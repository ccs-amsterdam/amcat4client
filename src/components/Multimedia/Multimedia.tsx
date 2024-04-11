import { useMultimediaList, useMultimediaPresignedPost } from "@/api/multimedia";
import { MiddlecatUser } from "middlecat-react";
import { Loading } from "../ui/loading";
import MultimediaUpload from "./MultimediaUpload";

interface Props {
  indexId: string;
  user: MiddlecatUser;
}

export default function Multimedia({ indexId, user }: Props) {
  const { data: multimediaList, isLoading: loadingMultimediaList } = useMultimediaList(user, indexId, {
    presigned_get: true,
    metadata: true,
  });
  if (loadingMultimediaList) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="prose flex flex-col gap-3 p-3 dark:prose-invert">
        <h3 className="">Multimedia list</h3>
        <div className="flex flex-col gap-3">
          {multimediaList?.map((item) => (
            <div key={item.key} className=" relative m-0 flex flex-col gap-2 rounded">
              <img
                className="m-0 aspect-auto max-w-full rounded"
                src={
                  item.is_dir
                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Antu_folder-yellow.svg/64px-Antu_folder-yellow.svg.png?20160706104318"
                    : item.presigned_get
                }
              />
              <div className="te2902 absolute bottom-0 w-full overflow-hidden text-ellipsis whitespace-nowrap rounded rounded-b bg-black/40 p-2 text-primary-foreground">
                <span title={item.key} className="bg-black/202 rounded">
                  {item.key}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MultimediaUpload indexId={indexId} user={user} />
    </div>
  );
}
