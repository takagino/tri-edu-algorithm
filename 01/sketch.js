let myBox; // 「myBox」という名前の箱（変数）を用意します

function setup() {
  new Canvas('16:9');

  // スプライト（キャラクター）を新しく作って、myBoxに入れる
  myBox = new Sprite(); // プロパティを変更する（. を使う）
  myBox.width = 100; // 幅を100に
  myBox.height = 150; // 高さを150に
  myBox.color = 'red'; // 色を赤に（文字は '' で囲むルール）
}

function draw() {
  background(220);
}
