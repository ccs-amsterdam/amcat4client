import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

import { addFilter, postQuery } from "@/amcat/api";
import { useFields } from "@/amcat/api/fields";
import {
  AmcatUser,
  AmcatDocument,
  AmcatField,
  AmcatIndexName,
  AmcatQuery,
} from "@/amcat/interfaces";
import prepareArticle from "./prepareArticle";
import { useMyIndexrole } from "@/amcat/api/indexDetails";
import { Link } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";

export interface ArticleProps {
  user: AmcatUser;
  index: AmcatIndexName;
  /** An article id. Can also be an array of length 1 with the article id, which can trigger setOpen if the id didn't change */
  id: string;
  /** A query, used for highlighting */
  query: AmcatQuery;
  changeArticle?: (id: string | null) => void;
  link?: string;
}

export default React.memo(Article);
function Article({
  user,
  index,
  id,
  query,
  changeArticle,
  link,
}: ArticleProps) {
  const { data: fields } = useFields(user, index);
  const [article, setArticle] = useState<AmcatDocument | null>(null);
  const myrole = useMyIndexrole(user, index);

  useEffect(() => {
    if (!id) return;
    if (article && id === article._id) return;
    fetchArticle(user, index, id, query, setArticle);
  }, [id, article, index, query]);

  if (!article || !fields) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[0.6fr,1fr] prose-lg gap-6">
      <div>
        <Meta
          article={article}
          fields={fields}
          setArticle={changeArticle}
          link={link}
        />
      </div>
      <div>
        <Body
          article={article}
          fields={fields}
          canviewtext={myrole !== "METAREADER"}
        />
      </div>
    </div>
  );
}

function fetchArticle(
  user: AmcatUser,
  index: AmcatIndexName,
  _id: string,
  query: AmcatQuery,
  setArticle: Dispatch<SetStateAction<AmcatDocument | null>>
) {
  let params: any = { annotations: true };
  query = addFilter(query, { _id: { values: [_id] } });
  postQuery(user, index, query, params)
    .then((data) => {
      setArticle(data.data.results[0]);
    })
    .catch((error) => {
      console.log(error);
      setArticle(null);
    });
}

interface BodyProps {
  article: AmcatDocument;
  fields: AmcatField[];
  canviewtext: boolean;
}

// now static, but designed so that we can make it dynamic later
const fieldLayout = {
  title: { fontSize: "1.4em", fontWeight: "bold" },
  text: { textAlign: "justify" },
  default: {},
};

const Body = ({ article, fields, canviewtext }: BodyProps) => {
  article = useMemo(() => prepareArticle(article), [article]);

  // Add title, all other 'text' fields, and finally text
  const texts = [
    <TextField
      key={-1}
      article={article}
      field="title"
      layout={fieldLayout}
      canviewtext={true}
    />,
  ];
  fields
    .filter(
      (f) =>
        f.type === "text" &&
        !["title", "text"].includes(f.name) &&
        article[f.name]
    )
    .forEach((f, i) => {
      texts.push(
        <TextField
          key={i}
          article={article}
          field={f.name}
          layout={fieldLayout}
          canviewtext={canviewtext}
          label={true}
        />
      );
    });

  texts.push(
    <TextField
      key={-2}
      article={article}
      field="text"
      layout={fieldLayout}
      label={texts.length > 1}
      canviewtext={canviewtext}
    />
  );
  return <>{texts}</>;
};

interface TextFieldProps {
  article: AmcatDocument;
  field: string;
  layout: any;
  canviewtext: boolean;
  label?: boolean;
}

function TextField({
  article,
  field,
  layout,
  label,
  canviewtext,
}: TextFieldProps) {
  const paragraphs = Array.isArray(article[field])
    ? article[field]
    : [article[field]];

  const fieldLayout = layout[field] || layout.default;

  const content = paragraphs.map((p: any, i: number) => (
    <span key={`${field}_${i}`} style={fieldLayout}>
      {p}
    </span>
  ));

  return (
    <div key={field} style={{ paddingBottom: "1em" }}>
      {!label ? null : (
        <span
          key={field + "_label"}
          style={{
            color: "grey",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {field}
        </span>
      )}
      {canviewtext ? (
        content
      ) : (
        <div className="text-orange-700 border-2 border-orange-700 rounded-md p-2">
          Text fields cannot be displayed because you have insufficient access
          to this index. Please contact the index admin to request access.
        </div>
      )}
    </div>
  );
}

interface MetaProps {
  article: AmcatDocument;
  fields: AmcatField[];
  setArticle?: (id: string) => void;
  link?: string;
}

const Meta = ({ article, fields, setArticle, link }: MetaProps) => {
  const metaFields = fields.filter(
    (f) =>
      f.type !== "text" &&
      !["title", "text"].includes(f.name) &&
      f.meta?.amcat4_display_meta !== "0"
  );
  const rows = () => {
    return metaFields.map((field) => {
      const value = formatMetaValue(article, field, setArticle);
      if (value == null) return null;
      return (
        <TableRow key={field.name}>
          <TableCell>
            <b>{field.name}</b>
          </TableCell>
          <TableCell>{value}</TableCell>
        </TableRow>
      );
    });
  };

  if (metaFields.length === 0) return null;

  const abbreviate = function (text: string | number) {
    const t = text.toString();
    if (t.length > 10)
      return `${t.substring(0, 4)}...${t.substring(t.length - 4)}`;
    return t;
  };

  return (
    <Table>
      <TableBody>
        {link == null ? null : (
          <TableRow key={-1}>
            <TableCell width={1}>
              <b>AmCAT ID</b>
            </TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger>
                  <a
                    href={link}
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(link);
                      return false;
                    }}
                  >
                    {abbreviate(article._id)}
                  </a>
                </PopoverTrigger>
                <PopoverContent>
                  content="Link copied to clipboard!" on="click"
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        )}
        {rows()}
      </TableBody>
    </Table>
  );
};

/**
 * Format a meta field for presentation
 * @param {*} article
 * @param {*} field
 * @returns
 */
export const formatMetaValue = (
  article: AmcatDocument,
  field: AmcatField,
  setArticle?: (id: string) => void
) => {
  const value = article[field.name];
  if (value == null) return null;
  switch (field.type) {
    case "date":
      // Only remove 'T' for now. But not sure why that's a great idea
      return value.replace("T", " ").substring(0, 19);
    case "id":
      if (setArticle) return <Link onClick={() => setArticle(value)} />;
    case "url":
      return <a href={value}>{value}</a>;
    case "tag":
      if (Array.isArray(value)) return value.map((v) => <span>{v}</span>);
      else return value ? <span>{value}</span> : null;
    case "long":
    case "double":
      return <i>{value}</i>;
    default:
      if (typeof value === "string") return value;
      return JSON.stringify(value);
  }
};
