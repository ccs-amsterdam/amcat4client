import React, { CSSProperties, ReactElement, useMemo } from "react";

import { useArticle } from "@/api/article";
import { useFields } from "@/api/fields";
import { useMyIndexrole } from "@/api/index";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AmcatArticle, AmcatField, AmcatIndexId, AmcatQuery } from "@/interfaces";
import { Link } from "lucide-react";
import { MiddlecatUser } from "middlecat-react";
import { highlightElasticTags } from "../Articles/highlightElasticTags";
import { Badge } from "../ui/badge";

export interface ArticleProps {
  user: MiddlecatUser;
  indexName: AmcatIndexId;
  /** An article id. Can also be an array of length 1 with the article id, which can trigger setOpen if the id didn't change */
  id: string;
  /** A query, used for highlighting */
  query: AmcatQuery;
  changeArticle?: (id: string | null) => void;
  link?: string;
}

export default React.memo(Article);
function Article({ user, indexName, id, query, changeArticle, link }: ArticleProps) {
  const { data: fields } = useFields(user, indexName);
  const documentFields = useMemo(() => fields?.filter((f) => f.client_display.in_document), [fields]);
  const indexRole = useMyIndexrole(user, indexName);
  const { data: article } = useArticle(user, indexName, id, query, { highlight: true }, indexRole);

  if (!article || !documentFields) return null;

  return (
    <div className="prose grid h-full max-w-none grid-cols-1 gap-8 dark:prose-invert lg:grid-cols-[0.6fr,1fr]">
      <div>
        <h2 className=" mt-0 text-primary">Meta data</h2>
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
  const textFields = fields.filter((f) => f.type === "text");
  const texts: ReactElement[] = [];

  // make sure title goes first
  const title = textFields.find((f) => f.name === "title");
  if (title)
    texts.push(
      <TextField
        key={"title"}
        article={article}
        field={title}
        layout={fieldLayout}
        metareader={metareader}
        label={false}
      />,
    );

  console.log(textFields);
  textFields
    .filter((f) => f.name !== "title")
    .forEach((f, i) => {
      texts.push(
        <TextField
          key={i}
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

  const paragraphs = article?.[field.name]?.split("\n") || [];

  for (let paragraph of paragraphs) {
    const text = paragraph.includes("<em>") ? highlightElasticTags(paragraph) : paragraph;
    content.push(
      <p className="mb-3 mt-0" key={paragraph}>
        {text}
      </p>,
    );
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

interface MetaProps {
  article: AmcatArticle;
  fields: AmcatField[];
  setArticle?: (id: string) => void;
  metareader?: boolean;
}

const Meta = ({ article, fields, setArticle, metareader }: MetaProps) => {
  const metaFields = fields.filter(
    (f) => f.type !== "text" && !["title", "text"].includes(f.name) && f.client_display.in_document,
  );

  if (metaFields.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field) => {
        if (field.type === "text") return null;

        const noAccessMessage =
          metareader && field.metareader.access !== "read" ? (
            <span className="text-secondary">Not visible for METAREADER</span>
          ) : null;
        return (
          <div key={field.name} className="grid grid-cols-[7rem,1fr] gap-3">
            <Badge
              tooltip={
                <div className="grid grid-cols-[auto,1fr] items-center gap-x-3">
                  <b>FIELD</b>
                  <span>{field.name}</span>
                  <b>TYPE</b>
                  <span className="">
                    {field.type === field.elastic_type ? field.type : `${field.type} (${field.elastic_type})`}
                  </span>

                  <b>VALUE</b>
                  <span className="">{noAccessMessage || article[field.name]}</span>
                </div>
              }
            >
              {field.name}
            </Badge>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {noAccessMessage || formatMetaValue(article, field, setArticle) || "EMPTY"}
            </span>
          </div>
        );
      })}
    </div>
  );

  // return (
  //   <Table className="mt-0 table-auto">
  //     <TableBody>
  //       {link == null ? null : (
  //         <TableRow key={-1}>
  //           <TableCell width={1}>
  //             <b>AmCAT ID</b>
  //           </TableCell>
  //           <TableCell>
  //             <Popover>
  //               <PopoverTrigger>
  //                 <a
  //                   href={link}
  //                   onClick={(e) => {
  //                     e.preventDefault();
  //                     navigator.clipboard.writeText(link);
  //                     return false;
  //                   }}
  //                 >
  //                   {abbreviate(article._id)}
  //                 </a>
  //               </PopoverTrigger>
  //               <PopoverContent>Link copied to clipboard!</PopoverContent>
  //             </Popover>
  //           </TableCell>
  //         </TableRow>
  //       )}
  //       {rows()}
  //     </TableBody>
  //   </Table>
  // );
};

/**
 * Format a meta field for presentation
 * @param {*} article
 * @param {*} field
 * @returns
 */
export const formatMetaValue = (article: AmcatArticle, field: AmcatField, setArticle?: (id: string) => void) => {
  const value = article[field.name];
  if (value == null) return null;
  switch (field.type) {
    case "date":
      // Only remove 'T' for now. But not sure why that's a great idea
      return value.replace("T", " ").substring(0, 19);

    case "keyword":
      if (field.name === "id" && setArticle) return <Link onClick={() => setArticle(value)} />;
      if (field.name === "url") return <a href={value}>{value}</a>;
      if (Array.isArray(value)) return value.map((v) => <span>{v}</span>);
      else return value ? <span>{value}</span> : null;
    case "number":
      return <i>{value}</i>;
    default:
      if (typeof value === "string") return value;
      return JSON.stringify(value);
  }
};
