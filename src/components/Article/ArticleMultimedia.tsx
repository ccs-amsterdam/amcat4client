import { AmcatArticle, AmcatField, AmcatIndexId, MultimediaType } from "@/interfaces";
import RenderMultimedia from "../Multimedia/RenderMultimedia";
import { MiddlecatUser } from "middlecat-react";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
  article: AmcatArticle;
  fields: AmcatField[];
}

export default function ArticleMultimedia({ user, indexId, article, fields }: Props) {
  const multimediaFields = fields.filter((f) => f.type === "image" || f.type === "video" || f.type === "audio");
  if (multimediaFields.length === 0) return null;

  const multimediaByType: Record<string, AmcatField[]> = { Images: [], Videos: [], Audio: [] };
  for (const field of multimediaFields) {
    if (field.type === "image") multimediaByType.Images.push(field);
    if (field.type === "video") multimediaByType.Videos.push(field);
    if (field.type === "audio") multimediaByType.Audio.push(field);
  }

  return (
    <div className="flex flex-col gap-2">
      {Object.keys(multimediaByType).map((typeGroup) => {
        const fields = multimediaByType[typeGroup];
        if (fields.length === 0) return null;
        return (
          <div>
            <h4>{typeGroup}</h4>
            {fields.map((field) => {
              if (!article[field.name]) return null;
              const type = field.type as MultimediaType;
              return <RenderMultimedia user={user} indexId={indexId} url={article[field.name]} renderAs={type} />;
            })}
          </div>
        );
      })}
    </div>
  );
}
