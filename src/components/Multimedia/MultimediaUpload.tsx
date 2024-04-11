import { MiddlecatUser } from "middlecat-react";
import { Loading } from "../ui/loading";
import { useMultimediaPresignedPost, useMutateMultimedia } from "@/api/multimedia";
import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { ArrowLeft, ArrowRight, Dot } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { list } from "postcss";
import JSZip from "jszip";
import { Exo_2 } from "next/font/google";
import { z } from "zod";

interface Props {
  indexId: string;
  user: MiddlecatUser;
}

interface UploadQueue {
  uploading: boolean;
  files: FileWithPath[];
  progress: number;
}

// Explicitly require extension to match the mime type.
// For zipped files it seems (?) we don't get the mime types
// so there we use the extension to determine the mime type.
const extensionMapping: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
  tiff: "image/tiff",
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",
};

export default function MultimediaUpload({ indexId, user }: Props) {
  const [data, setData] = useState<FileWithPath[]>();
  const [uploadQueue, setUploadQueue] = useState<UploadQueue>({ uploading: false, files: [], progress: 0 });
  const { data: presignedPost, isLoading: loadingPresignedPost } = useMultimediaPresignedPost(user, indexId, !!data);
  const { mutateAsync } = useMutateMultimedia(user, indexId, presignedPost);

  useEffect(() => {
    if (!presignedPost || !data) return;
    if (!uploadQueue.uploading) return;
    if (uploadQueue.progress >= data.length) {
      setUploadQueue({ files: [], progress: 0, uploading: false });
      return;
    }
    mutateAsync(uploadQueue.files[uploadQueue.progress])
      .then(() => {
        setUploadQueue({ ...uploadQueue, progress: uploadQueue.progress + 1 });
      })
      .catch((e) => {
        console.error(e);
        setUploadQueue({ files: [], progress: 0, uploading: false });
      });
  }, [uploadQueue, mutateAsync, presignedPost]);

  function startUpload() {
    if (!data) return;
    setUploadQueue({ uploading: true, files: data, progress: 0 });
  }
  function cancelUpload() {
    setUploadQueue({ files: [], progress: 0, uploading: false });
  }

  if (uploadQueue.uploading) {
    return (
      <div>
        <Progress value={(100 * uploadQueue.progress) / uploadQueue.files.length - 1} />
        <Button onClick={cancelUpload}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="prose flex min-h-[20rem] flex-col gap-3 p-3 dark:prose-invert ">
      <h3>Upload multimedia</h3>
      <Dropzope data={data} onChange={setData} />
      {data ? <Button onClick={startUpload}>Start upload</Button> : null}
      <ItemPreview data={data} />
    </div>
  );
}

function Dropzope({ data, onChange }: { data?: FileWithPath[]; onChange: (files: File[] | undefined) => void }) {
  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      const files = await listFiles(acceptedFiles);
      console.log(files);
      onChange([...(data || []), ...files]);
    },
    [data],
  );
  const onClear = () => onChange(undefined);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, validator: createValidator() });

  return (
    <div className=" flex gap-3">
      <div {...getRootProps()} className="flex-auto cursor-pointer rounded border-2 border-dashed border-primary p-4">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>{data ? "Add more files" : "Drag 'n' drop some files here, or click to select files"}</p>
        )}
      </div>
      <div className={data ? "" : "hidden"}>
        <Button variant="secondary" onClick={onClear} className="h-full">
          Clear
        </Button>
      </div>
    </div>
  );
}

const PAGESIZE = 10;
function ItemPreview({ data }: { data?: FileWithPath[] }) {
  const [dataOffset, setDataOffset] = useState(0);
  useEffect(() => {
    setDataOffset(0);
  }, [data]);

  if (!data) return null;

  function nextPage() {
    if (!data) return;
    setDataOffset((prev) => Math.min(prev + PAGESIZE, data.length - 1));
  }
  function prevPage() {
    setDataOffset((prev) => Math.max(prev - PAGESIZE, 0));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-secondary">{data?.length} multimedia files found</h3>
        <div className="mt-3 flex gap-2">
          <Button variant="secondary" onClick={prevPage} disabled={dataOffset === 0} className="h-8 p-1">
            <ArrowLeft />
          </Button>
          <Button
            variant="secondary"
            onClick={nextPage}
            disabled={dataOffset + PAGESIZE >= data?.length}
            className="h-8 p-1"
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
      <div className="text-sm">
        {data?.slice(dataOffset, dataOffset + PAGESIZE).map((file) => (
          <div className="flex flex-nowrap items-center">
            <Dot />
            <span
              title={file.name}
              key={file.path}
              className="overflow-hidden text-ellipsis whitespace-nowrap leading-8"
            >
              {file.path}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function createValidator() {
  const validator = (file: FileWithPath) => {
    if (file.name && /\.zip$/.test(file.name.toLowerCase())) return null; // zip files are processed and filtered in createFiles
    if (file.size && file.size > 100000000) return { code: "file-too-large", message: "File is too large" };

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension) return { code: "file-extension-missing", message: "File extension missing" };

    const mimeBasedOnExtension = extensionMapping[extension];
    if (!mimeBasedOnExtension)
      return { code: "file-extension-not-supported", message: "File extension not supported " };

    if (file.type !== mimeBasedOnExtension)
      return { code: "file-mime-type-mismatch", message: "File mime type mismatch" };

    return null;
  };

  return validator;
}

const listFiles = async (acceptedFiles: FileWithPath[]) => {
  const files = [];
  for (let af of acceptedFiles) {
    if (/\.zip$/.test(af.name.toLowerCase())) {
      const zippedfiles = await listZippedFiles(af);
      for (let zfile of zippedfiles) files.push(zfile);
    } else {
      files.push(af);
    }
  }

  return files;
};

const listZippedFiles = async (file: FileWithPath) => {
  let newZip = new JSZip();

  const zipped = await newZip.loadAsync(file);
  const zippedfiles = Object.values(zipped.files);
  const files: FileWithPath[] = [];
  for (let zobj of zippedfiles) {
    if (zobj.dir) continue;
    const zblob = await zobj.async("blob");
    const name = zobj.name.split("/").splice(-1)[0];
    const extension = name.split(".").pop()?.toLowerCase();

    if (!extension) {
      console.log("Extension is missing for file: ", name);
      continue;
    }
    const mime = extensionMapping[extension];
    if (!mime) {
      console.log("extension is not supported: ", extension);
      continue;
    }

    const zfile = new File([zblob], name, {
      type: mime,
      lastModified: zobj.date.getTime(),
    });
    const fileWithPath: FileWithPath = new FileWithPathClass(zfile, zobj.name);
    files.push(fileWithPath);
  }
  return files;
};

class FileWithPathClass extends File {
  path: string;
  constructor(file: File, path: string) {
    super([file], file.name, { type: file.type });
    this.path = path;
  }
}
