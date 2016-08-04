class Player extends MyImage{
  constructor(src, x, y) {
    super(src, x, y);
    this.firstPos = y;
  }

  move() {
    this._y += PLAYER_MOVE_VALUE;
    if (this._y > PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * (LINE_NUM - 1)) {
      this._y = PLAYER_FIRST_POS;
    }
  }
}
