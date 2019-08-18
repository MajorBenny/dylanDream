  var textContent1 = "With haunted hearts through the heat and cold. ";
  var textContent2 = "We never thought we could ever get old.";
  var textContent3 = "We thought we could sit forever in fun.";
  var textContent4 = "But our chances really was a million to one.";


var font;
var ranges = 100;
var MAX_PARTICLES = 120;
var COLORS = [ '#ffffff', '#511815', '#e2a400', '#e54100', '#ff7359','#ff1317' ];
//ARRAYS
var particles = [];
var pool = [];
//VARIABLES
var wander1 = 0.5;
var wander2 = 2.0;
var drag1 = .9;
var drag2 = .99;
var force1 = 2;
var force2 = 8;
var theta1 = -0.5;
var theta2 = 0.5;
var size1 = 5;
var size2 = 30;
var sizeScalar = 0.97;

const frequency = 0.002;
const fontSize = 80;

//auto start variables
let centerX, centerY, startX, step, amplitude;

function preload(){
  font = loadFont("data/miso-bold.ttf");

}

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index',-1);
  
  textFont(font, fontSize);
  // textAlign(CENTER);
  centerX = windowWidth/2;
  centerY = 100;
  step = 0;
  startX = centerX - textWidth(textContent1) / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  console.log("HI");
  background('#841815');

  
  
  // noiseMovement(0.001, 200, 800,textContent1,0);
  fill(255);
  noStroke();

  step += 0.01;
  amplitude = map(mouseY, 0, height, 100, 800);
  
  //draw text
  let x = startX;
  for (var i = 0; i < textContent1.length; i++) {
    let charWidth = textWidth(textContent1.charAt(i));
    x += charWidth/2;
    let y = getY(x);
  
    //calculate angle
    let angle = atan2(getY(x - charWidth / 2) - getY(x + charWidth / 2), -fontSize) + PI;
    angle *= 2;//expression
    push();
      //apply angle
      translate(x, y);
        rotate(angle);
      translate(-x, -y);  
      text(textContent1.charAt(i), x-charWidth/2, y);
      text(textContent2.charAt(i), x-charWidth/2, y+fontSize*1);
      text(textContent3.charAt(i), x-charWidth/2, y+fontSize*2);
      text(textContent4.charAt(i), x-charWidth/2, y+fontSize*3);

    pop();
    x += charWidth/2;
  }



  noFill();
  stroke('#d0202b');
  for (var i = 0.1; i <= ranges; i++) {
    var paintR = map(i, 0.1, ranges, 90, 255);
    stroke(paintR,30,30);
    beginShape();
    for (var x1 = -0.1; x1 <= width + 0.1; x1 += 60.0) {
      var n = noise(x1 * 0.001, i * 0.001, frameCount * 0.01);
      var y = map(n, 0, 1, 0, height);
      vertex(x1, y);
    }
    endShape();
  }



  

   update();
    
    for (var i = particles.length - 1; i >= 0; i--) {
      particles[i].show();
    }

}

function getY(x){
  return centerY / 2 + noise(step, x * frequency) * amplitude;
}

// function noiseMovement(stepAmp, mapStartY, mapEndY,textSample,line){
//   step += stepAmp;
//   amplitude = map(mouseY, 0, height, mapStartY, mapEndY);

//   let x = startX;
//   for (var i = 0; i < textSample; i++) {
//     let charWidth = textWidth(textSample.charAt(i));
//     x += charWidth/2;
//     let y = getY(x);

//     let angle = atan2(getY(x - charWidth / 2) - getY(x + charWidth / 2), -fontSize) + PI;
//     angle *= 2;//expression
//     push();
//       //apply angle
//       translate(x, y);
//         rotate(angle);
//       translate(-x, -y); 
//       fill(255); 
//       text(textSample.charAt(i), x-charWidth/2, y+fontSize*line);

//     pop();
//     x += charWidth/2;
//   }
// }


// PARTICLE CODE

function Particle(x,y,size) {
    this.alive = true;
    this.size = size || 10;
    this.wander = 0.15;
    this.theta = random( TWO_PI );
    this.drag = 0.92;
    this.color = '#fff';
    this.location = createVector(x || 0.0, y || 0.0);
    this.velocity = createVector(0.0, 0.0);
}

Particle.prototype.move = function() {
    this.location.add(this.velocity);
    this.velocity.mult(this.drag);
    this.theta += random( theta1, theta2 ) * this.wander;
    this.velocity.x += sin( this.theta ) * 0.1;
    this.velocity.y += cos( this.theta ) * 0.1;
    this.size *= sizeScalar;
    this.alive = this.size > 0.5;
}

Particle.prototype.show = function() {
  //arc( this.location.x, this.location.y, this.size, 0, TWO_PI );
  fill( this.color);
  noStroke();
  rectMode(CENTER);
  rect(this.location.x,this.location.y, this.size, this.size);
}

function spawn(x,y) {
    var particle, theta, force;
    if ( particles.length >= MAX_PARTICLES ) {
        pool.push( particles.shift() );
    }
    particle = new Particle(mouseX, mouseY, random(size1,size2));
    particle.wander = random( wander1, wander2 );
    particle.color = random( COLORS );
    particle.drag = random( drag1, drag2 );
    theta = random( TWO_PI );
    force = random( force1, force2 );
    particle.velocity.x = sin( theta ) * force;
    particle.velocity.y = cos( theta ) * force;
    particles.push( particle );
}

function update() {
    var i, particle;
    for ( i = particles.length - 1; i >= 0; i-- ) {
        particle = particles[i];
        if ( particle.alive ) {
          particle.move();
        } else {
          pool.push( particles.splice( i, 1 )[0] );
        }
    }
}

function moved() {
    var particle, max, i;
    max = random( 1, 4 );
    for ( i = 0; i < max; i++ ) {
      spawn( mouseX, mouseY );
    }
}

function mouseMoved() {
   moved();
   startX = mouseX - textWidth(textContent4 )/2;
}

function touchMoved() {
    moved();
}