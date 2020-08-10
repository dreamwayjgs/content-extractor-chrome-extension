class Palette {
    static index = 0
    static palette = ["#000000", "#004949", "#009292", "#ff6db6", "#ffb6db",
        "#490092", "#006ddb", "#b66dff", "#6db6ff", "#b6dbff",
        "#920000", "#924900", "#db6d00", "#24ff24", "#ffff6d"]
    static contrast(color: string) {
        const rgb = hexToRgb(color)
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
        if (luminance > 0.5) return '#000000'
        else return "#FFFFFF"
    }
    static getColor() {
        const color = Palette.palette[Palette.index]
        Palette.index++
        if (Palette.index >= Palette.palette.length) Palette.index = 0
        return {
            color: color,
            contrast: Palette.contrast(color)
        }
    }
}

function componentToHex(c: number) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex: string) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {
            r: 255, g: 255, b: 255
        };
}

export default Palette