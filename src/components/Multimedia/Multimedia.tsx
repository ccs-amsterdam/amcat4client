import { useMultimediaList, useMultimediaPresignedPost } from "@/api/multimedia";
import { MiddlecatUser } from "middlecat-react";
import { Loading } from "../ui/loading";
import MultimediaUpload from "./MultimediaUpload";

interface Props {
  indexId: string;
  user: MiddlecatUser;
}

export default function Multimedia({ indexId, user }: Props) {
  const { data: multimediaList, isLoading: loadingMultimediaList } = useMultimediaList(user, indexId);
  if (loadingMultimediaList) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-wrap gap-4">
        {multimediaList?.map((item) => (
          <div key={item.id} className="flex flex-col gap-2">
            <img src={item.url} alt={item.filename} />
            <div>{item.filename}</div>
          </div>
        ))}
      </div>
      <MultimediaUpload indexId={indexId} user={user} />
    </div>
  );
}
