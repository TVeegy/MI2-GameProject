"use strict";

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* SECTIE GLOBALE VARIABELEN *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */


/* ----------------------------------- *//* Element variabelen *//* ----------------------------------- */
var elemPlayer = document.getElementById("player");
var elemContainer = document.getElementById("gameContainer");


/* ----------------------------------- *//* Element property variabelen *//* ----------------------------------- */
var playerWidth = $("#player").outerWidth();
var playerHeight = $("#player").outerHeight();

// Expressies om met een dynamische container te werken ivm resizing tijdens het spelen v.h. spel.
var getGameContainerWidth = function(){
    return $("#gameContainer").width();
}
var getGameContainerHeight = function(){
    return $("#gameContainer").height();
}


/* ----------------------------------- *//* Invullen element property variabelen *//* ----------------------------------- */
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
/* ----------------------------------- *//* SECTIE BEWEGENINGSMECHANISME *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */


/* ----------------------------------- *//* Helperfuncties *//* ----------------------------------- */
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


/* ----------------------------------- *//* EventListening *//* ----------------------------------- */

// Twee variabelen om een losgelaten toets en een ingedrukte toets duidelijk te maken.
let keyUp = false;
let keyDownLoop = false;

let goingUp = false;
let goingDown = false;
let goingLeft = false;
let goingRight = false;
// Twee eventlisteners die a.d.h.v. de keycode met functies en variabelen de speler bewegen.
document.addEventListener('keydown', function(e) {
    // keyDownLoop == zorgen dat enkel bij het eerste event de loop gestart word. Anders start een loop per keydown event.
    if (/*keyUp == false &&*/ keyDownLoop == false){
        //waitForDiagonal();
        if (e.keyCode == '38'){
            /*Move("up");*/ //registerMoves("up"); 
            //goingUp = true; Move("up");
            //console.log("keydown up");
        }
        else if (e.keyCode == '40'){
            /*Move("down");*/ //registerMoves("down"); 
            //goingDown = true; Move("down");
            //console.log("keydown down");
        }
    
        else if (e.keyCode == '37'){
            /*Move("left");*/ //registerMoves("left"); 
            //goingLeft = true; Move("left");
            //console.log("keydown left");
        }
    
        else if (e.keyCode == '39'){
            /*Move("right");*/ //registerMoves("right"); 
            //goingRight = true; Move("right");
            //console.log("keydown right");
        }
    }
})

{ // Old code 
/*let busy = false;
function waitForDiagonal(){
    if (busy === false){
        console.log("timeout started");
        busy = true;

        setTimeout(function(){ 
            console.log("timeout ended");
            console.log(`first move: ${registeredMoves[0]}`);
            console.log(`second move: ${registeredMoves[1]}`);
            busy = false;

            if (registeredMoves[0] != "" && registeredMoves[1] != ""){
                console.log(`moving with arg: ${registeredMoves[0]} and ${registeredMoves[1]}`);
                moveDiagonal(registeredMoves[0], registeredMoves[1]);
                console.log("moved diagonal!");
            }
            else{
                console.log(`moving with arg: ${registeredMoves[0]}`);
                Move(registeredMoves[0]);
                console.log("moved axial!");
            }
            registeredMoves = ["",""];
        }, 100);
    }
}

let registeredMoves = ["",""];
function registerMoves(direction) {
    console.log(`attempting registration for move ${direction}...`);
    if (registeredMoves[0] === ""){
        console.log(`first move ${direction} registered!`);
        registeredMoves[0] = direction;
    }
        
    else if (registeredMoves[0] != direction && registeredMoves[1] === ""){
        console.log(`second move ${direction} registered!`);
        registeredMoves[1] = direction;
    }
}*/
}

let cancelUp = false;
let cancelDown = false;
let cancelLeft = false;
let cancelRight = false;
window.addEventListener("keyup", function(e){
    // keyUp == zorgen dat de loop onderbroken wordt wanneer iemand de pijltjestoets loslaat.
    if (e.keyCode == '38'){
        keyUp = true; 
        cancelUp = true;
        //console.log("keyup up");
    }
    else if (e.keyCode == '40'){
        keyUp = true; 
        cancelDown = true;
        //console.log("keyup down");
    }
    
    else if (e.keyCode == '37'){
        keyUp = true; 
        cancelLeft = true;
        //console.log("keyup left");
    }
    
    else if (e.keyCode == '39'){
        keyUp = true; 
        cancelRight = true;
        //console.log("keyup right");
    }
  })


