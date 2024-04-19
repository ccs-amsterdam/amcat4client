import { AmcatArticle, AmcatField } from "@/interfaces";
import { Badge } from "../ui/badge";
import { formatField } from "@/lib/formatField";

interface MetaProps {
  article: AmcatArticle;
  fields: AmcatField[];
  setArticle?: (id: string) => void;
  metareader?: boolean;
}

export default function Meta({ article, fields, setArticle, metareader }: MetaProps) {
  const metaFields = fields.filter((f) => f.type !== "text" && f.client_settings.inDocument);
  if (metaFields.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field) => {
        if (["text", "image", "video", "preprocess"].includes(field.type)) return null;

        const noAccessMessage =
          metareader && field.metareader.access !== "read" ? (
            <span className="text-secondary">Not visible for METAREADER</span>
          ) : null;

        if (!article[field.name] && !noAccessMessage) return null;

        let value = article[field.name];
        if (Array.isArray(value)) value = value.join(", ");
        value = String(value);

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
                  <span className="">{noAccessMessage || formatField(article, field, setArticle)}</span>
                </div>
              }
            >
              {field.name}
            </Badge>
            <span className="line-clamp-3 overflow-hidden text-ellipsis">
              {noAccessMessage || formatField(article, field, setArticle) || <span className="text-primary">NA</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}
