(function () {
    //全体で使用する変数
    var canvas = null;
    var ctx = null;
    var img_snow = null;
    var img_snow_man = null;
    var img_line0 = null;
    var img_line1 = null;
    var img_line2 = null;
    var img_player = null;
    var img_wrong_word = null;
    var img_correct_word = null;

    var has_started = false;

    //矢印キーのコード
    var LEFT_KEY_CODE = 37;
    var RIGHT_KEY_CODE = 39;
    //雪だるまの横位置に加算する変数
    var key_value = 0;

    var MOVE_VALUE = 100;
    var SPEED = 3;

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
            if (has_started == false) {
                renderFrame();
            }
            has_started = true;
        });
        //2D コンテキストを取得
        ctx = canvas.getContext('2d');

        // //image オブジェクトのインスタンスを生成
        // img_snow = new Image();
        // //image オブジェクトに画像をロード
        // img_snow.src = 'icon.png';
        //
        // /*画像読み込み完了のイベントハンドラーに Canvas に
        //    画像を表示するメソッドを記述 */
        // img_snow.onload = function () {
        //     img_snow._x = getCenterPostion(canvas.clientWidth, img_snow.width);
        //     img_snow._y = 0;
        //     //canvas 上で image を描画
        //     ctx.drawImage(img_snow, img_snow._x, img_snow._y);
        // };
        // //雪だるま画像のロード
        // img_snow_man = new Image();
        // img_snow_man.src = 'icon.png';
        // img_snow_man.onload = function () {
        //     img_snow_man._x = getCenterPostion(canvas.clientWidth, img_snow_man.width);
        //     img_snow_man._y = canvas.clientHeight - img_snow_man.height;
        //     //右側に動かせる最大値を設定
        //     img_snow_man.limit_rightPosition =  getRightLimitPosition(canvas.clientWidth, img_snow_man.width);
        //     ctx.drawImage(img_snow_man, img_snow_man._x, img_snow_man._y);
        // };



        img_line0 = new Image();
        img_line0.src = 'images/line.png';
        img_line0.onload = function () {
            img_line0._x = 0;
            img_line0._y = 100;
            ctx.drawImage(img_line0, img_line0._x, img_line0._y);
        };

        img_line1 = new Image();
        img_line1.src = 'images/line.png';
        img_line1.onload = function () {
            img_line1._x = 0;
            img_line1._y = 200;
            ctx.drawImage(img_line1, img_line1._x, img_line1._y);
        };

        img_line2 = new Image();
        img_line2.src = 'images/line.png';
        img_line2.onload = function () {
            img_line2._x = 0;
            img_line2._y = 300;
            ctx.drawImage(img_line2, img_line2._x, img_line2._y);
        };

        img_player = new Image();
        img_player.src = 'images/player.png';
        img_player.onload = function () {
            img_player._x = 10;
            img_player._y = 90;
            ctx.drawImage(img_player, img_player._x, img_player._y);
        };

        img_correct_word = new Image();
        img_correct_word.src = 'images/correct_word.png';
        img_correct_word.onload = function () {
            img_correct_word._x = 640;
            img_correct_word._y = 140;
            ctx.drawImage(img_player, img_correct_word._x, img_correct_word._y);
        };

        img_wrong_word = new Image();
        img_wrong_word.src = 'images/wrong_word.png';
        img_wrong_word.onload = function () {
            img_wrong_word._x = 800;
            img_wrong_word._y = 330;
            ctx.drawImage(img_wrong_word, img_wrong_word._x, img_wrong_word._y);
        };
    };

    //雪だるまを動かすためのイベントハンドラーをまとめた関数
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
           if ((canvas.clientWidth / 2) > evnt.touches[0].clientX) {
                key_value = -3;
           } else {
                key_value = 3;
           }
        });

        //雪だるまが進みっぱなしにならないように、 タッチが完了したら 0 に
        canvas.addEventListener("touchend", function (evnt) {
           key_value = 0;
        });

        //Canvas へのマウスダウンイベント設定
        canvas.addEventListener("mousedown", function (evnt) {
           if ((canvas.clientHeight / 2) > evnt.clientY) {
               img_player._y = img_player._y - 100;
           } else {
               img_player._y = img_player._y + 100;
           }
           if (img_player._y < 90) {
               img_player._y = 90;
           }
           if (img_player._y > 290) {
               img_player._y = 290;
           }
        });
    }

    function renderFrame() {
        //img_snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す
        if (img_correct_word._x < -200) {
            img_correct_word._x = 640
            SPEED+=1;
        };
        if (img_wrong_word._x < -200) { img_wrong_word._x = 640 };

        //canvas をクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // //img_snow の y 値を増分
        // img_snow._y += 2;

        img_wrong_word._x -= SPEED;
        img_correct_word._x -= SPEED;

        //画像を描画
        ctx.drawImage(img_line0, img_line0._x, img_line0._y);
        ctx.drawImage(img_line1, img_line1._x, img_line1._y);
        ctx.drawImage(img_line2, img_line2._x, img_line2._y);
        ctx.drawImage(img_player, img_player._x, img_player._y);
        ctx.drawImage(img_wrong_word, img_wrong_word._x, img_wrong_word._y);
        ctx.drawImage(img_correct_word, img_correct_word._x, img_correct_word._y);

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
