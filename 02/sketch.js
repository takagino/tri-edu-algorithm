let x = 0;
let y = 400;
let body, cabin, wheel1, wheel2;

function setup() {
  new Canvas(640, 480);

  // 【追加】重力と床を追加
  world.gravity.y = 10;
  new Sprite(320, 450, 640, 20, 'static');

  // 'kinematic'（物理演算の影響を受けない設定）を追加
  body = new Sprite(x, y, 120, 40, 'kinematic');
  body.color = '#0000ff';
  cabin = new Sprite(x, y - 30, 60, 30, 'kinematic');
  cabin.color = '#00ffff';
  wheel1 = new Sprite(x - 40, y + 20, 25, 'kinematic');
  wheel1.color = '#000000';
  wheel2 = new Sprite(x + 40, y + 20, 25, 'kinematic');
  wheel2.color = '#000000';

  // 【追加】障害物（ブロックの壁）を置く
  new Sprite(400, 420, 40, 40);
  new Sprite(400, 380, 40, 40);
  new Sprite(400, 340, 40, 40);
  new Sprite(400, 300, 40, 40);
}

function draw() {
  background('#dddddd');

  x = x + 2;

  body.x = x;
  cabin.x = x;
  wheel1.x = x - 40;
  wheel2.x = x + 40;
}
