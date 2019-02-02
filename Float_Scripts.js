"use strict";
var shapes = [];
var id = 0;
var backgroundColor = "green";
// -- supporting functions -- //

let px = (input) => {
    return input += "px";
}
let percent = (input) => {
    return input += "%";
}

// -- Centering Shapes -- //
let centerShapes = (width, height = width) => {

    shapes.forEach({
    let shapeTop = ($(window).height() / 2) - (width / 2);
    let shapeLeft = ($(window).width() / 2) - (height / 2);
    let shapeBottom = ($(window).height() / 2) + (width / 2);
    let shapeRight = ($(window).width() / 2) + (height / 2);

    let topPercentage = percent(shapeTop / $(window).height() * 100);
    let leftPercentage = percent(shapeLeft / $(window).width() * 100);
    let bottomPercentage = percent(shapeBottom / $(window).height() * 100);
    let rightPercentage = percent(shapeRight / $(window).width() * 100);

    let coordinates = [topPercentage, leftPercentage, bottomPercentage, rightPercentage];
    return coordinates;});
}

// -- Making Shapes -- //
let makeShape = (specification, size, color) => {
    id++;
    backgroundColor = color;
    var shapeElem = document.createElement("circle");
    shapeElem.style.width = px(size);
    shapeElem.style.height = px(size);

    let [top, left, bottom, right] = centerShapes(size);
    shapeElem.style.top = top;
    shapeElem.style.left = left;
    shapeElem.style.bottom = bottom;
    shapeElem.style.right = right;

    shapeElem.style.background = color;
    shapeElem.style.display = "block";
    shapeElem.style.position = "relative";
    shapeElem.id = "shape" + id;
    shapeElem.className = "animation";

    switch (specification) {
        case "circle":
            shapeElem.style.borderRadius = percent(50);
            break;
        case "triangle":
            shapeElem.style.background = document.body.style.backgroundColor;
            shapeElem.style.width = 0;
	       shapeElem.style.height = 0;
	       shapeElem.style.borderLeft = size+"px solid transparent";
	       shapeElem.style.borderRight = size+"px solid transparent";
	       shapeElem.style.borderBottom = size*2+"px solid "+backgroundColor;
            break;
    }

    shapes.push(shapeElem);
}

// -- Executed functions -- //
var stop = false;
var stopEruption = false;
let interaction = () => {
    if (!stop) {
        shapes[0].style.backgroundColor = "grey";
        $("#" + shapes[0].id).animate({
            borderBottomLeftRadius: "-=10%",
            borderBottomRightRadius: "-=10%",
            height: "+=100px",
            top: "50px",
            left: "50px",
            width: "+=50px"
        }, 200);
        stop = true;
    }
}
let eruption = () => {
    if (!stopEruption) {
        shapes[0].style.backgroundColor = "black";
        document.body.style.backgroundColor = "white";
    }
}

makeShape("circle", 100, "lightgreen");
document.body.appendChild(shapes[0]);

// -- Executed functions -- //
