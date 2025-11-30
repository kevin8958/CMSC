import { useCallback, useRef, useState } from "react";
import { LuCloudUpload } from "react-icons/lu";
import Typography from "@/foundation/Typography";
import classNames from "classnames";

interface UploadDropzoneProps {
  onSelect: (files: File[]) => void; // ✅ 배열
  accept?: string;
  maxSizeMB?: number;
}

export default function UploadDropzone({
  onSelect,
  accept = "*",
  maxSizeMB = 10,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    (file: File) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`파일 용량은 ${maxSizeMB}MB 이하만 가능합니다.`);
      }
      return true;
    },
    [maxSizeMB]
  );

  const handleFiles = useCallback(
    (files: File[]) => {
      try {
        const validFiles = files.filter((file) => {
          validate(file);
          return true;
        });

        setSelectedFiles(validFiles);
        setError(null);
        onSelect(validFiles);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [onSelect, validate]
  );

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        hidden
        onChange={(e) => {
          if (!e.target.files) return;
          handleFiles(Array.from(e.target.files));
        }}
      />

      <div
        className={classNames(
          "relative flex flex-col justify-center items-center gap-2 w-full h-[140px] border-2 rounded-xl transition cursor-pointer bg-white",
          dragging
            ? "border-primary-500 bg-primary-50"
            : "border-primary-200 hover:border-primary-400 border-dashed"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const files = Array.from(e.dataTransfer.files);
          if (files.length) handleFiles(files);
        }}
      >
        {/* 중앙 아이콘 */}
        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
          <LuCloudUpload className="text-primary-600 text-xl" />
        </div>

        {/* 안내문구 */}
        <Typography variant="B2" classes="text-primary-700">
          <span className="font-semibold underline cursor-pointer">
            클릭하여 파일 선택
          </span>{" "}
          또는 여기로 파일을 드래그하세요.
        </Typography>

        <Typography variant="B2" classes="text-gray-500">
          파일당 최대 {maxSizeMB}MB
        </Typography>
      </div>

      {/* 선택된 파일 목록 */}
      {selectedFiles.length > 0 && (
        <div className="mt-2 space-y-1">
          {selectedFiles.map((file) => (
            <Typography key={file.name} variant="C1" classes="text-gray-600">
              선택됨: <span className="font-medium">{file.name}</span> (
              {(file.size / 1024 / 1024).toFixed(1)}MB)
            </Typography>
          ))}
        </div>
      )}

      {/* 에러 */}
      {error && (
        <Typography variant="B2" classes="mt-1 text-danger">
          {error}
        </Typography>
      )}
    </>
  );
}
