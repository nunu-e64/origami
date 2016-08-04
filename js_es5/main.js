"use strict";

//矢印キーのコード
var LEFT_KEY_CODE = 37;
var RIGHT_KEY_CODE = 39;
//雪だるまの横位置に加算する変数
var key_value = 0;

var PLAYER_FIRST_POS = 90;
var PLAYER_MOVE_VALUE = 100;

var LINE_NUM = 3;

var SPEED = 3;
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MyImage = function () {
  function MyImage(src, x, y) {
    _classCallCheck(this, MyImage);

    this.image = new Image();
    this.image.src = src;
    this._x = x;
    this._y = y;
  }

  _createClass(MyImage, [{
    key: "draw",
    value: function draw(ctx) {
      ctx.drawImage(this.image, this._x, this._y);
    }
  }, {
    key: "onload",
    value: function onload(func) {
      this.image.onload = func;
    }
  }]);

  return MyImage;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = function (_MyImage) {
  _inherits(Player, _MyImage);

  function Player(src, x, y) {
    _classCallCheck(this, Player);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this, src, x, y));

    _this.firstPos = y;
    return _this;
  }

  _createClass(Player, [{
    key: "move",
    value: function move() {
      this._y += PLAYER_MOVE_VALUE;
      if (this._y > PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * (LINE_NUM - 1)) {
        this._y = PLAYER_FIRST_POS;
      }
    }
  }]);

  return Player;
}(MyImage);
'use strict';

//importScript('js/Constants.js');
//importScript('js/MyImage.js');
//importScript('js/Player.js');

// 外部スクリプトの読み込み
function importScript(src) {
    document.write("<script type='text/javascript' src='" + src + "'><\/script>");
}

(function () {
    //全体で使用する変数
    var canvas = null;
    var ctx = null;
    var requestId = null;
    var player = null;
    var wrongWord = null;
    var correctWord = null;

    var hasStarted = false;

    //DOM のロードが完了したら実行
    document.addEventListener("DOMContentLoaded", function () {
        loadAssets();
        setHandlers();
    });

    function loadAssets() {
        //HTML ファイル上の canvas エレメントのインスタンスを取得
        canvas = document.getElementById('bg');
        //アニメーションの開始
        canvas.addEventListener("click", function () {
            if (hasStarted == false) {
                renderFrame();
            }
            hasStarted = true;
        });
        //2D コンテキストを取得
        ctx = canvas.getContext('2d');

        player = new Player('images/player.png', 10, 90);
        player.onload(function () {
            player.draw(ctx);
        });

        correctWord = new MyImage('images/correct_word.png', 640, 140);
        correctWord.onload(function () {
            correctWord.draw(ctx);
        });

        wrongWord = new MyImage('images/wrong_word.png', 800, 330);
        wrongWord.onload(function () {
            wrongWord.draw(ctx);
        });
    };

    function setHandlers() {
        //キーイベントの取得 (キーダウン)
        document.addEventListener("keydown", function (evnt) {
            ctx.font = "bold 20px ‘ＭＳ ゴシック’";
            ctx.fillStyle = "red";
            ctx.fillText("key押されました", getCenterPostion(canvas.clientWidth, 140), 160);

            if (evnt.which == LEFT_KEY_CODE) {
                key_value = -3;
            } else if (evnt.which == RIGHT_KEY_CODE) {
                key_value = 3;
            }
        });

        //雪だるまが進みっぱなしにならないように、 キーが上がったら 0 に
        document.addEventListener("keyup", function () {
            key_value = 0;
        });

        //Canvas へのタッチイベント設定
        canvas.addEventListener("touchstart", function (evnt) {
            // TODO: ポース画面

            // タッチしたらPlayerを動かす
            player.move();
        });

        canvas.addEventListener("touchend", function (evnt) {});

        //Canvas へのマウスダウンイベント設定
        canvas.addEventListener("mousedown", function (evnt) {
            // TODO: ポース画面

            // タッチしたらPlayerを動かす
            player.move();
        });
    }

    function renderFrame() {
        //img_snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す
        if (correctWord._x < -200) {
            correctWord._x = 640;
            SPEED += 1;
        };
        if (wrongWord._x < -200) {
            wrongWord._x = 640;
        };

        //canvas をクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // //img_snow の y 値を増分
        // img_snow._y += 2;

        wrongWord._x -= SPEED;
        correctWord._x -= SPEED;

        //画像を描画
        player.draw(ctx);
        wrongWord.draw(ctx);
        correctWord.draw(ctx);

        //ループを開始
        requestId = window.requestAnimationFrame(renderFrame);
    }

    //中央に配置する画像の X 座標を求める関数
    function getCenterPostion(containerWidth, itemWidth) {
        return containerWidth / 2 - itemWidth / 2;
    };

    //Player (雪だるまを動かせる右の限界位置)
    function getRightLimitPosition(containerWidth, itemWidth) {
        return containerWidth - itemWidth;
    }

    //当たり判定
    function isHit(targetA, targetB) {
        if (targetA._x <= targetB._x && targetA.width + targetA._x >= targetB._x || targetA._x >= targetB._x && targetB._x + targetB.width >= targetA._x) {
            if (targetA._y <= targetB._y && targetA.height + targetA._y >= targetB._y || targetA._y >= targetB._y && targetB._y + targetB.height >= targetA._y) {
                ctx.font = "bold 20px ‘ＭＳ ゴシック’";
                ctx.fillStyle = "red";
                ctx.fillText("ヒットしました", getCenterPostion(canvas.clientWidth, 140), 160);
            }
        }
    }
})();
