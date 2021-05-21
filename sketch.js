var dog, sadDog, happyDog, database;
var food,foodStock;
var addFood,feedfood;
var milk;
var feed, lastFed,FedTime;
var foodStockValue;

function preload(){
  sadDog=loadImage("dog1.png");
  happyDog=loadImage("happy dog1.png");
  bg = loadImage("bg.jpg")
}

function setup() {
  database=firebase.database();
  createCanvas(800,550);

  milk = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(690,350,150,150);
  dog.addImage(sadDog);
  dog.scale=0.25;

  addFood=createButton("Add Food");
  addFood.position(785,220);
  addFood.mousePressed(addFoods);

  feedfood=createButton("Feed The Dog");
  feedfood.position(665,220);
  feedfood.mousePressed(feedDog);

}

function draw() {
  background(bg);
  milk.display();

  //write code to read fedtime value from the database 
  FedTime = database.ref('FeedTime');
  FedTime.on("value",function(data){
    lastFed=data.val()
  })

  strokeWeight(0.6);
  stroke(255,251,108);
  fill(255,85,0);
  textSize(17);
  //write code to display text lastFed time here
  if(lastFed>=12){ 
    text("Last Feed : "+ lastFed%12 + " PM", 375,120); 
  }else if(lastFed==0){
    text("Last Feed : 12 AM",375,120); 
  }else{ 
    text("Last Feed : "+ lastFed + " AM", 375,120);
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  food=data.val();
  milk.updateFoodStock(food);
}


function feedDog(){
  dog.addImage(happyDog);

  foodStockValue = milk.getFoodStock();
  if(foodStockValue<=0){
     milk.updateFoodStock(foodStockValue*0);
  }
  else{
    milk.updateFoodStock(foodStockValue-1);
  }
  database.ref('/').update({
    Food:milk.getFoodStock(),
    FeedTime:hour()
  })
  //write code here to update food stock and last fed time

}

//function to add food in stock
function addFoods(){
  dog.addImage(sadDog);
  food++;
  database.ref('/').update({
    Food:food
  })
}






