var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var coinsGroup, coinImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  mario_running = loadAnimation("Capture1.png","Capture3.png","Capture4.png");
  mario_collided = loadAnimation("mariodead.png");
  
  groundImage = loadImage("backg.jpg");
  
  coinImage = loadImage("coin.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  
}

function setup() {
  createCanvas(600, 200);
  

  mario = createSprite(50,180,20,50);
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  

  mario.scale = 0.3;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and coin Groups
  obstaclesGroup = createGroup();
  coinsGroup = createGroup();

  
  mario.setCollider("rectangle",0,0,mario.width,mario.height);
  mario.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){
    //move the 
    gameOver.visible = false;
    restart.visible = false;
    //change the mario animation
      mario.changeAnimation("running", mario_running);
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/71);
    
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& mario.y >= 100) {
        mario.velocityY = -12;
       
    }
    
    //add gravity
    mario.velocityY = mario.velocityY + 0.8
  
    //spawn the coins
    spawncoins();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(mario)){
        //mario.velocityY = -12;
        
        gameState = END;
        
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     //change the mario animation
      mario.changeAnimation("collided", mario_collided);
       

     
      ground.velocityX = 0;
      mario.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     coinsGroup.setVelocityXEach(0);    
   }
  
 
  //stop mario from falling down
  mario.collide(invisibleGround);
  
  if(mousePressedOver(restart)){
    reset()
  }
  drawSprites();
}


function reset(){
  gameOver.visible=false
  restart.visible=false
  coinsGroup.destroyEach()
  obstaclesGroup.destroyEach()
  score=0
gameState=PLAY
}



function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
        obstacle.scale = 0.3;
              break;
              
      case 2: obstacle.addImage(obstacle2);
        obstacle.scale = 0.3;
              break;
      case 3: obstacle.addImage(obstacle3);
        obstacle.scale = 0.3;
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawncoins() {
  //write code here to spawn the coins
 if (frameCount % 60 === 0) {
    var coin = createSprite(600,120,40,10);
    coin.y = Math.round(random(80,120));
    coin.addImage(coinImage);
    coin.scale = 0.2;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each coin to the group
    coinsGroup.add(coin);
   
  }
}





