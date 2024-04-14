import { useMultimediaPresignedGet } from "@/api/multimedia";
import { MultimediaListItem } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { Loading } from "../ui/loading";

export default function RenderMultimedia({
  user,
  indexId,
  item,
}: {
  user: MiddlecatUser;
  indexId: string;
  item: MultimediaListItem;
}) {
  const { data: presigned, isLoading } = useMultimediaPresignedGet(user, indexId, item.key);
  if (isLoading) return <Loading />;
  const type = presigned?.content_type?.join(" ") || "";
  function render() {
    if (!presigned) return null;
    if (/video/.test(type)) return <RenderVideo item={item} url={presigned.url} />;
    if (/image/.test(type)) return <RenderImage item={item} url={presigned.url} />;
    return null;
  }
  console.log(presigned);

  return (
    <div key={item.key} className="relative m-0 flex h-44 flex-col gap-2 rounded">
      {render()}
      <div className="absolute top-0 w-full  overflow-hidden text-ellipsis whitespace-nowrap rounded-t bg-black/20  p-2 py-1 font-mono text-sm font-bold text-white">
        <span title={item.key} className="rounded" style={{ textShadow: "0 0 5px black" }}>
          {item.key}
        </span>
      </div>
    </div>
  );
}

function RenderImage({ item, url }: { item: MultimediaListItem; url: string }) {
  return <img className="relative m-0 aspect-auto max-h-44 rounded object-cover hover:object-contain" src={url} />;
}

function RenderVideo({ item, url }: { item: MultimediaListItem; url: string }) {
  return (
    <video className="relative m-0 aspect-auto max-h-44 rounded object-cover hover:object-contain" src={url} controls />
  );
}
