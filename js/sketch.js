var font,fontSize;
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
var texts;

function preload(){
  font = loadFont("data/miso-bold.ttf");

}

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index',-1);
  // canvas.parent("game");
  textFont(font, 30);
  // textAlign(CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	console.log("HI");
  background('#841815');

  
   


  noFill();
  stroke('#d0202b');
  for (var i = 0.1; i <= ranges; i++) {
    var paintR = map(i, 0.1, ranges, 90, 255);
    stroke(paintR,30,30);
    beginShape();
    for (var x = -0.1; x <= width + 0.1; x += 60.0) {
      var n = noise(x * 0.001, i * 0.001, frameCount * 0.01);
      var y = map(n, 0, 1, 0, height);
      vertex(x, y);
    }
    endShape();
  }

  var textContent1 = "While riding on a train goin’ west,";
  var textContent2 = "I fell asleep for to take my rest,";
  var textContent3 = "I dreamed a dream that made me sad,";
  var textContent4 = "Concerning myself and the first few friends I had ";

  texts = textContent1.split(" ");
  
  console.log(textContent1);




  push();
  translate(width / 2, height / 2);
  fill(255);
  noStroke();

  circleSentence(textContent1, 300, 60, 1000);
  circleSentence(textContent1, 240, 40, 800);
  circleSentence(textContent1, 150, 30, 700);
  circleSentence(textContent1, 100, 20, 700);
  pop();

   update();
    
    for (var i = particles.length - 1; i >= 0; i--) {
      particles[i].show();
    }

}


function circleSentence(sentence, r, fontSize, speed) {
  textFont(font, fontSize);
  textSize(fontSize);
  var size = texts.length;
  var arclength = 0;
  var space = (2 * PI * r) / size;
  arclength += ((space / 2) * millis()) / speed;

  for (let i = 0; i < size; i++) {
    let currentChar = texts[i];

    arclength += space / 2;
    // Angle in radians is the arclength divided by the radius
    var theta = arclength / r;

    push();

    translate(r * cos(theta), r * sin(theta));

    // rotate(theta + PI / 2);
    text(currentChar, 0, 0);
    pop();
    // Move halfway again
    arclength += space / 2;
  }
}

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
}

function touchMoved() {
    moved();
}