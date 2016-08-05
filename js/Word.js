class Word extends MyImage {
    constructor(src) {
        super(src);
        this.reset();
    }

    reset() {
        this.x = WINDOW_WIDTH;
        this.y = Math.floor(Math.random() * WINDOW_HEIGHT);
        this.speed = Math.floor(Math.random() * (MAX_SPEED - MIN_SPEED)) + MIN_SPEED;
    }

    move (dt) {
        this.x-=this.speed * dt;

        //img_snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す
        if (this.x < -this.width) {
            MAX_SPEED += SPEED_UP_DELTA;
            this.reset();
        };
    }
}
