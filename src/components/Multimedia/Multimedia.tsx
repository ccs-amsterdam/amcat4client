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
    recursive: true,
  });
  if (loadingMultimediaList) {
    return <Loading />;
  }

  return (
    <div className="prose flex max-w-none flex-wrap-reverse dark:prose-invert">
      <div className="flex w-full max-w-none  flex-col gap-3 p-3 xl:max-w-[60%]">
        <h3 className="mt-0">Multimedia list</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {multimediaList?.map((item) => (
            <div key={item.key} className=" relative m-0 flex flex-col gap-2 rounded">
              <img
                className="m-0 aspect-auto  rounded"
                src={
                  item.is_dir
                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Antu_folder-yellow.svg/64px-Antu_folder-yellow.svg.png?20160706104318"
                    : item.presigned_get
                }
              />
              <div className="te2902 absolute bottom-0 w-full overflow-hidden text-ellipsis whitespace-nowrap rounded rounded-b bg-black/50 p-2 text-sm text-primary-foreground">
                <span title={item.key} className="rounded" style={{ textShadow: "0 0 10px black" }}>
                  {item.key}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-1/2  xl:w-[40%]">
        <div className="flex min-h-[20rem] flex-col gap-3 p-3 ">
          <h3 className="mt-0">Upload multimedia</h3>
          <MultimediaUpload indexId={indexId} user={user} />
        </div>
      </div>
    </div>
  );
}
