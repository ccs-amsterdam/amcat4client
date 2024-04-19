import { usePreprocessingInstructions } from "@/api/preprocessing";
import { Loading } from "../ui/loading";
import { AmcatIndexId } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";

interface Props {
  indexId: AmcatIndexId;
  user: MiddlecatUser;
}

export default function PreprocessingInstructions({ indexId, user }: Props) {
  const { data: instructions, isLoading } = usePreprocessingInstructions(user, indexId);
  if (isLoading) return <Loading />;
  if (!instructions) return null;
  return (
    <div>
      <h3 className="text-lg font-bold">Active preprocessors</h3>
      <div className="flex flex-col gap-3 py-3">
        {instructions.map((i) => (
          <div key={i.field} className="flex flex-col gap-1 rounded border p-3">
            <div>{i.task}</div>
            <div>{i.field}</div>
            <div>{i.endpoint}</div>

            <div className="mt-3">
              Arguments:
              <div className="ml-6 grid grid-cols-[max-content,1fr] gap-x-6">
                {i.arguments.map((arg) => (
                  <>
                    <div>{arg.name}</div>
                    <div>{arg.value}</div>
                  </>
                ))}
              </div>
            </div>

            <div className="mt-3">
              Output:
              <div className="ml-6 grid grid-cols-[max-content,1fr] gap-x-6">
                {i.outputs.map((output) => (
                  <>
                    <div> {output.name}</div>
                    <div>{output.field}</div>
                  </>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
