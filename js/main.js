importScript('js/Constants.js');
importScript('js/MyImage.js');
importScript('js/Player.js');
importScript('js/Word.js');
importScript('js/TitleScene.js');
importScript('js/GameScene.js');

// 外部スクリプトの読み込み
function importScript(src) {
  document.write("<script type='text/javascript' src='" + src + "'><\/script>");
}

(function() {
    var requestAnimationFrame = window.requestAnimationFrame ||
　　　　　　　　　　　　　　　　　　　window.mozRequestAnimationFrame ||
                              　window.webkitRequestAnimationFrame ||
　　　　　　　　　　　　　　　　　　　window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

(function() {
    var cancelAnimationFrame = window.cancelAnimationFrame ||
　　　　　　　　　　　　　　　　　　　window.mozcancelAnimationFrame ||
                              　window.webkitcancelAnimationFrame ||
　　　　　　　　　　　　　　　　　　　window.mscancelAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
})();

(function () {
    //全体で使用する変数
    var canvas = null;
    var ctx = null;
    var requestId = null;

    var hasStarted = false;

    var loadingAssetsCount = 0;
    var loadedAssetsCount = 0;
    var hasStartedAllLoading = false;

    //DOM のロードが完了したら実行
    document.addEventListener("DOMContentLoaded", function () {
          loadAssets();
          hasStartedAllLoading = true;
          console.log("loadAssets");
     });

    // アセット読み込みカウンター
    function beginLoadAsset() {
        loadingAssetsCount++;
    }

    // すべてのアセットの読み込みが終了していたらタイトル表示
    function finishLoadAsset() {
        loadedAssetsCount++;
        if (loadedAssetsCount == loadingAssetsCount && hasStartedAllLoading) {
            console.log("finishLoadAsset");
            showTitle();
        }
    }

    function showTitle() {
        titleScene = null;
        titleScene = new TitleScene();
        args = {
            "back" : back,
            "titleLogo" : titleLogo,
            "titlePlayer0" : titlePlayer0,
            "titlePlayer1" : titlePlayer1,
        }
        titleScene.init(canvas, ctx, args);
        titleScene.setGameStartCallback(function(index){showGameScene(index);});
        titleScene.show();
    }

    function showGameScene(playerIndex) {
        gameScene = null;
        gameScene = new GameScene();
        args = {
            "back" : back,
            "player0" : player0,
            "player1" : player1,
            "correctWord" : correctWord,
            "wrongWord" : wrongWord
        }
        gameScene.init(canvas, ctx, args);

        // シーン遷移用コールバックを設定
        gameScene.setGoBackTitleCallback(function(){showTitle();});

        gameScene.show(playerIndex);
    }

    function loadAssets() {
        //HTML ファイル上の canvas エレメントのインスタンスを取得
        canvas = document.getElementById('bg');

        //2D コンテキストを取得
        ctx = canvas.getContext('2d');


        // 背景
        back = new MyImage("images/dot.jpg");
        beginLoadAsset();
        back.onload (
            function () { finishLoadAsset();}
        );

        // タイトルシーン
        titleLogo = new MyImage("images/title.png");
        beginLoadAsset();
        titleLogo.onload (
            function () { finishLoadAsset();}
        );

        titlePlayer0 = new MyImage("images/title_player0.png");
        beginLoadAsset();
        titlePlayer0.onload (
            function () { finishLoadAsset();}
        );

        titlePlayer1 = new MyImage("images/title_player1.png");
        beginLoadAsset();
        titlePlayer1.onload (
            function () { finishLoadAsset();}
        );


        //ゲームシーン
        player0 = new Player('images/player0.png');
        beginLoadAsset();
        player0.onload (
            function () { finishLoadAsset();}
        );

        player1 = new Player('images/player1.png');
        beginLoadAsset();
        player1.onload (
            function () { finishLoadAsset();}
        );

        correctWord = new Word('images/correct_word.png');
        beginLoadAsset();
        correctWord.onload (
            function () { finishLoadAsset();}
        );

        wrongWord = new Word('images/wrong_word.png');
        beginLoadAsset();
        wrongWord.onload (
            function () { finishLoadAsset();}
        );
    };

    //Player (雪だるまを動かせる右の限界位置)
    function getRightLimitPosition(containerWidth, itemWidth) {
        return containerWidth - itemWidth;
    }

    //当たり判定
    function isHit(targetA, targetB) {
        if ((targetA.x <= targetB.x && targetA.width + targetA.x >= targetB.x)
                || (targetA.x >= targetB.x && targetB.x + targetB.width >= targetA.x)) {
                   if ((targetA._y <= targetB._y && targetA.height + targetA._y >= targetB._y)
                       || (targetA._y >= targetB._y && targetB._y + targetB.height >= targetA._y)) {
                          ctx.font = "bold 20px ‘ＭＳ ゴシック’";
                          ctx.fillStyle = "red";
                          ctx.fillText("ヒットしました", getCenterPostion(canvas.clientWidth, 140), 160);
            }
        }
    }

})();
