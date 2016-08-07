importScript('js/Constants.js');
importScript('js/MyImage.js');
importScript('js/Player.js');
importScript('js/Word.js');
importScript('js/Line.js');
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
    var canvas = null;
    var ctx = null;

    var loadingAssetsCount = 0;
    var loadedAssetsCount = 0;
    var hasStartedAllLoading = false;

    // シーン
    var titleScene = null;
    var gameScene = null;

    // アセット
    var back = null;
    var backTitle = null;
    var titleLogo = null;
    var titlePlayer0 = null;
    var titlePlayer1 = null;
    var player0 = null;
    var player1 = null;
    var correctWord = null;
    var wrongWord = null;
    var line = null;

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
        scene = "title";
        if (titleScene == null) {
            console.log("Create Title");
            titleScene = new TitleScene();
        }
        var args = {
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
        scene = "game";
        if (gameScene == null) {
            console.log("Create GameScene");
            gameScene = new GameScene();
        }
        var args = {
            "back" : back,
            "player0" : player0,
            "player1" : player1,
            "correctWord" : correctWord,
            "wrongWord" : wrongWord,
            "backTitle" : backTitle,
            "line" : line,
        }
        gameScene.init(canvas, ctx, args);

        // シーン遷移用コールバックを設定
        gameScene.setGoBackTitleCallback(function(){showTitle();});

        gameScene.show(playerIndex);
    }

    function loadAssets() {
        //HTML ファイル上の canvas エレメントのインスタンスを取得
        canvas = document.getElementById('bg');
        canvas.width = WINDOW_WIDTH;
        canvas.height = WINDOW_HEIGHT;

        //2D コンテキストを取得
        ctx = canvas.getContext('2d');

        // デバイスのイベント阻害
        canvas.addEventListener("touchend", clickPreventHandler);

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

        correctWord = new MyImage('images/correct_word.png');
        beginLoadAsset();
        correctWord.onload (
            function () { finishLoadAsset();}
        );

        wrongWord = new MyImage('images/wrong_word.png');
        beginLoadAsset();
        wrongWord.onload (
            function () { finishLoadAsset();}
        );

        backTitle = new MyImage('images/back_title.png');
        beginLoadAsset();
        backTitle.onload (
            function () { finishLoadAsset();}
        );

        line = new MyImage('images/line.png');
        beginLoadAsset();
        line.onload (
            function () { finishLoadAsset();}
        );
    };

    function clickPreventHandler(event) {
        // event.preventDefault();
        console.log("prevent!");
    }

})();
