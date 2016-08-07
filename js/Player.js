class Player extends MyImage{
    constructor(src) {
        super(src);
    }

    setFirstPosition(x, y) {
        this.x = x;
        this.y = y;
    };

    move(lineIndex) {
        this.y = PLAYER_FIRST_POS + lineIndex * PLAYER_MOVE_VALUE;
        // if (this.y > PLAYER_FIRST_POS + PLAYER_MOVE_VALUE * (LINE_NUM - 1)) {
        //     this.y = PLAYER_FIRST_POS;
        // }
    }
}
