;(function () {
    /* A NOTE TO THE TEACHER */
    /**
     * I have not been to all lessons, therefore I cannot apply every convention teached by the teacher.
     * This is not an excuse, this is a warning for what you could find in this piece of javascript code.
     * I DID pay full attention to a certain book 'Clean Code' describing the importance of clear, logical and fool-proof code.
     * 
     * The fact that I applied my knowledge from school and that book in here has helped me out a lot.
     * I find it very difficult to read code as it is cluttered and chaotic without a clear mind.
     * So I wasn't just trying to style this code in a good way, I had to.
     * 
     * That concludes my defense for foreign conventions to our usual lessons.
     */
    
    'use strict'
    window.addEventListener('load', function () 
    {
        // An overview of shortcuts to code blocks. (use CTRL+Click)
        function Overview(){
            // Game controller
            gameController;
            // Configurations
            DefaultPlayerPosition;
            ConfigureContainerDimensions;

            // Player controller
            playerController;
            // Keypress to movement mechanics
            HandleKeyEvent;
            ConfigureStartMoveController;
            ConfigureStopMoveController;
            // Joystick
            CreateJoystick;
            // Player moving sequencing
            StartSequencingFrames;
            ExecuteMovingProcess;

            // Player lifecycle
            RespawnPlayer;
            KillPlayer;

            // Opponent
            opponentController;
            CreateOpponent;
            AnimateOpponent;
            KillOpponent;
            KillAllOpponents;
            // Bullet
            CreateBullet;
            AnimateBullet;
            KillBullet;
            KillAllBullets;

            // Game flow
            StartGameFlow;
            KillGame;
            UndoEndgame;
            RestartGame;
        }

        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* ----------------------------------- *//* SECTION GLOBAL VARIABLES *//* ---------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///

        /* --------------------------------------------------------------------------------------------------------- */
        /* ------------------------- *//* Saved DOM-elements and their properties *//* ------------------------- */ Overview
        /* --------------------------------------------------------------------------------------------------------- */

        let elemPlayer = document.getElementById("player");
        let playerStyle = elemPlayer.style;
        let elemGameContainer = document.getElementById("gameContainer");
        let mobileFlag = false;
        // Configuring the player's properties to it's default values for this game regarding position.
        DefaultPlayerPosition(elemPlayer);
        let playerWidth = $("#player").outerWidth();
        let playerHeight = $("#player").outerHeight();


        /* --------------------------------------------------------------------------------------------------------- */
        /* ------------------------- *//* Expressions regarding DOM-elements *//* ------------------------- */ Overview
        /* --------------------------------------------------------------------------------------------------------- */

        // Expressions for retrieving up-to-date element-properties.
        let getGameContainerWidth = function(){
            return $("#gameContainer").width();
        }
        let getGameContainerHeight = function(){
            return $("#gameContainer").height();
        }
        let getPlayerWidth = function(){
            return $("#player").outerWidth();
        }
        let getPlayerHeight = function(){
            return $("#player").outerHeight();
        }

        /* --------------------------------------------------------------------------------------------------------- */
        /* ----------------------------------- *//* Global-/Helperfunctions *//* ----------------------------------- */ Overview
        /* --------------------------------------------------------------------------------------------------------- */

        // Converts a position-property(pixel) to a workable integer.
        function ConvertPropertyToInt(propertyValue){
            return parseInt(propertyValue.replace('px', ''), 10);
        }

        // Converts an integer to a property-format string.
        function ConvertIntToPixelProperty(propertyValue){
            return `${propertyValue}px`;
        }

        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* ----------------------------------- *//* SECTION Configuration & Controllers *//* ---------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///

        /* --------------------------------------------------------------------------------------------------------- */
        /* ----------------------------------- *//* Game statistics controller *//* ----------------------------------- */ Overview
        /* --------------------------------------------------------------------------------------------------------- */

        // A controller for overall game data and to handle the game end.
        let gameController = { playerDeaths: 0, playerTimes: [], opponentsKilled: 0, bulletsFired: 0, bulletsKilled: 0, gameOver:false };
        let elemPlayerDeaths = document.getElementById('playerDeaths');
        let elemOpponentsKilled = document.getElementById('opponentsKilled');
        let elemBulletsFired = document.getElementById('bulletsFired');
        let elemBulletsKilled = document.getElementById('bulletsKilled');
        // Attachement of getter and setter properties which will trigger or fire other events/methods.
        Object.defineProperties(gameController, {
            'getPlayerDeaths': { get: function() { return this.playerDeaths;}},
            'setPlayerDeaths': { set: function(value) { this.playerDeaths = value; elemPlayerDeaths.innerHTML = `Player deaths: ${value}`}},

            'getOpponentsKilled': { get: function() { return this.opponentsKilled; }},
            'setOpponentsKilled': { set: function(value) { this.opponentsKilled = value; elemOpponentsKilled.innerHTML = `Opponents killed: ${value}`}},

            'getBulletsFired': { get: function() { return this.bulletsFired; }},
            'setBulletsFired': { set: function(value) { this.bulletsFired = value; elemBulletsFired.innerHTML = `Bullets fired: ${value}`}},
            
            'getBulletsKilled': { get: function() { return this.bulletsKilled; }},
            'setBulletsKilled': { set: function(value) { this.bulletsKilled = value; elemBulletsKilled.innerHTML = `Bullets vanished: ${value}`}},

            'getGameOver': { get: function() { return this.gameOver; }},
            'setGameOver': { set: function(value) { this.gameOver = value; if (value){KillGame();}}}
        });

        /* --------------------------------------------------------------------------------------------------------- */
        /* ----------------------------------- *//* Default Player configurations *//* ----------------------------------- */ Overview
        /* --------------------------------------------------------------------------------------------------------- */
        function DefaultPlayerPosition(configuredElemPlayer){
            // A hard-coded but simple way to recognise whether the game is on mobile or not.
            let diameter;
            if (window.getComputedStyle(elemGameContainer, null).getPropertyValue("background-color") === 'rgb(15, 86, 167)'){
                diameter = 20;
                mobileFlag = true;
            }
            else{
                diameter = 40;
                mobileFlag = false;
            }

            playerStyle = configuredElemPlayer.style;
            elemPlayer = configuredElemPlayer;

            // Styling the player's skin
            playerStyle.width = `${diameter}px`;
            playerStyle.height = `${diameter}px`;

            let backgroundSize = diameter * 1.10869;
            playerStyle.backgroundSize = `${backgroundSize}px`;
            let backgroundPosition = backgroundSize - 53.5/46*diameter;
            playerStyle.backgroundPosition = `${backgroundPosition}px`;

            // Styling the player's position
            let startPositionX = 0;
            let startPositionY = 0;
            playerStyle.left = `${startPositionX}px`;
            playerStyle.right = `${startPositionX + diameter}px`;
            playerStyle.top = `${startPositionY}px`;
            playerStyle.bottom = `${startPositionY + diameter}px`;

            // Pre-Configuring the death-transition AFTER creation to prevent transitions at creation when configuring backgroundsize/-position.
            elemPlayer.classList.add('playerTransition');
        }

        // A precaution for overflow and animation issues, adapting the container to the player dimensions.
        ConfigureContainerDimensions();
        function ConfigureContainerDimensions(){
            let previousWidth = getGameContainerWidth();
            let previousHeight = getGameContainerHeight();
            
            elemGameContainer.style.width = Math.round((previousWidth/getPlayerWidth()))*getPlayerWidth()-getPlayerWidth() + "px";
            elemGameContainer.style.height = Math.round((previousHeight/getPlayerHeight()))*getPlayerHeight()-getPlayerHeight() + "px";
        }

        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* ------------------------------------ *//* SECTION INTIALISING MOVEMENT *//* ------------------------------------ *///
        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///

        /* --------------------------------------------------------------------------------------------------------- */
        /* --------------------------------------- *//* MoveController *//* --------------------------------------- */ Overview
        /* --------------------------------------------------------------------------------------------------------- */

        let playerController = CreatePlayerController();

        function CreatePlayerController(){
            // moveSpeed = pixels per move -- first-/secondMoveFlag = booleans signaling if player moves or not.
            //first-/secondDirection = directions in which one moves, multiple because of diagonal movement.
            let playerController = { moveSpeed: 1, firstMoveFlag: false, secondMoveFlag: false, firstDirection: '', secondDirection: ''};

            // Attachement of getter and setter properties which will trigger or fire other events/methods.
            Object.defineProperties(playerController, {
                'getMoveSpeed': { get: function() { return this.moveSpeed; }},
                'setMoveSpeed': { set: function(value) { this.moveSpeed = value; }},

                'getFirstMoveFlag': { get: function() { return this.firstMoveFlag; }},
                'setFirstMoveFlag': { set: function(value) { this.firstMoveFlag = value; if (value == true) StartSequencingFrames(); else StopFirstMoveFrameSequencing(); }},
                'getSecondMoveFlag': { get: function() { return this.secondMoveFlag; }},
                'getSecondMoveFlag': { set: function(value) { this.secondMoveFlag = value; if (value == true) StartSequencingFrames(); else StopSecondMoveFrameSequencing(); }},

                'getFirstMoveDirection': { get: function() { return this.firstDirection; }},
                'setFirstMoveDirection': { set: function(value) { this.firstDirection = value; }},
                'getSecondMoveDirection': { get: function() { return this.secondDirection; }},
                'setSecondMoveDirection': { set: function(value) { this.secondDirection = value; }},
            });

            return playerController;
        } 

        /* ------------------------------------------------------------------------------------------------------------------------ */
        /* ----------------------------------- *//* EventListening to keypresses-/releases *//* ----------------------------------- */ Overview
        /* ------------------------------------------------------------------------------------------------------------------------ */

        // Tying up the keyup and keydown event to my own handler for both events.
        onkeyup = onkeydown = HandleKeyEvent;

        /* --------------------------------------------------------------------------------------------------------- */
        /* ----------------------------------- *//* Eventhandling Variables *//* ----------------------------------- */ Overview
        /* --------------------------------------------------------------------------------------------------------- */

        // A memory of used arrow-keycodes to react upon within this program (arrowKeys) and a map of each entered keycode + current state (keycodeMap).
        let arrowKeys = {left:'37', up:'38', right:'39', down:'40'};
        let keycodeMap = {};

        // Variable to indentify whether a key is prrssed/released.
        let isKeyUpEvent = false;

        /* ---------------------------------------------------------------------------------------------- */
        /* ----------------------------------- *//* Eventhandler *//* ----------------------------------- */ Overview
        /* ---------------------------------------------------------------------------------------------- */
        let canShootFlag = true;
        function HandleKeyEvent(e) 
        {
            e = e || event; // Dealing with IE.

            // Mapping the key and its current state (if keydown -> true). (not used, interesting for possible custom shortcuts in the future)
            keycodeMap[e.keyCode] = e.type == 'keydown';

            // Shooting bullets
            if (e.keyCode == '13' && e.type == 'keydown' && canShootFlag == true){
                canShootFlag = false;
                CreateBullet();
                setTimeout(function(){canShootFlag = true;}, 1000);
            } 
                
            // Defining if we configure the playerController for starting/stopping movement.
            isKeyUpEvent = e.type == 'keydown' ? false : true;

            // Check if the keycode is an arrow-key of the arrowKeys variable.
            if (Object.values(arrowKeys).indexOf(e.keyCode.toString()) > -1) 
            {
                // Map the state of a key event in our arrowKeys array. ( -> true).
                keycodeMap[e.keyCode] = false;
                
                // Configuring the playerController using the pressed key/direction at the key up/down event.
                switch(e.keyCode.toString()){
                    case '37':
                        if (isKeyUpEvent) ConfigureStopMoveController('left');
                        else ConfigureStartMoveController('left');
                        break;

                    case '39':
                        if (isKeyUpEvent) ConfigureStopMoveController('right');
                        else ConfigureStartMoveController('right');
                        break;

                    case '38':
                        if (isKeyUpEvent) ConfigureStopMoveController('up');
                        else ConfigureStartMoveController('up');
                        break;

                    case '40':
                        if (isKeyUpEvent) ConfigureStopMoveController('down');
                        else ConfigureStartMoveController('down');
                        break;
                }
            }
        }

        /* ---------------------------------------------------------------------------------------------- */
        /* ------------------------- *//* Configuring the MoveController *//* -------------------------- */ Overview
        /* ---------------------------------------------------------------------------------------------- */
        // An alteration to the previous logical model, distinction between horizontal/vertical at input avoids many small bugs.
        function ConfigureStartMoveController(direction)
        {
        if (direction == 'up' || direction == 'down'){
            if (playerController.getFirstMoveDirection != direction){
                    playerController.setFirstMoveFlag = true;
                    playerController.setFirstMoveDirection = direction;
            }
        }

        if (direction == 'left' || direction == 'right'){
                if (playerController.getSecondMoveDirection != direction){
                    playerController.setSecondMoveFlag = true;
                    playerController.setSecondMoveDirection = direction;
                }
            }
        }

        function ConfigureStopMoveController(direction)
        {
            // If the keyup event is the first direction, reset that direction's values and signal that the moving sequence has ended.
            if (playerController.getFirstMoveDirection == direction)
            {
                playerController.setFirstMoveFlag = false;
                playerController.setFirstMoveDirection = '';
            }
            // If the keyup event is the second direction, reset that direction's values and signal that the moving sequence has ended.
            if (playerController.getSecondMoveDirection == direction)
            {
                playerController.setSecondMoveFlag = false;
                playerController.setSecondMoveDirection = '';
            }
        }

        /* ---------------------------------------------------------------------------------------------- */
        /* ------------------------- *//* The Joystick *//* -------------------------- */ Overview
        /* ---------------------------------------------------------------------------------------------- */
        let joystickDisplayedFlag = false;
        let joystickInterval;
        CreateJoystick();
        function CreateJoystick(){
            // Creating the joystick (API) object + configuration using parameters
            //niet-eigen code -> https://github.com/jeromeetienne/virtualjoystick.js/blob/master/README.md//
            let  joystick = new VirtualJoystick({
                container: document.getElementById('stickContainer'),
                mouseSupport: false,
                stationaryBase: true,
                    baseX: getGameContainerWidth()-126/2-40,
                    baseY: getGameContainerHeight()-126/2-40,
                limitStickTravel: true,
                    stickRadius: 80
            });
            //niet-eigen code -> https://github.com/jeromeetienne/virtualjoystick.js/blob/master/README.md//

            let verticalDirection = '', horizontalDirection = '';

            // Feeds input data to moving controller (and process) by substituting keypress-events using an interval.
            function TranslateStickToMoving() {
                // Abstraction of main configuration operations.
                function AddDirection(value){
                    if (value === 'up' || value === 'down'){
                        if (verticalDirection != value){
                            verticalDirection = value;
                            ConfigureStartMoveController(verticalDirection);
                        }
                    }
                    if (value === 'left' || value === 'right'){
                        if (horizontalDirection != value){
                            horizontalDirection = value;
                            ConfigureStartMoveController(horizontalDirection);
                        }
                    }
                }
                function RemoveDirection(value){
                    if (verticalDirection === value){
                        ConfigureStopMoveController(verticalDirection);
                        verticalDirection = '';
                    }
                    if (horizontalDirection === value){
                        ConfigureStopMoveController(horizontalDirection);
                        horizontalDirection = '';
                    }
                }
                function HandleJoystick(stickIsUp, stickDirection){
                    if (stickIsUp)
                        AddDirection(stickDirection);
                    else
                        RemoveDirection(stickDirection);
                }

                // Checking the joystick values.
                HandleJoystick(joystick.up(), 'up');
                HandleJoystick(joystick.down(), 'down');
                HandleJoystick(joystick.left(), 'left');
                HandleJoystick(joystick.right(), 'right');

                if (!joystickDisplayedFlag)
                    clearInterval(joystickInterval);
            }

            // Touch Eventlisteners to limit the use of an interval (rather than running it continuously).
            joystick.addEventListener('touchStart', function(){
                joystickDisplayedFlag = true;
                joystickInterval = setInterval(TranslateStickToMoving, 20);
            })
            joystick.addEventListener('touchEnd', function(){
                joystickDisplayedFlag = false;
            })
        }

        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* ---------------------------------- *//* SECTION SEQUENCING MOVEMENT *//* -------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///

        /* --------------------------------------------------------------------------------------------------------------------- */
        /* ----------------------------------- *//* Managing the sequencing of Movement *//* ----------------------------------- */ Overview
        /* --------------------------------------------------------------------------------------------------------------------- */

        // Variables to signal a sequence of moves (because of keeping a key pressed) to stop.
        // The separation of directions and their processing is necessary to execute both movements independently.
        let stopFirstMoveSequenceFlag = false;
        let stopSecondMoveSequenceFlag = false;

        // A variable to lock the moving process from all excessive generated events when keeping a key pressed down.
        let lockFirstMoveSequence = false;
        let lockSecondMoveSequence = false;

        // Two simple functions to signal and intervene when a moving-sequence is running using flags.
        function StopFirstMoveFrameSequencing() 
        {
            stopFirstMoveSequenceFlag = true;
        }
        function StopSecondMoveFrameSequencing() 
        {
            stopSecondMoveSequenceFlag = true;
        }

        // Responsability: Starting and stopping a sequence/interval of frames while protecting it from starting parralel moving sequences because of new keypress events.
        function StartSequencingFrames() {
            // If no other first moving sequence is happening ( = lock), start a first moving direction sequence
            if (!lockFirstMoveSequence)
            {
                // Lock the moving sequence from starting (parallel at the original sequence) at new keypress events
                lockFirstMoveSequence = true;
                let firstSequenceFrameInterval = setInterval(function(){ ExecuteSequenceFrame(stopFirstMoveSequenceFlag, true, playerController.getFirstMoveDirection, firstSequenceFrameInterval);}, 10);
            }
            // If no other second moving sequence is happening ( = lock), start a second moving direction sequence
            if (!lockSecondMoveSequence)
            {
                // Lock the moving sequence from starting (parallel at the original sequence) at new keypress events
                lockSecondMoveSequence = true;
                let secondSequenceFrameInterval = setInterval(function(){ ExecuteSequenceFrame(stopSecondMoveSequenceFlag, false, playerController.getSecondMoveDirection, secondSequenceFrameInterval);}, 10);
            }
        }

        // Responsability: Clearing the interval whenever the moveController intervenes and executing a single sequenceframe.
        function ExecuteSequenceFrame(stopMoveSequenceFlag, isFirstDirectionFlag, moveDirection, sequenceFrameInterval) 
        {
            // If no call for halting the moving sequence is made, continue moving.
            if (!stopMoveSequenceFlag)
            {
                ExecuteMoveAnimationFrame(moveDirection);
            }
            // If a call for halting the moving sequence is made, determine if it is the first or second entered moving direction sequence. (and signal this using flags and locks)
            else 
            {
                if (isFirstDirectionFlag) { stopFirstMoveSequenceFlag = false; lockFirstMoveSequence = false; }
                else { stopSecondMoveSequenceFlag = false; lockSecondMoveSequence = false; }
                clearInterval(sequenceFrameInterval);
            }
        }

        // Responsability: Executing the moving process behind a single frame.
        function ExecuteMoveAnimationFrame(moveDirection) {
            requestAnimationFrame(function fireMovingProcess() {
                ExecuteMovingProcess(moveDirection);
            });
        }

        /* --------------------------------------------------------------------------------------------------------------------- */
        /* ----------------------------------- *//* Executing the actual movement *//* ----------------------------------- */ Overview
        /* --------------------------------------------------------------------------------------------------------------------- */

        // Responsability: Checking and handling game-border collision and physically moving the player.
        function ExecuteMovingProcess(moveDirection){

            // Creating movement collision rules.
            let topRule = ConvertPropertyToInt(playerStyle.top) < 0;
            let bottomRule = ConvertPropertyToInt(playerStyle.bottom) > getGameContainerHeight();
            let leftEdgeRule = ConvertPropertyToInt(playerStyle.left) < 0;
            let rightEdgeRule = ConvertPropertyToInt(playerStyle.right) > getGameContainerWidth();

            // Applying collision rules
            switch(moveDirection){
                case "up":
                    if (!topRule){
                        MovePlayerPosition(moveDirection);
                    }
                    break;
                    
                case "down":
                    if (!bottomRule){
                        MovePlayerPosition(moveDirection); 
                    }
                    break;
                    
                case "left":
                    if (!leftEdgeRule){
                        MovePlayerPosition(moveDirection);
                    }
                    break;
                    
                case "right":
                    if (!rightEdgeRule){
                        MovePlayerPosition(moveDirection);
                    }
                    break;
            }
        }

        // Replacing the value of the player's position-properties based on the given direction.
        function MovePlayerPosition(moveDirection) 
        {
            let topPos = ConvertPropertyToInt(playerStyle.top);
            let leftPos = ConvertPropertyToInt(playerStyle.left);
            let pixelsPerMove = playerController.moveSpeed;

            switch (moveDirection) {
                case 'up':
                        playerStyle.top = `${topPos - pixelsPerMove}px`;
                        playerStyle.bottom = `${topPos - pixelsPerMove + playerHeight}px`;
                        break;
                case 'down':
                        playerStyle.top = `${topPos + pixelsPerMove}px`;
                        playerStyle.bottom = `${topPos + pixelsPerMove + playerHeight}px`;
                        break;
                case 'left':
                        playerStyle.left = `${leftPos - pixelsPerMove}px`;
                        playerStyle.right = `${leftPos - pixelsPerMove + playerWidth}px`;
                        break;
                case 'right':
                        playerStyle.left = `${leftPos + pixelsPerMove}px`;
                        playerStyle.right = `${leftPos + pixelsPerMove + playerWidth}px`;
                        break;
            }
        }

        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* ---------------------------- *//* PLAYER LIFECYCLE *//* ---------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///

        /* ---------------------------------------------------------------------------------------------- */
        /* ------------------------- *//* Killing and spawning a player *//* -------------------------- */ Overview
        /* ---------------------------------------------------------------------------------------------- */

        function RespawnPlayer() {
            let newPlayer = document.createElement("div");
            newPlayer.id = 'player';

            newPlayer.classList.add('playerTransition');
            document.getElementById("gameContainer").appendChild(newPlayer);

            DefaultPlayerPosition(newPlayer);
        }

        function KillPlayer() {
            playerStyle.backgroundSize = '0px';
            playerStyle.backgroundPosition = `${23/2}px`;
            setTimeout(function(){ $(`#${elemPlayer.id}`).remove(); gameController.setPlayerDeaths = gameController.getPlayerDeaths + 1; if (!gameController.getGameOver) RespawnPlayer();}, 400);
        }


        /* ---------------------------------------------------------------------------------------------- */
        /* ------------------------- *//* Opponents *//* -------------------------- */ Overview
        /* ---------------------------------------------------------------------------------------------- */

        // The controller is encased into a function because every opponent requires a newly created object if this format/class.
        function CreateOpponentController(){
            // A controller for opponent movement configuration and management
            let opponentController = { MoveSpeed: 0, Left: 0, Top: 0, Right:0, Bottom: 0, Height: 0, Width: 0, HorizontalDirection: '', VerticalDirection: ''};

            // Attachement of getter and setter properties which will trigger or fire other events/methods.
            Object.defineProperties(opponentController, {
                'getMoveSpeed': { get: function() { return this.MoveSpeed; }},
                'setMoveSpeed': { set: function(value) { this.MoveSpeed = value; }},
                
                'getLeft': { get: function() { return this.Left; }},
                'setLeft': { set: function(value) { this.Left = value; this.Right = this.Left + this.Width;}},
                'getTop': { get: function() { return this.Top; }},
                'setTop': { set: function(value) { this.Top = value; this.Bottom = this.Top + this.Height; }},
                'getRight': { get: function() { return this.Right; }},
                'setRight': { set: function(value) { this.Right = value; }},
                'getBottom': { get: function() { return this.Bottom; }},
                'setBottom': { set: function(value) { this.Bottom = value; }},
                
                'getWidth': { get: function() { return this.Width; }},
                'setWidth': { set: function(value) { this.Width = value; }},
                'getHeight': { get: function() { return this.Height; }},
                'setHeight': { set: function(value) { this.Height = value; }},

                'getHorizontalDirection': { get: function() { return this.HorizontalDirection; }},
                'setHorizontalDirection': { set: function(value) { this.HorizontalDirection = value; }},
                
                'getVerticalDirection': { get: function() { return this.VerticalDirection; }},
                'setVerticalDirection': { set: function(value) { this.VerticalDirection = value; }},
            });

            return opponentController;
        }

        let opponentIDCounter = 0;
        let opponentList = []; let opponentsDied = 0;
        let opponentDiedFlag = [];

        function CreateOpponent(){
            let thisOpponentController = CreateOpponentController();
            let opponentStyle = elemOpponent.style;

            // Creating the element, configuring Id and class and adding it to an array (+ updating the count for the next Id assignment).
            let elemOpponent = document.createElement("div");
            elemOpponent.classList.add('opponent');
            elemOpponent.id = `opponent${opponentIDCounter}`;
            opponentIDCounter++;

            // Required for defining Right and Bottom using other property's setters.
            thisOpponentController.setHeight = ConvertPropertyToInt(playerStyle.height);
            thisOpponentController.setWidth = ConvertPropertyToInt(playerStyle.width);

            // Right and Bottom are defined by setters of Left and Top.
            let spawnPointXY = [getGameContainerWidth()/2-(thisOpponentController.getWidth/2),  opponentsDied % 2 == 0 ? 0 : getGameContainerHeight() - thisOpponentController.getHeight];
            thisOpponentController.setLeft = spawnPointXY[0];
            thisOpponentController.setTop = spawnPointXY[1];
            
            // Styling the opponent element and applying alternating colors.
            opponentStyle.position = 'absolute';
            opponentStyle.width = `${thisOpponentController.Width}px`;
            opponentStyle.height = `${thisOpponentController.Height}px`;
            if (opponentsDied % 2 == 0) opponentStyle.background = "yellow";
            else opponentStyle.background = "red";
            opponentStyle.left = `${thisOpponentController.Left}px`;
            opponentStyle.right = `${thisOpponentController.Right}px`;
            opponentStyle.top = `${thisOpponentController.Top}px`;
            opponentStyle.bottom = `${thisOpponentController.Bottom}px`;

            // Adding the element to the playing field.
            document.getElementById("gameContainer").appendChild(elemOpponent);
            opponentList.push(elemOpponent);
            
            // Configuring the alternating moving directions
            let horizontalDirection = opponentIDCounter % 2 == 0 ? 'left' : 'right';
            let verticalDirection = opponentIDCounter % 2 == 0 ? 'up' : 'down';
            thisOpponentController.setHorizontalDirection = horizontalDirection;
            thisOpponentController.setVerticalDirection = verticalDirection;

            AnimateOpponent(elemOpponent, thisOpponentController);
        }

        function AnimateOpponent(elemOpponent, thisOpponentController) {
            let randomXMoveFactor = 1, randomYMoveFactor = 1;

            let topRule, bottomRule, leftEdgeRule, rightEdgeRule;
            let topPlayerCollision, bottomPlayerCollision, leftPlayerCollision, rightPlayerCollision;
            // An interval to animate opponent movement/collision until collision with the PLAYER occurs.
            let interval = setInterval(function() {
                // Stopping the movement sequence for a non-existing element
                if (opponentDiedFlag.includes(elemOpponent)){
                    opponentDiedFlag.splice(opponentDiedFlag.indexOf(elemOpponent), opponentDiedFlag.indexOf(elemOpponent)+1);
                    clearInterval(interval);
                }

                // Creating MOVING collision rules.
                topRule = thisOpponentController.getTop < 0;
                bottomRule = thisOpponentController.getBottom > getGameContainerHeight();
                leftEdgeRule = thisOpponentController.getLeft < 0;
                rightEdgeRule = thisOpponentController.getRight > getGameContainerWidth();

                // Creating PLAYER collision rules.
                let collisionMargin = 100*2; // A cut to the collsion area due to the round visual vs square hitbox
                topPlayerCollision = thisOpponentController.getBottom > ConvertPropertyToInt(playerStyle.top) + ConvertPropertyToInt(playerStyle.top)/collisionMargin;
                bottomPlayerCollision = thisOpponentController.getTop < ConvertPropertyToInt(playerStyle.bottom) - ConvertPropertyToInt(playerStyle.bottom)/collisionMargin;
                leftPlayerCollision = thisOpponentController.getRight > ConvertPropertyToInt(playerStyle.left) + ConvertPropertyToInt(playerStyle.left)/collisionMargin;
                rightPlayerCollision = thisOpponentController.getLeft < ConvertPropertyToInt(playerStyle.right) - ConvertPropertyToInt(playerStyle.right)/collisionMargin; 

                // Applying WALL CONTACT collision rules.
                if (topRule)
                    thisOpponentController.setVerticalDirection = 'down';
                if (bottomRule)
                    thisOpponentController.setVerticalDirection = 'up';
                if (leftEdgeRule)
                    thisOpponentController.setHorizontalDirection = 'right';
                if (rightEdgeRule)
                    thisOpponentController.setHorizontalDirection = 'left';
                
                let maxAcceleration = 3;
                if (topRule || bottomRule || leftEdgeRule || rightEdgeRule){
                    randomXMoveFactor = Math.floor(Math.random() * maxAcceleration);
                    randomYMoveFactor = Math.floor(Math.random() * maxAcceleration);
                }

                // Applying PLAYER CONTACT collision rules.
                if (topPlayerCollision && bottomPlayerCollision && leftPlayerCollision && rightPlayerCollision){
                    KillOpponent(elemOpponent); KillPlayer(); clearInterval(interval);
                }
                
                // Updating the opponent-controller.
                let horizontalDirection = thisOpponentController.getHorizontalDirection;
                let verticalDirection = thisOpponentController.getVerticalDirection;
                let randomisedXMoveSpeed = randomXMoveFactor + thisOpponentController.getMoveSpeed;
                let randomisedYMoveSpeed = randomYMoveFactor + thisOpponentController.getMoveSpeed;
                if (verticalDirection === 'up')
                    thisOpponentController.setTop = thisOpponentController.getTop - randomisedYMoveSpeed;
                if (verticalDirection === 'down')
                    thisOpponentController.setTop = thisOpponentController.getTop + randomisedYMoveSpeed;
                if (horizontalDirection === 'left')
                    thisOpponentController.setLeft = thisOpponentController.getLeft - randomisedXMoveSpeed;
                if (horizontalDirection === 'right')
                    thisOpponentController.setLeft = thisOpponentController.getLeft + randomisedXMoveSpeed;

                opponentStyle.left = `${thisOpponentController.getLeft}px`;
                opponentStyle.right = `${thisOpponentController.getRight}px`;
                opponentStyle.top = `${thisOpponentController.getTop}px`;
                opponentStyle.bottom = `${thisOpponentController.getBottom}px`;

            }, 20);
        }

        function KillOpponent(elemOpponent){
            opponentDiedFlag.push(elemOpponent);
            // Resetting variables and adjusting lists because of item removal.
            opponentsDied++;
            opponentList.splice(opponentList.indexOf(elemOpponent), opponentList.indexOf(elemOpponent)+1);
            
            // Creating a minimal death animation using a width/height transition.
            elemOpponent.style.width = '0px'; elemOpponent.style.height = '0px';
            
            // Removing the element using JQuery after the death-transition has ended.
            setTimeout(function(){ $(`#${elemOpponent.id}`).remove(); gameController.setOpponentsKilled = gameController.getOpponentsKilled +1;}, 1200);
        }

        // Remove all opponents using JQuery and resetting their variables.
        function KillAllOpponents(){
            opponentList = [];
            opponentsDied = 0;
            opponentIDCounter = 0;
            $("div.opponent").remove();
        }

        /* ---------------------------------------------------------------------------------------------- */
        /* ------------------------- *//* Bullets *//* -------------------------- */ Overview
        /* ---------------------------------------------------------------------------------------------- */

        let bulletIDCounter = 0;
        let bulletList = [];
        function CreateBullet(){
            // Creating the element, configuring id/class and preparing data for styling.
            let elemBullet = document.createElement("div");
            elemBullet.classList.add('bullet');
            elemBullet.id = `bullet${bulletIDCounter}`;
            bulletIDCounter++;
            
            let bulletStyle = elemBullet.style;
            let bulletHeigth = ConvertPropertyToInt(playerStyle.height)/4, bulletWidth = ConvertPropertyToInt(playerStyle.width)/4;

            let spawnPointXY = [];
            let spawnpointX, spawnpointY;
            let bulletDirectionX = '', bulletDirectionY = '';

            // Translating the possible moving direction of the player into a direction for the bullet.
            SwitchOnDirection(playerController.getFirstMoveDirection);
            SwitchOnDirection(playerController.getSecondMoveDirection);
            function SwitchOnDirection(switchValue){
                switch(switchValue){
                    case 'up':
                            spawnpointY = ConvertPropertyToInt(playerStyle.top);
                            bulletDirectionY = switchValue;
                            break;
                    case 'down':
                            spawnpointY = ConvertPropertyToInt(playerStyle.top);
                            bulletDirectionY = switchValue;
                            break;
                    case 'left':
                            spawnpointX = ConvertPropertyToInt(playerStyle.left);
                            bulletDirectionX = switchValue;
                            break;
                    case 'right':
                            spawnpointX = ConvertPropertyToInt(playerStyle.right);
                            bulletDirectionX = switchValue;
                            break;
                }
            }

            if (bulletDirectionX === ''){
                spawnpointX = ConvertPropertyToInt(playerStyle.right);
                if (bulletDirectionY == '') bulletDirectionX = 'right';
            }
            if (bulletDirectionY === ''){
                spawnpointY = ConvertPropertyToInt(playerStyle.top)+ConvertPropertyToInt(playerStyle.height)/2;
            }

            // Adding some margin between the player and the bullet to avoid collision.
            spawnPointXY[0] = spawnpointX + 2.5;
            spawnPointXY[1] = spawnpointY + 2.5;

            // Styling the bullet's dimensions and appearance.
            bulletStyle.width = ConvertIntToPixelProperty(bulletWidth);
            bulletStyle.height = ConvertIntToPixelProperty(bulletHeigth);

            bulletStyle.left = ConvertIntToPixelProperty(spawnPointXY[0] - (bulletWidth/2));
            bulletStyle.right = ConvertIntToPixelProperty(spawnPointXY[0] + (bulletWidth/2));
            bulletStyle.top = ConvertIntToPixelProperty(spawnPointXY[1] - (bulletHeigth/2));
            bulletStyle.bottom = ConvertIntToPixelProperty(spawnPointXY[1] + (bulletHeigth/2));
            
            bulletStyle.position = 'absolute';
            bulletStyle.background = 'red';
            
            // Showing, registering and animating the created bullet.
            elemGameContainer.appendChild(elemBullet);
            bulletList.push(elemBullet);
            AnimateBullet(elemBullet, bulletDirectionX, bulletDirectionY);
        }


        function AnimateBullet(elemBullet, horizontalDirection, verticalDirection) {
            let bulletStyle = elemBullet.style;
            let collisionCounter = 0; let maxCollisions = 10;
            let shrinkFactor = (ConvertPropertyToInt(bulletStyle.width)/maxCollisions + ConvertPropertyToInt(bulletStyle.height)/maxCollisions)/2;

            gameController.setBulletsFired = gameController.getBulletsFired +1;
            
            // Color is used to grant the player temporary protection from a spawned bullet.
            bulletStyle.background = 'green';
            setTimeout(function(){ elemBullet.style.background = 'red';}, 1000);

            // An interval to animate opponent WALL collision until collision with the PLAYER occurs.
            let bulletAnimationInterval = setInterval(function() {
                let bulletTop = ConvertPropertyToInt(bulletStyle.top), bulletBottom = ConvertPropertyToInt(bulletStyle.bottom);
                let bulletLeft = ConvertPropertyToInt(bulletStyle.left), bulletRight = ConvertPropertyToInt(bulletStyle.right);
                let bulletWidth = ConvertPropertyToInt(bulletStyle.width), bulletHeight = ConvertPropertyToInt(bulletStyle.height);
                
                // Creating MOVING collision rules.
                let topRule = bulletTop < 0;
                let bottomRule = bulletBottom > getGameContainerHeight();
                let leftEdgeRule = bulletLeft < 0;
                let rightEdgeRule = bulletRight > getGameContainerWidth();

                // Applying MOVING collision rules.
                if (topRule)
                    verticalDirection = 'down';
                if (bottomRule)
                    verticalDirection = 'up';
                if (leftEdgeRule)
                    horizontalDirection = 'right';
                if (rightEdgeRule)
                    horizontalDirection = 'left';
                    
                if (topRule || bottomRule || leftEdgeRule || rightEdgeRule){
                    collisionCounter++; 
                    if (collisionCounter == maxCollisions) {KillBullet(elemBullet); gameController.setBulletsKilled = gameController.getBulletsKilled +1;}
                    if (collisionCounter % 2 == 0) {
                        bulletStyle.width = ConvertIntToPixelProperty(bulletWidth-shrinkFactor); 
                        bulletStyle.height = ConvertIntToPixelProperty(bulletHeight-shrinkFactor);
                    }
                }        

                // Creating and applying OPPONENT collision rules for each known opponent, executed by the bullet.
                function CheckOpponentCollision(item){
                    let itemStyle = item.style;
                    let topOpponentCollision, bottomOpponentCollision, leftOpponentCollision, rightOpponentCollision;

                    // Without enough space (player/opponent width), reducing the hitbox to cope with the round shape is hurtful to the game experience.
                    if (mobileFlag){
                        topOpponentCollision = bulletBottom > ConvertPropertyToInt(itemStyle.top);
                        bottomOpponentCollision = bulletTop < ConvertPropertyToInt(itemStyle.bottom);
                        leftOpponentCollision = bulletRight > ConvertPropertyToInt(itemStyle.left);
                        rightOpponentCollision = bulletLeft < ConvertPropertyToInt(itemStyle.right);
                    }
                    else{
                        topOpponentCollision = bulletBottom > ConvertPropertyToInt(itemStyle.top) + ConvertPropertyToInt(itemStyle.top)/100*2;
                        bottomOpponentCollision = bulletTop < ConvertPropertyToInt(itemStyle.bottom) - ConvertPropertyToInt(itemStyle.bottom)/100*2
                        leftOpponentCollision = bulletRight > ConvertPropertyToInt(itemStyle.left) + ConvertPropertyToInt(itemStyle.left)/100*2;
                        rightOpponentCollision = bulletLeft < ConvertPropertyToInt(itemStyle.right) - ConvertPropertyToInt(itemStyle.right)/100*2;
                    }
                
                    // Applying OPPONENT collision rules.
                    if (topOpponentCollision && bottomOpponentCollision && leftOpponentCollision && rightOpponentCollision){
                        KillOpponent(item); KillBullet(elemBullet); clearInterval(bulletAnimationInterval); console.log('HIT');
                    }
                }
                opponentList.forEach(CheckOpponentCollision);

                // Creating PLAYER collision rules.
                let topPlayerCollision = bulletBottom > ConvertPropertyToInt(playerStyle.top) + ConvertPropertyToInt(playerStyle.top)/100*2;
                let bottomPlayerCollision = bulletTop < ConvertPropertyToInt(playerStyle.bottom) - ConvertPropertyToInt(playerStyle.bottom)/100*2;
                let leftPlayerCollision = bulletRight > ConvertPropertyToInt(playerStyle.left) + ConvertPropertyToInt(playerStyle.left)/100*2;
                let rightPlayerCollision = bulletLeft < ConvertPropertyToInt(playerStyle.right) - ConvertPropertyToInt(playerStyle.right)/100*2;

                // Applying PLAYER collision rules.
                if (topPlayerCollision && bottomPlayerCollision && leftPlayerCollision && rightPlayerCollision && bulletStyle.background === 'red'){
                    KillPlayer(); KillBullet(elemBullet); clearInterval(bulletAnimationInterval);
                }

                // Executing the actual movement.
                let moveSpeed = ConvertPropertyToInt(playerStyle.width)/20*1.5;

                if (verticalDirection === 'up'){
                    bulletStyle.top = ConvertIntToPixelProperty(bulletTop - moveSpeed);
                    bulletStyle.bottom = ConvertIntToPixelProperty(bulletTop + bulletHeight);
                }
                if (verticalDirection === 'down'){
                    bulletStyle.top = ConvertIntToPixelProperty(bulletTop + moveSpeed);
                    bulletStyle.bottom = ConvertIntToPixelProperty(bulletTop + bulletHeight);
                }
                if (horizontalDirection === 'left'){
                    bulletStyle.left = ConvertIntToPixelProperty(bulletLeft - moveSpeed);
                    bulletStyle.right = ConvertIntToPixelProperty(bulletLeft + bulletWidth);
                }
                if (horizontalDirection === 'right'){
                    bulletStyle.left = ConvertIntToPixelProperty(bulletLeft + moveSpeed);
                    bulletStyle.right = ConvertIntToPixelProperty(bulletLeft + bulletWidth);
                }

            }, 20);}

            let bulletsDied = 0;
            // Killing a single bullet using the parameter element.
            function KillBullet(elemBullet){
                // Resetting variables and adjusting lists because of item removal.
                bulletsDied++;
                bulletList.splice(bulletList.indexOf(elemBullet), bulletList.indexOf(elemBullet)+1);
                
                // Creating a minimal death animation using a width/height transition.
                elemBullet.style.width = '0px'; elemBullet.style.height = '0px';
                
                // Removing the element using JQuery after the death-transition has ended.
                setTimeout(function(){ $(`#${elemBullet.id}`).remove();}, 400);
            }

            // Remove all bullets using JQuery and resetting their variables.
            function KillAllBullets(){
                bulletList = [];
                bulletsDied = 0;
                bulletIDCounter = 0;
                $("div.bullet").remove();
            }

        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* ---------------------------- *//* GAME FLOW *//* ---------------------------- */// 
        ///* --------------------------------------------------------------------------------------------------------- *///
        ///* --------------------------------------------------------------------------------------------------------- *///
        StartGameFlow();
        function StartGameFlow(){
            function AwaitOutcome(){
                // A short interval checking if the player loses or wins. (And configuring the controller accordingly)
                let interval = setInterval(function(){
                    if (opponentList.length == 0)
                        gameController.setGameOver = true;
                    if (gameController.playerDeaths > 5)
                        gameController.setGameOver = true; 
                }, 20);
            }

            // A short block of code to start awaiting the outcome and sequence the opponent spawning waves. (a little faster every time)
            setTimeout(AwaitOutcome, 1000);
            opponentLimit = 15;
            for (i = 0; i < opponentLimit; i = i + 1000) { 
                setTimeout(CreateOpponent, i-1000/opponentLimit);
            }
        }

        // All operations needed to apply the appearances for the end of this game.
        let classNameGameWon = 'youWin';
        let classNameGameLost = 'youDied';
        function KillGame(){
            KillAllBullets(); KillAllOpponents(); KillPlayer();
            document.getElementById('restartButton').classList.remove('buttonHidden');
            document.getElementById('restartButton').classList.add('buttonVisible');
            if (opponentList.length == 0){
                elemGameContainer.classList.add(classNameGameWon);
            }
            else{
                elemGameContainer.classList.add(classNameGameLost);
            }
        }

        // All operations needed to undo the appearances at the end of this game AND restarting the game.
        function UndoEndgame(){
            setTimeout(function(){
                let containerClassList = elemGameContainer.classList;
                if (containerClassList.contains(classNameGameWon))
                    containerClassList.remove(classNameGameWon);
                if (containerClassList.contains(classNameGameLost))
                    containerClassList.remove(classNameGameLost);
                document.getElementById('restartButton').classList.add('buttonHidden');
                document.getElementById('restartButton').classList.remove('buttonVisible');
                RestartGame();
            },1000);
        }

        // All operations needed to start a normal gameplay.
        function RestartGame(){
            // Resetting game statistics
            gameController.setBulletsFired = 0;
            gameController.setBulletsKilled = 0;
            gameController.setOpponentsKilled = 0;
            gameController.setPlayerDeaths = 0;
            gameController.setPlayerTimes = [];

            // Resetting the game mechanics
            gameController.setGameOver = false;
            playerController = CreatePlayerController();

            RespawnPlayer();

            // Opponent waves will commence after 1 second.
            setTimeout(StartGameFlow, 1000);
        }

        // A button, visible when defeated/victorious to restart the game.
        document.getElementById('restartButton').addEventListener('click', function(){if (gameController.getGameOver) UndoEndgame();});
    }); // load
})(); // nameless function

