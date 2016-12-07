class Color {
    solidColor(c, m, y, k) {
        let color = new SolidColor;
        color.cmyk.black = k;
        color.cmyk.cyan = c;
        color.cmyk.yellow = y;
        color.cmyk.magenta = m;

        return color;
    }
}

export default Color;
