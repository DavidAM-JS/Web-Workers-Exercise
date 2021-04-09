"use strict";

const imageWorker = new Worker("/worker.js");

const fileinput = document.getElementById("fileinput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const srcImage = new Image();

let imgData = null;
let originalPixels = null;
let currentPixels = null;

fileinput.onchange = function (e) {
    if (e.target.files && e.target.files.item(0)) {
        srcImage.src = URL.createObjectURL(e.target.files[0]);
    }
}

srcImage.onload = function () {
    canvas.width = srcImage.width;
    canvas.height = srcImage.height;
    ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height);
    imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height);
    originalPixels = imgData.data.slice();
}

function startImageModify() {
    const array = ["modifying", imgData, originalPixels, srcImage.width, srcImage.height];
    imageWorker.postMessage(array);
}

imageWorker.onmessage = function(event) {
    ctx.putImageData(event.data, 0, 0, 0, 0, srcImage.width, srcImage.height);
}

function spin() {
    const spinner = document.getElementById("spinner");
    let angle = 0;
    setInterval(() => {
        angle++;
        spinner.style.transform = `rotate(${angle}deg)`;
    }, 20);
}

spin();



