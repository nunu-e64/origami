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

// Constants ////
var WINDOW_WIDTH = 640;
var WINDOW_HEIGHT = 480;

var PLAYER_FIRST_POS = 5;
var PLAYER_MOVE_VALUE = 160;

var LINE_NUM = 3;

var MIN_SPEED = 2;
var FIRST_MAX_SPEED = 4;
var MAX_MAX_SPEED = 10;
var SPEED_UP_DELTA = 0.2;

var SPAWN_FIRST_INTERVAL = 1.0;
var SPAWN_INTERVAL_DELTA = 0.05;
var SPAWN_MAX_INTERVAL = 0.3;

var FONT_JPN = "'YuGothic',‘ＭＳ ゴシック’";
var FONT_EN = "'Euphemia','Arial'";

var FILTER_BLACK = "rgba(0, 0, 0, 0.5)";

// Global Valriable ////
var scene = "";
var maxSpeed = FIRST_MAX_SPEED;

// Global Function ////
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

function changeScene(nextScene) {
    console.log("Scene: " + scene + "->" + nextScene);
    scene = nextScene;
}

// ブラウザ対応音源拡張子取得
var AUDIO_EXT = function () {
    return "mp3";
    // var ext     = "";
    // var audio   = new Audio();
    //
    // if      (audio.canPlayType("audio/ogg") == 'maybe') { ext="ogg"; }
    // else if (audio.canPlayType("audio/mp3") == 'maybe') { ext="mp3"; }
    // else if (audio.canPlayType("audio/wav") == 'maybe') { ext="wav"; }
    //
    // return ext;
}();
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
            for (var i = 0; i < LINE_NUM - 1; i++) {
                var line = new Line();
                line.setImage(args["line"].image);
                this.lines.push(line);
            }

            if (this.result == null) {
                this.result = new Result();
                console.log("Create Result");
            }
            this.result.init(canvas, args["tweetButton"], args["resultBack"], args["closeButton"], args["tweetBox"]);

            this.score = 0;
            this.text = "ゲームスタート";
            this.isPlaying = true;
            maxSpeed = FIRST_MAX_SPEED;
            this.spawnInterval = SPAWN_FIRST_INTERVAL;
            this.correctWords = [];
            this.wrongWords = [];
            this.lastWord = null;

            this.count = 0;
            this.buttonAlpha = 0;

            this.touchHandler = this.touchstartEvent.bind(this);
            this.mousedownHandler = this.mousedownEvent.bind(this);
            this.touchBackTitleButtonHandler = this.touchBackToTitleEvent.bind(this);
            this.mousedownBackTitleButtonHandler = this.mousedownBackToTitleEvent.bind(this);
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
            this.player.setFirstPosition(50, PLAYER_FIRST_POS);
            this.backTitleButton.x = getCenterPostion(WINDOW_WIDTH, this.backTitleButton.width);
            // this.backTitleButton.y = WINDOW_HEIGHT - this.backTitleButton.height - 20;
            this.backTitleButton.y = getCenterPostion(WINDOW_HEIGHT, this.backTitleButton.height);

            this.line = [];
            for (var i = 0; i < this.lines.length; i++) {
                this.lines[i].x = 0;
                this.lines[i].y = PLAYER_MOVE_VALUE * (i + 1) + i * 6;
            }
        }
    }, {
        key: "setHandlers",
        value: function setHandlers() {
            //Canvas へのタッチイベント設定
            this.canvas.addEventListener("touchstart", this.touchHandler, false);
            this.canvas.addEventListener("mousedown", this.mousedownHandler, false);
        }
    }, {
        key: "touchstartEvent",
        value: function touchstartEvent(event) {
            event.preventDefault();
            console.log("prevent!");
            this.clickEvent(event.touches[0].clientY);
        }
    }, {
        key: "mousedownEvent",
        value: function mousedownEvent(event) {
            event.preventDefault();
            console.log("prevent!");
            this.clickEvent(event.clientY);
        }
    }, {
        key: "clickEvent",
        value: function clickEvent(y) {
            if (scene != "game") {
                return;
            }
            console.log("GameScene click");
            // タッチしたらPlayerを動かす
            if (this.isPlaying) {
                for (var i = 0; i < LINE_NUM; i++) {
                    if (y >= PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * i && y <= PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * (i + 1)) {
                        console.log("move: " + i);
                        this.player.move(i);
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
                    console.log("Spawn Correct");
                } else {
                    var word = new Word(false);
                    word.setImage(this.wrongWordImage);
                    this.wrongWords.push(word);
                    console.log("Spawn Wrong");
                }
            }
        }
    }, {
        key: "renderFrame",
        value: function renderFrame() {
            if (scene != "game" && scene != "result") {
                return;
            }

            this.count++;

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

            // 文字描画
            this.drawText();

            //リザルト画面描画
            if (scene == "result") {
                this.result.draw(this.ctx);
            }

            // 当たり判定チェック
            if (this.isPlaying) {
                this.checkHit();
                this.text = this.score;
            }

            // スポーン
            this.spawn();
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

            for (var i = 0; i < this.lines.length; i++) {
                this.lines[i].draw(ctx);
            }

            this.player.draw(ctx);
            for (var i = this.correctWords.length - 1; i >= 0; i--) {
                this.correctWords[i].draw(ctx);
            }
            for (var i = this.wrongWords.length - 1; i >= 0; i--) {
                this.wrongWords[i].draw(ctx);
            }

            if (this.lastWord != null) {
                this.lastWord.draw(ctx);
            }

            if (!this.isPlaying && scene == "game") {
                //ホバリングパターン
                // var dy = Math.sin(this.count / 10) * 10;
                // var y = this.backTitleButton.y;
                // this.backTitleButton.addPos(0, dy);
                // this.backTitleButton.draw(ctx);
                // this.backTitleButton.y = y;

                // フェードインパターン
                if (this.buttonAlpha < 1.0) {
                    this.buttonAlpha += 0.05;
                    this.backTitleButton.addPos(0, 2.5);
                }
                ctx.globalAlpha = this.buttonAlpha;
                this.backTitleButton.draw(ctx);
                ctx.globalAlpha = 1.0;
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
                    this.lastWord = this.wrongWords[i];
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
            var ctx = this.ctx;
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.font = "italic 32px " + FONT_EN;
            ctx.fillStyle = "black";
            ctx.fillText(this.text, WINDOW_WIDTH / 2, 50);

            ctx.textAlign = "right";
            ctx.textBaseline = "bottom";
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.font = "12px " + FONT_EN;
            ctx.fillText("Sound by 煉獄庭園", WINDOW_WIDTH, WINDOW_HEIGHT);
        }
    }, {
        key: "showGameOver",
        value: function showGameOver() {
            this.isPlaying = false;
            this.canvas.removeEventListener("touchstart", this.touchHandler, false);
            this.canvas.removeEventListener("mousedown", this.mousedownHandler, false);
            this.canvas.addEventListener("touchstart", this.touchBackTitleButtonHandler, false);
            this.canvas.addEventListener("mousedown", this.mousedownBackTitleButtonHandler, false);

            changeScene("result");
            this.result.show(this.score);
        }
    }, {
        key: "touchBackToTitleEvent",
        value: function touchBackToTitleEvent(event) {
            event.preventDefault();
            console.log("prevent touchstart!");
            this.goBackToTitle(event.touches[0].clientX, event.touches[0].clientY);
        }
    }, {
        key: "mousedownBackToTitleEvent",
        value: function mousedownBackToTitleEvent(event) {
            event.preventDefault();
            console.log("prevent mousedown!");
            this.goBackToTitle(event.clientX, event.clientY);
        }
    }, {
        key: "goBackToTitle",
        value: function goBackToTitle(x, y) {
            if (scene != "game" || this.isPlaying) {
                return;
            }
            if (this.backTitleButton.isContainedArea(x, y)) {
                window.cancelAnimationFrame(this.requestId); // ループ停止
                this.canvas.removeEventListener("touchstart", this.touchBackTitleButtonHandler, false);
                this.canvas.removeEventListener("mousedown", this.mousedownBackTitleButtonHandler, false);
                this.goBackTitleCallback();
            }
        }
    }]);

    return GameScene;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputBox = function () {
    function InputBox(inputBox) {
        _classCallCheck(this, InputBox);

        this.inputBox = inputBox;
    }

    _createClass(InputBox, [{
        key: "setSize",
        value: function setSize(width, height) {
            this.inputBox.style.width = width + "px";
            this.inputBox.style.height = height + "px";
        }
    }, {
        key: "setPos",
        value: function setPos(x, y) {
            this.inputBox.style.left = x + "px";
            this.inputBox.style.top = -(WINDOW_HEIGHT - y) + "px";
            this.x = x;
            this.y = y;
        }
    }, {
        key: "addPos",
        value: function addPos(x, y) {
            this.x += x;
            this.y += y;
            this.inputBox.style.left = this.x + "px";
            this.inputBox.style.top = -(WINDOW_HEIGHT - this.y) + "px";
        }
    }, {
        key: "setValue",
        value: function setValue(value) {
            this.inputBox.value = value;
        }
    }, {
        key: "getValue",
        value: function getValue() {
            return this.inputBox.value;
        }
    }, {
        key: "show",
        value: function show() {
            this.inputBox.style.display = "inline";
        }
    }, {
        key: "hide",
        value: function hide() {
            this.inputBox.style.display = "none";
        }
    }]);

    return InputBox;
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
        key: "setPos",
        value: function setPos(x, y) {
            this.x = x;
            this.y = y;
        }
    }, {
        key: "addPos",
        value: function addPos(x, y) {
            this.x += x;
            this.y += y;
        }
    }, {
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

var Result = function () {
    function Result() {
        _classCallCheck(this, Result);
    }

    _createClass(Result, [{
        key: "init",
        value: function init(canvas, tweetButton, resultBack, closeButton, tweetBox) {
            this.canvas = canvas;
            this.tweetButton = tweetButton;
            this.resultBack = resultBack;
            this.closeButton = closeButton;
            this.tweetBox = new InputBox(tweetBox);

            this.filterAlpha = 0.0;
            this.alpha = 0.0;
            this.hasSetClickHandler = false;

            this.touchHandler = this.touchEvent.bind(this);
            this.mousedownHandler = this.mousedownEvent.bind(this);
        }
    }, {
        key: "show",
        value: function show(score) {
            this.score = score;
            this.rank = this.getRank(score);

            this.resultBack.setPos(getCenterPostion(WINDOW_WIDTH, this.resultBack.width), getCenterPostion(WINDOW_HEIGHT, this.resultBack.height));

            this.closeButton.setPos(this.resultBack.x - 10 + this.resultBack.width - this.closeButton.width / 2, this.resultBack.y + 10 - this.closeButton.height / 2);

            this.tweetButton.setPos(this.resultBack.x + getCenterPostion(this.resultBack.width, this.tweetButton.width), this.resultBack.y + this.resultBack.height - this.tweetButton.height);

            // this.tweetBox.top
            var width = 360;
            var height = 60;
            this.tweetBox.setSize(360, 60);
            this.tweetBox.setPos(getCenterPostion(WINDOW_WIDTH, width), this.resultBack.y + this.resultBack.height - 140);
            this.tweetBox.setValue(this.getTweetText());

            this.tweetBox.addPos(0, -50);
            this.resultBack.addPos(0, -50);
            this.closeButton.addPos(0, -50);
            this.tweetButton.addPos(0, -50);
        }
    }, {
        key: "getRank",
        value: function getRank(score) {
            if (score >= 100) {
                return "SSS";
            } else if (score >= 50) {
                return "SS";
            } else if (score >= 40) {
                return "S";
            } else if (score >= 35) {
                return "A++";
            } else if (score >= 30) {
                return "A+";
            } else if (score >= 25) {
                return "A";
            } else if (score >= 20) {
                return "B++";
            } else if (score >= 15) {
                return "B+";
            } else if (score >= 10) {
                return "B";
            } else if (score >= 5) {
                return "C++";
            } else if (score >= 3) {
                return "C+";
            } else if (score >= 1) {
                return "C";
            } else {
                return "D";
            }
        }
    }, {
        key: "dismiss",
        value: function dismiss() {
            changeScene("game");
            this.canvas.removeEventListener("touchstart", this.touchHandler, false);
            this.canvas.removeEventListener("mousedown", this.mousedownHandler, false);
            this.tweetBox.hide();
        }
    }, {
        key: "draw",
        value: function draw(ctx) {
            // 画像のフェードイン/スライドイン表示
            if (this.filterAlpha < 1.0) {
                this.filterAlpha += 0.1;
            } else if (this.alpha < 1.0) {
                this.alpha += 0.05;
                this.resultBack.addPos(0, 2.5);
                this.closeButton.addPos(0, 2.5);
                this.tweetButton.addPos(0, 2.5);
                this.tweetBox.addPos(0, 2.5);
                this.tweetBox.show();
            } else {
                if (!this.hasSetClickHandler) {
                    this.canvas.addEventListener("touchstart", this.touchHandler, false);
                    this.canvas.addEventListener("mousedown", this.mousedownHandler, false);
                    this.hasSetClickHandler = true;
                }
            }
            ctx.globalAlpha = this.filterAlpha;
            ctx.fillStyle = FILTER_BLACK;

            ctx.globalAlpha = this.alpha;
            ctx.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
            this.resultBack.draw(ctx);
            this.closeButton.draw(ctx);
            this.tweetButton.draw(ctx);

            // 結果画面テキスト表示
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            var text = "GAME OVER";
            ctx.font = "italic 28px " + FONT_EN;
            ctx.fillStyle = "black";

            ctx.fillText(text, this.resultBack.x + this.resultBack.width / 2, this.resultBack.y + 20);

            ctx.textAlign = "left";
            ctx.font = "italic 20px " + FONT_EN;
            text = "Your score";
            ctx.fillText(text, this.resultBack.x + 100, this.resultBack.y + 80);

            text = "Player rank";
            ctx.fillText(text, this.resultBack.x + 100, this.resultBack.y + 130);

            ctx.fillStyle = "rgb(231, 48, 122)";
            ctx.font = "italic 32px " + FONT_EN;

            ctx.fillText(this.score, this.resultBack.x + 240, this.resultBack.y + 70);
            ctx.fillText(this.rank, this.resultBack.x + 240, this.resultBack.y + 120);

            ctx.globalAlpha = 1.0;
        }
    }, {
        key: "touchEvent",
        value: function touchEvent(event) {
            event.preventDefault();
            console.log("prevent touchstart!");
            this.clickEvent(event.touches[0].clientX, event.touches[0].clientY);
        }
    }, {
        key: "mousedownEvent",
        value: function mousedownEvent(event) {
            event.preventDefault();
            console.log("prevent mousedown!");
            this.clickEvent(event.clientX, event.clientY);
        }
    }, {
        key: "clickEvent",
        value: function clickEvent(x, y) {
            if (scene != "result") {
                return;
            }
            if (this.tweetButton.isContainedArea(x, y)) {
                this.tweet(this.tweetBox.getValue());
                return;
            }
            if (this.closeButton.isContainedArea(x, y)) {
                this.dismiss();
                return;
            }
        }
    }, {
        key: "getTweetText",
        value: function getTweetText() {
            var url = "http://www.test.com";
            var hashtag = "#testtag";
            var text = "ミニゲーム挑戦結果！ スコア:" + this.score + "  ランク:" + this.rank;
            return text + " " + url + " " + hashtag;
        }
    }, {
        key: "tweet",
        value: function tweet(text) {
            var ref = "http://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&";
            console.log(ref);
            window.open(ref);
        }
    }]);

    return Result;
}();
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
            this.touchHandler = this.touchEvent.bind(this);
            this.mousedownHandler = this.mousedownEvent.bind(this);
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
            var ctx = this.ctx;

            this.titleLogo;
            this.back.draw(this.ctx);

            this.titleLogo.x = getCenterPostion(WINDOW_WIDTH, this.titleLogo.width);
            this.titleLogo.y = 100;
            this.titleLogo.draw(ctx);

            this.titlePlayer0.x = 200;
            this.titlePlayer0.y = 250;
            this.titlePlayer0.draw(ctx);

            this.titlePlayer1.x = WINDOW_WIDTH - 200 - this.titlePlayer1.width;
            this.titlePlayer1.y = 250;
            this.titlePlayer1.draw(ctx);

            ctx.textAlign = "right";
            ctx.textBaseline = "bottom";
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.font = "12px " + FONT_EN;
            ctx.fillText("Created by nunu-e64", WINDOW_WIDTH, WINDOW_HEIGHT);

            console.log("show titleLogo");
        }
    }, {
        key: "setHandlers",
        value: function setHandlers() {
            this.canvas.addEventListener("touchstart", this.touchHandler, false);
            this.canvas.addEventListener("mousedown", this.mousedownHandler, false);
        }
    }, {
        key: "touchEvent",
        value: function touchEvent(event) {
            event.preventDefault();
            console.log("prevent touchstart!");
            this.clickEvent(event.touches[0].clientX, event.touches[0].clientY);
        }
    }, {
        key: "mousedownEvent",
        value: function mousedownEvent(event) {
            event.preventDefault();
            console.log("prevent mousedown!");
            this.clickEvent(event.clientX, event.clientY);
        }
    }, {
        key: "clickEvent",
        value: function clickEvent(x, y) {
            //キャラを選択した時に
            if (this.hasStarted || scene != "title") {
                return;
            }
            if (this.titlePlayer0.isContainedArea(x, y)) {
                this.canvas.removeEventListener("touchstart", this.touchHandler, false);
                this.canvas.removeEventListener("mousedown", this.mousedownHandler, false);
                this.hasStarted = true;
                this.gameStartCallback(0);
            }
            if (this.titlePlayer1.isContainedArea(x, y)) {
                this.canvas.removeEventListener("touchstart", this.touchHandler, false);
                this.canvas.removeEventListener("mousedown", this.mousedownHandler, false);
                this.hasStarted = true;
                this.gameStartCallback(1);
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
    }

    _createClass(Word, [{
        key: "setImage",
        value: function setImage(img) {
            this.image = img;
            this.width = this.image.width;
            this.height = this.image.height;
            this.reset();
        }
    }, {
        key: "reset",
        value: function reset() {
            this.x = WINDOW_WIDTH;
            this.y = Math.floor(Math.random() * (WINDOW_HEIGHT + this.height)) - this.height;
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
//importScript('js/Result.js');
//importScript('js/inputBox.js');
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
        changeScene("game");
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
            "line": line,
            "tweetButton": tweetButton,
            "resultBack": resultBack,
            "closeButton": closeButton,
            "tweetBox": tweetBox
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

        // デバイスのイベント阻害
        // canvas.addEventListener("click", clickPreventHandler);

        // 音楽
        bgm = new Audio("music/bgm." + AUDIO_EXT);
        bgm.loop = true;
        bgm.volume = 1.0;
        bgm.play();

        // 背景
        back = new MyImage("images/background.png");
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

        // リザルトモーダル
        tweetButton = new MyImage('images/tweet_button.png');
        beginLoadAsset();
        tweetButton.onload(function () {
            finishLoadAsset();
        });

        resultBack = new MyImage('images/result_back.png');
        beginLoadAsset();
        resultBack.onload(function () {
            finishLoadAsset();
        });

        closeButton = new MyImage('images/close_button.png');
        beginLoadAsset();
        closeButton.onload(function () {
            finishLoadAsset();
        });
    };

    function clickPreventHandler(event) {
        event.preventDefault();
        console.log("prevent!");
    }
})();
