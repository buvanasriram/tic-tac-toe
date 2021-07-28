var canvas, backgroundImage;
var cells = [];
var gameState = 0,finishedPlayers;
var playerCount,allPlayers;
var selections;
var distance = 0;
var database;
var gameFinished = false;
var currentPlayer = 1;
var sel=[]; // player selections converted to number - 0 no sel, 1 - player1, 2 - player2
var winner;

var form, player, game;

var cars, car1, car2, car3, car4;
var track, car1_img, car2_img, car3_img, car4_img;

function preload(){
   oimg = loadImage("images/oimg.jpg");
   ximg = loadImage("images/ximg.png")
}

function setup(){
  canvas = createCanvas(600 , 600);
  database = firebase.database();
  gameState = 0;
  game = new Game();
  game.getState();
  game.start();
}


function draw(){
  background(200, 200, 255);
  

  if (playerCount === 2 && gameState !== 2){
    game.update(1);
  }

  if (gameState === 1) {
    drawBoard();
    game.play();
  }
  if (gameState === 2) {
    drawBoard();
    drawSprites();
    textSize(30);
    fill("red");
    stroke(0)
    textAlign(CENTER, CENTER);
    text("Game Over", width/2, 100);
  }
}

function drawBoard() {
  push()
  fill("white");
  strokeWeight(10);
  line (150,150,150, 450);
  line (250,150,250, 450);
  line (350,150,350, 450);
  line (450,150,450, 450);

  line (100,250,500, 250);
  line (100,350,500, 350);
  pop();
}
