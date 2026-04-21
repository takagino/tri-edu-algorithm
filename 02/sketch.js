let px = 50;
let py = 350;
let body, eye; // パーツごとに箱を用意

function setup() {
  new Canvas(640, 480);
  world.gravity.y = 10;
  new Sprite(320, 450, 640, 20, 'static');

  // パーツ1：体（基準となる px, py をそのまま使う）
  body = new Sprite(px, py, 80, 50);
  body.color = 'pink';
  body.collider = 'kinematic';

  // パーツ2：目（体から見て、右に+20、上に-10 ずらす）
  eye = new Sprite(px + 20, py - 10, 15, 15);
  eye.color = 'white';
  eye.collider = 'kinematic';

  // 障害物の壁
  new Sprite(400, 400, 40, 40);
  new Sprite(400, 360, 40, 40);
  new Sprite(400, 320, 40, 40);
}

function draw() {
  background('skyblue');

  // 大元の変数「px」を増やす
  px = px + 2;

  // 1つの変数 px を変えるだけで、全パーツが一緒に動く！（連動の魔法）
  body.x = px;
  eye.x = px + 20; // setupと同じ「+20」のずらし幅をキープする

  body.y = py;
  eye.y = py - 10; // setupと同じ「-10」のずらし幅をキープする
}
