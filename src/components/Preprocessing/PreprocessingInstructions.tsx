import { usePreprocessingInstructionDetails, usePreprocessingInstructions } from "@/api/preprocessing";
import { Loading } from "../ui/loading";
import { AmcatIndexId, PreprocessingInstruction, PreprocessingInstructionStatus } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { Fragment } from "react";

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
                  <Fragment key={arg.name}>
                    <div>{arg.name}</div>
                    <div>{arg.value || arg.field}</div>
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="mt-3">
              Output:
              <div className="ml-6 grid grid-cols-[max-content,1fr] gap-x-6">
                {i.outputs.map((output) => (
                  <Fragment key={output.name}>
                    <div> {output.name}</div>
                    <div>{output.field}</div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div className="mt-3">
              Status: <PreprocessingStatus user={user} indexId={indexId} instruction={i} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PreprocessingDetailsProps extends Props {
  instruction: PreprocessingInstruction;
  user: MiddlecatUser;
}
export function PreprocessingStatus({ indexId, instruction, user }: PreprocessingDetailsProps) {
  const { isLoading, data } = usePreprocessingInstructionDetails(user, indexId, instruction.field);
  if (isLoading) return <span>...</span>;
  if (data == null) return null;
  return (
    <div className="ml-6 grid grid-cols-[max-content,1fr] gap-x-6">
      <div>Preprocessor status</div>
      <div>{data.status}</div>
      <div>Total documents</div>
      <div>{data.counts.total}</div>
      <div>Done</div>
      <div>{data.counts.done || 0}</div>
      <div>Errors</div>
      <div>{data.counts.error || 0}</div>
      <div>Todo</div>
      <div>{data.counts.total - (data.counts.done || 0) - (data.counts.error || 0)}</div>
    </div>
  );
}
