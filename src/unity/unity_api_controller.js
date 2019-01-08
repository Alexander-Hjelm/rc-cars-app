/*
    This is the Tiltspot Unity API.
    Here is all the functions which will act as inputs to the game.
    To find all the outputs please check the javascriptLibrary.jslib which the Tiltspot-Unity plugin uses.
 */

window.tiltspotJSInterface = {
    msgToController: function(id, msg, data){
        Tiltspot.msgToController(id, msg, data);
    },

    broadcast: function (msg, data) {
        Tiltspot.broadcast(msg, data);
    },

    gameStarted: function () {
        Tiltspot.gameStarted();
    },

    gamePlaying: function () {
        Tiltspot.gamePlaying();
    },

    exitGame: function () {
        Tiltspot.exitGame();
    }

};

var Tiltspot = {

    gameInstance: null,
    users: [],

    instantiateGame: function (url) {
        if (this.gameInstance !== null) return;
        this.gameInstance = UnityLoader.instantiate("gameContainer", url, {onProgress: UnityProgress, width: 800, height: 600} );
    },

    onControllerMsg: function (id, msg, data) {
        if (this.gameInstance === null) return;
        this.gameInstance.SendMessage('Tiltspot', 'OnMessage', JSON.stringify({
            controllerId: id,
            msg: msg,
            data: data
        }));
    },

    onControllerReconnect: function (id) {
        if (this.gameInstance === null) return;
        this.gameInstance.SendMessage('Tiltspot', 'OnReconnect', JSON.stringify({
            controllerId: id
        }));
    },

    onTiltspotInfo: function (language, startTime, entryCode, users, hostId) {
        if (this.gameInstance === null) return;
        this.users = users;
        this.gameInstance.SendMessage('Tiltspot', 'OnTiltspotInfo', JSON.stringify({
            language: language,
            startTime: startTime,
            entryCode: entryCode,
            hostId: hostId,
            users: users
        }));
    },

    broadcast: function (msg, data) {
        for(var i=0; i<this.users.length; i++){
            this.msgToController(i, msg, data);
        }
    },

    msgToController: function (id, msg, data) {},

    gameStarted: function () {},


};