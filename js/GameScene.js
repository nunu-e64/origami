
class GameScene{
    constructor() {
        this.requestId = null;
    }

    setGoBackTitleCallback(callback) {
        this.goBackTitleCallback = callback;
        this.score = 0;
        this.text = "ゲームスタート"
    }

    init(canvas, ctx, args){
        this.canvas = canvas;
        this.ctx = ctx;
        this.back = args["back"];
        this.player0 = args["player0"];
        this.player1 = args["player1"];
        this.correctWord = args["correctWord"];
        this.wrongWord = args["wrongWord"];
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

        this.ctx.font = "bold 20px ‘ＭＳ ゴシック’";
        this.ctx.fillStyle = "red";
        this.ctx.fillText("スタート", getCenterPostion(this.canvas.clientWidth, 140), 160);

    }

    setUpLayout () {
        this.player.setFirstPosition(100, 90);
        this.correctWord.x = 640;
        this.correctWord.y = 300;
        this.wrongWord.x = 700;
        this.wrongWord.y = 100;
    }

    setHandlers() {
        var self = this;

        //Canvas へのタッチイベント設定
        this.canvas.addEventListener("click", function (evnt) {
            // TODO: ポース画面
            console.log("click");
            // タッチしたらPlayerを動かす
            self.player.move();
        });
    }

    renderFrame() {
        //ループを開始
        window.requestAnimationFrame(this.renderFrame.bind(this));

        //canvas をクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //img_snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す
        if (this.correctWord.x < -200) {
            this.correctWord.x = 640
            SPEED+=1;
        };
        if (this.wrongWord.x < -200) { this.wrongWord.x = 640 };

        // 時間移動
        this.wrongWord.x -= SPEED;
        this.correctWord.x -= SPEED;

        //画像を描画
        this.draw();

        // 当たり判定チェック
        this.checkHit();

        // 文字描画
        this.text = this.score;
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
            // this.correctWord.reset();
            this.score++;
        }
        if (this.isHitWrongWord(this.player, this.wrongWord)) {
            // this.wrongWord.reset();
            this.score--;
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
        this.ctx.font = "bold 48px ‘ＭＳ ゴシック’";
        this.ctx.fillStyle = "red";
        this.ctx.fillText(this.text, getCenterPostion(this.canvas.clientWidth, 50), 50);
    }

}
