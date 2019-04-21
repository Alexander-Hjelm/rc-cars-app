let TEXT_C = Object.freeze({BLUE: "\x1b[34m", RED: "\x1b[31m", GREEN: "\x1b[32m", WHITE: "\x1b[37m", YELLOW: "\x1b[33m"});
let config = require("./config");
let fs = require('fs');
let rmdir = require('rimraf');
let ncp = require('ncp').ncp;
let outputDirName = "_TiltspotBuild";
const {exec} = require('child_process');

let gamePath = "";
let contPath = "";
let assePath = "";
let hasAssets = false;
let rootPath = "";
let buildPath = "";
let gameIsUnity = false;
let controllerIsUnity = false;

let warnings = [];

start(()=>{
    createFolders(()=>{
        copyFiles(()=>{
            copyCover(()=>{
                compressFiles(()=>{
                    finish();
                });
            });
        });
    });
});

function start(callback) {
    log("%%% STARTING %%%", TEXT_C.GREEN);
    log("%% Fetching paths..");
    gamePath = config.Path_To_Game;
    contPath = config.Path_To_Controller;
    assePath = config.Path_To_Assets;
    hasAssets = assePath !== "";
    if(gamePath === "") stopExec("No game path was given in config.js");
    rootPath = removeLastFromPath(gamePath);
    buildPath = rootPath+"/"+outputDirName;
    log("% Game folder: "+gamePath);
    log("% Controller folder: "+contPath);
    log("% Assets folder: "+assePath);
    log("% Root folder: "+rootPath);
    log("% Build folder: "+buildPath);
    log("%% Done fetching paths");
    if(callback) callback();
}

function createFolders(callback) {
    log("%% Creating folders..");
    createDir(rootPath, outputDirName, ()=>{
        createDir(buildPath, "game", ()=>{
            createDir(buildPath, "controller", ()=>{
                if(hasAssets) createDir(buildPath, "assets", done);
                else done();
            });
        });
    });

    function done() {
        log("%% Done creating folders");
        if(callback) callback();
    }
}

function copyFiles(callback) {
    log("%% Copying files..");

    function copyGame() {
        log("% Copying game files..");
        ncp(gamePath, buildPath+"/game", (err)=>{
            if(err) stopExec("Could not copy files from "+gamePath);
            if(checkIfUnity(buildPath+"/game")){
                gameIsUnity = true;
                log("% Game is a Unity project");
                fs.unlinkSync(buildPath+"/game/index.html");
                fs.copyFile("src/unity/unity_index_game.html", buildPath+"/game/index.html", (err)=>{
                    if(err) stopExec("Could not copy index file for unity game from 'src/unity/unity_index_game.html'");
                    copyController();
                })
            }else copyController();
        });
    }

    function copyController() {
        log("% Copying controller files..");
        ncp(contPath, buildPath+"/controller", (err)=>{
            if(err) stopExec("Could not copy files from "+contPath);
            if(checkIfUnity(buildPath+"/controller")){
                controllerIsUnity = true;
                log("% Controller is a Unity project");
                fs.unlinkSync(buildPath+"/controller/index.html");
                fs.copyFile("src/unity/unity_index_controller.html", buildPath+"/controller/index.html", (err)=>{
                    if(err) stopExec("Could not copy index file for unity controller from 'src/unity/unity_index_controller.html'");
                    copyAssets();
                })
            }else copyAssets();
        })
    }

    function copyAssets() {
        if(hasAssets){
            log("% Copying assets files..");
            ncp(assePath, buildPath+"/assets", (err)=>{
                if(err) stopExec("Could not copy files from "+assePath);
                done();
            });
        }else done();
    }

    function done() {
        log("%% Done copying files");
        if(callback) callback();
    }

    copyGame();
}

function copyCover(callback) {
    getFilesInDir(rootPath, (files)=>{
        let found = false;
        for(let i=0; i<files.length; i++){
            if(files[i] === rootPath+"/cover.png"){
                found = true;
            }
        }
        if(!found){
            let s = "No cover picture located in root folder. Add cover.png in folder: "+rootPath;
            warnings.push(s);
            log("[WARNING] "+s, TEXT_C.YELLOW);
            if(callback) callback();
        }else{
            log("%% Copying cover picture..");
            ncp(rootPath+"/cover.png", buildPath+"/cover.png", (err)=>{
                if(err) stopExec("Could not copy cover image ("+rootPath+"/cover.png.");
                log("%% Done copying cover picture");
                if(callback) callback();
            })
        }
    });
}

