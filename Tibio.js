//"use strict";
var levelWidth = $(window).height(), levelHeight = $(window).width();

var player = document.getElementById("player");
var container = document.getElementById("gameContainer");

var playerWidth = 20;
var moveScale = 10;

var getGameContainerWidth = function(){
    var output =  $("#gameContainer").width();
    return output;
}
var getGameContainerHeight = function(){
    var output = $("#gameContainer").height();
    return output;
}


player.style.left = "0px";
player.style.right = `${$("#player").width()}px`;
player.style.top = "0px";
player.style.bottom = `${$("#player").height()}px`;


/*
function moveDiagonal() {
  var pos = 0;
  var id = setInterval(frame, 5);
  function frame() {
    if (pos == 350) {
      clearInterval(id);
    } 
    else {
      pos++; 
      player.style.top = pos + 'px'; 
      player.style.left = pos + 'px'; 
    }
  }
}*/

roundgameContainerSize();
function roundgameContainerSize(){
    var oldWidth = getGameContainerWidth();
    var oldHeight = getGameContainerHeight();
    
    container.style.width = Math.round((oldWidth/10))*10 + "px";
    container.style.height = Math.round((oldHeight/10))*10 + "px";
}

var keyUp = false;
var keyDownLoop = false;

document.addEventListener('keydown', function(e) {
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
    console.log("BEEP");
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



function Move(direction) {
    keyDownLoop == true;
    
    do{
        movePlayer(direction);
    }
    while (keyUp == false);
    
    keyUp = false;
    keyDownLoop = false;
    
    /*var id = setInterval(frame, 5);
    function frame() {
        if (keyUp == true) {
            keyUp = false;
            keyDownLoop = false;
            clearInterval(id);
        } 
        else {
            movePlayer(direction);
        }
  }*/
}

function convertPropertyToInt(property){
    var numbers = property.replace('px', '');
    var numbersToInt = parseInt(numbers, 10);
    return numbersToInt;
}
function movePlayer(direction){
    switch(direction){
        case "up":
            if (convertPropertyToInt(player.style.top) > 0){
               var topNumbers = player.style.top.replace('px', '');
                var top = parseInt(topNumbers, 10);
                player.style.top = `${top - 1}px`;
                player.style.bottom = `${top - 1 + playerWidth}px`;
            }
            break;
            
        case "down":
            var gamecontainerHeight = getGameContainerHeight();
        if (convertPropertyToInt(player.style.bottom) < gamecontainerHeight){
                var topNumbers = player.style.top.replace('px', '');
                var top = parseInt(topNumbers, 10);
                player.style.top = `${top + 1}px`;
                player.style.bottom = `${top + 1 + playerWidth}px`;
            }
            break;
            
        case "left":
            if (convertPropertyToInt(player.style.left) > 0){
                var leftNumbers = player.style.left.replace('px', '');
                var left = parseInt(leftNumbers, 10);
                player.style.left = `${left - 1}px`;
                player.style.right = `${left - 1 + playerWidth}px`;
            }
            break;
            
        case "right":
            var gameContainerWidth = getGameContainerWidth();
            if (convertPropertyToInt(player.style.right) < gameContainerWidth){
                var leftNumbers = player.style.left.replace('px', '');
                var left = parseInt(leftNumbers, 10);
                player.style.left = `${left + 1}px`;
                player.style.right = `${left + 1 + playerWidth}px`;
            }
            break;
    }
}