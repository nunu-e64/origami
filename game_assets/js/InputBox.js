class InputBox {
    constructor(inputBox) {
        this.inputBox = inputBox;
    }

    setSize(width, height) {
        this.inputBox.style.width = width + "px";
        this.inputBox.style.height = height + "px";
    }

    setPos(x, y) {
        this.inputBox.style.left = x + "px";
        this.inputBox.style.top = - (WINDOW_HEIGHT - y) + "px";
        this.x = x;
        this.y = y;
    }

    addPos(x, y) {
        this.x += x;
        this.y += y;
        this.inputBox.style.left = this.x + "px";
        this.inputBox.style.top = - (WINDOW_HEIGHT - this.y) + "px";
    }

    setValue(value) {
        this.inputBox.value = value;
    }

    getValue() {
        return this.inputBox.value;
    }

    show() {
        this.inputBox.style.display = "inline";
    }

    hide() {
        this.inputBox.style.display = "none";
    }
}