/* ----------------------------------- *//* Bewegen *//* ----------------------------------- */

let map = {37:false, 38:false, 39:false, 40:false};
let keys = {left:'37', up:'38', right:'39', down:'40'}; 
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE

    for (let i = 0, len = Object.keys(map).length; i < len; i++) {
        console.log('test');
      }

    if (Object.values(keys).indexOf(e.keyCode.toString()) > -1) 
    {
        map[e.keyCode] = e.type == 'keydown';
        switch(e.keyCode){
            case '37':
                if (map[37]) Move('left');
                break;

            case '39':
                if (map[39]) Move('right');    
                break;

            case '38':
                if (map[38]) Move('up');    
                break;

            case '40':
                if (map[40]) Move('down');
                break;
        }
    }
}

// Een interval waarin een beweging uitgevoerd word tot de pijltjestoets losgelaten word. (Daar worden dan ook de gebruikte variabelen gereset)
function Move(direction) {
    keyDownLoop = true;
    function executeMove() {
        
        for (let i = 0, len = Object.keys(map).length; i < len; i++) {
            console.log('test ' + i);
          }
        
        /*switch(e.keyCode){
            case '37':
                if (map[37])
                {
                    movePlayer('left');
                    requestAnimationFrame(executeMove);
                };
                break;

            case '39':
                if (map[39])
                {
                    movePlayer('right');
                    requestAnimationFrame(executeMove);
                };  
                break;

            case '38':
                if (map[38])
                {
                    movePlayer('up');
                    requestAnimationFrame(executeMove);
                };
                break;

            case '40':
                if (map[40])
                {
                    movePlayer('down');
                    requestAnimationFrame(executeMove);
                };
                break;
        }*/
    };
    requestAnimationFrame(executeMove);
}

/*function moveDiagonal(firstDirection, secondDirection) {
    keyDownLoop = true;

    function executeMove() {
        if (keyUp == true) {
            keyUp = false;
            keyDownLoop = false;
        } 
        else {
            movePlayer(firstDirection);
            movePlayer(secondDirection);
            requestAnimationFrame(executeMove);
        }
    };
    requestAnimationFrame(executeMove);
}*/

// Functie die der kern v.h. bewegingsmechanisme is, top en bottom veranderen evenredig.
function movePlayer(direction, elem=null){
    let playerStyleRef;
    elem === null ? playerStyleRef = elemPlayer.style : playerStyleRef = elem.style;;
    let top = convertPropertyToInt(playerStyleRef.top);
    let left = convertPropertyToInt(playerStyleRef.left);
    let pixelPerMove = 5;

    switch(direction){
        case "up":
            if (top > 0){
                playerStyleRef.top = `${top - pixelPerMove}px`;
                playerStyleRef.bottom = `${top - pixelPerMove + playerHeight}px`;
            }
            break;
            
        case "down":
            let gamecontainerHeight = getGameContainerHeight();
            if (convertPropertyToInt(playerStyleRef.bottom) < gamecontainerHeight){
                playerStyleRef.top = `${top + pixelPerMove}px`;
                playerStyleRef.bottom = `${top + pixelPerMove + playerHeight}px`;
            }
            break;
            
        case "left":
            if (convertPropertyToInt(playerStyleRef.left) > 0){
                playerStyleRef.left = `${left - pixelPerMove}px`;
                playerStyleRef.right = `${left - pixelPerMove + playerWidth}px`;
            }
            break;
            
        case "right":
            let gameContainerWidth = getGameContainerWidth();
            if (convertPropertyToInt(playerStyleRef.right) < gameContainerWidth){
                playerStyleRef.left = `${left + pixelPerMove}px`;
                playerStyleRef.right = `${left + pixelPerMove + playerWidth}px`;
            }
            break;
    }
}