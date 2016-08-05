class Word {
    constructor() {
        this.reset();
    }

    setImage(img) {
        this.image = img;
        this.width = this.image.width;
        this.height = this.image.height;
    }

    reset() {
        this.x = WINDOW_WIDTH;
        this.y = Math.floor(Math.random() * WINDOW_HEIGHT);
        this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
    }

    move (dt) {
        this.x-=this.speed * dt;
    }

    isActive () {
        if (this.x < -this.width) {
            return false;
        }
        return true;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
    }
}
