class Line {
    constructor() {
        this.width = 0;
        this.height = 0;
    }

    setImage(img) {
        this.image = img;
        this.width = this.image.width;
        this.height = this.image.height;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
    }
}
