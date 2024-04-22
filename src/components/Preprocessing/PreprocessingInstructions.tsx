import {
  usePreprocessingInstructionDetails,
  usePreprocessingInstructions,
  usePreprocessingTasks,
} from "@/api/preprocessing";
import { Loading } from "../ui/loading";
import { AmcatIndexId, PreprocessingInstruction, PreprocessingTask } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { Fragment, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";

interface Props {
  indexId: AmcatIndexId;
  user: MiddlecatUser;
}

export default function PreprocessingInstructions({ indexId, user }: Props) {
  const { data: instructions, isLoading } = usePreprocessingInstructions(user, indexId);
  const { data: tasks, isLoading: isTasksLoading } = usePreprocessingTasks(user);
  const [activeInstruction, setActiveInstruction] = useState<PreprocessingInstruction | undefined>(undefined);
  if (isLoading || isTasksLoading) return <Loading />;
  if (!instructions || !tasks) return null;
  const tasknames = instructions.map((i) => i.task);
  return (
    <div className="prose dark:prose-invert">
      <PreprocessingDetailsDialog
        user={user}
        indexId={indexId}
        instruction={activeInstruction}
        onClose={() => setActiveInstruction(undefined)}
      />
      <h3 className="text-lg font-bold">Active preprocessors</h3>
      <div className="flex flex-col gap-3 py-3">
        {tasks
          .filter((t) => tasknames.includes(t.name))
          .map((t) => (
            <div key={t.name}>
              <h3 className="mb-0 mt-2">{t.name}</h3>
              {instructions
                .filter((i) => i.task === t.name)
                .map((i) => (
                  <div
                    key={i.field}
                    className="flex flex-col gap-1 rounded border p-3"
                    onClick={() => setActiveInstruction(i)}
                  >
                    <div className="font-semibold text-primary">
                      {i.outputs.map((f) => f.field).join(", ")} &larr; {i.field}(
                      {i.arguments
                        .filter((f) => f.field)
                        .map((f) => f.field)
                        .join(", ")}
                      )
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
}

interface PreprocessingDetailsProps extends Props {
  instruction: PreprocessingInstruction;
}

interface PreprocessingDetailsDialogProps extends Props {
  onClose: () => void;
  instruction?: PreprocessingInstruction;
}
function PreprocessingDetailsDialog({ onClose, indexId, instruction, user }: PreprocessingDetailsDialogProps) {
  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };
  return (
    <Dialog open={instruction != null} onOpenChange={onOpenChange}>
      <DialogContent>
        {instruction == null ? null : <PreprocessingDetails indexId={indexId} instruction={instruction} user={user} />}
      </DialogContent>
    </Dialog>
  );
}

function PreprocessingDetails({ indexId, instruction, user }: PreprocessingDetailsProps) {
  const { isLoading, data } = usePreprocessingInstructionDetails(user, indexId, instruction.field);
  if (isLoading) return <Loading />;
  if (data == null) return null;

  return (
    <>
      <h3 className="mb-0 mt-2 font-semibold text-primary">
        {instruction.field}: {instruction.task}
      </h3>
      <div className="mt-3">
        <h3 className="my-0">Arguments:</h3>
        <div className="ml-6 grid grid-cols-[12rem,1fr] gap-x-6">
          <span>Endpoint</span>
          <span title={instruction.endpoint} className="overflow-hidden text-ellipsis whitespace-nowrap">
            {instruction.endpoint}
          </span>
          {instruction.arguments.map((arg) => {
            const value =
              arg.value == null ? arg.field : Array.isArray(arg.value) ? arg.value.join(", ") : String(arg.value);
            return (
              <Fragment key={arg.name}>
                <span title={arg.name} className="overflow-hidden text-ellipsis whitespace-nowrap ">
                  {arg.name}
                </span>
                <span title={value || ""} className="overflow-hidden text-ellipsis whitespace-nowrap ">
                  {value}
                </span>
              </Fragment>
            );
          })}
        </div>
      </div>
      <div className="mt-3">
        <h3 className="my-0">Output:</h3>
        <div className="ml-6 grid grid-cols-[12rem,1fr] gap-x-6">
          {instruction.outputs.map((output) => (
            <Fragment key={output.name}>
              <span title={output.name} className="overflow-hidden text-ellipsis whitespace-nowrap ">
                {output.name}
              </span>
              <div>{output.field}</div>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="mt-3">
        <h3 className="my-0">Status: </h3>
        <div className="ml-6 grid grid-cols-[12rem,1fr] gap-x-6">
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
      </div>
    </>
  );
}
