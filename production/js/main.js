"use strict";

/*////////////////////////////////////////////////////////////////////
======================================================================
File Name       : main.js
Creation Date   : 2016/08/07

Copyright © 2016 nunu-e64. All rights reserved.

This source code or any portion thereof must not be
reproduced or used in any manner whatsoever.
======================================================================
*/ ////////////////////////////////////////////////////////////////////

var WINDOW_WIDTH = 640;
var WINDOW_HEIGHT = 480;

var PLAYER_FIRST_POS = 90;
var PLAYER_MOVE_VALUE = 110;

var LINE_NUM = 3;

var MIN_SPEED = 2;
var FIRST_MAX_SPEED = 5;
var MAX_MAX_SPEED = 10;
var SPEED_UP_DELTA = 0.4;
var maxSpeed = FIRST_MAX_SPEED;

var FIRST_SPAWN_RATE = 0.005;
var RATE_UP_DELTA = 0.0001;
var MAX_SPAWN_RATE = 0.01;

var SPAWN_FIRST_INTERVAL = 1.0;
var SPAWN_INTERVAL_DELTA = 0.05;
var SPAWN_MAX_INTERVAL = 0.3;

var scene = "";

//中央に配置する画像の X 座標を求める関数
function getCenterPostion(containerWidth, itemWidth) {
    return containerWidth / 2 - itemWidth / 2;
};

var now = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);

var getTime = function getTime() {
    return (now && now.call(performance) || new Date().getTime()) / 1000;
};

