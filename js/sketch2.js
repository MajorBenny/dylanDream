var font,fontSize;
var joinedText;
var alphabet = 'ABCDEFGHIJKLMNORSTUVWYZ,.;!? ';
var counters = [];

var posX;
var posY;

var drawAlpha = true;

function preload(){
  font = loadFont("data/miso-bold.ttf");
  joinedText = loadStrings('data/word2.rtf');

}

function setup() {

  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index',-1);
  textFont(font, 30);
  noStroke();

  joinedText = joinedText.join(' ');

  for (var i = 0; i < alphabet.length; i++) {
    counters[i] = 0;
  }

  countCharacters();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {

  background(255);

	posX = 20;
  posY = 40;

  // go through all characters in the text to draw them
  for (var i = 0; i < joinedText.length; i++) {
    // again, find the index of the current letter in the character set
    var upperCaseChar = joinedText.charAt(i).toUpperCase();
    var index = alphabet.indexOf(upperCaseChar);
    if (index < 0) continue;

    if (drawAlpha) {
      fill(87, 35, 129, counters[index] * 3);
    } else {
      fill(87, 35, 129);
    }

    var sortY = index * 20 + 40;
    var m = map(mouseX, 50, width - 50, 0, 1);
    m = constrain(m, 0, 1);
    var interY = lerp(posY, sortY, m);

    text(joinedText.charAt(i), posX, interY);

    posX += textWidth(joinedText.charAt(i));
    if (posX >= width - 200 && upperCaseChar == ' ') {
      posY += 30;
      posX = 20;
    }
  }
}

function countCharacters() {
  for (var i = 0; i < joinedText.length; i++) {
    // get one character from the text and turn it to uppercase
    var c = joinedText.charAt(i);
    var upperCaseChar = c.toUpperCase();
    var index = alphabet.indexOf(upperCaseChar);
    // increase the respective counter
    if (index >= 0) counters[index]++;
  }
}

function getUniqCharacters() {
  var charsArray = joinedText.toUpperCase().split('');
  var uniqCharsArray = charsArray.filter(function(char, index) {
    return charsArray.indexOf(char) == index;
  }).sort();
  return uniqCharsArray.join('');
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (key == 'a' || key == 'A') drawAlpha = !drawAlpha;
}