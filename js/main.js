

importScript('js/Constants.js');
importScript('js/MyImage.js');
importScript('js/Player.js');

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
        player.onload (
          function () {
            player.draw(ctx);
          }
        );

        correctWord = new MyImage('images/correct_word.png', 640, 140);
        correctWord.onload (
          function () {
            correctWord.draw(ctx);
          }
        );

        wrongWord = new MyImage('images/wrong_word.png', 800, 330);
        wrongWord.onload (
          function () {
            wrongWord.draw(ctx);
          }
        );
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

        canvas.addEventListener("touchend", function (evnt) {
        });

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
            correctWord._x = 640
            SPEED+=1;
        };
        if (wrongWord._x < -200) { wrongWord._x = 640 };

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
        return (containerWidth / 2) - (itemWidth / 2);
    };

    //Player (雪だるまを動かせる右の限界位置)
    function getRightLimitPosition(containerWidth, itemWidth) {
        return containerWidth - itemWidth;
    }

    //当たり判定
    function isHit(targetA, targetB) {
        if ((targetA._x <= targetB._x && targetA.width + targetA._x >= targetB._x)
                || (targetA._x >= targetB._x && targetB._x + targetB.width >= targetA._x)) {
                   if ((targetA._y <= targetB._y && targetA.height + targetA._y >= targetB._y)
                       || (targetA._y >= targetB._y && targetB._y + targetB.height >= targetA._y)) {
                          ctx.font = "bold 20px ‘ＭＳ ゴシック’";
                          ctx.fillStyle = "red";
                          ctx.fillText("ヒットしました", getCenterPostion(canvas.clientWidth, 140), 160);
            }
        }
    }

})();
