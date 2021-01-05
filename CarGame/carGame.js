var record=[];
var enemyCar=[];
var speed=30;
var speedLv=10;
var difficulty=1;
var timerPassed=0;
var timePassed=0;
var picNum=0;
var roadPic=new Array("./img/road1.jpg","./img/road2.jpg","./img/road3.jpg","./img/road4.jpg","./img/road5.jpg");

var carX=500;
var carY=600;
var carWidth=40;
var carHeight=100;
var carSpeed=10;

var tableOn=0;

//start the timer
var gameTimer=setInterval(myTimer,100);
var pushX=Math.floor(Math.random()*700)+100;
var pushY=20;
var pushArray=[pushX,pushY];
enemyCar.push(pushArray);


//timer event
function myTimer(){
	timerPassed++;
	
	if (timerPassed%10==0){
		timePassed++;
		//win condition
		if (timePassed>=60){
			alert("Congrats, you have made your escape!");
			location.href="win.html";
		}
		
		//change difficulty
		if (timerPassed%50==0){
			if (speedLv>1){
				difficulty++;
				speedLv--;
			}else if (speedLv==1){
				difficulty="Max Level";
				speedLv=0.5;
			}
		}
		document.getElementById("displayTimer").innerHTML=timePassed;
		document.getElementById("displayDiff").innerHTML=difficulty;
	}

	//random spawn enemy cars
	if (timerPassed%(speedLv*10)==0){
		var pushX=Math.floor(Math.random()*700)+100;
		var pushY=20;
		var pushArray=[pushX,pushY];
		enemyCar.push(pushArray);
	}
	
	//make road moving and call drawing function
	if (timerPassed%speedLv==0){
		picNum++;
		if (picNum>4)	picNum=0;
		moveEnemy();
		myRoad();
	}
}

//drawing everything on canvas
function myRoad(){
	var canvas=document.getElementById("road");
	var ctx=canvas.getContext("2d");
	
	var bkGround =new Image();
	bkGround.src=roadPic[picNum];
	
	ctx.drawImage(bkGround,0,0);
	drawCar(carX,carY);
	for (var i=0;i<enemyCar.length;i++)	drawEnemy(enemyCar[i][0],enemyCar[i][1]);
	
	carHit();
}

//drawing cars
function drawCar(x,y){
	var canvas=document.getElementById("road");
	var ctx=canvas.getContext("2d");
    var car=new Image();
    car.src="img/car.png";
	ctx.drawImage(car,x,y,40,100);
}

//drawing enemy cars
function drawEnemy(x,y){
	var canvas=document.getElementById("road");
	var ctx=canvas.getContext("2d");
    var car=new Image();
    car.src="img/EnemyCar.png";
	ctx.drawImage(car,x,y,carWidth,carHeight);
}

//use to move cars
function up(){
	carY-=carSpeed;
	myRoad();
}
function down(){
	carY+=carSpeed;
	myRoad();
}
function left(){
	carX-=carSpeed;
	myRoad();
}
function right(){
	carX+=carSpeed;
	myRoad();
}
window.addEventListener("keydown",moveObj);

function moveObj(){
	if(event.keyCode==38){
		if ((carY-carSpeed)>0) up();
	}else if (event.keyCode==37){
		if ((carX-carSpeed)>100) left();
	}else if (event.keyCode==40){
		if ((carY+carSpeed)<700) down();
	}else if(event.keyCode==39){
		if ((carX+carSpeed)<860) right();
	}else if (event.keyCode==82) restart();
}

//determine if car hits
function carHit(){
	for (var i=0;i<enemyCar.length;i++){
		if ((enemyCar[i][0]<=carX) && (carX<=enemyCar[i][0]+carWidth)){
			if ((enemyCar[i][1]<=carY) && (carY<=enemyCar[i][1]+carHeight))	hit();
			else if ((enemyCar[i][1]<=(carY+100)) && ((carY+100)<=enemyCar[i][1]+carHeight)) hit();
		}else if ((enemyCar[i][0]<=(carX+40)) && ((carX+40)<=enemyCar[i][0]+carWidth)){
			if ((enemyCar[i][1]<=carY) && (carY<=enemyCar[i][1]+carHeight))	hit();
			else if ((enemyCar[i][1]<=(carY+100)) && ((carY+100)<=enemyCar[i][1]+carHeight)) hit();
		}
	}
}

//use to move enemy cars
function moveEnemy(){
	for (var i=0;i<enemyCar.length;i++){
		enemyCar[i][1]+=speed;
		if (enemyCar[i][1]>=800) enemyCar.splice(i,1);
		var leftOrRight=Math.random();
		if ((leftOrRight>=0.5)&&((enemyCar[i][0]+(speed/2))<=890)) enemyCar[i][0]+=(speed/2);
		else if ((leftOrRight<0.5)&&((enemyCar[i][0]-(speed/2))>=110)) enemyCar[i][0]-=(speed/2);
	}
}

//restart the game
function restart(){
	clearInterval(gameTimer);
	
	while (enemyCar.length !=0) enemyCar.pop();
	
	speed=30;
	speedLv=10;
	difficulty=1;
	timerPassed=0;
	timePassed=0;
	picNum=0;
	
	carX=500;
	carY=600;
	carWidth=40;
	carHeight=100;
	carSpeed=10;
	
	gameTimer=setInterval(myTimer,100);
	var pushX=Math.floor(Math.random()*700)+100;
	var pushY=20;
	var pushArray=[pushX,pushY];
	enemyCar.push(pushArray);
}

//when car hit enemy, bring to game over page
function hit(){
	clearInterval(gameTimer);
	var pushName=prompt("You crashed! Please enter your name to view your score!");
	var score=timePassed;
	var pushArray=[pushName,score];
	record.push(pushArray);
	location.href="End.html";
}

function playAgain(){
	location.href="Play.html";
}

//show score board
function scoreBoard(){
	if (tableOn==0){
		tableOn=1;
		document.getElementById("scoreOpen").innerHTML="Close Score Board";
		var table=document.getElementById("scoreBoard");
		var row=table.insertRow(0);
		var cell1=row.insertCell(0);
		var cell2=row.insertCell(1);
		cell1.innerHTML="Player Name";
		cell2.innerHTML="Player Score";
	
		for (var i=0; i<record.length; i++){
			var row=table.insertRow(i+1);
			var cell1=row.insertCell(0);
			var cell2=row.insertCell(1);
			cell1.innerHTML=record[i][0];
			cell2.innerHTML=record[i][1];
		}
	}else if(tableOn==1){
		tableOn=0;
		document.getElementById("scoreOpen").innerHTML="Show Score Board";
		document.getElementById("scoreBoard").innerHTML="";
	}
}
