import React, { useRef } from "react";

export const FileUpload = ({
  fileName,
  setFileName,
  setFile,
}: {
  fileName: string;
  setFileName: (name: string) => void;
  setFile: (file: File | null) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hoverButton, setHoverButton] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  const handleFileClear = () => {
    if (fileInputRef.current) {
      setFileName("");
      setFile(null);
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFileName(droppedFile.name);
      setFile(droppedFile);
    }
  };

  return (
    <div className="flex flex-col gap-[2px]">
      <label htmlFor="photo" className="text-foreground font-medium">
        Photo
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex justify-center items-center bg-white h-[96px] border border-[#CBB6E5] rounded-md cursor-pointer *:cursor-pointer"
      >
        {fileName ? (
          <div className="flex items-center gap-2">
            {fileName}
            <button
              className="cursor-pointer"
              onMouseEnter={() => setHoverButton(true)}
              onMouseLeave={() => setHoverButton(false)}
              onClick={handleFileClear}
              type="button"
            >
              {hoverButton ? (
                <img src="/delete-hover.svg" alt="delete-hover" />
              ) : (
                <img src="/delete-default.svg" alt="delete-default" />
              )}
            </button>
          </div>
        ) : (
          <button
            className="flex gap-2"
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <p className="underline text-[#761BE4]">Upload an Image</p>
            <p className="hidden sm:block">or drag and drop here</p>
          </button>
        )}

        <input
          onChange={handleFileChange}
          multiple={false}
          ref={fileInputRef}
          type="file"
          hidden
        />
      </div>
    </div>
  );
};
