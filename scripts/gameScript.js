"use strict";

///* --------------------------------------------------------------------------------------------------------- *///
///* --------------------------------------------------------------------------------------------------------- *///
///* ----------------------------------- *//* SECTION GLOBAL VARIABLES *//* ---------------------------------- *///
///* --------------------------------------------------------------------------------------------------------- *///
///* --------------------------------------------------------------------------------------------------------- *///

/* --------------------------------------------------------------------------------------------------------- */
/* ------------------------- *//* Saved DOM-elements and their properties *//* ------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

var elemPlayer = document.getElementById("player");
var elemGameContainer = document.getElementById("gameContainer");

var playerWidth = $("#player").outerWidth();
var playerHeight = $("#player").outerHeight();

/* --------------------------------------------------------------------------------------------------------- */
/* ------------------------- *//* Expressies regarding DOM-elements *//* ------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

// Expressions for retrieving up-to-date element-properties.
var getGameContainerWidth = function(){
    return $("#gameContainer").width();
}
var getGameContainerHeight = function(){
    return $("#gameContainer").height();
}
var getPlayerWidth = function(){
    return $("#player").outerWidth();
}
var getPlayerHeight = function(){
    return $("#player").outerHeight();
}

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* Defaultconfigurations *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

// Configuring the player's properties to it's default values for this game regarding position.
DefaultPlayerPosition();
function DefaultPlayerPosition(){
    let playerStyleRef = elemPlayer.style;

    let startPositionX = 0;
    let startPositionY = 0;

    playerStyleRef.left = `${startPositionX}px`;
    playerStyleRef.right = `${startPositionX + getPlayerWidth()}px`;
    playerStyleRef.top = `${startPositionY}px`;
    playerStyleRef.bottom = `${startPositionY + getPlayerHeight()}px`;
}

// A precaution for overflow and animation issues, adapting the container to the player dimensions.
ConfigureContainerDimensions();
function ConfigureContainerDimensions(){
    let previousWidth = getGameContainerWidth();
    let previousHeight = getGameContainerHeight();

    elemGameContainer.style.width = Math.round((previousWidth/getPlayerWidth()))*getPlayerWidth() + "px";
    elemGameContainer.style.height = Math.round((previousHeight/getPlayerHeight()))*getPlayerHeight() + "px";
}

///* --------------------------------------------------------------------------------------------------------- *///
///* --------------------------------------------------------------------------------------------------------- *///
///* ------------------------------------ *//* SECTION HANDLING KEYS *//* ------------------------------------ *///
///* --------------------------------------------------------------------------------------------------------- *///
///* --------------------------------------------------------------------------------------------------------- *///

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* Global-/Helperfunctions *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

// Converts a (pixel-)position-property to a workable integer.
function ConvertPropertyToInt(propertyValue){
    return parseInt(propertyValue.replace('px', ''), 10);
}

/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------- *//* Move-Controller *//* --------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

// moveSpeed = pixels per move -- first-/secondMoveFlag = booleans signaling if player moves or not.
//first-/secondDirection = directions in which one moves, multiple because of diagonal movement -- gravity = force that pulls back what went up.
let moveController = { moveSpeed: 1, firstMoveFlag: false, secondMoveFlag: false, firstDirection: '', secondDirection: '', gravity: 0 };

// Attachement of getter and setter properties which will trigger or fire other events/methods.
Object.defineProperties(moveController, {
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

    'getGravity': { get: function() { return this.gravity; }},
    'setGravity': { set: function(value) { this.gravity = value; }}
});

/* ------------------------------------------------------------------------------------------------------------------------ */
/* ----------------------------------- *//* EventListening to keypresses-/releases *//* ----------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------ */

// Two references to handler methods for the keydown and keyup events.
onkeyup = onkeydown = HandleKeyEvent;

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* Eventhandling Variables *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

// A memory of used arrow-keycodes to react upon within this program (arrowKeys) and a map of each entered keycode's current state (keycodeMap).
let arrowKeys = {left:'37', up:'38', right:'39', down:'40'};
let keycodeMap = {};

// Variable to indentify whether a move is started/stopped. (keydown or keyup)
let isKeyUpEvent = false;

/* ---------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* Eventhandler *//* ----------------------------------- */
/* ---------------------------------------------------------------------------------------------- */

function HandleKeyEvent(e) 
{
    
    e = e || event; // Dealing with IE.

    // Mapping the key and its current state (if keydown -> true).
    keycodeMap[e.keyCode] = e.type == 'keydown';
    
    // Defining if we configure the moveController for movement or deconfigure it for stopping movement.
    if(e.type == 'keydown') 
    {
        isKeyUpEvent = false;
        HandlePlayerSprite(true);
        HandleAppearanceFlipping(true);
    }
    else 
    {
        isKeyUpEvent = true;
        if (moveController.firstDirection == '' || moveController.secondDirection == '')
        {
            HandlePlayerSprite(false);
            HandleAppearanceFlipping(false);
        }
        
    }

    // Check if the input keycode is an arrow-key of the arrowKeys variable.
    if (Object.values(arrowKeys).indexOf(e.keyCode.toString()) > -1) 
    {
        // Map the state of an arrow-key event. ( -> true).
        keycodeMap[e.keyCode] = false;
        
        // Configure the moveController according to the used key and purpose.
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
/* ------------------------- *//* Appearance Handling *//* -------------------------- */
/* ---------------------------------------------------------------------------------------------- */

animateScript();
var tID; //we will use this variable to clear the setInterval()
function animateScript() {
    let spriteWidth = playerWidth;
    let slicerPosition = spriteWidth;
    let slicesShowed = 0;

    tID = setInterval ( () => {
        slicesShowed++;
        elemPlayer.style.backgroundPosition = `-${slicerPosition}px`;
        document.getElementById('playerWalking').style.backgroundPosition = `-${slicerPosition}px`;
        document.getElementById('playerRunning').style.backgroundPosition = `-${slicerPosition}px`;
        document.getElementById('playerJumping').style.backgroundPosition = `-${slicerPosition}px`;
        document.getElementById('playerAttacking').style.backgroundPosition = `-${slicerPosition}px`;
        document.getElementById('playerHurt').style.backgroundPosition = `-${slicerPosition}px`;
        document.getElementById('playerDying').style.backgroundPosition = `-${slicerPosition}px`;

        if (slicesShowed != 4)
        { slicerPosition = slicerPosition + spriteWidth;}
        else
        { slicerPosition = spriteWidth; slicesShowed = 0;}
    }
    , 125 );
} 

var constructSpriteClassName = function(spriteType){
    return 'player' + spriteType.substr(0,1).toUpperCase() + spriteType.substr(1,spriteType.length);
}

let currentSpriteType = 'idle';
HandlePlayerSprite('idle');
document.getElementById('playerWalking').classList.add('playerWalking');
document.getElementById('playerRunning').classList.add('playerRunning');
document.getElementById('playerJumping').classList.add('playerJumping');
document.getElementById('playerAttacking').classList.add('playerAttacking');
document.getElementById('playerHurt').classList.add('playerHurt');
document.getElementById('playerDying').classList.add('playerDying');

function HandlePlayerSprite(newSpriteType) 
{
    elemPlayer.classList.remove(constructSpriteClassName(currentSpriteType));
    currentSpriteType = newSpriteType;
    elemPlayer.classList.add(constructSpriteClassName(currentSpriteType));
}

function HandleAppearanceFlipping(isFlipped) 
{
    if (isFlipped)
    {
        elemPlayer.classList.add('playerFlipped');
    }
    else 
    {
        elemPlayer.classList.remove('playerFlipped');
    }
    
}

/* ---------------------------------------------------------------------------------------------- */
/* ------------------------- *//* Configuring the move-controller *//* -------------------------- */
/* ---------------------------------------------------------------------------------------------- */
// Separation of these processes is of importance to benefit programming logic and flag-control.
function ConfigureStartMoveController(direction)
{
    // Avoidance of code execution whenever the direction is already configured.
    if (moveController.getFirstMoveDirection != direction && moveController.getSecondMoveDirection != direction)
    {
        // Checking if the first direction-slot is free, if yes it is configured for the start of movement.
        if (moveController.getFirstMoveDirection == '')
        {
            moveController.setFirstMoveFlag = true;
            moveController.setFirstMoveDirection = direction;
        }
        // Filling in the second direction-slot resulting in diagonal movement and configuring it for the start of movement.
        else
        {
            moveController.setSecondMoveFlag = true;
            moveController.setSecondMoveDirection = direction;
        }
    }
}

function ConfigureStopMoveController(direction)
{
    // Checking if the first direction-slot is equal the the key, if yes it is configured for the stopping of movement.
    if (moveController.getFirstMoveDirection == direction)
    {
        moveController.setFirstMoveFlag = false;
        moveController.setFirstMoveDirection = '';
    }
    // Checking if the second direction-slot is equal the the key, if yes it is configured for the stopping of movement.
    else
    {
        moveController.setSecondMoveFlag = false;
        moveController.setSecondMoveDirection = '';
    }
}

///* --------------------------------------------------------------------------------------------------------- *///
///* --------------------------------------------------------------------------------------------------------- *///
///* ---------------------------------- *//* SECTION SEQUENCING MOVEMENT *//* -------------------------------- *///
///* --------------------------------------------------------------------------------------------------------- *///
///* --------------------------------------------------------------------------------------------------------- *///

/* --------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* Managing the sequencing of Movement *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------------------- */

// Variables to signal a sequence of moves (because of keeping a key pressed) to stop.
// The separation of directions and their processing is necessary to execute both movements independently.
let stopFirstMoveSequenceFlag = false;
let stopSecondMoveSequenceFlag = false;

// A variable to lock the moving process from all excessive generated events when keeping a key pressed down.
let lockFirstMoveSequence = false;
let lockSecondMoveSequence = false;

// Two simple functions to signal and intervene when a moving-sequence is running.
function StopFirstMoveFrameSequencing() 
{
    stopFirstMoveSequenceFlag = true;
}
function StopSecondMoveFrameSequencing() 
{
    stopSecondMoveSequenceFlag = true;
}

// Responsability: Starting and stopping a sequence/interval of frames while protecting it from excessive method calls by event-triggers.
function StartSequencingFrames() {
    if (!lockFirstMoveSequence)
    {
        // Reset the flag before starting a new moving sequence
        lockFirstMoveSequence = true;
        let firstSequenceFrameInterval = setInterval(function(){ ExecuteSequenceFrame(stopFirstMoveSequenceFlag, true, moveController.getFirstMoveDirection, firstSequenceFrameInterval);}, 10);
    }
    if (!lockSecondMoveSequence)
    {
        // Reset the flag before starting a new moving sequence
        lockSecondMoveSequence = true;
        let secondSequenceFrameInterval = setInterval(function(){ ExecuteSequenceFrame(stopSecondMoveSequenceFlag, false, moveController.getSecondMoveDirection, secondSequenceFrameInterval);}, 10);
    }
}

// Responsability: Clearing the interval whenever the moveController intervenes and executing a single sequenceframe.
function ExecuteSequenceFrame(stopMoveSequenceFlag, isFirstDirectionFlag, moveDirection, sequenceFrameInterval) 
{
    if (!stopMoveSequenceFlag)
    {
        ExecuteMoveAnimationFrame(moveDirection);
    }
    else 
    {
        if (isFirstDirectionFlag) { stopFirstMoveSequenceFlag = false; lockFirstMoveSequence = false; }
        else { stopSecondMoveSequenceFlag = false; lockSecondMoveSequence = false; }
        clearInterval(sequenceFrameInterval);
    }
}

// Responsability: Starting the animation of a move in the according direction.
function ExecuteMoveAnimationFrame(moveDirection) {
    requestAnimationFrame(function fireMovingProcess() {
        switch(moveDirection)
        {
            case 'left':
                ExecuteMovingProcess('left');
                break;

            case 'right':
                ExecuteMovingProcess('right');
                break;

            case 'up':
                ExecuteMovingProcess('up');
                break;

            case 'down':
                ExecuteMovingProcess('down');
                break;
        }
    });
}

///* --------------------------------------------------------------------------------------------------------- *///
///* --------------------------------------------------------------------------------------------------------- *///
///* ---------------------------- *//* SECTION EXECUTING THE ACTUAL MOVEMENT *//* ---------------------------- *///
///* --------------------------------------------------------------------------------------------------------- *///
///* --------------------------------------------------------------------------------------------------------- *///

// Responsability: Changing the position in pixels of an element in a certain axial direction on the screen.
function ExecuteMovingProcess(moveDirection, movedElement = null){
    // A basic container-variable to store the style reference of a given element or the player (per default).
    let movedElementStyle;
    movedElement == null ? movedElementStyle = elemPlayer.style : movedElementStyle = movedElement.style;

    // Applying movement-restriction rules before actually moving the element on the screen.
    let topRule = ConvertPropertyToInt(movedElementStyle.top) > 0;
    let bottomRule = ConvertPropertyToInt(movedElementStyle.bottom) < getGameContainerHeight();
    let leftEdgeRule = ConvertPropertyToInt(movedElementStyle.left) > 0;
    let rightEdgeRule = ConvertPropertyToInt(movedElementStyle.right) < getGameContainerWidth();

    switch(moveDirection){
        case "up":
            if (topRule){
                // Rules concerning the top and bottom of the container
                MoveElementPosition(moveDirection, movedElementStyle);
            }
            break;
            
        case "down":
            // Rules concerning the top and bottom of the container
            if (bottomRule){
                MoveElementPosition(moveDirection, movedElementStyle);
            }
            break;
            
        case "left":
            // Rules concerning the left and right edges of the container
            if (leftEdgeRule){
                MoveElementPosition(moveDirection, movedElementStyle);
            }
            break;
            
        case "right":
            // Rules concerning the left and right edges of the container
            if (rightEdgeRule){
                MoveElementPosition(moveDirection, movedElementStyle);
            }
            break;
    }
}

// Replacing the values of the element its position-properties, based on the given direction.
function MoveElementPosition(moveDirection, movedElementStyle) 
{
    let topPos = ConvertPropertyToInt(movedElementStyle.top);
    let leftPos = ConvertPropertyToInt(movedElementStyle.left);
    let pixelsPerMove = moveController.moveSpeed;

    // Filtering on up/down using an if-else statement wherein we filter on left/right using a ternary operator.
    if (moveDirection === 'up' || moveDirection === 'down')
    {
        movedElementStyle.top = moveDirection === 'down' ? `${topPos + pixelsPerMove}px` : `${topPos - pixelsPerMove}px`;
        movedElementStyle.bottom = moveDirection === 'down' ? `${topPos + pixelsPerMove + playerHeight}px` : `${topPos - pixelsPerMove + playerHeight}px`;
    }
    else
    {
        movedElementStyle.left = moveDirection === 'right' ? `${leftPos + pixelsPerMove}px` : `${leftPos - pixelsPerMove}px`;
        movedElementStyle.right = moveDirection === 'right' ? `${leftPos + pixelsPerMove + playerWidth}px` : `${leftPos - pixelsPerMove + playerWidth}px`;
    }
}