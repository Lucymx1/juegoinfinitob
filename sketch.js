var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOver;
var restart;
var score;
var gameOverImg,restartImg
var reset
var checkpoint, dieSound, jumpSound;

function preload(){
  trex_running = loadAnimation("kirby.png","kirby.png","kirby.png");
  
  trex_collided =loadAnimation("kirbyOIP.png");
  groundImage = loadImage("piso1.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("ladrillo.png");
  obstacle2 = loadImage("ladrillo2.png");
  obstacle3 = loadImage("ladrillo3.png");
  obstacle4 = loadImage("ladrillo4.png");
  obstacle5 = loadImage("ladrillo5.png");
  obstacle6 = loadImage("ladrillo6.png");
  
   restartImg = loadImage("restart.png");
   gameOverImg = loadImage("gameOver.png");
  
  checkpoint = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");

}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("trex_collided", trex_collided);
  trex.scale = 0.16;
  
  ground = createSprite(20,50,50,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
    gameOver = createSprite(300,100);
   gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOverImg.scale = 0.5;
  restartImg.scale = 0.5;


  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes 

  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hola" + 5);
  
  trex.setCollider("circle",0,0,110);
  trex.debug = false ;
  
  score = 0;
}

function draw() {
  background(0);
  //mostrar puntuación
  text("Puntuación: "+ score, 500,50);
  
    console.log("esto es ",gameState)

  
  if(gameState === PLAY){
     gameOver.visible = false;
    restart.visible = false;
    //mover el suelo
    ground.velocityX = -4;
    //puntuación
    score = score + Math.round(frameCount/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el Trex salte al presionar la barra espaciadora
    if(keyDown("space")&& trex.y >= 100) {
      jumpSound.play();
        trex.velocityY = -13;
        touches=[];
    }
    
    //agregar gravedad
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecer nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
    if(score>0&&score%100==0){
      checkpoint.play();

    }
  }
   else if (gameState === END) {
    trex.velocityY=0;  
    ground.velocityX = 0;
      trex.changeAnimation("trex_collided", trex_collided);
     obstaclesGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setVelocityXEach(0);
      cloudsGroup.setLifetimeEach(-1);     
      gameOver.visible = true;
     restart.visible = true;
     
     
     

   if(touches.legth<0||mousePressedOver(restart))
   {
    reset();
    touches=[];
    }
   }
  
 
  //evitar que el trex caiga
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -6;
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}
function reset(){
gameState=PLAY;
obstaclesGroup.destroyEach(0);
cloudsGroup.destroyEach(0);
trex.changeAnimation("running",trex_running);
restart.visible = false;
gameOver.visible = false;
score=0;
}
function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 134;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar cada nube al grupo
   cloudsGroup.add(cloud);
    }

}

