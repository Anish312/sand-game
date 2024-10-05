"use strict";
const game = document.getElementById("game");
let ctx = game.getContext("2d");
game.width = 600;
game.height = 600;
const cellSize = 5;
const rows = game.width / cellSize;
const columns = game.height / cellSize;
let grid;
let blockMoving = true; // Flag to check if the block is moving
let mouseInside = false; // Flag to check if the mouse is inside the canvas
ctx.fillStyle = "black";
ctx.fillRect(0, 0, game.width, game.height);
function make2dArr() {
    let arr = new Array(columns);
    for (let i = 0; i < columns; i++) {
        arr[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}
function setUp() {
    grid = make2dArr();
}
// Event listener to check if the mouse is inside the canvas
game.addEventListener("mouseenter", () => {
    mouseInside = true;
});
game.addEventListener("mouseleave", () => {
    mouseInside = false;
});
addEventListener("mousemove", (e) => {
    if (mouseInside) { // Only add blocks if the mouse is inside the canvas
        let pressedCol = Math.floor(e.offsetX / cellSize);
        let pressedRow = Math.floor(e.offsetY / cellSize);
        console.log(pressedCol, pressedRow);
        grid[pressedRow][pressedCol] = 1;
    }
});
function draw() {
    ctx.clearRect(0, 0, game.width, game.height); // Clear the canvas
    // Draw the grid and objects
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j] === 1) {
                ctx.fillStyle = "yellow"; // Draw object cell
            }
            else {
                ctx.fillStyle = "black"; // Draw empty cell
            }
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
    requestAnimationFrame(draw); // Continuously call draw for smooth animation
}
function updateGrid() {
    let newGrid = make2dArr();
    blockMoving = false; // Assume blocks stop, only set to true if any block is still moving
    // Update the grid to move the object down
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];
            if (state === 1) {
                // Check if block can move downwards
                if (j < rows - 1) { // Make sure it's not the last row
                    let below = grid[i][j + 1];
                    let belowR = (i + 1 < columns) ? grid[i + 1][j + 1] : 1; // Bound check right diagonal
                    let belowL = (i - 1 >= 0) ? grid[i - 1][j + 1] : 1; // Bound check left diagonal
                    if (below === 0) {
                        newGrid[i][j + 1] = 1; // Move block down
                        blockMoving = true;
                    }
                    else if (belowR === 0) {
                        newGrid[i + 1][j + 1] = 1; // Move block right-down diagonally
                        blockMoving = true;
                    }
                    else if (belowL === 0) {
                        newGrid[i - 1][j + 1] = 1; // Move block left-down diagonally
                        blockMoving = true;
                    }
                    else {
                        newGrid[i][j] = 1; // Stay in place if blocked
                    }
                }
                else {
                    newGrid[i][j] = 1; // Stay in place if at the bottom
                }
            }
        }
    }
    grid = newGrid;
    // If no blocks are moving anymore and mouse is inside, generate a new block
    if (!blockMoving && mouseInside) {
        grid[0][Math.floor(Math.random() * columns)] = 1; // Add a new block at the top
        blockMoving = true; // Restart block movement
    }
}
// Set up the grid and start the drawing loop
setUp();
draw();
const fallSpeed = 20; // Falling speed in milliseconds
setInterval(updateGrid, fallSpeed);
