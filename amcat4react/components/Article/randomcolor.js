/* Couldn't get this to work with typescript (and I'm a lazy bastard) */
import randomColor from "randomcolor";

export default function getRandomColor(seed) {
  return randomColor({ seed, luminosity: "light" });
}
