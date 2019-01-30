module.exports = {
    /**
     *  Server_IP tells the server which IP the server should listen on.
     *  If a mobile device is on the same local network as the computer you have the possibility to use this device
     *  when testing by change this to your local IP address.
     *
     *  Find you local IP address:
     *  (Windows) run the command 'ipconfig' in the command prompt.
     *  (OSX) run the command 'ifconfig' in the terminal.
     *
     *  Default value: "localhost"
     */
    Server_IP: "localhost",

    /**
     *  Server_Port tells the server which port it should listen on.
     *
     *  Default: 8080
     */
    Server_Port: 8080,

    /** (Required)
     *  Path_To_Game is where the location of the directory containing the actual game you want to test.
     *  For Javascript games this will be the parent directory of the index.html for the game.
     *  For Unity games this will me the parent directory containing the folders Build and TemplateData.
     *
     *  Default: ""
     */
    Path_To_Game: "/home/groove/Tiltspot_Game_Tester_v1.0.0/build/game",

    /** (Required)
     *  Path_To_Controller is where the location of the directory containing the actual controller you want to test.
     *  For Javascript games this will be the parent directory of the index.html for the controller.
     *
     *  Default: ""
     */
    Path_To_Controller: "/home/groove/Tiltspot_Game_Tester_v1.0.0/controller",

    /**
     *  Path_To_Assets is the path where the assets for both controller and game is located.
     *  This path could be empty if there are no assets needed.
     *  Typically a Unity build doesn't need external assets.
     *
     *  Default: ""
     */
    Path_To_Assets: "",

};
