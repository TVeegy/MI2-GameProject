"use strict";

/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* SECTIE GLOBALE VARIABELEN *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */


/* ----------------------------------- *//* Element variabelen *//* ----------------------------------- */
var player = document.getElementById("player");
var container = document.getElementById("gameContainer");


/* ----------------------------------- *//* Element property variabelen *//* ----------------------------------- */
var playerWidth = $("#player").outerWidth();

// Expressies om met een dynamische container te werken ivm resizing
var getGameContainerWidth = function(){
    var output =  $("#gameContainer").width();
    return output;
}
var getGameContainerHeight = function(){
    var output = $("#gameContainer").height();
    return output;
}


/* ----------------------------------- *//* Invullen element property variabelen *//* ----------------------------------- */
// Mario's afmetingen zijn dynamisch, javascript leest ook enkel inline-CSS en geen CSS stijlbladen.
player.style.left = "0px";
player.style.right = `${$("#player").width()}px`;
player.style.top = "0px";
player.style.bottom = `${$("#player").height()}px`;


/* --------------------------------------------------------------------------------------------------------- */
/* ----------------------------------- *//* SECTIE BEWEGENINGSMECHANISME *//* ----------------------------------- */
/* --------------------------------------------------------------------------------------------------------- */


/* ----------------------------------- *//* Helperfuncties *//* ----------------------------------- */
// De container's afmetingen afronden zodat snel bewegende objecten per 10 pixels kunnen bewegen. (zo geen overflow aan randen)
roundgameContainerSize();
function roundgameContainerSize(){
    var oldWidth = getGameContainerWidth();
    var oldHeight = getGameContainerHeight();
    
    container.style.width = Math.round((oldWidth/10))*10 + "px";
    container.style.height = Math.round((oldHeight/10))*10 + "px";
}

// Helperfunctie die de CPU-intensieve jquery vervangt.
function convertPropertyToInt(property){
    return parseInt(property.replace('px', ''), 10);
}


/* ----------------------------------- *//* EventListening *//* ----------------------------------- */

// Twee variabelen om een toets loslaten en een ingedrukte toets duidelijk te maken.
var keyUp = false;
var keyDownLoop = false;

// Twee eventlisteners die a.d.h.v. de keycode met functies en variabelen de speler bewegen.
document.addEventListener('keydown', function(e) {
    // keyDownLoop == zorgen dat enkel bij het eerste event de loop gestart word. Anders start een loop per keydown event.
    if (keyUp == false && keyDownLoop == false){
        if (e.keyCode == '38'){
            Move("up"); console.log("keydown up");
        }
        else if (e.keyCode == '40'){
            Move("down"); console.log("keydown down");
        }
    
        else if (e.keyCode == '37'){
            Move("left"); console.log("keydown left");
        }
    
        else if (e.keyCode == '39'){
            Move("right"); console.log("keydown right");
        }
    }
})

window.addEventListener("keyup", function(e){
    // keyUp == zorgen dat de loop onderbroken wordt wanneer iemand de pijltjestoets loslaat.
    if (e.keyCode == '38'){
        keyUp = true; console.log("keyup up");
    }
    else if (e.keyCode == '40'){
        keyUp = true; console.log("keyup down");
    }
    
    else if (e.keyCode == '37'){
        keyUp = true; console.log("keyup left");
    }
    
    else if (e.keyCode == '39'){
        keyUp = true; console.log("keyup right");
    }
  })


/* ----------------------------------- *//* Bewegen *//* ----------------------------------- */

// Een interval waarin een beweging uitgevoerd word tot de pijltjestoets losgelaten word. (Daar worden dan ook de gebruikte variabelen gereset)
function Move(direction) {
    keyDownLoop = true;
    
    var id = setInterval(frame, 2);
    function frame() {
        if (keyUp == true) {
            keyUp = false;
            keyDownLoop = false;
            
            clearInterval(id);
        } 
        else {
            movePlayer(direction);
        }
  }
}

// Huidig bewegingssysteem is blind voor overlappende pijltjestoetsen.
/*
function moveDiagonal() {
  var id = setInterval(frame, 5);
  function frame() {
    if () {
      clearInterval(id);
    } 
    else {
      
    }
  }
}*/

// Functie die der kern v.h. bewegingsmechanisme is, top en bottom veranderen evenredig.
function movePlayer(direction){
    switch(direction){
        case "up":
            if (convertPropertyToInt(player.style.top) > 0){
                var top = convertPropertyToInt(player.style.top);
                player.style.top = `${top - 1}px`;
                player.style.bottom = `${top - 1 + playerWidth}px`;
            }
            break;
            
        case "down":
            var gamecontainerHeight = getGameContainerHeight();
            if (convertPropertyToInt(player.style.bottom) < gamecontainerHeight){
                var top = convertPropertyToInt(player.style.top);
                player.style.top = `${top + 1}px`;
                player.style.bottom = `${top + 1 + playerWidth}px`;
            }
            break;
            
        case "left":
            if (convertPropertyToInt(player.style.left) > 0){
                var left = convertPropertyToInt(player.style.left);
                player.style.left = `${left - 1}px`;
                player.style.right = `${left - 1 + playerWidth}px`;
            }
            break;
            
        case "right":
            var gameContainerWidth = getGameContainerWidth();
            if (convertPropertyToInt(player.style.right) < gameContainerWidth){
                var left = convertPropertyToInt(player.style.left);
                player.style.left = `${left + 1}px`;
                player.style.right = `${left + 1 + playerWidth}px`;
            }
            break;
    }
}