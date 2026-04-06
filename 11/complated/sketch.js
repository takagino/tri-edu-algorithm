// --- グローバル変数 ---
// ゲームの状態管理（第10回の知識）
// 0: タイトル画面, 1: プレイ中, 2: ゲームオーバー（結果）
let state = 0;

// UI用変数（第11回の知識）
let score = 0;
let timeLeft = 30;

// スプライト用変数
let player;
let coins; // コインのグループ（第6回の知識）

function setup() {
  new Canvas(600, 400);

  // プレイヤーの設定
  player = new Sprite();
  player.width = 50;
  player.height = 50;
  player.color = 'blue';
  player.y = 350;
  player.collider = 'kinematic'; // 重力の影響を受けないが、動かせる（第9回の知識）

  // コイングループの設定（第6回の知識）
  coins = new Group();
  coins.diameter = 20;
  coins.color = 'yellow';
  coins.collider = 'dynamic'; // 重力で落ちる

  // 衝突判定のイベント設定（第7回の知識）
  // プレイヤーがコインに重なったら、関数 catchCoin を実行する
  player.overlaps(coins, catchCoin);

  // テキストの初期設定
  textAlign(CENTER, CENTER);
}

function draw() {
  background(220);

  // 状態遷移による画面の切り替え（第10回の知識）
  if (state === 0) {
    drawTitle();
  } else if (state === 1) {
    playGame();
  } else if (state === 2) {
    drawGameOver();
  }
}

// --- 画面描画とロジックの関数（第8回の知識） ---

// 1. タイトル画面の処理
function drawTitle() {
  fill(0);
  textSize(40);
  text('コインキャッチャー', width / 2, height / 2 - 20);

  textSize(20);
  text('スペースキーを押してスタート', width / 2, height / 2 + 30);

  // スペースキーでゲーム開始（第3回の知識）
  if (kb.presses('space')) {
    startGame();
  }
}

// 2. ゲーム開始時の初期化処理
function startGame() {
  state = 1; // プレイ中に切り替え
  score = 0; // スコアのリセット
  timeLeft = 30; // タイマーのリセット
  player.x = width / 2; // プレイヤーの位置を中央に戻す
  coins.removeAll(); // 残っているコインを全て消す
}

// 3. プレイ中のメインロジック
function playGame() {
  // --- プレイヤーの操作（第3・9回の知識） ---
  if (kb.pressing('left')) {
    player.vel.x = -5; // 左へ移動（速度）
  } else if (kb.pressing('right')) {
    player.vel.x = 5; // 右へ移動（速度）
  } else {
    player.vel.x = 0; // 押していなければ止まる
  }

  // 画面外に出ないようにする制御
  if (player.x < 25) player.x = 25;
  if (player.x > width - 25) player.x = width - 25;

  // --- コインの生成（第4回の知識） ---
  // 約60フレーム（1秒）ごとに新しいコインを生成
  if (frameCount % 60 === 0) {
    let c = new coins.Sprite();
    c.x = random(20, width - 20); // 横位置はランダム
    c.y = -20; // 画面の上から
    c.vel.y = random(2, 6); // 落ちるスピードもランダム
  }

  // --- メモリ節約：画面外に落ちたコインを消す（第5回の知識） ---
  for (let i = 0; i < coins.length; i++) {
    if (coins[i].y > height + 20) {
      coins[i].remove();
    }
  }

  // --- UIとタイマー処理（第11回の知識） ---
  // 60フレーム（約1秒）ごとに残り時間を減らす
  if (frameCount % 60 === 0 && timeLeft > 0) {
    timeLeft--;
  }

  // スコアとタイマーのUI表示
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text('スコア: ' + score, 20, 20);

  textAlign(RIGHT, TOP);
  text('残り時間: ' + timeLeft, width - 20, 20);

  // テキストの揃え位置を中央に戻しておく
  textAlign(CENTER, CENTER);

  // --- ゲームオーバーの判定 ---
  if (timeLeft <= 0) {
    state = 2; // リザルト画面へ遷移
    player.vel.x = 0; // プレイヤーを止める
  }
}

// 4. コインを取った時の処理（第7回の知識）
function catchCoin(playerSprite, coinSprite) {
  coinSprite.remove(); // 触れたコインを消す
  score += 100; // スコアを加算する（第11回の知識）
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

  // スペースキーでタイトルに戻る
  if (kb.presses('space')) {
    state = 0;
  }
}
