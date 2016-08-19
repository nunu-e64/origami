importScript('game_assets/js/Constants.js');
importScript('game_assets/js/MyImage.js');
importScript('game_assets/js/Player.js');
importScript('game_assets/js/Word.js');
importScript('game_assets/js/Line.js');
importScript('game_assets/js/Result.js');
importScript('game_assets/js/inputBox.js');
importScript('game_assets/js/TitleScene.js');
importScript('game_assets/js/GameScene.js');

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
    var tweetButton = null;
    var resultBack = null;
    var closeButton = null;
    var tweetBox = null;

    // BGM
    var bgm = null;

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
        changeScene("title");
        if (titleScene == null) {
            console.log("Create Title");
            titleScene = new TitleScene();
        }
        var args = {
            "back" : back,
            "titleLogo" : titleLogo,
            "titlePlayer0" : titlePlayer0,
            "titlePlayer1" : titlePlayer1,
            "titleMessage" : titleMessage,
        }
        titleScene.init(canvas, ctx, args);
        titleScene.setGameStartCallback(function(index){showGameScene(index);});
        titleScene.show();
    }

    function showGameScene(playerIndex) {
        changeScene("explain");
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
            "tweetButton" : tweetButton,
            "resultBack" : resultBack,
            "closeButton" : closeButton,
            "tweetBox" : tweetBox,
            "explain" : explain,
            "gameStartButton" : gameStartButton,
        }
        gameScene.init(canvas, ctx, args);

        // シーン遷移用コールバックを設定
        gameScene.setGoBackTitleCallback(function(){showTitle();});

        gameScene.show(playerIndex);
    }

    function loadAssets() {
        //HTML ファイル上の canvas エレメントのインスタンスを取得
        canvas = document.getElementById('cav');
        canvas.width = WINDOW_WIDTH;
        canvas.height = WINDOW_HEIGHT;

        tweetBox = document.getElementById('tweetbox');
        tweetBox.style.display = "none";

        //2D コンテキストを取得
        ctx = canvas.getContext('2d');

        // テキストの描画位置指定
        ctx.textBaseline = "top";
        ctx.textAlign = "left";

        // 音楽
        bgm = new Audio("game_assets/music/bgm." + AUDIO_EXT);
        bgm.loop = true;
        bgm.volume = 1.0;
        bgm.play();

        // 背景
        back = new MyImage("game_assets/images/background.png");
        beginLoadAsset();
        back.onload (
            function () { finishLoadAsset();}
        );

        // タイトルシーン
        titleLogo = new MyImage("game_assets/images/title.png");
        beginLoadAsset();
        titleLogo.onload (
            function () { finishLoadAsset();}
        );

        titlePlayer0 = new MyImage("game_assets/images/title_player0.png");
        beginLoadAsset();
        titlePlayer0.onload (
            function () { finishLoadAsset();}
        );

        titlePlayer1 = new MyImage("game_assets/images/title_player1.png");
        beginLoadAsset();
        titlePlayer1.onload (
            function () { finishLoadAsset();}
        );

        titleMessage = new MyImage("game_assets/images/titleMessage.png");
        beginLoadAsset();
        titleMessage.onload (
            function () { finishLoadAsset();}
        );

        //ゲームルールモーダル
        explain = new MyImage("game_assets/images/explain.png");
        beginLoadAsset();
        explain.onload (
            function () { finishLoadAsset();}
        );

        gameStartButton = new MyImage("game_assets/images/game_start.png");
        beginLoadAsset();
        gameStartButton.onload (
            function () { finishLoadAsset();}
        );

        //ゲームシーン
        player0 = new Player('game_assets/images/player0.png');
        beginLoadAsset();
        player0.onload (
            function () { finishLoadAsset();}
        );

        player1 = new Player('game_assets/images/player1.png');
        beginLoadAsset();
        player1.onload (
            function () { finishLoadAsset();}
        );

        correctWord = new MyImage('game_assets/images/correct_word.png');
        beginLoadAsset();
        correctWord.onload (
            function () { finishLoadAsset();}
        );

        wrongWord = new MyImage('game_assets/images/wrong_word.png');
        beginLoadAsset();
        wrongWord.onload (
            function () { finishLoadAsset();}
        );

        backTitle = new MyImage('game_assets/images/back_title.png');
        beginLoadAsset();
        backTitle.onload (
            function () { finishLoadAsset();}
        );

        line = new MyImage('game_assets/images/line.png');
        beginLoadAsset();
        line.onload (
            function () { finishLoadAsset();}
        );

        // リザルトモーダル
        tweetButton = new MyImage('game_assets/images/tweet_button.png');
        beginLoadAsset();
        tweetButton.onload (
            function () { finishLoadAsset();}
        );

        resultBack = new MyImage('game_assets/images/result_back.png');
        beginLoadAsset();
        resultBack.onload (
            function () { finishLoadAsset();}
        );

        closeButton = new MyImage('game_assets/images/close_button.png');
        beginLoadAsset();
        closeButton.onload (
            function () { finishLoadAsset();}
        );
    };

    function clickPreventHandler(event) {
        event.preventDefault();
        console.log("prevent!");
    }

})();
