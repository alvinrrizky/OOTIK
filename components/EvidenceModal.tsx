import React, { useState, useEffect } from 'react';
// Fix: Add .ts extension to import path.
import type { Evidence } from '../types.ts';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (evidence: Evidence) => void;
  taskTitle: string;
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({ isOpen, onClose, onSubmit, taskTitle }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [textEvidence, setTextEvidence] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      const timer = setTimeout(() => {
        setActiveTab('text');
        setTextEvidence('');
        setFile(null);
        setError('');
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleFileSelect = (selectedFile: File | undefined) => {
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File is too large (max 5MB).');
        return;
      }
      if (!['image/jpeg', 'application/pdf'].includes(selectedFile.type)) {
        setError('Invalid file type. Please upload a JPG or PDF.');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0]);
  };
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'file' && file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        onSubmit({
          type: 'file',
          content: loadEvent.target?.result as string,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    } else if (activeTab === 'text' && textEvidence.trim()) {
      onSubmit({
        type: 'text',
        content: textEvidence
      });
    }
  };

  const isSubmitDisabled = activeTab === 'text' ? !textEvidence.trim() : !file;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 bg-black/60 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submit Evidence</h3>
          <button type="button" className="text-slate-500 dark:text-slate-400 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={onClose} aria-label="Close modal">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">You are completing the task:</p>
              <h4 className="font-semibold text-lg text-slate-800 dark:text-white">{taskTitle}</h4>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-700">
              <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                <button type="button" onClick={() => setActiveTab('text')} className={`${activeTab === 'text' ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-200 dark:hover:border-slate-600'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                  Enter Link or Text
                </button>
                <button type="button" onClick={() => setActiveTab('file')} className={`${activeTab === 'file' ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-200 dark:hover:border-slate-600'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                  Upload File
                </button>
              </nav>
            </div>
            
            {activeTab === 'text' && (
              <div>
                <label htmlFor="evidence" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Evidence of Completion <span className="text-red-500">*</span>
                </label>
                <textarea id="evidence" value={textEvidence} onChange={(e) => setTextEvidence(e.target.value)} rows={4} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5" placeholder="e.g., Paste a link to the document, or describe the outcome." required></textarea>
              </div>
            )}

            {activeTab === 'file' && (
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Upload File (JPG, PDF - Max 5MB) <span className="text-red-500">*</span></label>
                <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`flex justify-center items-center w-full h-32 px-6 border-2 border-dashed rounded-lg cursor-pointer ${isDragging ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-700/50'}`}>
                  <div className="text-center">
                    {file ? (
                        <>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">{file.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                        </>
                    ) : (
                        <>
                          <svg className="mx-auto h-8 w-8 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                          <p className="text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold text-violet-600 dark:text-violet-400">Click to upload</span> or drag and drop</p>
                        </>
                    )}
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".jpg, .jpeg, .pdf" />
                </div>
                {error && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end p-6 space-x-2 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={onClose} className="text-slate-800 dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 rounded-lg text-sm px-5 py-2.5 text-center">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitDisabled} className="text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-emerald-300 dark:disabled:bg-emerald-800 disabled:cursor-not-allowed">
              Submit & Complete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvidenceModal;