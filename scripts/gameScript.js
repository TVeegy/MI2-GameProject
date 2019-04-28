"use strict";

/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* SECTIE GLOBALE VARIABELEN *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* Element variabelen *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
var elemPlayer = document.getElementById("player");
var elemContainer = document.getElementById("gameContainer");


/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* Element property variabelen *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

var playerWidth = $("#player").outerWidth();
var playerHeight = $("#player").outerHeight();

// Expressies om met een dynamische container te werken ivm resizing tijdens het spelen v.h. spel.
var getGameContainerWidth = function(){
    return $("#gameContainer").width();
}
var getGameContainerHeight = function(){
    return $("#gameContainer").height();
}

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* Invullen element property variabelen *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

// Mario's afmetingen zijn dynamisch, javascript leest ook enkel inline-CSS en geen CSS stijlbladen.
resetPlayerPosition();
function resetPlayerPosition(){
    let playerStyleRef = elemPlayer.style;

    // Uitbreiding
    let startPosition = 0;
    let currentPlayerWidth = playerWidth;
    let currentPlayerHeight = playerHeight;

    // De speler zijn positie configureren
    playerStyleRef.left = `${startPosition}px`;
    playerStyleRef.right = `${currentPlayerWidth}px`;
    playerStyleRef.top = `${startPosition}px`;
    playerStyleRef.bottom = `${currentPlayerHeight}px`;
}

/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* SECTIE BEWEGENINGSMECHANISME *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* Helperfuncties *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

// De container's afmetingen afronden zodat bewegende objecten per 10 pixels kunnen bewegen. (zo geen overflow aan randen)
roundgameContainerSize();
function roundgameContainerSize(){
    let oldWidth = getGameContainerWidth();
    let oldHeight = getGameContainerHeight();
    
    elemContainer.style.width = Math.round((oldWidth/10))*10 + "px";
    elemContainer.style.height = Math.round((oldHeight/10))*10 + "px";
}

// Helperfunctie die een property omzet naar een bruikbaar getal.
function convertPropertyToInt(property){
    return parseInt(property.replace('px', ''), 10);
}

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* EventListening *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

// A memory of used arrow-keycodes to react upon within this program (arrowKeys) and a map of each arrow-keycode's current state (arrowKeyStateMap)
let arrowKeys = {left:'37', up:'38', right:'39', down:'40'};
let arrowKeyStateMap = {37:false, 38:false, 39:false, 40:false};

// Two references to handler methods for the keydown and keyup events
onkeyup = HandleKeyUp;
onkeydown = HandleKeyDown;

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* EventHandling *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

function HandleKeyDown(e) {
    e = e || event; // Dealing with IE

    // Check if the input keycode is an arrow-key of the arrowKeys variable
    if (Object.values(arrowKeys).indexOf(e.keyCode.toString()) > -1) 
    {
        // Map the state of an arrow-key event. ( -> true)
        arrowKeyStateMap[e.keyCode] = true;
        
        // Configure the moveController according to the used key
        switch(e.keyCode.toString()){
            case '37':
                moveController.setMoveDirection = 'left';
                moveController.setMoveSpeed = 1;
                break;

            case '39':
                moveController.setMoveDirection = 'right';
                moveController.setMoveSpeed = 1;
                break;

            case '38':
                moveController.setMoveDirection = 'up';
                moveController.setMoveSpeed = 1;    
                break;

            case '40':
                moveController.setMoveDirection = 'down';
                moveController.setMoveSpeed = 1; 
                break;
        }
    }
}

function HandleKeyUp(e) {
    e = e || event; // Dealing with IE

    // Check if the input keycode is an arrow-key of the arrowKeys variable
    if (Object.values(arrowKeys).indexOf(e.keyCode.toString()) > -1) 
    {
        // Map the state of an arrow-key event. ( -> true)
        arrowKeyStateMap[e.keyCode] = false;
        
        // Configure the moveController according to the used key
        switch(e.keyCode.toString()){
            case '37':
                moveController.setMoveDirection = 'left';
                moveController.setMoveSpeed = 0;
                break;

            case '39':
                moveController.setMoveDirection = 'right';
                moveController.setMoveSpeed = 0;
                break;

            case '38':
                moveController.setMoveDirection = 'up';
                moveController.setMoveSpeed = 0;    
                break;

            case '40':
                moveController.setMoveDirection = 'down';
                moveController.setMoveSpeed = 0;    
                break;
        }
    }
}

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* Move Controller *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

// The basic variable out of which an object is defined with accompanying getters and setters.
let moveController = { moveSpeed: 0, direction: '', gravity: 0 };

// A move speed of += 1 will prompt moving, anything below that will stop moving. (this provided there is a configured direction)
Object.defineProperties(moveController, {
    'getMoveSpeed': { get: function() { return this.moveSpeed; } },
    'setMoveSpeed': { set: function(value) { if (value >= 1) StartSequencingMoves(); else StopSequencing(); this.moveSpeed = value;} },
    'getMoveDirection': { get: function() { return this.moveSpeed; } },
    'setMoveDirection': { set: function(value) { this.direction = value; this.direction = value;} },
    'getGravity': { get: function() { return this.gravity; } },
    'setGravity': { set: function(value) { this.gravity = value; } }
});

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* Initiating Movement *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

// Variables to signal movement and a variable to stop overflow problems caused by a misconfiguration
let stopMovementFlag = false;
let failSafeCounter = 0;

// Responsability: Starting and stopping a moving sequence - Protecting/Governing the process
function StartSequencingMoves() {
    
    // Reset the flag before starting a new moving sequence
    stopMovementFlag = false;

    function ExecuteSequence() 
    {
        failSafeCounter++;
        if (!stopMovementFlag && moveController.direction != '')
        {
            ExecuteMoveAnimation(moveController.direction);
            if (failSafeCounter < 50) 
                ExecuteSequence();
            else 
            {
                console.log('FAILSAFE ACTIVATED');
                failSafeCounter = 0;
            }
        }
    }
    // Execute the above-described moving sequence
    ExecuteSequence(); 
}

// A simple function to flag the stopping of a moving sequence
function StopSequencing() 
{
    stopMovementFlag = true;
}

// Responsability: Starting and stopping the animation of a move - Protecting/Governing the process
function ExecuteMoveAnimation(direction) {

    // Fires a single frame, based on the direction of the move
    function fireAnimationFrame() {
        switch(direction)
        {
            case 'left':
                MovePixelPosition('left');
                break;

            case 'right':
                MovePixelPosition('right');
                break;

            case 'up':
                MovePixelPosition('up');
                break;

            case 'down':
                MovePixelPosition('down');
                break;
        }
    };
    // Execute the above-described firing function
    requestAnimationFrame(fireAnimationFrame);
}

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* Executing the Movement *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */

// Responsability: Changing the position in pixels of an element in a certain axial direction on the screen
function MovePixelPosition(direction, elem=null){
    // A basic container-variable to efficiently store the style reference
    let playerStyleRef;
    elem === null ? playerStyleRef = elemPlayer.style : playerStyleRef = elem.style;

    // A basic container-variable to store the left and top position, using the helper-/convertermethod, and the amount of pixels per move
    let topPos = convertPropertyToInt(playerStyleRef.top);
    let leftPos = convertPropertyToInt(playerStyleRef.left);
    let pixelsPerMove = 1;

    // A decision based on the direction to move an element, governed by the playing field's rules (container edges, ...)
    switch(direction){
        case "up":
            if (topPos > 0){
                // Rules concerning the top and bottom of the container
                playerStyleRef.top = `${topPos - pixelsPerMove}px`;
                playerStyleRef.bottom = `${topPos - pixelsPerMove + playerHeight}px`;
            }
            break;
            
        case "down":
            // Rules concerning the top and bottom of the container
            let gamecontainerHeight = getGameContainerHeight();
            if (convertPropertyToInt(playerStyleRef.bottom) < gamecontainerHeight){
                playerStyleRef.top = `${topPos + pixelsPerMove}px`;
                playerStyleRef.bottom = `${topPos + pixelsPerMove + playerHeight}px`;
            }
            break;
            
        case "left":
            // Rules concerning the left and right edges of the container
            if (convertPropertyToInt(playerStyleRef.left) > 0){
                playerStyleRef.left = `${leftPos - pixelsPerMove}px`;
                playerStyleRef.right = `${leftPos - pixelsPerMove + playerWidth}px`;
            }
            break;
            
        case "right":
            // Rules concerning the left and right edges of the container
            let gameContainerWidth = getGameContainerWidth();
            if (convertPropertyToInt(playerStyleRef.right) < gameContainerWidth){
                playerStyleRef.left = `${leftPos + pixelsPerMove}px`;
                playerStyleRef.right = `${leftPos + pixelsPerMove + playerWidth}px`;
            }
            break;
    }
}