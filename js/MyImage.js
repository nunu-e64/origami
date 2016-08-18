class MyImage {
    constructor(src) {
        if (src != undefined) {
            this.image = new Image();
            this.image.src = src;
            this.onload(function(){});  //外部からonloadがセットされなかった時にwidth/heightを取得しておくために実行
        }
        this.x = 0;
        this.y = 0;
    }

    setImage(img) {
        this.image = img;
        this.width = this.image.width;
        this.height = this.image.height;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    addPos(x, y) {
        this.x += x;
        this.y += y;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
    }

    onload(func) {
        var self = this;
        var onloadfunc = function(){
            func();
            self.width = self.image.width;
            self.height = self.image.height;
        }
        this.image.onload = onloadfunc;
    }

    isContainedArea(x, y) {
        if (this.x <= x && x <= this.x + this.width) {
            if (this.y <= y && y <= this.y + this.height) {
                return true;
            }
        }
        return false;
    }
}
