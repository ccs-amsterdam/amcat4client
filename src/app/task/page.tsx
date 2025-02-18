"use client";

import { useTaskStatus } from "@/api/task";
import { Loading } from "@/components/ui/loading";
import { useMiddlecat } from "middlecat-react";
import { useSearchParams } from "next/navigation";

export default function Task() {
  //TODO: Make progress report nicer, maybe add progress bar?
  const params = useSearchParams();
  const taskId = params?.get("taskId");
  const { user } = useMiddlecat();
  const { data } = useTaskStatus(user, taskId);
  console.log({ user, data, taskId });
  if (user == null || data == null) return <Loading />;
  if (taskId == null) return <div className="bg-warn">Please provide taskId in URL</div>;
  console.log(data);
  return (
    <div className="flex h-full w-full flex-auto flex-col pt-6 md:pt-6">
      <div className="flex justify-center">
        <div className="flex w-full max-w-[1000px] flex-col px-5 py-5 sm:px-10">
          <h1>Task status: {data["completed"] ? "Done" : "In progress"}</h1>
          <p>Task description: {data["task"]["description"]}</p>
          <pre className="mt-2 border p-1 text-xs">
            Raw task output:{"\n\n"}
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
