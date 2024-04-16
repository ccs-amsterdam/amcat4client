import { AmcatIndexId, PreprocessingInstruction, PreprocessingTask } from "@/interfaces";
import { MiddlecatUser } from "middlecat-react";
import { usePreprocessingTasks } from "@/api/preprocessing";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Loading } from "../ui/loading";
import { Input } from "../ui/input";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import { z } from "zod";
import { useFields } from "@/api/fields";
import {
  amcatPreprocessingInstruction,
  amcatPreprocessingInstructionArgument,
  amcatPreprocessingInstructionArgumentValue,
} from "@/schemas";

interface Props {
  indexId: AmcatIndexId;
  user: MiddlecatUser;
}

export default function PreprocessingTasks({ indexId, user }: Props) {
  const { data: tasks, isLoading: isLoadingTasks } = usePreprocessingTasks(user);
  const { data: fields, isLoading: isLoadingFields } = useFields(user, indexId);

  if (isLoadingTasks || isLoadingFields) return <Loading />;
  if (!tasks) return <div>Could not load tasks</div>;

  return (
    <div className="max-w-lg">
      <h3 className="text-lg font-bold">Available tasks</h3>
      <Accordion type="single" collapsible>
        {tasks.map((task) => (
          <AccordionItem value={task.name} key={task.name}>
            <AccordionTrigger>{task.name}</AccordionTrigger>
            <AccordionContent>
              <TaskForm key={task.name} task={task} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

type ArgumentValue = z.infer<typeof amcatPreprocessingInstructionArgumentValue>;

function TaskForm({ task }: { task: PreprocessingTask }) {
  const [instruction, setInstruction] = useState(() => createInstructionTemplate(task));
  useEffect(() => setInstruction(createInstructionTemplate(task)), [task]);

  function keyHandler(key: keyof PreprocessingInstruction) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setInstruction({ ...instruction, [key]: e.target.value });
  }

  function argValueHandler(name: string) {
    return (value: ArgumentValue) => {
      const args = [...instruction.arguments];
      const index = args.findIndex((arg) => arg.name === name);
      args[index].value = value;
      setInstruction({ ...instruction, arguments: args });
    };
  }

  function outputFieldHandler(name: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const outputs = [...instruction.outputs];
      const index = outputs.findIndex((output) => output.name === name);
      outputs[index].field = e.target.value;
      setInstruction({ ...instruction, outputs });
    };
  }

  const labelStyle = "font-bold leading-8";

  return (
    <form className="flex flex-col gap-3 rounded bg-primary/30 p-3">
      <div>
        <label className={labelStyle} htmlFor="endpoint">
          API Endpoint
        </label>
        <Input id="endpoint" value={instruction.endpoint} onChange={keyHandler("endpoint")} />
      </div>
      <div>
        <label className={labelStyle} htmlFor="field">
          Preprocessor status field
        </label>
        <Input id="field" value={instruction.field} onChange={keyHandler("field")} />
      </div>
      <div>
        <label className={labelStyle} htmlFor="Arguments">
          Arguments
        </label>
        <div className="flex flex-col gap-2 rounded  pl-6">
          {instruction.arguments.map((arg) => (
            <div key={arg.name}>
              <label className={labelStyle} htmlFor={arg.name}>
                {arg.name}
              </label>
              <ArrayableInput value={arg.value} onChange={argValueHandler(arg.name)} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className={labelStyle} htmlFor="Outputs">
          Outputs
        </label>
        <div className="flex flex-col gap-2 rounded  pl-6">
          {instruction.outputs.map((output) => (
            <div key={output.name}>
              <label className={labelStyle} htmlFor={output.name}>
                {output.name}
              </label>
              <Input id={output.name} value={output.field} onChange={outputFieldHandler(output.name)} />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}

function ArrayableInput({ value, onChange }: { value: ArgumentValue; onChange: (value: ArgumentValue) => void }) {
  const [values, setValues] = useState(() => (Array.isArray(value) ? [...value, undefined] : [value]));
  useEffect(() => setValues(Array.isArray(value) ? [...value, undefined] : [value]), [value]);

  const isArray = Array.isArray(value);
  const type = isArray ? typeof value[0] : typeof value;

  function onChangeValue(newValue: string, index: number) {
    const newValues = [...values];
    newValues[index] = newValue;
    const v = newValues
      .map((v) => {
        if (v === "") return undefined;
        if (type === "number") return Number(v);
        if (type === "boolean") return Boolean(v);
        return v;
      })
      .filter((v) => v !== undefined);
    // had to resort to type coercion, because typescript is driving me mad
    onChange(isArray ? (v as ArgumentValue) : v[0] || value);
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {values.map((v, i) => {
        if (type === "boolean")
          return <Input key={i} value={String(v)} type="checkbox" onChange={(e) => onChangeValue(e.target.value, i)} />;
        if (type === "number")
          return <Input key={i} value={String(v)} type="number" onChange={(e) => onChangeValue(e.target.value, i)} />;
        return (
          <Input
            key={i}
            value={String(v ?? "")}
            type={typeof values[0]}
            onChange={(e) => onChangeValue(e.target.value, i)}
          />
        );
      })}
    </div>
  );
}

function createInstructionTemplate(task: PreprocessingTask): PreprocessingInstruction {
  const args = task.parameters.map((param) => {
    const arg: any = { name: param.name };

    if (/string/.test(param.type)) {
      arg.value = param.default ?? "";
    } else if (/number/.test(param.type)) {
      arg.value = param.default ?? undefined;
    } else if (/boolean/.test(param.type)) {
      arg.value = param.default ?? false;
    }
    if (/\[\]/.test(param.type)) {
      arg.value = [arg.value];
    }

    if (param.use_field) arg.field = "";

    return arg;
  });

  const outputs = task.outputs.map((output) => {
    return { name: output.name, field: "" };
  });

  const template: PreprocessingInstruction = {
    field: "",
    task: task.name,
    endpoint: task.endpoint.placeholder ?? "",
    arguments: args,
    outputs,
  };

  return amcatPreprocessingInstruction.parse(template);
}
