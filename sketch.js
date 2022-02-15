var trex, trex_running, trex_choca, edges; 
var groundImage; 
var ground;
var numramdom;
var nube1imagen,nube2imagen;
var obstaculo1;
var obstaculo2;
var obstaculo3;
var obstaculo4;
var grupoNubes, grupoObtaculos;
var PLAY = 1, END = 0;
var gameState = PLAY;
var score = 0;
var restartImg, restart;
var gameOverImg,  gameOver;
var sonidosalto, sonidomuerte, sonidopuntos;
var fondo, fondoimg;

function preload(){
  fondoimg = loadImage("ciudad.PNG");
  
trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
trex_choca = loadAnimation("trex_collided.png");
groundImage = loadImage("ground2.png");
  
nube1imagen = loadImage("nube.png")
nube2imagen = loadImage("nube2.png")
  
obstaculo1=loadImage("car1.gif")
obstaculo2=loadImage("fuegito.png")
obstaculo3=loadImage("llanta.png")
obstaculo4=loadImage("moto.png")

  //cargar imagen gameOVer
  gameOverImg = loadImage("gameOver.png");
  //cargar imagen restart
  restartImg = loadImage("restart.png");
  
  sonidopuntos = loadSound("checkPoint.mp3");
sonidomuerte=loadSound("die.mp3");
  sonidosalto=loadSound("jump.mp3");
}

function setup(){
//createCanvas(600,200);
createCanvas(windowWidth, windowHeight);
  
//trex = createSprite(50,160,20,50);
trex = createSprite(50,height-70,20,50);
  
trex.addAnimation("running", trex_running);
trex.addAnimation("collided", trex_choca);
trex.scale = 0.5;trex.x = 50;
  
edges = createEdgeSprites();
  
//ground=createSprite(200,180,400,20);
ground=createSprite(width,height-80,width,20);
ground.addImage("ground",groundImage);
ground.x=ground.width/2;
  
//sueloinvisible=createSprite(300,200,800,20);
sueloinvisible=createSprite(width/2,height-60,width,20);
sueloinvisible.visible=false; 
  
  grupoNubes = new Group()
  grupoObstaculos = new Group()
  trex.debug= false;
  
  //colisionador setCollider
  //trex.setCollider("rectangle", 0,0,10,10,0);
  trex.setCollider("circle",0,0,30);
  //trex.setCollider("aabb" )
  
  //crea sprite y carga imagen game over y escala
  gameOver=createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  //crea sprite y carga imagen start y escala
  restart=createSprite(width/2,height/2+60);
  restart.addImage(restartImg);
  
  var m = "hola";
  console.log(m);
}

function draw(){ 
   
  
//background("white");
  background(fondoimg);
  
//muestra el score
fill("white");
textSize(18);
text("score: "+score, width-100,30);
   
  if(gameState === PLAY){
    //ESCONDE GAME OVER & RESTART
   gameOver.visible = false
    restart.visible = false

    
    //aumenta score
    score = score + Math.round(getFrameRate()/60);
    
    if(score > 0 && score % 100 === 0){
      sonidopuntos.play();
    }
    
    
  //  ground.velocityX=-(2+score/100); 
    ground.velocityX=-(4 + 3* score/100);
    if(ground.x<0){ 
       ground.x=ground.width/2; 
    }
  
   /*if((keyDown("space") || touches.length > 0) && trex.y>height-120 ){ 
     trex.velocityY = -12 ; 
     sonidosalto.play();
     //console.log(touches);
     touches=[];
   }*/
    
    if((keyDown("space") || touches.length > 0 ) && trex.y>height-120 ){ 
     trex.velocityY = -12 ; 
     sonidosalto.play();
     touches = [];
     
   }
  
   trex.velocityY = trex.velocityY + 0.5; 
   trex.collide(sueloinvisible);
  
   spawnClouds();
  
   spawnobstaculs();
    
   if(grupoObstaculos.isTouching(trex)){
      gameState=END
      
      sonidomuerte.play();
    }
    
  }
  else if( gameState === END){
    //MUESTRA GAME OVER & RESTART
    gameOver.visible = true
    restart.visible = true
    
    grupoNubes.setVelocityXEach(0);
    grupoObstaculos.setVelocityXEach(0);
    
    //cambia animacion a trex a trex collided
    
    trex.changeAnimation("collided", trex_choca);
    
    //cambia tiempo vida de obstaculos 
    grupoNubes.setLifetimeEach(-1)
    grupoObstaculos.setLifetimeEach(-1);

    //por velocidad Y de trex en 0
    trex.velocityY=0
    ground.velocityX=0
  
    if(mousePressedOver(restart) || touches.length > 0){
         reset();
        touches=[];
    }
  
  
  
  }
  
drawSprites();
}

function spawnClouds () {
  
  
  if(frameCount%120 === 0 ){
     clouds=createSprite(width+10,50,40,10)  
    clouds.addImage("nube1",nube1imagen)
    clouds.scale=0.06
    clouds.y=Math.round(random(10,height/3))
    clouds.velocityX=-3 
    
    clouds2=createSprite(width+200,50,40,10)  
    clouds2.addImage("nube2",nube2imagen)
    clouds2.scale=0.06
    clouds2.y=Math.round(random(10,80))
    clouds2.velocityX=-3 
    
    clouds.depth=trex.depth
    trex.depth++
    
    clouds2.depth=trex.depth
    trex.depth++
    
    clouds.lifetime=width/2
    clouds2.lifetime=width/2
    
    grupoNubes.add(clouds)
    grupoNubes.add(clouds2)

  }
} //fin funcion spawnClouds

function spawnobstaculs(){
  if(frameCount%60===0){
    
      var obstaculo=createSprite(width+10,155)
      obstaculo.velocityX = -(6 + score/100);
      
     switch(Math.round(random(1,4))){
  
       //carro 
       case 1:obstaculo.addImage(obstaculo1);
        obstaculo.scale=0.05; break;
      
        //fuego
        case 2:obstaculo.addImage(obstaculo2);
        obstaculo.scale=0.04;break;

        //llanta
        case 3:obstaculo.addImage(obstaculo3);
        obstaculo.scale=0.04;
        
         break;

        //moto
        case 4:obstaculo.addImage(obstaculo4);
        obstaculo.scale=0.02;break;
  }//fin switch
          
    obstaculo.depth=trex.depth
    trex.depth++
    obstaculo.lifetime = width/2;
    
    //obstaculo.y=170;
    obstaculo.y=height-90;
    
    grupoObstaculos.add(obstaculo);

    
}
}//fin funcion spawnObstacles


function reset (){
  grupoNubes.destroyEach(); 
  grupoObstaculos.destroyEach();
  trex.changeAnimation("running", trex_running)
  score=0
  gameState = PLAY;
}