import React, { CSSProperties, ReactElement, useMemo, useState } from "react";

import { useArticle } from "@/api/article";
import { useFields } from "@/api/fields";
import { useMyIndexrole } from "@/api/index";

import { AmcatArticle, AmcatField, AmcatIndexId, AmcatQuery } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { Button } from "../ui/button";
import { Loading } from "../ui/loading";

import { highlightElasticTags } from "@/lib/highlightElasticTags";
import Meta from "./Meta";

export interface ArticleProps {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  /** An article id. Can also be an array of length 1 with the article id, which can trigger setOpen if the id didn't change */
  id: string;
  /** A query, used for highlighting */
  query: AmcatQuery;
  changeArticle?: (id: string | null) => void;
  link?: string;
}

export default React.memo(Article);
function Article({ user, indexId, id, query, changeArticle, link }: ArticleProps) {
  const { data: fields, isLoading: fieldsLoading } = useFields(user, indexId);
  const documentFields = useMemo(() => fields?.filter((f) => f.client_settings.inDocument), [fields]);
  const indexRole = useMyIndexrole(user, indexId);
  const { data: article, isLoading: articleLoading } = useArticle(
    user,
    indexId,
    id,
    query,
    { highlight: true },
    indexRole,
  );

  if (fieldsLoading || articleLoading) return <Loading />;
  if (!article || !documentFields) return null;

  return (
    <div className="prose grid h-full max-w-none grid-cols-1 gap-8 dark:prose-invert lg:grid-cols-[0.6fr,1fr]">
      <div>
        <h2 className=" mt-0">Meta data</h2>
        <Meta
          article={article}
          fields={documentFields}
          setArticle={changeArticle}
          metareader={indexRole === "METAREADER"}
        />
      </div>
      <div className="h-full overflow-auto">
        <Body article={article} fields={documentFields} metareader={indexRole === "METAREADER"} />
      </div>
    </div>
  );
}

interface BodyProps {
  article: AmcatArticle;
  fields: AmcatField[];
  metareader: boolean;
}

const fieldLayout = {
  title: { fontSize: "1.4em", fontWeight: "bold" },
  text: {},
  default: {},
};

const Body = ({ article, fields, metareader }: BodyProps) => {
  // Add title, all other 'text' fields, and finally text
  const textFields = fields.filter((f) => f.type_group === "text");
  const texts: ReactElement[] = [];

  // make sure title goes first
  const title = textFields.find((f) => f.name === "title");
  if (title)
    texts.push(
      <TextField
        key={article.id + "_title"}
        article={article}
        field={title}
        layout={fieldLayout}
        metareader={metareader}
        label={false}
      />,
    );

  textFields
    .filter((f) => f.name !== "title")
    .forEach((f, i) => {
      texts.push(
        <TextField
          key={article.id + "_" + f.name}
          article={article}
          field={f}
          layout={fieldLayout}
          metareader={metareader}
          label={textFields.length > 2}
        />,
      );
    });

  return <>{texts}</>;
};

interface TextFieldProps {
  article: AmcatArticle;
  field: AmcatField;
  layout: Record<string, CSSProperties>;
  metareader: boolean;
  label?: boolean;
}

function TextField({ article, field, layout, label, metareader }: TextFieldProps) {
  const content: ReactElement[] = [];
  const [maxLength, setMaxLength] = useState(1200);

  const paragraphs = article?.[field.name]?.split("\n") || [];

  let nchars = 0;

  for (let paragraph of paragraphs) {
    const truncated = paragraph.length > maxLength - nchars;
    if (truncated) paragraph = paragraph.slice(0, maxLength - nchars);
    const text = highlightableValue(paragraph);
    nchars += paragraph.length;

    content.push(
      <p className="mb-3 mt-0" key={paragraph}>
        {text}
        {truncated ? <span className="text-primary">...</span> : null}
      </p>,
    );

    if (truncated) {
      content.push(
        <Button
          key="showmore"
          className="mt-4 w-full rounded-none border-t border-dotted border-primary text-primary"
          variant="ghost"
          onClick={() => setMaxLength(Infinity)}
        >
          Show full text
        </Button>,
      );
      break;
    }
  }

  function renderContent() {
    if (!metareader || field.metareader.access === "read") return <div style={layout[field.name] || {}}>{content}</div>;

    if (field.metareader.access === "none")
      return (
        <div className="text-secondary">
          METAREADER limitation: cannot view the <b>{field.name}</b>
        </div>
      );

    if (field.metareader.access === "snippet") {
      return (
        <div>
          <div style={layout[field.name] || {}}>
            <span className=" text-secondary">
              METAREADER limitation: can only view snippet of <b>{field.name}</b>:
            </span>{" "}
            {content}
          </div>
        </div>
      );
    }
  }

  return (
    <div key={field.name} style={{ paddingBottom: "1em" }}>
      {!label ? null : (
        <span key={field.name + "_label"} className="font-bold text-primary">
          {field.name}
        </span>
      )}
      {renderContent()}
    </div>
  );
}

function highlightableValue(value: string) {
  return value.includes("<em>") ? highlightElasticTags(value) : value;
}
