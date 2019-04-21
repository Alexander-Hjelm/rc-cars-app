/**
 * This is the global Tiltspot object.
 * You can access it anywhere in your document, example: Tiltspot.entryCode;
 */
var Tiltspot = {

    /**
     * The language of the browser
     * Example: "en-us"
     */
    language: "",
    /**
     * The start time of the game in milliseconds.
     */
    startTime: 0,

    /**
     * The entry code to the room.
     */
    entryCode: "",

    /**
     * All the users that are in the game.
     * A user object contains:
     *      userId: {number} The user id of the user. If the user is not logged in this id will be -1.
     *      nickname: {String} The nickname of the user.
     *      isLoggedIn: {boolean} If the user is logged in.
     *      ownsGame: {boolean} If the user owns this game.
     *      host: {boolean} If this user is the host of this session.
     *      profile_picture: {String} A link to the users profile picture (Https://...).
     */
    users: [],

    /**
     * The user that this controller represents.
     * The user object contains:
     *      userId: {number} The user id of the user. If the user is not logged in this id will be -1.
     *      nickname: {String} The nickname of the user.
     *      isLoggedIn: {boolean} If the user is logged in.
     *      ownsGame: {boolean} If the user owns this game.
     *      host: {boolean} If this user is the host of this session.
     *      profile_picture: {String} A link to the users profile picture (Https://...).
     */
    user: null,

    /**
     * The id of the host.
     * To get the player that are host use this id with the users array: Tiltspot.users[Tiltspot.hostId].
     */
    hostId: -1,

    /**
     * The player id that this controller represents.
     */
    playerId: -1,

    onTiltspotInfo: function (language, startTime, entryCode, users, hostId, user, playerId) {
        this.language = language;
        this.startTime = startTime;
        this.entryCode = entryCode;
        this.users = users;
        this.hostId = hostId;
        this.user = user;
        this.playerId = playerId;
    },

    /**
     * (You should overwrite this function)
     * This function is executed when a message from the game is received.
     * @param {String} msg The message received
     * @param {Object} data The data received
     */
    onGameMsg: function (msg, data) {},

    /**
     * This function sends a message to the game
     * @param {String} msg The message to send
     * @param {Object} data The data to send
     */
    msgToGame: function (msg, data) {},

    /**
     * This function returns a link to your asset.
     * For instance if you have a image in your Assets/img/img.png folder you should call Tiltspot.getAssetUrl(img/img.png).
     * @param url
     */
    getAssetUrl: function (url) {},

    /**
     * (You should overwrite this function)
     * This function is executed when the API and the Tiltspot object are initiated.
     * After this function is executed you can access data from the object, example: Tiltspot.users
     */
    onReady: function () {},

    /**
     * (You should overwrite this function)
     * This function is executed when the game is paused.
     */
    onPause: false,

    /**
     * (You should overwrite this function)
     * This function is executed when the game is resumed.
     */
    onResume: false,

    /**
     * When calling on this function the game exits.
     */
    exitGame: function () {}

};