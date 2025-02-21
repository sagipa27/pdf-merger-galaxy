
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  index: number;
}

const FileUploader = ({ onFileSelect, index }: FileUploaderProps) => {
  const [fileName, setFileName] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFileName(acceptedFiles[0].name);
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`relative p-6 border-2 border-dashed rounded-lg transition-all duration-300 ease-in-out animate-fade-up
        ${isDragActive 
          ? 'border-primary bg-primary/5' 
          : fileName 
            ? 'border-green-500 bg-green-50/50' 
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <FileText className={`w-8 h-8 ${fileName ? 'text-green-500' : 'text-gray-400'}`} />
        {fileName ? (
          <p className="text-sm font-medium text-green-600">{fileName}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700">
              {isDragActive ? 'Drop the PDF here' : 'Drop PDF here or click to browse'}
            </p>
            <p className="text-xs text-gray-500">PDF files only</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
