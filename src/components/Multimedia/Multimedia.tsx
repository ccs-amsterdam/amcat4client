import { useMultimediaFullList, useMultimediaList, useMultimediaPresignedPost } from "@/api/multimedia";
import { MiddlecatUser } from "middlecat-react";
import { Loading } from "../ui/loading";
import MultimediaUpload from "./MultimediaUpload";
import { MultimediaListItem } from "@/interfaces";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  indexId: string;
  user: MiddlecatUser;
}

// WORK IN PROGRESS
// The idea is to enable browing through the bucket like a file system.
// - We can remove the regular useMultimediaList and just get the presigned get links
//   for paginated items from multimediaFullList. (main reason being that in the page from
//   multimediaList some of the 6 items can be directories, which we don't want to show)
// - The DirectoryBrowser is just a quick draw-up. Maybe use Chadcns breadcrump component

export default function Multimedia({ indexId, user }: Props) {
  const [prefix, setPrefix] = useState<string>("");
  console.log(prefix);
  const { data: multimediaFullList, isLoading: loadingMultimediaFullList } = useMultimediaFullList(
    user,
    indexId,
    prefix,
  );
  const { data: multimediaList, isLoading: loadingMultimediaList } = useMultimediaList(user, indexId, {
    n: 6,
    presigned_get: true,
    metadata: true,
    recursive: false,
    prefix,
  });

  const directories = useMemo(() => {
    if (!multimediaFullList) return [];
    return multimediaFullList.filter((item) => item.is_dir);
  }, [multimediaFullList]);

  const canGoBack = prefix.split("/").length > 1;
  function goBack() {
    setPrefix(prefix.split("/").slice(0, -1).join("/"));
  }
  const fileCount = multimediaFullList?.filter((item) => !item.is_dir).length;
  const showItems = multimediaList?.filter((item) => !item.is_dir);

  return (
    <div className="prose flex max-w-none flex-wrap-reverse dark:prose-invert">
      <div className="flex w-full max-w-none  flex-col gap-3 p-3 xl:max-w-[60%]">
        <h3 className="mt-0">Multimedia list</h3>
        {loadingMultimediaFullList ? <Loading /> : null}
        <div className="min-h-[8rem]">
          <DirectoryBrowser
            indexId={indexId}
            prefix={prefix}
            setPrefix={setPrefix}
            multimediaFullList={multimediaFullList}
          />
        </div>
        <div className="text-sm text-gray-500">{fileCount} items</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {loadingMultimediaList ? <Loading /> : null}
          {showItems?.map((item) => (
            <div key={item.key} className=" relative m-0 flex flex-col gap-2 rounded">
              <RenderMultimedia key={item.key} item={item} />
              <div className="absolute top-0 w-full  overflow-hidden text-ellipsis whitespace-nowrap rounded-t bg-black/20  p-2 py-1 font-mono text-sm font-bold text-white">
                <span title={item.key} className="rounded" style={{ textShadow: "0 0 5px black" }}>
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

function DirectoryBrowser({
  indexId,
  prefix,
  setPrefix,
  multimediaFullList,
}: {
  indexId: string;
  prefix: string;
  setPrefix: (prefix: string) => void;
  multimediaFullList?: MultimediaListItem[];
}) {
  const path = useMemo(() => {
    if (!prefix) return [];
    const split = prefix.split("/");
    return split.slice(0, split.length - 1);
  }, [indexId, prefix]);
  const directories = useMemo(() => {
    if (!multimediaFullList) return [];
    return multimediaFullList
      .filter((item) => item.is_dir)
      .map((item) => {
        // get second to last split of /, because this is the next path name
        const split = item.key.split("/");
        return split[split.length - 2];
      });
  }, [multimediaFullList]);

  function selectPath(i: number) {
    if (i === 0) return setPrefix("");
    setPrefix(path.slice(0, i).join("/"));
  }

  const breadcrumb = [indexId, ...path];

  return (
    <div>
      <div className="flex">
        {breadcrumb.map((dir, i) => (
          <Button
            key={dir}
            className="px-1"
            variant="ghost"
            onClick={() => selectPath(i)}
            disabled={i === breadcrumb.length - 1}
          >
            {i > 0 ? " / " : ""}
            {dir}
          </Button>
        ))}
      </div>
      <div>
        {directories.map((dir) => (
          <div key={dir} className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setPrefix(`${prefix}${dir}/`)}>
              {dir}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RenderMultimedia({ item }: { item: MultimediaListItem }) {
  const type = item.content_type.join(" ");
  if (/video/.test(type)) return <RenderVideo item={item} />;
  if (/image/.test(type)) return <RenderImage item={item} />;
  return null;
}

function RenderImage({ item }: { item: MultimediaListItem }) {
  return (
    <img
      className="relative m-0 aspect-auto max-h-44 rounded object-cover hover:object-contain"
      src={
        item.is_dir
          ? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Antu_folder-yellow.svg/64px-Antu_folder-yellow.svg.png?20160706104318"
          : item.presigned_get
      }
    />
  );
}

function RenderVideo({ item }: { item: MultimediaListItem }) {
  return (
    <video
      className="relative m-0 aspect-auto max-h-44 rounded object-cover hover:object-contain"
      src={item.presigned_get}
      controls
    />
  );
}
