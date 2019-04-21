/**
 * This is the configurations for the Tiltspot Game Tester.
 * When you have filled in the paths for your game and you are ready to test, start the game tester.
 * Information on how to start the game tester are provided in the HOWTO.txt file.
 */

module.exports = {

    /** (Required)
     *  Server_IP tells the server which IP the server should use.
     *  If a mobile device is on the same local network as the computer you have the possibility to use this device
     *  for testing by changing this value to your local IP address.
     *
     *  Find you local IP address:
     *  (Windows) run the command 'ipconfig' in the command prompt.
     *  (OSX/Linux) run the command 'ifconfig' in the terminal.
     *
     *  By using "localhost" you will not be able to use other devices to interact with the game tester.
     *
     *  Default value: "localhost"
     */
    Server_IP: "localhost",

    /** (Required)
     *  Server_Port tells the server which port it should listen on.
     *  This will effect the url for the game tester, for instance with port 8080 the url could be "localhost:8080".
     *
     *  Default: 8080
     */
    Server_Port: 8080,

    /**
     *  Unity_Port tells the server which port Unity is listening to.
     *  This value is only used when you are to test your game within Unity itself.
     *  You can ignore this value if your game is not a Unity game, and/or you are to test the game within the game tester.
     *
     *  Default: 8081
     */
    Unity_Port: 8081,

    /** (Required)
     *  Path_To_Game is where the location of the directory containing the actual game you want to test.
     *  For Javascript games this will be the parent directory of the index.html for the game.
     *  For Unity games this will me the parent directory containing the folders Build and TemplateData.
     *
     *  The path could also be a URL which returns a html page. For dedicated severs.
     *  Default: ""
     */
    Path_To_Game: "/home/groove/projects/rc-cars-app/build/game",

    /** (Required)
     *  Path_To_Controller is where the location of the directory containing the actual controller you want to test.
     *  For Javascript games this will be the parent directory of the index.html for the controller.
     *
     *  Default: ""
     */
    Path_To_Controller: "/home/groove/projects/rc-cars-app/controller",

    /**
     *  Path_To_Assets is the path where the assets for both controller and game is located.
     *  This path could be empty if there are no assets needed.
     *  Typically a Unity build doesn't need external assets.
     *
     *  Default: ""
     */
    Path_To_Assets: "",

};
