
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
        this.correctWord = args["correctWord"];
        this.wrongWord = args["wrongWord"];

        this.score = 0;
        this.text = "ゲームスタート"
        this.isPlaying = true;
        MAX_SPEED = INITIAL_MAX_SPEED;
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
        this.correctWord.reset();
        this.wrongWord.reset();
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
            console.log("move");
            this.player.move();
        }
    }

    renderFrame() {
        //ループを開始
        this.requestId = window.requestAnimationFrame(this.renderFrame.bind(this));

        //canvas をクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 時間移動
        this.wrongWord.move(1);
        this.correctWord.move(1);

        //画像を描画
        this.draw();

        // 当たり判定チェック
        if (this.isPlaying) {
            this.checkHit();
            this.text = this.score;
        } else {
            this.text = "Game Over : Score " + this.score;
        }

        // 文字描画
        this.drawText();
    }

    draw() {
        var ctx = this.ctx;
        this.back.draw(ctx);
        this.player.draw(ctx);
        this.wrongWord.draw(ctx);
        this.correctWord.draw(ctx);
    }

    checkHit() {
        if (isHit(this.player, this.correctWord)) {
            this.correctWord.reset();
            this.score++;
        }
        if (this.isHitWrongWord(this.player, this.wrongWord)) {
            this.wrongWord.reset();
            this.showGameOver();
        }
    }

    isHitWrongWord(targetA, targetB) {
        if (targetA.x <= targetB.x && targetB.x <= targetA.x + targetA.width) {
            if ((targetA.y <= targetB.y && targetA.height + targetA.y >= targetB.y)
             || (targetA.y >= targetB.y && targetB.y + targetB.height >= targetA.y)) {

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

    goBackToTitle() {
        console.log(this.requestId);
        window.cancelAnimationFrame(this.requestId);  // ループ停止
        this.canvas.removeEventListener("click", this.goBackToTitle, false);
        this.goBackTitleCallback();
    }
}
