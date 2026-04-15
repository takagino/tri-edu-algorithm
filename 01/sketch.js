function setup() {
  new Canvas(640, 480);
  world.gravity.y = 10;

  // 床
  new Sprite(320, 400, 640, 20, 'static');

  // 丸（円）を降らせる（X, Y, 直径）
  new Sprite(300, 50, 30);
  new Sprite(320, 0, 40);
  new Sprite(340, -50, 50);
}

function draw() {
  background('black');
}
