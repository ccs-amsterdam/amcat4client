import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Grid, Icon, Label, Popup, Table } from "semantic-ui-react";
import { addFilter, postQuery, useFields } from "../../Amcat";
import {
  AmcatUser,
  AmcatDocument,
  AmcatField,
  AmcatIndexName,
  AmcatQuery,
} from "../../interfaces";
import prepareArticle from "./prepareArticle";

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
  const fields = useFields(user, index);
  const [article, setArticle] = useState<AmcatDocument | null>(null);

  useEffect(() => {
    if (!id) return;
    if (article && id === article._id) return;
    fetchArticle(user, index, id, query, setArticle);
  }, [id, article, index, query]);

  if (!article || !fields) return null;

  return (
    <Grid stackable>
      <Grid.Column width={6}>
        <Meta
          article={article}
          fields={fields}
          setArticle={changeArticle}
          link={link}
        />
      </Grid.Column>
      <Grid.Column width={10}>
        <Body article={article} fields={fields} />
      </Grid.Column>
    </Grid>
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
}

// now static, but designed so that we can make it dynamic later
const fieldLayout = {
  title: { fontSize: "1.4em", fontWeight: "bold" },
  text: { textAlign: "justify" },
  default: {},
};

const Body = ({ article, fields }: BodyProps) => {
  article = useMemo(() => prepareArticle(article), [article]);

  // Add title, all other 'text' fields, and finally text
  const texts = [
    <TextField key={-1} article={article} field="title" layout={fieldLayout} />,
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
    />
  );
  return <>{texts}</>;
};

interface TextFieldProps {
  article: AmcatDocument;
  field: string;
  layout: any;
  label?: boolean;
}

function TextField({ article, field, layout, label }: TextFieldProps) {
  const paragraphs = Array.isArray(article[field])
    ? article[field]
    : [article[field]];

  const fieldLayout = layout[field] || layout.default;
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
      {paragraphs.map((p: any, i: number) => (
        <span key={`${field}_${i}`} style={fieldLayout}>
          {p}
        </span>
      ))}
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
        <Table.Row key={field.name}>
          <Table.Cell width={1}>
            <b>{field.name}</b>
          </Table.Cell>
          <Table.Cell>{value}</Table.Cell>
        </Table.Row>
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
    <Table
      basic="very"
      compact
      style={{
        lineHeight: "0.9",
        padding: "10px",
        paddingLeft: "10px",
        color: "black",
      }}
    >
      <Table.Body>
        {link == null ? null : (
          <Table.Row key={-1}>
            <Table.Cell width={1}>
              <b>AmCAT ID</b>
            </Table.Cell>
            <Table.Cell>
              <Popup
                inverted
                trigger={
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
                }
                content="Link copied to clipboard!"
                on="click"
              />
            </Table.Cell>
          </Table.Row>
        )}
        {rows()}
      </Table.Body>
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
      if (setArticle)
        return <Icon link name="linkify" onClick={() => setArticle(value)} />;
    case "url":
      return <a href={value}>{value}</a>;
    case "tag":
      if (Array.isArray(value)) return value.map((v) => <Label>{v}</Label>);
      else return value ? <Label>{value}</Label> : null;
    case "long":
    case "double":
      return <i>{value}</i>;
    default:
      if (typeof value === "string") return value;
      return JSON.stringify(value);
  }
};
