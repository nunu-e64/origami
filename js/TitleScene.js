

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
        this.touchHandler = this.touchEvent.bind(this);
        this.mousedownHandler = this.mousedownEvent.bind(this);
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
        this.canvas.addEventListener("touchstart", this.touchHandler, false);
        this.canvas.addEventListener("mousedown", this.mousedownHandler, false);
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
        //キャラを選択した時に
        if (this.hasStarted || scene != "title") {
            return ;
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

}
