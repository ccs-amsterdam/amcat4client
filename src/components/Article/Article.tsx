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
import { Badge } from "../ui/badge";

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

const Body = ({ article, fields, metareader }: BodyProps) => {
  const titleFields = fields.filter((f) => f.client_settings.isHeading);
  const textFields = fields.filter((f) => f.type === "text" && !f.client_settings.isHeading);

  return (
    <>
      <h2 className="mt-2">
        {titleFields.map((f, i) => (
          <span key={f.name}>
            {i > 0 ? <span className="mx-1 text-primary"> | </span> : ""}
            {highlightElasticTags(String(article[f.name] || "NA"))}
          </span>
        ))}
      </h2>
      {textFields.map((f) => {
        if (!article[f.name]) return null;

        return (
          <TextField
            key={article.id + "_" + f.name}
            article={article}
            field={f}
            metareader={metareader}
            label={textFields.length > 1}
          />
        );
      })}
    </>
  );
};

interface TextFieldProps {
  article: AmcatArticle;
  field: AmcatField;
  metareader: boolean;
  label?: boolean;
}

function TextField({ article, field, label, metareader }: TextFieldProps) {
  const content: ReactElement[] = [];
  const [maxLength, setMaxLength] = useState(1200);
  const paragraphs = String(article?.[field.name])?.split("\n") || [];
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
    if (!metareader || field.metareader.access === "read") return <div>{content}</div>;

    if (field.metareader.access === "none")
      return (
        <div className="text-secondary">
          METAREADER limitation: cannot view the <b>{field.name}</b>
        </div>
      );

    if (field.metareader.access === "snippet") {
      return (
        <div>
          <div>
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
    <div key={field.name} className="pb-1">
      {!label ? null : <div className="mb-2 border-b border-foreground/30 pr-1 text-foreground/60">{field.name}</div>}
      {renderContent()}
    </div>
  );
}

function highlightableValue(value: string) {
  return value.includes("<em>") ? highlightElasticTags(value) : value;
}
