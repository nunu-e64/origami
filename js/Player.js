class Player extends MyImage{
    constructor(src) {
        super(src);
    }

    setFirstPosition(x, y) {
        this.x = x;
        this.y = y;
        this.firstPos = this.y;
    };

    move() {
        this.y += PLAYER_MOVE_VALUE;
        if (this.y > PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * (LINE_NUM - 1)) {
            this.y = PLAYER_FIRST_POS;
        }
    }
}
