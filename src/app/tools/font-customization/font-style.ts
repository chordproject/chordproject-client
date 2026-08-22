export class FontStyle {
    size: FontSize;
    color: FontColor;
    isBold: boolean;
    isItalic: boolean;

    constructor() {
        this.size = FontSize.M;
        this.color = FontColor.Default;
        this.isBold = false;
        this.isItalic = false;
    }
}

export enum FontColor {
    Default = 'default',
    Orange = 'orange',
    Red = 'red',
    Green = 'green',
    Purple = 'purple',
    Blue = 'blue'
}

export enum FontSize {
    Xs = 0,
    S = 1,
    M = 2,
    L = 3,
    Xl = 4,
    Xxl = 5
}
