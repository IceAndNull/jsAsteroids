var UpdateList = [];
var DrawList = [];

var mouseX = 0;
var mouseY = 0;

var fps = 60;

var colors = ["red", "blue", "orange", "yellow"];

function mouseMove(mouseEvent){
	mouseX = mouseEvent.pageX;
    mouseY = mouseEvent.pageY;
}

document.onmousemove = mouseMove;

class Thing{
    constructor(xpos, ypos, setWidth, setHeight, setColor, setImg){
    	this.x = xpos;
        this.y = ypos;
        this.width = setWidth;
        this.height = setHeight;
        this.color = setColor;
		this.img = setImg;
    }
    Update(){

    }
    touching(otherThing)
    {
    	var isTouching = (otherThing.x < this.x + this.width && this.x < otherThing.x + otherThing.width && otherThing.y < this.y + this.height && this.y < otherThing.y + otherThing.height);
        if(isTouching){
        	console.log("touching");
        }
        else{
        	console.log("not touching");
        }
    	return isTouching;
    }
}

class MouseFollowThing extends Thing{
	Update(){
    	this.x = mouseX - this.width / 2;
        this.y = mouseY - this.height / 2;
    }
}

class Asteroid extends Thing{
	resetYet = false;
    reset(setColor, setImg){
       	this.size = Math.floor(Math.random() * 96) + 5;
        this.width = this.size;
        this.height = this.size;
        if(Math.random() >= 0.5){
        	this.x = Math.random() * (window.screen.width - 1 - this.width) + 1;
            this.y = -this.height;
        }
        else{
        	this.y = Math.random() * (window.screen.height - 1 - this.height) + 1;
            this.x = -this.width;
        }
        this.color = setColor;
		this.img = setImg;
    	this.xvel = Math.random() * (1000 / fps) * window.screen.width / 1500;
    	this.yvel = Math.random() * (1000 / fps) * window.screen.height / 1500;
        this.resetYet = true;
    }
    Update(){
    	if(!this.resetYet){
        	this.reset(colors[Math.floor(Math.random()*colors.length)], this.img);
        }
    	this.x += this.xvel;
        this.y += this.yvel;
        if(this.x + this.width + this.xvel > window.screen.width || this.y + this.height + this.yvel > window.screen.height){
        	removeThing(this);
        }
    }
}

class EaterThing extends Thing{
	size = 15;
	Update(){
    	this.width = this.size;
        this.height = this.size;
    	this.x = mouseX - this.width / 2;
        this.y = mouseY - this.height / 2;
        for(var i = 0; i < UpdateList.length; i++){
        	var currentThing = UpdateList[i];
            //console.log(currentThing);
        	if(currentThing instanceof Asteroid && this.touching(currentThing)){
            	if(currentThing.size > this.size){
                	console.log("ded");
                    this.size = 15;
			//currentThing.color = colors[Math.floor(Math.random()*colors.length)];
                }
                else{
                	this.size += 1;
                    removeThing(currentThing);
                }
            }
        }
    }
}

class AsteroidManager{
	counter = 0;
	constructor(){
    	addThing(new EaterThing(window.screen.width / 2, window.screen.height / 2, 0, 0, "green", ""));
    }
    
    Update(){
    	this.counter++;
    	if(this.counter > fps / 5){
        	addThing(new Asteroid(0,0,0,0,"red", ""));
            this.counter = 0
        }
    }
}

function drawAll(){
	document.body.innerHTML = "";
    DrawList.forEach(function(currentThing) {
    	if(currentThing.img != ""){
        	document.body.innerHTML += "<img style=\"width: "+currentThing.width.toString()+"; height: "+currentThing.height.toString()+"; position:absolute; left:"+currentThing.x.toString()+"; top: "+currentThing.y.toString()+";\" src=\""+currentThing.img+"\"></img>"
        }
        else{
        	document.body.innerHTML += "<div style=\"background:"+currentThing.color+"; width: "+currentThing.width.toString()+"; height: "+currentThing.height.toString()+"; position:absolute; left:"+currentThing.x.toString()+"; top: "+currentThing.y.toString()+";\"></div>"
        }
	});
}

function updateAll(){
	UpdateList.forEach(function(currentThing) {
    	currentThing.Update();
	});
}

function addThing(addingThing){
	UpdateList.push(addingThing);
    DrawList.push(addingThing);
}

function removeThing(removingThing){
	//throw new Exception();
	UpdateList.splice(UpdateList.indexOf(removingThing), 1);
	DrawList.splice(DrawList.indexOf(removingThing), 1);
}

function loop(){
	updateAll();
    drawAll();
	setTimeout(loop, 1000/fps);
}

UpdateList.push(new AsteroidManager());

loop();
