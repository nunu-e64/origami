
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

        this.lines = [];
        for (var i = 0; i < LINE_NUM + 1; i++) {
            var line = new Line();
            line.setImage(args["line"].image);
            this.lines.push(line);
        }

        this.score = 0;
        this.text = "ゲームスタート"
        this.isPlaying = true;
        MAX_SPEED = INITIAL_MAX_SPEED;
        this.spawnRate = INITIAL_SPAWN_RATE;
        this.correctWords = [];
        this.wrongWords = [];
    }

    show(playerIndex) {
        console.log(playerIndex);
        this.player = (playerIndex == 0 ? this.player0 : this.player1);

        // 初期配置
        console.log(this);
        this.setUpLayout();
        this.setHandlers();

        // ゲームスタート
        this.renderFrame();
    }

    setUpLayout () {
        this.player.setFirstPosition(100, 90);
        this.backTitleButton.x = getCenterPostion(WINDOW_WIDTH, this.backTitleButton.width);
        this.backTitleButton.y = WINDOW_HEIGHT - this.backTitleButton.height - 50;

        this.line = [];
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].x = 0;
            this.lines[i].y = PLAYER_FIRST_POS - this.lines[i].height + PLAYER_MOVE_VALUE * i;
            console.log(this.lines[i].y);
        }
    }

    setHandlers() {
        //Canvas へのタッチイベント設定
        this.canvas.addEventListener("click", this.clickEvent.bind(this), false);
    }

    clickEvent(event) {
        // TODO: ポース画面
        console.log("GameScene click");
        // タッチしたらPlayerを動かす
        if (this.isPlaying) {
            var y = event.clientY;
            for (var i = 0; i < LINE_NUM; i++) {
                if (y >= PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * i && y <= PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * (i+1)) {
                    console.log("move");
                    this.player.move(i);
                    this.draw();
                }
            }
        }
    }

    spawn() {
        var rand = Math.random();
        if (rand < this.spawnRate) {
            var word = new Word();
            if (Math.random() < 0.5) {
                word.setImage(this.correctWordImage);
                this.correctWords.push(word);
                console.log("Spawn: correct " + this.correctWords.length);
            } else {
                word.setImage(this.wrongWordImage);
                this.wrongWords.push(word);
                console.log("Spawn: wrong " + this.wrongWords.length);
            }
        }
    }

    renderFrame() {
        //ループを開始
        this.requestId = window.requestAnimationFrame(this.renderFrame.bind(this));

        //canvas をクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 時間移動
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

        // 当たり判定チェック
        if (this.isPlaying) {
            this.checkHit();
            this.text = this.score;
        } else {
            this.text = "Game Over : Score " + this.score;
        }

        // スポーン
        this.spawn();

        // レベルアップ
        if (MAX_SPEED < MAX_MAX_SPEED) {
            MAX_SPEED += SPEED_UP_DELTA;
        } else {
            MAX_SPEED = MAX_MAX_SPEED;
        }

        if (this.spawnRate < MAX_SPAWN_RATE) {
            this.spawnRate += RATE_UP_DELTA;
        } else {
            this.spawnRate = MAX_SPAWN_RATE;
        }
        // console.log("MaxSpeed:" + MAX_SPEED + ", Rate: " + this.spawnRate);

        // 文字描画
        this.drawText();
    }

    draw() {
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

    checkHit() {
        for (var i = this.correctWords.length - 1; i >= 0; i--) {
            if (isHit(this.player, this.correctWords[i])) {
                this.correctWords.splice(i, 1);
                //RATE_UP
                this.score++;
            }
        }
        for (var i = this.wrongWords.length - 1; i >= 0; i--) {
            if (this.isHitWrongWord(this.player, this.wrongWords[i])) {
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
        this.ctx.font = "bold 32px ‘ＭＳ ゴシック’";
        this.ctx.fillStyle = "red";
        this.ctx.fillText(this.text, 50, 50);
    }

    showGameOver() {
        this.isPlaying = false;
        this.canvas.removeEventListener("click", this.clickEvent, false);
        this.canvas.addEventListener("click", this.goBackToTitle.bind(this), false);
    }

    goBackToTitle(event) {
        if (this.backTitleButton.isContainedArea(event.clientX, event.clientY)) {
            console.log(this.requestId);
            window.cancelAnimationFrame(this.requestId);  // ループ停止
            this.canvas.removeEventListener("click", this.goBackToTitle, false);
            this.goBackTitleCallback();
        }
    }
}