function compressFiles(callback) {
    log("%% Compressing files..");
    getFilesInDir(buildPath+"/game", (list)=>{
        if(gameIsUnity) list = [buildPath+"/game/index.html"];
        compressList(list, ()=>{
            getFilesInDir(buildPath+"/controller", (list)=>{
                if(controllerIsUnity) list = [buildPath+"/controller/index.html"];
                compressList(list, ()=>{
                    if(hasAssets){
                        getFilesInDir(buildPath+"/assets", (list)=>{
                            compressList(list, done);
                        });
                    }else done();
                })
            });
        })
    });

    function compressList(list, callback) {
        let i=0;
        let loop = ()=>{
            if(i === list.length) callback();
            else{
                compressFile(list[i], ()=>{
                    i++;
                    loop();
                });
            }
        };
        loop();
    }

    function compressFile(path, callback) {
        switch (getFileExtension(path)) {
            case "js":
                log("% Compressing file: "+path);
                executeCommand('uglifyjs "'+path+'" -c -m -o "'+path+'"', callback);
                break;
            case "css":
                log("% Compressing file: "+path);
                executeCommand('uglifycss  --output "'+path+'" "'+path+'"', callback);
                break;
            case "html":
                log("% Compressing file: "+path);
                executeCommand('html-minifier --collaps e-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --use-short-doctype --minify-css true --minify-js true -o "'+path+'" "'+path+'"', callback);
                break;
            default:
                callback();
        }
    }

    function done() {
        log("%% Done compressing files");
        if(callback) callback();
    }
}

function finish() {
    log("%%% COMPLETED %%%", TEXT_C.GREEN);
    if(warnings.length > 0){
        log("\n### WARNINGS ###", TEXT_C.YELLOW);
        for(let i=0; i<warnings.length; i++){
            log("* "+warnings[i], TEXT_C.YELLOW);
        }
    }
    log("\n### INFO ###",TEXT_C.BLUE);
    log("* Build is located in "+buildPath, TEXT_C.BLUE);
}

function getFilesInDir(dir, callback) {
    let list = [];
    fs.readdir(dir, (err, files)=>{
        if(err) stopExec("Could not read directory "+dir);
        files.forEach((file, index)=>{
            let p = dir+"/"+file;
            fs.stat(p, (err, stat)=>{
                if(err) stopExec("Could not get state file "+p);
                if(stat.isFile()){
                    list.push(p);
                    if(index === files.length-1){
                        if(callback) callback(list);
                    }
                }else if(stat.isDirectory()){
                    getFilesInDir(p, (l)=>{
                        list = list.concat(l);
                        if(index === files.length-1){
                            if(callback) callback(list);
                        }
                    })
                }
            });
        })
    });
}

function createDir(root, dir, callback) {
    if(fs.existsSync(root+"/"+dir)){
        log("% Deleting directory: "+root+"/"+dir);
        rmdir(root+"/"+dir, function (err) {
            if(err) stopExec("Could not remove folder "+root+"/"+dir);
            create();
        });
    }else create();

    function create() {
        log("% Making directory: "+root+"/"+dir);
        fs.mkdirSync(root+"/"+dir);
        if(callback) callback();
    }
}

function removeLastFromPath(path) {
    let the_arr = path.split('/');
    if(the_arr.length === 1){
        the_arr = path.split("\\")
    }
    the_arr.pop();
    return the_arr.join('/');
}

function stopExec(err){
    log("%%% STOPPED %%%", TEXT_C.RED);
    log("* ERROR: "+err, TEXT_C.RED);
    log("", TEXT_C.WHITE);
    process.exit();
}

function getFileExtension(path) {
    return path.split('.').pop();
}

function executeCommand(command, callback) {
    exec(command, (err, stdout, stderr)=>{
        if(err){
            stopExec("Could not execute commend: "+command+". \n\n"+stderr);
        }
        if(callback) callback();
    });
}

function log(msg, color) {
    if(color){
        console.log(color+"%s\x1b[0m", msg);
    }else{
        console.log(msg);
    }
}

function checkIfUnity(url) {
    return fs.existsSync(url+"/Build") && fs.existsSync(url+"/Build/UnityLoader.js");
}