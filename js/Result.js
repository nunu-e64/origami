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
    }

    show(score) {
        this.score = score;

        this.resultBack.setPos(getCenterPostion(WINDOW_WIDTH, this.resultBack.width), getCenterPostion(WINDOW_HEIGHT, this.resultBack.height));

        this.closeButton.setPos(this.resultBack.x + this.resultBack.width - this.closeButton.width / 2, this.resultBack.y - this.closeButton.height / 2);

        this.tweetButton.setPos(this.resultBack.x + getCenterPostion(this.resultBack.width, this.tweetButton.width), this.resultBack.y + this.resultBack.height - this.tweetButton.height);

        this.resultBack.addPos(0, -50);
        this.closeButton.addPos(0, -50);
        this.tweetButton.addPos(0, -50);

        this.canvas.addEventListener("click", this.clickHandler.bind(this), false);

        console.log(this.tweetButton);
    }

    dismiss() {
        changeScene("game");
        this.canvas.removeEventListener("click", this.clickHandler, false);
    }

    draw(ctx) {
        if (this.filterAlpha < 1.0) {
            this.filterAlpha += 0.1;
        } else if (this.alpha < 1.0) {
            this.alpha += 0.05;
            this.resultBack.addPos(0, 2.5);
            this.closeButton.addPos(0, 2.5);
            this.tweetButton.addPos(0, 2.5);
        }
        ctx.globalAlpha = this.filterAlpha;
        ctx.fillStyle = FILTER_BLACK;

        ctx.globalAlpha = this.alpha;
        ctx.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
        this.resultBack.draw(ctx);
        this.closeButton.draw(ctx);
        this.tweetButton.draw(ctx);

        //text

        ctx.globalAlpha = 1.0;
    }

    clickHandler(event) {
        if (scene != "result") {
            return;
        }
        console.log(this.resultBack);
        console.log(this.tweetButton);
        if (this.tweetButton.isContainedArea(event.clientX, event.clientY)) {
            this.tweet();
            return;
        }
        if (this.closeButton.isContainedArea(event.clientX, event.clientY)) {
            this.dismiss();
            return;
        }
        if (! this.resultBack.isContainedArea(event.clientX, event.clientY)) {
            this.dismiss();
            return;
        }
    }

    tweet() {
        var url = "http://www.test.com";
        var hashtag = "testtag";
        var text = "結果をツイート！" + this.score + "点！";
        var ref= "http://twitter.com/intent/tweet?url="
　　　　　　　　+ url + "&text=" + text + "&hashtags=" + hashtag + "&";
        console.log(ref);
        window.open(ref);
    }
}
