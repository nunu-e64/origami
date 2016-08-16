class Result{
    constructor() {
    }

    init (canvas, tweetButton, resultBack, closeButton) {
        this.canvas = canvas;
        this.tweetButton = tweetButton;
        this.resultBack = resultBack;
        this.closeButton = closeButton;

        this.filterAlpha = 0.0;
        this.alpha = 0.0;
        this.hasSetClickHandler = false;

        this.touchHandler = this.touchEvent.bind(this);
        this.mousedownHandler = this.mousedownEvent.bind(this);
    }

    show(score) {
        this.score = score;
        this.rank = this.getRank(score);

        this.resultBack.setPos(getCenterPostion(WINDOW_WIDTH, this.resultBack.width), getCenterPostion(WINDOW_HEIGHT, this.resultBack.height));

        this.closeButton.setPos(this.resultBack.x - 10 + this.resultBack.width - this.closeButton.width / 2, this.resultBack.y + 10 - this.closeButton.height / 2);

        this.tweetButton.setPos(this.resultBack.x + getCenterPostion(this.resultBack.width, this.tweetButton.width), this.resultBack.y + this.resultBack.height - this.tweetButton.height);

        this.resultBack.addPos(0, -50);
        this.closeButton.addPos(0, -50);
        this.tweetButton.addPos(0, -50);
    }

    getRank(score) {
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

    dismiss() {
        changeScene("game");
        this.canvas.removeEventListener("touchstart", this.touchHandler, false);
        this.canvas.removeEventListener("mousedown", this.mousedownHandler, false);
    }

    draw(ctx) {
        // 画像のフェードイン/スライドイン表示
        if (this.filterAlpha < 1.0) {
            this.filterAlpha += 0.1;
        } else if (this.alpha < 1.0) {
            this.alpha += 0.05;
            this.resultBack.addPos(0, 2.5);
            this.closeButton.addPos(0, 2.5);
            this.tweetButton.addPos(0, 2.5);
        } else {
            if (! this.hasSetClickHandler) {
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
        text = "Your Score ... "
        ctx.fillText(text, this.resultBack.x + 100, this.resultBack.y + 80);

        text = "Player Rank ... "
        ctx.fillText(text, this.resultBack.x + 100, this.resultBack.y + 130);

        ctx.fillStyle = "rgb(255, 78, 83)";
        ctx.font = "italic 32px " + FONT_EN;

        ctx.fillText(this.score, this.resultBack.x + 250, this.resultBack.y + 70);
        ctx.fillText(this.rank, this.resultBack.x + 250, this.resultBack.y + 120);

        ctx.globalAlpha = 1.0;
    }

    touchEvent(event) {
        event.preventDefault();
        console.log("prevent touchstart!");
        this.clickEvent(event.touches[0].clientX, event.touches[0].clientY);
    }

    mousedownEvent(event) {
        event.preventDefault();
        console.log("prevent mousedown!");
        this.clickEvent(event.clientX, event.clientY);
    }

    clickEvent(x, y) {
        if (scene != "result") {
            return;
        }
        if (this.tweetButton.isContainedArea(x, y)) {
            this.tweet();
            return;
        }
        if (this.closeButton.isContainedArea(x, y)) {
            this.dismiss();
            return;
        }
    }

    tweet() {
        var url = "http://www.test.com";
        var hashtag = "testtag";
        var text = "ミニゲーム挑戦結果！ スコア:"+this.score+"  ランク:" + this.rank;
        var ref= "http://twitter.com/intent/tweet?url="
　　　　　　　　+ url + "&text=" + text + "&hashtags=" + hashtag + "&";
        console.log(ref);
        window.open(ref);
    }
}
