

class TitleScene {
    constructor(){
    }

    setGameStartCallback(callback) {
        this.gameStartCallback = callback;
    }

    init (canvas, ctx, args) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.titleLogo = args["titleLogo"];
        this.titlePlayer0 = args["titlePlayer0"];
        this.titlePlayer1 = args["titlePlayer1"];
        this.back = args["back"];

        this.hasStarted = false;
        this.clickHandler = this.clickEvent.bind(this);
    }

    show () {
        // 配置と表示
        this.setUpLayout();

        // タップイベント設定
        this.setHandlers();
    }

    setUpLayout(){
        var ctx = this.ctx;

        this.titleLogo
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
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.font = "12px " + FONT_EN;
        ctx.fillText("Created by nunu-e64", WINDOW_WIDTH, WINDOW_HEIGHT);

        console.log("show titleLogo");
    }

    setHandlers(){
        this.canvas.addEventListener("click", this.clickHandler, false);
    }

    clickEvent(event) {
        //キャラを選択した時に
        var self = this;
        if (self.hasStarted || scene != "title") {
            return ;
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

}
