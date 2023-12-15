import { AmcatDocument } from "@/amcat/interfaces";
import { getColor, getColorGradient } from "./colors";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function prepareArticle(article: AmcatDocument) {
  if (article._annotations) article = addAnnotations(article);

  // add annotations also splits paragraphs. For text fields without annotations
  // we still need to do this. We can see if a text has been processed by addAnnotations
  // if it's an array. But there should be a more elegant solution
  if (!Array.isArray(article.text))
    article.text = splitParagraphs(article.text || "");

  return article;
}

/**
 * A rather complicated function, but what it does is take an array of annotations
 * (that can be in artice._annotations), and add span tags to show them.
 * The reasons it's so complicated is that these annotations can overlap, so they first
 * need to be merged together.
 * @param {*} article
 * @returns
 */
const addAnnotations = (article: AmcatDocument) => {
  if (!article._annotations) return article;

  const mergedAnnotations = mergeAnnotations(article, article._annotations);

  for (let field of Object.keys(mergedAnnotations)) {
    if (Array.isArray(article[field])) {
      // due to rerendering, the annotations can be added twice
      // except they can't and shouldn't, so if it's an array (i.e. tokens already added) skip it
      continue;
    }

    const parts = [];
    const text = article[field];

    let offset = 0;
    for (let annotation of mergedAnnotations[field]) {
      if (annotation.start == null || annotation.end == null) continue;
      // check if there was text between the start/last annotation and the new one, and add
      // this as unannotated text
      if (annotation.start > offset) {
        parts.push(splitParagraphs(text.slice(offset, annotation.start)));
      }

      // then add the annotation span in a tags
      parts.push(
        annotateText(
          splitParagraphs(text.slice(annotation.start, annotation.end)),
          annotation
        )
      );

      offset = annotation.end;
    }
    // add final text after the last annotation
    parts.push(splitParagraphs(text.slice(offset)));
    article[field] = parts;
  }

  return article;
};

const splitParagraphs = (text: string) => {
  const paragraphs = text.split(/\n/);

  const linebreak = (i: number) => {
    if (i === paragraphs.length - 1) return null;
    return (
      <>
        <br />
        <br />
      </>
    );
  };

  // this looks needlessly complex, but we can't use tags to encapsulate paragraphs
  // due to the span annotations, so we add line breaks manually
  // [WvA] and I presume this is where the unique key warning comes from. But not 100% sure...
  return paragraphs.map((p, i) => (
    <>
      {p}
      {linebreak(i)}
    </>
  ));
};

const annotateText = (text: JSX.Element[], annotation: MergedAnnotation) => {
  const annlist = [];
  const colors = [];
  for (let a of annotation.annotations || []) {
    const id = a.variable + "_" + a.value + "_" + a.start;
    const color = getColor(id, a.color);
    colors.push(color);
    annlist.push(
      <li
        key={id}
        style={{
          backgroundColor: color,
          padding: "0.3em",
        }}
      >
        <b>{a.variable}</b>
        {": " + a.value}
      </li>
    );
  }

  let cl = "annotated";
  if (annotation.left) cl += " left";
  if (annotation.right) cl += " right";

  return (
    <Popover key={annotation.start + "_tag"}>
      <PopoverTrigger>
        <span
          className={cl}
          key={annotation.start + "_tag"}
          style={{ background: getColorGradient(colors) }}
        >
          {text}
        </span>
      </PopoverTrigger>
      <PopoverContent>
        <ul>{annlist}</ul>
      </PopoverContent>
    </Popover>
  );
};

type Annotation = {
  field: string;
  variable: string;
  value: any;
  offset: number;
  length: number;
  start?: number;
  color?: string;
};

type MergedAnnotation = {
  field?: string;
  length?: number;
  offset?: number;
  start?: number;
  end?: number;
  left?: boolean;
  right?: boolean;
  annotations?: Annotation[];
};

const mergeAnnotations = (
  article: AmcatDocument,
  annotations: Annotation[]
): { [key: string]: MergedAnnotation[] } => {
  const annotationDict: any = {};
  for (let annotation of annotations) {
    if (!article[annotation.field]) continue;
    if (!annotationDict[annotation.field])
      annotationDict[annotation.field] = {};
    for (let i = 0; i < annotation.length; i++) {
      if (!annotationDict[annotation.field][annotation.offset + i])
        annotationDict[annotation.field][annotation.offset + i] = [];
      annotationDict[annotation.field][annotation.offset + i].push(annotation);
    }
  }

  const mergedAnnotations: { [key: string]: MergedAnnotation[] } = {};
  const writeAnnotation = (
    annotation: MergedAnnotation,
    field: string,
    i: number
  ) => {
    annotation.end = i;
    // annotation.annotations = annotation.annotations.map((a) => ({
    //   variable: a.variable,
    //   value: a.value,
    // }));
    annotation.right = annotationDict[field][i + 1] == null; // no annotation to right?
    mergedAnnotations[field].push(annotation);
  };

  for (let field of Object.keys(annotationDict)) {
    if (!mergedAnnotations[field]) mergedAnnotations[field] = [];
    let annotation: MergedAnnotation = {};

    for (let i = 0; i <= article[field].length; i++) {
      // (<= so that it continues to just after the last char, for annotations all to the end)
      let newAnnotation = false;
      const positionAnnotations = annotationDict[field][i];

      if (!positionAnnotations) {
        // annotation ended
        if (!annotation.annotations) continue;
        writeAnnotation(annotation, field, i);
        annotation = {};
        continue;
      }

      if (!annotation.annotations) {
        // new annotation has not yet started, initializt it and continue
        annotation = { annotations: positionAnnotations, start: i, left: true };
        continue;
      }

      newAnnotation = annotationsAreDifferent(
        annotation.annotations,
        positionAnnotations
      );
      if (newAnnotation) {
        // annotation ended with the immediate start of a new annotation
        writeAnnotation(annotation, field, i);

        // if new annotation started, already add the starting position
        annotation = {
          annotations: positionAnnotations,
          start: i,
          left: false,
        };
      }
    }
  }
  return mergedAnnotations;
};

const annotationsAreDifferent = (
  prev: Annotation[],
  next: Annotation[]
): boolean => {
  if (prev.length !== next.length) return true;
  for (let j = 0; j < prev.length; j++) {
    if (next[j] !== prev[j]) {
      return true;
    }
  }
  return false;
};
