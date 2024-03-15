import { AmcatIndexId } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";

interface Props {
  user: MiddlecatUser;
  indexId: AmcatIndexId;
}

export default function ({ user, indexId }: Props) {
  return (
    <div>
      <h1>Upload</h1>
    </div>
  );
}
