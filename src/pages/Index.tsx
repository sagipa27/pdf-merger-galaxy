
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import FileUploader from '@/components/FileUploader';
import { mergePDFs } from '@/lib/pdfUtils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (index: number, file: File) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.some(file => !file)) {
      toast({
        title: "Missing files",
        description: "Please upload all three PDF files before merging.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const mergedPdfBytes = await mergePDFs(files as File[]);
      
      // Create a download link
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success!",
        description: "Your PDFs have been merged successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error merging your PDFs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">IMR procedure</h1>
          <p className="text-lg text-gray-600">
            Combine your PDF documents seamlessly
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          {[0, 1, 2].map((index) => (
            <FileUploader
              key={index}
              index={index}
              onFileSelect={(file) => handleFileSelect(index, file)}
            />
          ))}
        </div>

        <div className="flex justify-center animate-fade-up" style={{ animationDelay: '300ms' }}>
          <Button
            onClick={handleMerge}
            disabled={isProcessing || files.some(file => !file)}
            className="px-8 py-6 text-lg relative transition-all duration-300 hover:scale-105"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Merge PDFs'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
