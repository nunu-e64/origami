

class TitleScene {
    constructor(){
        this.hasStarted = false;
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
    }

    show () {
        // 配置と表示
        this.setUpLayout();

        // タップイベント設定
        this.setHandlers();
    }

    setUpLayout(){
        this.titleLogo
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

    setHandlers(){
        this.canvas.addEventListener("click", this.clickEvent.bind(this), false);
    }

    clickEvent(event) {
        //キャラを選択した時に
        var self = this;
        if (self.hasStarted) {
            return ;
        }
        if (self.titlePlayer0.isContainedArea(event.clientX, event.clientY)) {
            console.log(self);
            self.canvas.removeEventListener("click", self.clickEvent, false);
            self.hasStarted = true;
            self.gameStartCallback(0);
        }
        if (self.titlePlayer1.isContainedArea(event.clientX, event.clientY)) {
            console.log("hit1");
            self.canvas.removeEventListener("click", self.clickEvent, false);
            self.hasStarted = true;
            self.gameStartCallback(1);
        }
    }

}
