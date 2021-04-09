"use strict";

let currentPixels = null;
let originalPixels = null;
let imgData = null;
let width = null;
let height = null;

function getIndex(x, y) {
    return (x + y * width) * 4;
}

const R_OFFSET = 0;
const G_OFFSET = 1;
const B_OFFSET = 2;

function convertBlackWhite(x, y) {
    const index = getIndex(x, y);
    const avg = (currentPixels[index + R_OFFSET] + currentPixels[index + G_OFFSET] + currentPixels[index + B_OFFSET])/3;
    currentPixels[index + R_OFFSET] = avg;
    currentPixels[index + G_OFFSET] = avg;
    currentPixels[index + B_OFFSET] = avg;
}

function modifyImage() {
    currentPixels = originalPixels.slice();

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            convertBlackWhite(j, i);
        }
    }

    commitChanges();
}

function commitChanges() {
    for (let i = 0; i < imgData.data.length; i++) {
        imgData.data[i] = currentPixels[i];
    }

    postMessage(imgData);
}

onmessage = function(event){
    if(event.data[0] === "modifying"){
        imgData = event.data[1];
        originalPixels = event.data[2]
        width = event.data[3];
        height = event.data[4];
        modifyImage();
    }
}