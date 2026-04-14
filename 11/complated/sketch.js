// --- グローバル変数 ---
let state = 0;
let score = 0;
let timeLeft = 30;

let player;
let floor; // ジャンプの着地用の床
let coins;
let badCoins; // 減点コインのグループ

function setup() {
  new Canvas(600, 400);

  // 世界に下向きの重力を設定（第9回の知識）
  world.gravity.y = 10;

  // 見えない床の設定（プレイヤーが落ちないようにする）
  floor = new Sprite(300, 410, 600, 20, 'static'); // 画面のすぐ下に配置

  // --- 【変更点1】ピクセルアートの定義 ---
  let smileText = `
..yyyyyy
.yybyybyy
yyyyyyyyyy
yybyyyybyy
.yybbbbyy
..yyyyyy`;

  // プレイヤーの設定
  player = new Sprite();
  // ゲームのプレイヤーサイズ（40x40）に合わせる
  player.width = 40;
  player.height = 40;

  // --- 【変更点2】ピクセルアート画像を適用 ---
  // ご提示のスケール32は大きすぎるため、4に調整（10x10グリッド x 4 = 40x40ピクセル）
  player.img = spriteArt(smileText, 4);

  // --- 【変更点3】不要な透明色設定を削除 ---
  // player.color = '#00000000'; // 画像を使うので不要

  player.y = 350;
  player.collider = 'dynamic'; // 重力の影響を受けるようにする
  player.rotationLock = true; // 丸まって転がらないように固定する

  // コイングループの設定
  coins = new Group();
  coins.diameter = 20;
  coins.color = 'yellow';
  coins.text = '💰';
  coins.collider = 'dynamic';

  // 減点コイングループの設定
  badCoins = new Group();
  badCoins.diameter = 25;
  badCoins.color = 'purple';
  badCoins.text = '💣';
  badCoins.collider = 'dynamic';

  // 衝突判定のイベント設定
  player.overlaps(coins, catchCoin);
  player.overlaps(badCoins, catchBadCoin); // 減点コインに触れたら

  textAlign(CENTER, CENTER);
}

function draw() {
  // 背景を少し明るい色に変更
  background('#87CEEB');

  if (state === 0) {
    drawTitle();
  } else if (state === 1) {
    playGame();
  } else if (state === 2) {
    drawGameOver();
  }
}

// 1. タイトル画面の処理
function drawTitle() {
  fill(0);
  textSize(40);
  text('コインキャッチャーDX', width / 2, height / 2 - 20);

  textSize(20);
  text('スペースキーを押してスタート', width / 2, height / 2 + 30);

  if (kb.presses('space')) {
    startGame();
  }
}

// 2. ゲーム開始時の初期化処理
function startGame() {
  state = 1;
  score = 0;
  timeLeft = 30;
  player.x = width / 2;
  player.y = 350; // 高さを戻す
  player.vel.x = 0;
  player.vel.y = 0;
  coins.removeAll();
  badCoins.removeAll(); // 古い減点コインも消す
}

// 3. プレイ中のメインロジック
function playGame() {
  // プレイヤーの左右操作
  if (kb.pressing('left')) {
    player.vel.x = -5;
  } else if (kb.pressing('right')) {
    player.vel.x = 5;
  } else {
    player.vel.x = 0;
  }

  // プレイヤーのジャンプ処理
  // 「上キーを押した」かつ「床に触れている」時だけジャンプできる
  if (kb.presses('up') && player.colliding(floor)) {
    player.vel.y = -6; // 上方向に力を加える
  }

  // 画面外に出ないようにする制御（左右のみ）
  if (player.x < 20) player.x = 20;
  if (player.x > width - 20) player.x = width - 20;

  // コインと減点コインのランダム生成
  if (frameCount % 60 === 0) {
    // 0〜99のランダムな数字を作り、30未満（30%の確率）なら爆弾を降らせる
    if (random(100) < 30) {
      let b = new badCoins.Sprite();
      b.x = random(20, width - 20);
      b.y = -20;
    } else {
      let c = new coins.Sprite();
      c.x = random(20, width - 20);
      c.y = -20;
    }
  }

  // メモリ節約処理
  for (let i = 0; i < coins.length; i++) {
    if (coins[i].y > height + 20) coins[i].remove();
  }
  for (let i = 0; i < badCoins.length; i++) {
    if (badCoins[i].y > height + 20) badCoins[i].remove();
  }

  // タイマー処理
  if (frameCount % 60 === 0 && timeLeft > 0) {
    timeLeft--;
  }

  // UI表示
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text('スコア: ' + score, 20, 20);

  textAlign(RIGHT, TOP);
  text('残り時間: ' + timeLeft, width - 20, 20);

  textAlign(CENTER, CENTER);

  // ゲームオーバー判定
  if (timeLeft <= 0) {
    state = 2;
    player.vel.x = 0;
  }
}

// 4. コインを取った時の処理
function catchCoin(playerSprite, coinSprite) {
  coinSprite.remove();
  score += 100;
}

// 減点コイン（爆弾）を取った時の処理
function catchBadCoin(playerSprite, badCoinSprite) {
  badCoinSprite.remove();
  score -= 50; // 50点マイナス

  // 触れた瞬間に少しノックバック（後ろに弾かれる）させるとゲームっぽくなります
  playerSprite.vel.y = -5;
}

// 5. ゲームオーバー（リザルト）画面の処理
function drawGameOver() {
  fill(0);
  textSize(40);
  text('タイムアップ！', width / 2, height / 2 - 40);

  textSize(30);
  fill('red');
  text('最終スコア: ' + score, width / 2, height / 2 + 10);

  fill(0);
  textSize(20);
  text('スペースキーを押してタイトルへ', width / 2, height / 2 + 60);

  if (kb.presses('space')) {
    state = 0;
  }
}
