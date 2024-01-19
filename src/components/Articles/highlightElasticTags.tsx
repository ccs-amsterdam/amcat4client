import { ReactElement } from "react";

/***
 *
 * Replace <em> tags in the input string by <highlight> jsx tags
 *
 */
export function highlightElasticTags(text: string): ReactElement {
  // if </em> is immediately followed by <em>, remove them to the sequence is highlighted
  text = text.replaceAll("</em> <em>", " ");

  const regex = new RegExp(/<em>(.*?)<\/em>/); // Match text inside two square brackets
  return (
    <>
      {String(text)
        .split(regex)
        .reduce((prev: (string | ReactElement)[], tagged: string, i) => {
          if (i % 2 === 0) {
            prev.push(tagged);
          } else {
            prev.push(
              <span className="rounded bg-secondary/40 px-[2px]  " key={i + tagged}>
                {tagged}
              </span>,
            );
          }
          return prev;
        }, [])}
    </>
  );
}

/**
 * Remove all <em> / </em> tags from a string
 *
 * @param text The input text
 * @returns the text without </?em> tags
 */
export function removeElasticTags(text: string): string {
  return String(text).replaceAll("<em>", "").replaceAll("</em>", "");
}
