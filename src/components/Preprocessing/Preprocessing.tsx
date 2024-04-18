import { AmcatIndexId } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import PreprocessingTasks from "./PreprocessingTasks";
import PreprocessingInstructions from "./PreprocessingInstructions";

interface Props {
  indexId: AmcatIndexId;
  user: MiddlecatUser;
}

export default function Preprocessing({ indexId, user }: Props) {
  return (
    <div className="grid grid-cols-1 p-3 lg:grid-cols-2">
      <PreprocessingTasks indexId={indexId} user={user} />
      <PreprocessingInstructions indexId={indexId} user={user} />
    </div>
  );
}
