
class GameScene{
    constructor() {
        this.requestId = null;
    }

    setGoBackTitleCallback(callback) {
        this.goBackTitleCallback = callback;
    }

    init(canvas, ctx, args){
        this.canvas = canvas;
        this.ctx = ctx;
        this.back = args["back"];
        this.player0 = args["player0"];
        this.player1 = args["player1"];
        this.correctWordImage = args["correctWord"].image;
        this.wrongWordImage = args["wrongWord"].image;
        this.backTitleButton = args["backTitle"];
        this.explain = args["explain"];
        this.gameStartButton = args["gameStartButton"];

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
        this.text = "ゲームスタート"
        this.isPlaying = true;
        maxSpeed = FIRST_MAX_SPEED;
        this.spawnInterval = SPAWN_FIRST_INTERVAL;
        this.correctWords = [];
        this.wrongWords = [];
        this.lastWord = null;

        this.count = 0;
        this.buttonAlpha = 0;
        this.explainAlpha = 0;

        this.touchHandler = this.touchstartEvent.bind(this);
        this.mousedownHandler = this.mousedownEvent.bind(this);
        this.touchBackTitleButtonHandler = this.touchBackToTitleEvent.bind(this);
        this.mousedownBackTitleButtonHandler = this.mousedownBackToTitleEvent.bind(this);
    }

    showExplain() {
        changeScene("explain");
        this.explain.x = getCenterPosition(WINDOW_WIDTH, this.explain.width);
        this.explain.y = getCenterPosition(WINDOW_HEIGHT, this.explain.height);

        this.gameStartButton.x = getCenterPosition(WINDOW_WIDTH, this.gameStartButton.width);
        this.gameStartButton.y = this.explain.y + this.explain.height -  this.gameStartButton.height - 5;

        this.explain.addPos(0, -50);
    }

    show(playerIndex) {
        this.player = (playerIndex == 0 ? this.player0 : this.player1);

        // 初期配置
        this.setUpLayout();
        this.setHandlers();

        if (scene == "explain") {
            this.showExplain();
        }
        this.resetTime();
        this.renderFrame();
    }

    resetTime() {
        // ゲームスタート
        this.startTime = getTime();
        this.lastSpawnTime = this.startTime;
    }

    setUpLayout () {
        this.player.setFirstPosition(50, PLAYER_FIRST_POS);
        this.backTitleButton.x = getCenterPosition(WINDOW_WIDTH, this.backTitleButton.width);
        // this.backTitleButton.y = WINDOW_HEIGHT - this.backTitleButton.height - 20;
        this.backTitleButton.y =         getCenterPosition(WINDOW_HEIGHT, this.backTitleButton.height);

        this.line = [];
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].x = 0;
            this.lines[i].y = PLAYER_MOVE_VALUE * (i + 1) + i * 6;
        }
    }

    setHandlers() {
        //Canvas へのタッチイベント設定
        this.canvas.addEventListener("touchstart", this.touchHandler, false);
        this.canvas.addEventListener("mousedown", this.mousedownHandler, false);
    }

    touchstartEvent(event) {
        event.preventDefault();
        console.log("prevent!");
        this.clickEvent(event.touches[0].clientX, event.touches[0].clientY);
    }

    mousedownEvent(event) {
        event.preventDefault();
        console.log("prevent!");
        this.clickEvent(event.clientX, event.clientY);
    }

    clickEvent(x, y) {

        if (scene == "explain") {
            if (this.gameStartButton.isContainedArea(x, y)){
                changeScene("game");
                this.resetTime();
            }
            return;
        }

        if (scene != "game") {
            return;
        }
        console.log("GameScene click");
        // タッチしたらPlayerを動かす
        if (this.isPlaying) {
            for (var i = 0; i < LINE_NUM; i++) {
                if (y >= PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * i && y <= PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * (i+1)) {
                    console.log("move: " + i);
                    this.player.move(i);
                }
            }
        }
    }

    spawn() {
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

    renderFrame() {
        if (scene != "game" && scene != "result" && scene != "explain") {
            return;
        }

        this.count++;

        //ループを開始
        this.requestId = window.requestAnimationFrame(this.renderFrame.bind(this));

        // フレーム測定
        this.currentTime = getTime();

        //canvas をクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (scene == "explain") {
            this.draw();
            return;
        }

        // 障害物の移動
        for (var i = this.correctWords.length - 1; i >= 0; i--) {
            this.correctWords[i].move(1);
            if (! this.correctWords[i].isActive()) {
                this.correctWords.splice(i, 1)
            }
        }
        for (var i = this.wrongWords.length - 1; i >= 0; i--) {
            this.wrongWords[i].move(1);
            if (! this.wrongWords[i].isActive()) {
                this.wrongWords.splice(i, 1)
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

    levelUp () {
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

    draw() {
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

        if (scene == "explain") {
            if (this.explainAlpha < 1.0) {
                this.explainAlpha += 0.05;
                this.explain.addPos(0, 2.5);
            }
            ctx.globalAlpha = this.explainAlpha;
            this.explain.draw(ctx);
            ctx.globalAlpha = 1.0;

            if (this.explainAlpha >= 1.0) {
                this.gameStartButton.draw(ctx);
            }
        }
    }

    checkHit() {
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

    isHitWrongWord(targetA, targetB) {
        if (targetA.x <= targetB.x + 5 && targetB.x + 5 <= targetA.x + targetA.width) {
            if ((targetA.y <= targetB.y + 10 && targetA.height + targetA.y >= targetB.y + 10)
             || (targetA.y >= targetB.y + 10 && targetB.y + targetB.height - 10 >= targetA.y)) {
                return true;
            }
        }
        return false;
    }

    drawText() {
        var ctx = this.ctx
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.font = "italic 32px " + FONT_EN;
        ctx.fillStyle = "black";
        ctx.fillText(this.text, WINDOW_WIDTH / 2, 50);
    }

    showGameOver() {
        this.isPlaying = false;
        this.canvas.removeEventListener("touchstart", this.touchHandler, false);
        this.canvas.removeEventListener("mousedown", this.mousedownHandler, false);
        this.canvas.addEventListener("touchstart", this.touchBackTitleButtonHandler, false);
        this.canvas.addEventListener("mousedown", this.mousedownBackTitleButtonHandler, false);

        changeScene("result");
        this.result.show(this.score);
    }

    touchBackToTitleEvent(event) {
        event.preventDefault();
        console.log("prevent touchstart!");
        this.goBackToTitle(event.touches[0].clientX, event.touches[0].clientY);
    }

    mousedownBackToTitleEvent(event) {
        event.preventDefault();
        console.log("prevent mousedown!");
        this.goBackToTitle(event.clientX, event.clientY);
    }

    goBackToTitle(x, y) {
        if (scene != "game" || this.isPlaying) {
            return;
        }
        if (this.backTitleButton.isContainedArea(x, y)) {
            window.cancelAnimationFrame(this.requestId);  // ループ停止
            this.canvas.removeEventListener("touchstart", this.touchBackTitleButtonHandler, false);
            this.canvas.removeEventListener("mousedown", this.mousedownBackTitleButtonHandler, false);
            this.goBackTitleCallback();
        }
    }
}
