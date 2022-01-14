type Mode = "hard" | "soft";

interface Options {
    mode: Mode;
}

export class Leet {
    private mode: Mode;
    public constructor(options: Options) {
        this.mode = options.mode;
    }

    public translate(message: string): string {
        if (this.mode === "hard") {
            return message
                .replace(/i/gi, "1")
                .replace(/a/gi, "/\\")
                .replace(/b/gi, "I3")
                .replace(/c/gi, "[")
                .replace(/d/gi, "I)")
                .replace(/e/gi, "€")
                .replace(/f/gi, "|=")
                .replace(/g/gi, "&")
                .replace(/h/gi, "/-/")
                .replace(/j/gi, "_|")
                .replace(/k/gi, "|<")
                .replace(/l/gi, "|")
                .replace(/m/gi, "^^")
                .replace(/n/gi, "^/")
                .replace(/o/gi, "()")
                .replace(/p/gi, "|°")
                .replace(/q/gi, "(,)")
                .replace(/r/gi, "I2")
                .replace(/s/gi, "$")
                .replace(/t/gi, "+")
                .replace(/u/gi, "|_|")
                .replace(/v/gi, "|/")
                .replace(/w/gi, "'//")
                .replace(/x/gi, ")(")
                .replace(/y/gi, "`/")
                .replace(/z/gi, "%");
        } else {
            return message
                .replace(/a/gi, "4")
                .replace(/b/gi, "8")
                .replace(/e/gi, "3")
                .replace(/i/gi, "1")
                .replace(/o/gi, "0")
                .replace(/r/gi, "2")
                .replace(/s/gi, "5")
                .replace(/t/gi, "7")
                .toUpperCase();
        }
    }

    public reverse(message: string): string {
        if (this.mode === "hard") {
            return message
                .replace(/\/\\/g, "a")
                .replace(/I3/g, "b")
                .replace(/\[/g, "c")
                .replace(/I\)/g, "d")
                .replace(/€/g, "e")
                .replace(/\|=/g, "f")
                .replace(/&/g, "g")
                .replace(/\/-\//g, "h")
                .replace(/1/g, "i")
                .replace(/(?<!\|)_\|/g, "j")
                .replace(/\|</g, "k")
                .replace(/(?<!_)\|(?![=<°/_])/g, "l")
                .replace(/\^\^/g, "m")
                .replace(/\^\//g, "n")
                .replace(/\(\)/g, "o")
                .replace(/\|°/g, "p")
                .replace(/\(,\)/g, "q")
                .replace(/I2/g, "r")
                .replace(/\$/g, "s")
                .replace(/\+/g, "t")
                .replace(/\|_\|/g, "u")
                .replace(/\|\//g, "v")
                .replace(/'\/\//g, "w")
                .replace(/\)\(/g, "x")
                .replace(/`\//g, "y")
                .replace(/%/g, "z");
        } else {
            return message
                .replace(/4/g, "a")
                .replace(/8/g, "b")
                .replace(/3/g, "e")
                .replace(/1/g, "i")
                .replace(/0/g, "o")
                .replace(/2/g, "R")
                .replace(/5/g, "s")
                .replace(/7/g, "t")
                .toLowerCase();
        }
    }
}
