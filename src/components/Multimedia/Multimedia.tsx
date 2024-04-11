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
      <div className="flex flex-wrap gap-4">
        {multimediaList?.map((item) => (
          <div key={item.key} className="flex flex-col gap-2">
            <img
              className="max-w-8 max-h-8"
              src={
                item.is_dir
                  ? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Antu_folder-yellow.svg/64px-Antu_folder-yellow.svg.png?20160706104318"
                  : item.presigned_get
              }
            />
            <div>{item.key}</div>
          </div>
        ))}
      </div>
      <MultimediaUpload indexId={indexId} user={user} />
    </div>
  );
}
