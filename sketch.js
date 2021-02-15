//Variables
var end = 0;
var play = 1;
var neutral = 2;
var gamestate = neutral;
var player,playerI;
var zombieI;
var buildings;
var back,backI;
var bulletI;
var zombieGroup,bulletGroup;
var text1;
var play,playI;
var score = 0;
bulletSound,mainSound;
var safearea;
var zombieDie;
var gameOverSound;

function preload(){
  //Load All Sound And Images
    playerI = loadImage("player.png");
    backI = loadImage("back.jpg");
    zombieI = loadImage("zombie.png");
    bulletI  = loadImage("bullet.png");
    playI = loadImage("start.png");
    bulletSound = loadSound("bullet.mp3"); 
    mainSound = loadSound('main.mp3');
    zombieDie = loadSound("zombieDie.mp3");
    gameOverSound = loadSound("over.mp3");
}

function setup() {
  //Create The Canvas
    createCanvas(1150,1000);

  //Groups
  zombieGroup = new Group();
  bulletGroup = new Group();

  //Moving BAckground
  back = createSprite(1150,500,1150,1000);
  back.x = back.width/2;
  back.addImage(backI);
  back.scale = 5;

  //Create The Player
    player = createSprite(50,900,40,60);
    player.addImage(playerI);
    player.scale = 0.20;

    //Start Button
    play = createSprite(500,500,40,40);
    play.addImage(playI);
    play.visible = false;
    play.scale = 0.5;

  //Sounds
    mainSound.play();
    mainSound.loop();

    //Safearea
    stroke("red");
    safeArea = createSprite(100,500,10,1000);
    safeArea.visible = false;
    
}

function draw() {
  //Background 
    if(back.x < 0){
      back.x = back.width/2;
    }

    

    //Initial Velocity
    player.velocityX = 0;
    player.velocityY = 0;

  //All Things According To The Respective GameStates
  if(gamestate === neutral){
    player.visible = false;
    back.velocityX = 0;
    play.visible = true;
    if(mousePressedOver(play)){
      gamestate = play;
    }
  }  

    else if(gamestate === play){
      //Move The Player
        if(keyDown("up")){
          player.velocityY = -13;
        }

        if(keyDown("down")){
          player.velocityY = 13;
        }

        //SafeArea
        safeArea.visible = true;
      
      //spawn Zombies And Bullets
        spawnZombies();
        spawnBullets();

      //Make The Background
      back.velocityX = -5;

        for(var i = 0; i < zombieGroup.length; i++){
          if(bulletGroup.isTouching(zombieGroup.get(i))){
            zombieGroup.get(i).destroy();
            score = score + 1;
            bulletGroup.destroyEach();
            zombieDie.play();
          }
        }

        player.visible = true;
        play.visible = false;

        if(zombieGroup.isTouching(safeArea)){
          gamestate = end;
          gameOverSound.play();
        }
    }

    else if(gamestate === end){
      score = 0;
      text("Game Over",500,500);
      back.velocityX = 0;
      player.visible = false;
      zombieGroup.velocityX = 0;
      zombieGroup.destroyEach();
      bulletGroup.destroyEach();
      if(keyDown("space")){
        gamestate = neutral;
      }
      mainSound.stop();
      safeArea.visible = false;
    }

    console.log(gamestate);
  //Draw The Sprites 
    drawSprites();


    fill("red");
    textSize(20);
    text("Score: " + score,900,50);
    
    
}
//Functions
function spawnZombies(){
  if(frameCount % 40 === 0){
    var rany = Math.round(random(40,900));
    var zombie = createSprite(1170,rany,40,50);
    zombie.velocityX = -7;
    zombie.addImage(zombieI);
    zombie.scale = 0.08;
    zombieGroup.add(zombie);
  }
}

function spawnBullets(){
  if(keyWentDown("space")){
    var bullet = createSprite(50,20,40,40);
    bullet.x = player.x;
    bullet.y = player.y;
    bullet.addImage(bulletI);
    bulletGroup.add(bullet);
    bullet.velocityX = 6;
    bullet.scale = 0.07;
    bulletSound.play();
    return bullet;
  }
}