function isHit(targetA, targetB) {
    if (targetA.x <= targetB.x && targetA.width + targetA.x >= targetB.x || targetA.x >= targetB.x && targetB.x + targetB.width >= targetA.x) {
        if (targetA.y <= targetB.y && targetA.height + targetA.y >= targetB.y || targetA.y >= targetB.y && targetB.y + targetB.height >= targetA.y) {

            return true;
        }
    }
    return false;
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameScene = function () {
    function GameScene() {
        _classCallCheck(this, GameScene);

        this.requestId = null;
    }

    _createClass(GameScene, [{
        key: "setGoBackTitleCallback",
        value: function setGoBackTitleCallback(callback) {
            this.goBackTitleCallback = callback;
        }
    }, {
        key: "init",
        value: function init(canvas, ctx, args) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.back = args["back"];
            this.player0 = args["player0"];
            this.player1 = args["player1"];
            this.correctWordImage = args["correctWord"].image;
            this.wrongWordImage = args["wrongWord"].image;
            this.backTitleButton = args["backTitle"];

            this.lines = [];
            for (var i = 0; i < LINE_NUM + 1; i++) {
                var line = new Line();
                line.setImage(args["line"].image);
                this.lines.push(line);
            }

            this.score = 0;
            this.text = "ゲームスタート";
            this.isPlaying = true;
            maxSpeed = FIRST_MAX_SPEED;
            this.spawnRate = FIRST_SPAWN_RATE;
            this.spawnInterval = SPAWN_FIRST_INTERVAL;
            this.correctWords = [];
            this.wrongWords = [];

            this.touchHandler = this.touchstartEvent.bind(this);
            this.mousedownHandler = this.mousedownEvent.bind(this);
            this.clickBackTitleButtonHandler = this.goBackToTitle.bind(this);
        }
    }, {
        key: "show",
        value: function show(playerIndex) {
            this.player = playerIndex == 0 ? this.player0 : this.player1;

            // 初期配置
            this.setUpLayout();
            this.setHandlers();

            // ゲームスタート
            this.startTime = getTime();
            this.lastSpawnTime = this.startTime;
            this.renderFrame();
        }
    }, {
        key: "setUpLayout",
        value: function setUpLayout() {
            this.player.setFirstPosition(100, 90);
            this.backTitleButton.x = getCenterPostion(WINDOW_WIDTH, this.backTitleButton.width);
            this.backTitleButton.y = WINDOW_HEIGHT - this.backTitleButton.height - 50;

            this.line = [];
            for (var i = 0; i < this.lines.length; i++) {
                this.lines[i].x = 0;
                this.lines[i].y = PLAYER_FIRST_POS - this.lines[i].height + PLAYER_MOVE_VALUE * i;
            }
        }
    }, {
        key: "setHandlers",
        value: function setHandlers() {
            //Canvas へのタッチイベント設定
            this.canvas.addEventListener("touchstart", this.touchHandler, false);
            this.canvas.addEventListener("mousedown", this.mousedownHandler, false);
            // this.canvas.addEventListener("mousedown", this.clickHandler, false);
        }
    }, {
        key: "touchstartEvent",
        value: function touchstartEvent(event) {
            this.clickEvent(event.touches[0].clientY);
        }
    }, {
        key: "mousedownEvent",
        value: function mousedownEvent(event) {
            this.clickEvent(event.clientY);
        }
    }, {
        key: "clickEvent",
        value: function clickEvent(y) {
            if (scene != "game") {
                return;
            }
            // TODO: ポース画面
            console.log("GameScene click");
            // タッチしたらPlayerを動かす
            if (this.isPlaying) {
                for (var i = 0; i < LINE_NUM; i++) {
                    if (y >= PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * i && y <= PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * (i + 1)) {
                        console.log("move: " + i);
                        this.player.move(i);
                        this.draw();
                    }
                }
            }
        }
    }, {
        key: "spawn",
        value: function spawn() {
            if (this.currentTime - this.lastSpawnTime > this.spawnInterval) {
                this.lastSpawnTime = this.currentTime + (this.currentTime - this.lastSpawnTime - this.spawnInterval);
                if (this.spawnCounter == null) {
                    this.spawnCounter = 0;
                }
                this.spawnCounter++;
                if (this.spawnCounter % 3 != 0) {
                    var word = new Word(true);
                    word.setImage(this.correctWordImage);
                    this.correctWords.push(word);
                    console.log("Spawn: correct " + this.correctWords.length);
                } else {
                    var word = new Word(false);
                    word.setImage(this.wrongWordImage);
                    this.wrongWords.push(word);
                    console.log("Spawn: wrong " + this.wrongWords.length);
                }
            }
        }
    }, {
        key: "renderFrame",
        value: function renderFrame() {
            if (scene != "game") {
                return;
            }

            //ループを開始
            this.requestId = window.requestAnimationFrame(this.renderFrame.bind(this));

            // フレーム測定
            this.currentTime = getTime();
            // console.log(this.currentTime - this.startTime);

            //canvas をクリア
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 障害物の移動
            for (var i = this.correctWords.length - 1; i >= 0; i--) {
                this.correctWords[i].move(1);
                if (!this.correctWords[i].isActive()) {
                    this.correctWords.splice(i, 1);
                }
            }
            for (var i = this.wrongWords.length - 1; i >= 0; i--) {
                this.wrongWords[i].move(1);
                if (!this.wrongWords[i].isActive()) {
                    this.wrongWords.splice(i, 1);
                }
            }

            //画像を描画
            this.draw();

            // 当たり判定チェック
            if (this.isPlaying) {
                this.checkHit();
                this.text = this.score;
            } else {
                this.text = "Game Over : Score " + this.score;
            }

            // スポーン
            this.spawn();

            // 文字描画
            this.drawText();
        }
    }, {
        key: "levelUp",
        value: function levelUp() {
            // レベルアップ
            if (maxSpeed < MAX_MAX_SPEED) {
                maxSpeed += SPEED_UP_DELTA;
            } else {
                maxSpeed = MAX_MAX_SPEED;
            }

            if (this.spawnRate < MAX_SPAWN_RATE) {
                this.spawnRate += RATE_UP_DELTA;
            } else {
                this.spawnRate = MAX_SPAWN_RATE;
            }

            if (this.spawnInterval > SPAWN_MAX_INTERVAL) {
                this.spawnInterval -= SPAWN_INTERVAL_DELTA;
            } else {
                this.spawnInterval = SPAWN_MAX_INTERVAL;
            }

            console.log("maxSpeed: " + maxSpeed + ", interval: " + this.spawnInterval);
        }
    }, {
        key: "draw",
        value: function draw() {
            var ctx = this.ctx;
            this.back.draw(ctx);
            this.player.draw(ctx);
            for (var i = this.correctWords.length - 1; i >= 0; i--) {
                this.correctWords[i].draw(ctx);
            }
            for (var i = this.wrongWords.length - 1; i >= 0; i--) {
                this.wrongWords[i].draw(ctx);
            }

            if (!this.isPlaying) {
                this.backTitleButton.draw(ctx);
            }

            for (var i = 0; i < this.lines.length; i++) {
                this.lines[i].draw(ctx);
            }
        }
    }, {
        key: "checkHit",
        value: function checkHit() {
            for (var i = this.correctWords.length - 1; i >= 0; i--) {
                if (isHit(this.player, this.correctWords[i])) {
                    this.correctWords.splice(i, 1);
                    this.score++;
                    this.levelUp();
                }
            }
            for (var i = this.wrongWords.length - 1; i >= 0; i--) {
                if (this.isHitWrongWord(this.player, this.wrongWords[i])) {
                    this.wrongWords.splice(i, 1);
                    this.showGameOver();
                }
            }
        }
    }, {
        key: "isHitWrongWord",
        value: function isHitWrongWord(targetA, targetB) {

            if (targetA.x <= targetB.x + 5 && targetB.x + 5 <= targetA.x + targetA.width) {
                if (targetA.y <= targetB.y + 10 && targetA.height + targetA.y >= targetB.y + 10 || targetA.y >= targetB.y + 10 && targetB.y + targetB.height - 10 >= targetA.y) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: "drawText",
        value: function drawText() {
            this.ctx.font = "bold 32px ‘ＭＳ ゴシック’";
            this.ctx.fillStyle = "red";
            this.ctx.fillText(this.text, 50, 50);
        }
    }, {
        key: "showGameOver",
        value: function showGameOver() {
            this.isPlaying = false;
            this.canvas.removeEventListener("touchstart", this.touchHandler, false);
            this.canvas.removeEventListener("mousedown", this.mousedownHandler, false);
            this.canvas.addEventListener("click", this.clickBackTitleButtonHandler, false);
        }
    }, {
        key: "goBackToTitle",
        value: function goBackToTitle(event) {
            if (scene != "game" || this.isPlaying) {
                return;
            }
            if (this.backTitleButton.isContainedArea(event.clientX, event.clientY)) {
                window.cancelAnimationFrame(this.requestId); // ループ停止
                this.canvas.removeEventListener("click", this.clickBackTitleButtonHandler, false);
                this.goBackTitleCallback();
            }
        }
    }]);

    return GameScene;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Line = function () {
    function Line() {
        _classCallCheck(this, Line);

        this.width = 0;
        this.height = 0;
    }

    _createClass(Line, [{
        key: "setImage",
        value: function setImage(img) {
            this.image = img;
            this.width = this.image.width;
            this.height = this.image.height;
        }
    }, {
        key: "draw",
        value: function draw(ctx) {
            ctx.drawImage(this.image, this.x, this.y);
        }
    }]);

    return Line;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MyImage = function () {
    function MyImage(src) {
        _classCallCheck(this, MyImage);

        this.image = new Image();
        this.image.src = src;
        this.x = 0;
        this.y = 0;
        this.onload(function () {}); //外部からonloadがセットされなかった時にwidth/heightを取得しておくために実行
    }

    _createClass(MyImage, [{
        key: "draw",
        value: function draw(ctx) {
            ctx.drawImage(this.image, this.x, this.y);
        }
    }, {
        key: "onload",
        value: function onload(func) {
            var self = this;
            var onloadfunc = function onloadfunc() {
                func();
                self.width = self.image.width;
                self.height = self.image.height;
            };
            this.image.onload = onloadfunc;
        }
    }, {
        key: "isContainedArea",
        value: function isContainedArea(x, y) {
            if (this.x <= x && x <= this.x + this.width) {
                if (this.y <= y && y <= this.y + this.height) {
                    return true;
                }
            }
            return false;
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

    function Player(src) {
        _classCallCheck(this, Player);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this, src));
    }

    _createClass(Player, [{
        key: "setFirstPosition",
        value: function setFirstPosition(x, y) {
            this.x = x;
            this.y = y;
        }
    }, {
        key: "move",
        value: function move(lineIndex) {
            this.y = PLAYER_FIRST_POS + lineIndex * PLAYER_MOVE_VALUE;
            // if (this.y > PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * (LINE_NUM - 1)) {
            //     this.y = PLAYER_FIRST_POS;
            // }
        }
    }]);

    return Player;
}(MyImage);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TitleScene = function () {
    function TitleScene() {
        _classCallCheck(this, TitleScene);
    }

    _createClass(TitleScene, [{
        key: "setGameStartCallback",
        value: function setGameStartCallback(callback) {
            this.gameStartCallback = callback;
        }
    }, {
        key: "init",
        value: function init(canvas, ctx, args) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.titleLogo = args["titleLogo"];
            this.titlePlayer0 = args["titlePlayer0"];
            this.titlePlayer1 = args["titlePlayer1"];
            this.back = args["back"];

            this.hasStarted = false;
            this.clickHandler = this.clickEvent.bind(this);
        }
    }, {
        key: "show",
        value: function show() {
            // 配置と表示
            this.setUpLayout();

            // タップイベント設定
            this.setHandlers();
        }
    }, {
        key: "setUpLayout",
        value: function setUpLayout() {
            this.titleLogo;
            this.back.draw(this.ctx);

            this.titleLogo.x = getCenterPostion(WINDOW_WIDTH, this.titleLogo.width);
            this.titleLogo.y = 100;
            this.titleLogo.draw(this.ctx);

            this.titlePlayer0.x = 200;
            this.titlePlayer0.y = 250;
            this.titlePlayer0.draw(this.ctx);

            this.titlePlayer1.x = WINDOW_WIDTH - 200 - this.titlePlayer1.width;
            this.titlePlayer1.y = 250;
            this.titlePlayer1.draw(this.ctx);

            console.log("show titleLogo");
        }
    }, {
        key: "setHandlers",
        value: function setHandlers() {
            this.canvas.addEventListener("click", this.clickHandler, false);
        }
    }, {
        key: "clickEvent",
        value: function clickEvent(event) {
            //キャラを選択した時に
            var self = this;
            if (self.hasStarted || scene != "title") {
                return;
            }
            if (self.titlePlayer0.isContainedArea(event.clientX, event.clientY)) {
                self.canvas.removeEventListener("click", this.clickHandler, false);
                self.hasStarted = true;
                self.gameStartCallback(0);
            }
            if (self.titlePlayer1.isContainedArea(event.clientX, event.clientY)) {
                self.canvas.removeEventListener("click", this.clickHandler, false);
                self.hasStarted = true;
                self.gameStartCallback(1);
            }
        }
    }]);

    return TitleScene;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Word = function () {
    function Word(isCorrect) {
        _classCallCheck(this, Word);

        this.isCorrect = isCorrect;
        this.reset();
    }

    _createClass(Word, [{
        key: "setImage",
        value: function setImage(img) {
            this.image = img;
            this.width = this.image.width;
            this.height = this.image.height;
        }
    }, {
        key: "reset",
        value: function reset() {
            console.log(this.isCorrect);
            this.x = WINDOW_WIDTH;
            this.y = Math.floor(Math.random() * WINDOW_HEIGHT);
            this.speed = Math.random() * (maxSpeed - MIN_SPEED) + MIN_SPEED;
        }
    }, {
        key: "move",
        value: function move(dt) {
            this.x -= this.speed * dt;
        }
    }, {
        key: "isActive",
        value: function isActive() {
            if (this.x < -this.width) {
                return false;
            }
            return true;
        }
    }, {
        key: "draw",
        value: function draw(ctx) {
            ctx.drawImage(this.image, this.x, this.y);
        }
    }]);

    return Word;
}();
'use strict';

//importScript('js/Constants.js');
//importScript('js/MyImage.js');
//importScript('js/Player.js');
//importScript('js/Word.js');
//importScript('js/Line.js');
//importScript('js/TitleScene.js');
//importScript('js/GameScene.js');

// 外部スクリプトの読み込み
function importScript(src) {
    document.write("<script type='text/javascript' src='" + src + "'><\/script>");
}

(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

(function () {
    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozcancelAnimationFrame || window.webkitcancelAnimationFrame || window.mscancelAnimationFrame;
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
            "back": back,
            "titleLogo": titleLogo,
            "titlePlayer0": titlePlayer0,
            "titlePlayer1": titlePlayer1
        };
        titleScene.init(canvas, ctx, args);
        titleScene.setGameStartCallback(function (index) {
            showGameScene(index);
        });
        titleScene.show();
    }

    function showGameScene(playerIndex) {
        scene = "game";
        if (gameScene == null) {
            console.log("Create GameScene");
            gameScene = new GameScene();
        }
        var args = {
            "back": back,
            "player0": player0,
            "player1": player1,
            "correctWord": correctWord,
            "wrongWord": wrongWord,
            "backTitle": backTitle,
            "line": line
        };
        gameScene.init(canvas, ctx, args);

        // シーン遷移用コールバックを設定
        gameScene.setGoBackTitleCallback(function () {
            showTitle();
        });

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
        back.onload(function () {
            finishLoadAsset();
        });

        // タイトルシーン
        titleLogo = new MyImage("images/title.png");
        beginLoadAsset();
        titleLogo.onload(function () {
            finishLoadAsset();
        });

        titlePlayer0 = new MyImage("images/title_player0.png");
        beginLoadAsset();
        titlePlayer0.onload(function () {
            finishLoadAsset();
        });

        titlePlayer1 = new MyImage("images/title_player1.png");
        beginLoadAsset();
        titlePlayer1.onload(function () {
            finishLoadAsset();
        });

        //ゲームシーン
        player0 = new Player('images/player0.png');
        beginLoadAsset();
        player0.onload(function () {
            finishLoadAsset();
        });

        player1 = new Player('images/player1.png');
        beginLoadAsset();
        player1.onload(function () {
            finishLoadAsset();
        });

        correctWord = new MyImage('images/correct_word.png');
        beginLoadAsset();
        correctWord.onload(function () {
            finishLoadAsset();
        });

        wrongWord = new MyImage('images/wrong_word.png');
        beginLoadAsset();
        wrongWord.onload(function () {
            finishLoadAsset();
        });

        backTitle = new MyImage('images/back_title.png');
        beginLoadAsset();
        backTitle.onload(function () {
            finishLoadAsset();
        });

        line = new MyImage('images/line.png');
        beginLoadAsset();
        line.onload(function () {
            finishLoadAsset();
        });
    };

    function clickPreventHandler(event) {
        // event.preventDefault();
        console.log("prevent!");
    }
})();