(function () {
    //全体で使用する変数
    var canvas = null;
    var ctx = null;
    var img_snow = null;
    var img_snow_man = null;
    //DOM のロードが完了したら実行
    document.addEventListener("DOMContentLoaded", function () {
        loadAssets();
    });

    function loadAssets() {
        //HTML ファイル上の canvas エレメントのインスタンスを取得
        canvas = document.getElementById('bg');
        //アニメーションの開始
        canvas.addEventListener("click", renderFrame);
        //2D コンテキストを取得
        ctx = canvas.getContext('2d');
        //image オブジェクトのインスタンスを生成
        img_snow = new Image();
        //image オブジェクトに画像をロード
        img_snow.src = 'icon.png';

        /*画像読み込み完了のイベントハンドラーに Canvas に
           画像を表示するメソッドを記述 */
        img_snow.onload = function () {
            img_snow._x = getCenterPostion(canvas.clientWidth, img_snow.width);
            img_snow._y = 0;
            //canvas 上で image を描画
            ctx.drawImage(img_snow, img_snow._x, img_snow._y);
        };
        //雪だるま画像のロード
        img_snow_man = new Image();
        img_snow_man.src = 'icon.png';
        img_snow_man.onload = function () {
            img_snow_man._x = getCenterPostion(canvas.clientWidth, img_snow_man.width);
            img_snow_man._y = canvas.clientHeight - img_snow_man.height;
            ctx.drawImage(img_snow_man, img_snow_man._x, img_snow_man._y);
        };
    };

    function renderFrame() {
        //img_snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す
        if (img_snow._y > canvas.clientHeight) { img_snow._y = 0 };
        //canvas をクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //img_snow の y 値を増分
        img_snow._y += 2;
        //画像を描画
        ctx.drawImage(img_snow, img_snow._x, img_snow._y);
        ctx.drawImage(img_snow_man, img_snow_man._x, img_snow_man._y);
        //当たり判定
        isHit(img_snow, img_snow_man);
        //ループを開始
        requestId = window.requestAnimationFrame(renderFrame);
    }

    //中央に配置する画像の X 座標を求める関数
    function getCenterPostion(containerWidth, itemWidth) {
        return (containerWidth / 2) - (itemWidth / 2);
    };

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
