import randomColor from "randomcolor";

/**
 * Get the color from the codeMap for a given annotation value/code.
 *
 * @param {*} code     annotation value/code
 * @param {*} color    the color. If not given, creates random color
 * @returns
 */
export const getColor = (code: string, color: string = ""): string => {
  let col = color || randomColor({ seed: code, luminosity: "light" });
  return col + "80";
};

/**
 * Create a gradient for a given array of colors
 *
 * @param {*} colors ...you know, colors
 * @returns
 */
export const getColorGradient = (colors: string[]) => {
  if (colors.length === 0) return "white";
  if (colors.length === 1) return colors[0];

  const pct = Math.floor(100 / colors.length);
  const gradColors = colors.reduce((a: string[], color, i) => {
    if (i === 0) a.push(color + ` ${pct}%`);
    if (i === colors.length - 1) a.push(color + ` ${100 - pct}%`);

    if (i > 0 && i < colors.length - 1) {
      a.push(color + ` ${pct * i}%`);
      a.push(color + ` ${pct * (i + 1)}%`);
    }
    return a;
  }, []);

  return `linear-gradient(to bottom, ${gradColors.join(", ")})`;
};
