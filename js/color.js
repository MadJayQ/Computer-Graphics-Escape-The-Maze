class Color {
    constructor(r, g, b, a) {
        this.r = r / 255;
        this.g = g / 255;
        this.b = b / 255;
        this.a = a / 255;
    }

    serialize() {
        return [
            this.r,
            this.g,
            this.b,
            this.a
        ];
    }
};

var RED = new Color(255, 0, 0, 255);
var BLUE = new Color(0, 0, 255, 255);
var GREEN = new Color(0, 255, 0, 255);
var BLACK = new Color(0, 0, 0, 255);
var WHITE = new Color(255, 255, 255, 255);
var SKY = new Color(30, 144, 255, 255);
var TRUNK = new Color(83, 53, 10, 255);
var GRASS = new Color(96, 128, 56, 255);
var ROCK = new Color(90, 77, 65, 255);
var DARK = new Color(5, 13, 16);