

class TitleScene {
    constructor(){
        this.requestId = null;
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
        this.marker0 = new MyImage();
        this.marker1 = new MyImage();
        this.marker0.setImage(args["marker"].image);
        this.marker1.setImage(args["marker"].image);

        // var line = new Line();
        // line.setImage(args["line"].image);

        this.hasStarted = false;
        this.touchHandler = this.touchEvent.bind(this);
        this.mousedownHandler = this.mousedownEvent.bind(this);

        this.count = 0;
    }

    show () {
        // 配置と表示
        this.setUpLayout();

        // タップイベント設定
        this.setHandlers();

        this.renderFrame();
    }

    renderFrame() {
        if (scene != "title") {
            return;
        }
        console.log("render");
        //ループを開始
        this.requestId = window.requestAnimationFrame(this.renderFrame.bind(this));

        if (this.count > 100) {
            window.cancelAnimationFrame(this.requestId);  // ループ停止
        }
        if (this.count <= 40) {
            this.titleLogoAlpha = this.count / 40;
            this.titleLogo.addPos(0, 50 / 40);
        }

        this.count++;

        this.draw();
        this.drawText();
    }

    draw() {
        var ctx = this.ctx;
        this.back.draw(ctx);

        ctx.globalAlpha = this.titleLogoAlpha;
        this.titleLogo.draw(ctx);
        ctx.globalAlpha = 1;

        this.titlePlayer0.draw(ctx);
        this.titlePlayer1.draw(ctx);

        if (this.count >= 40) {
            this.marker0.draw(ctx);
            this.marker1.draw(ctx);
        }
    }

    drawText() {
        var ctx = this.ctx;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.font = "12px " + FONT_EN;
        ctx.fillText("Created by nunu-e64", WINDOW_WIDTH, WINDOW_HEIGHT);
    }

    setUpLayout(){
        this.titleLogo.x = getCenterPostion(WINDOW_WIDTH, this.titleLogo.width);
        this.titleLogo.y = 50;

        this.titlePlayer0.x = 200;
        this.titlePlayer0.y = 250;

        this.titlePlayer1.x = WINDOW_WIDTH - 200 - this.titlePlayer1.width;
        this.titlePlayer1.y = 250;

        this.marker0.x = this.titlePlayer0.x + getCenterPostion(this.titlePlayer0.width, this.marker0.width);
        this.marker0.y = this.titlePlayer0.y - this.marker0.height - 10;

        this.marker1.x = this.titlePlayer1.x + getCenterPostion(this.titlePlayer1.width, this.marker1.width);
        this.marker1.y = this.titlePlayer1.y - this.marker1.height - 10;

        console.log("setup title");
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
        var gameStart = -1;
        if (this.titlePlayer0.isContainedArea(x, y)) {
            gameStart = 0;
        }
        if (this.titlePlayer1.isContainedArea(x, y)) {
            gameStart = 1;
        }

        if (gameStart != -1) {
            this.canvas.removeEventListener("touchstart", this.touchHandler, false);
            this.canvas.removeEventListener("mousedown", this.mousedownHandler, false);
            this.hasStarted = true;
            window.cancelAnimationFrame(this.requestId);  // ループ停止
            this.gameStartCallback(gameStart);
        }
    }

}
