class MyImage {
  constructor(src, x, y) {
    this.image = new Image();
    this.image.src = src;
    this._x = x;
    this._y = y;
  }

  draw(ctx) {
      ctx.drawImage(this.image, this._x, this._y);
  }

  onload(func) {
    this.image.onload = func;
  }
}
