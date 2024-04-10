import { MiddlecatUser } from "middlecat-react";
import { Loading } from "../ui/loading";
import { useMultimediaPresignedPost, useMutateMultimedia } from "@/api/multimedia";
import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { ArrowLeft, ArrowRight, Dot } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface Props {
  indexId: string;
  user: MiddlecatUser;
}

interface UploadQueue {
  uploading: boolean;
  files: FileWithPath[];
  progress: number;
}

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
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => onChange([...(data || []), ...acceptedFiles]), [data]);
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
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/webp", "image/tiff"];

  const validator = (file: FileWithPath) => {
    if (file.name && /\.zip$/.test(file.name.toLowerCase())) return null; // zip files are processed and filtered in createFiles
    if (file.size && file.size > 100000000) return { code: "file-too-large", message: "File is too large" };
    if (allowedMimeTypes.includes(file.type)) return null;
    return {
      code: "file-not-allowed",
      message: "File doesn't match any of the allowed filenames",
    };
  };

  return validator;
}
