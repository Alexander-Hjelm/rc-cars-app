let config = require("./config"),
    webSocket = require('ws');

let states = Object.freeze({DISCONNECTED: 0, CONNECTING: 1, CONNECTED: 2});

module.exports = UnityHandler;

function UnityHandler(){
    if(!(this instanceof UnityHandler)) return new UnityHandler();
    this.port = config.Unity_Port;
    this.url = 'ws://127.0.0.1:'+config.Unity_Port+"/GameTesterHandler";
    this.socket = null;
    this.active = false;
    this.status = states.DISCONNECTED;
    this.tiltspotInfo = null;
    this.computer = null;
    this.io = null;
}

UnityHandler.prototype.setSocketIO = function(i){
    UnityHandler.io = i;
};

UnityHandler.prototype.setComputer = function(c){
    UnityHandler.computer = c;
};

UnityHandler.prototype.setActive = function(a){
    if(a) start();
    else stop();
};

UnityHandler.prototype.sendMsg = function(id, msg, data){
    sendMsg("msgToGame", id, msg, data);
};

UnityHandler.prototype.updateTiltspotInfo = function(data){
    UnityHandler.tiltspotInfo = data;
};

UnityHandler.prototype.controllersReady = function(data){
    if(UnityHandler.status === states.CONNECTED && UnityHandler.active) UnityHandler.socket.send(JSON.stringify({
        unityMsg: "controllersReady",
        data: data
    }));
};

UnityHandler.prototype.onMobileDisconnect = function (id) {
    if(UnityHandler.status === states.CONNECTED && UnityHandler.active) UnityHandler.socket.send(JSON.stringify({
        unityMsg: "disconnect",
        controllerId: id
    }));
};

UnityHandler.prototype.onMobileReconnect = function (id) {
    if(UnityHandler.status === states.CONNECTED && UnityHandler.active) UnityHandler.socket.send(JSON.stringify({
        unityMsg: "reconnect",
        controllerId: id
    }));
};

UnityHandler.prototype.onMobileConnect = function (id) {
    if(UnityHandler.status === states.CONNECTED && UnityHandler.active) UnityHandler.socket.send(JSON.stringify({
        unityMsg: "connect",
        controllerId: id
    }));
};

UnityHandler.prototype.reset = function () {
    UnityHandler.active = false;
    UnityHandler.status = states.DISCONNECTED;
    UnityHandler.tiltspotInfo = null;
    UnityHandler.computer = null;
};

function start() {
    UnityHandler.active = true;
    UnityHandler().status = states.CONNECTING;
    tryConnect();
}

function stop() {
    UnityHandler.active = false;
    UnityHandler().status = states.DISCONNECTED;
    disconnect();
}

function sendMsg(unityMsg, id, msg, data) {
    if(UnityHandler.status === states.CONNECTED && UnityHandler.active) UnityHandler.socket.send(JSON.stringify({
        unityMsg: unityMsg,
        controllerId: id,
        msg: msg,
        data: data
    }));
}

function tryConnect() {
    if(UnityHandler.status === states.CONNECTED) return;
    UnityHandler.socket = new webSocket('ws://127.0.0.1:'+config.Unity_Port+"/GameTesterHandler", null, null);
    UnityHandler.socket.onopen = function () {
        UnityHandler.status = states.CONNECTED;
        try{
            UnityHandler.socket.send(JSON.stringify({
                unityMsg: "updateTiltspotInfo",
                data: UnityHandler.tiltspotInfo
            }));
        }catch (e){}

        if(UnityHandler.computer) UnityHandler.io.to(UnityHandler.computer.id).emit("msgToComputer", -1, "unityStarted");
    };
    UnityHandler.socket.onclose = function () {
        UnityHandler.socket = null;
        if(UnityHandler.status === states.CONNECTED){
            if(UnityHandler.computer) UnityHandler.io.to(UnityHandler.computer.id).emit("msgToComputer", -1, "unityStopped");
            UnityHandler.status = states.DISCONNECTED;
        }
        if(UnityHandler.active){
            UnityHandler.status = states.CONNECTING;
            setTimeout(tryConnect, 500);
        }
    };
    UnityHandler.socket.onmessage = function(e){
        if(UnityHandler.computer === null) return;
        UnityHandler.io.to(UnityHandler.computer.id).emit("msgFromUnity", e.data);
    };
    UnityHandler.socket.onerror = function (err) {}
}

function disconnect() {
    if(!UnityHandler.socket) return;
    UnityHandler.socket.close();
    UnityHandler.socket = null;
}