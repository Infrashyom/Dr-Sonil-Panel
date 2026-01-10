
import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Link as LinkIcon, List, Image as ImageIcon, X, UploadCloud, Loader2, Type, ChevronDown, Undo, Redo, Globe, AlignLeft } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, onImageUpload, className = '' }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Selection persistence
  const savedRange = useRef<Range | null>(null);
  const [selectedText, setSelectedText] = useState('');

  const [activeModal, setActiveModal] = useState<'none' | 'link' | 'image'>('none');
  
  // Link State
  const [linkUrl, setLinkUrl] = useState('');
  
  // Image State
  const [uploading, setUploading] = useState(false);

  // Font Size Dropdown
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  // --- INITIALIZATION & SYNC ---

  useEffect(() => {
    if (editorRef.current) {
        if (editorRef.current.innerHTML !== value) {
             if (value && editorRef.current.innerHTML === '') {
                 editorRef.current.innerHTML = value;
             }
        }
    }
  }, []); 

  const handleInput = () => {
      if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
      }
  };

  // --- SELECTION HELPERS ---

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      // Ensure the selection is actually inside the editor
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
          savedRange.current = range.cloneRange();
          setSelectedText(selection.toString());
      } else {
          setSelectedText('');
      }
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (selection && savedRange.current) {
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
    }
  };

  const execCmd = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    // Force focus back to editor to keep selection alive if possible
    if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
    }
  };

  // --- UI HANDLERS ---

  const openModal = (type: 'link' | 'image') => {
      saveSelection(); 
      setActiveModal(type);
      setLinkUrl('');
  };

  const closeModal = () => {
      setActiveModal('none');
      savedRange.current = null;
      setSelectedText('');
  };

  const insertLink = (e?: React.FormEvent) => {
    e?.preventDefault(); // Prevent form submission
    e?.stopPropagation();

    if (linkUrl) {
      restoreSelection(); 
      execCmd('createLink', linkUrl);
      closeModal();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const url = await onImageUpload(file);
        restoreSelection();
        execCmd('insertImage', url);
        closeModal();
      } catch (err) {
        alert('Upload failed');
      } finally {
        setUploading(false);
      }
    }
  };

  const setFontSize = (size: string) => {
      restoreSelection(); // Restore before applying format
      if (size === 'normal') execCmd('formatBlock', 'P');
      if (size === 'large') execCmd('formatBlock', 'H3');
      if (size === 'huge') execCmd('formatBlock', 'H2');
      setShowSizeDropdown(false);
  };

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden bg-white relative flex flex-col ${className}`}>
      
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 select-none shrink-0 z-10">
        
        {/* Undo/Redo */}
        <button type="button" onClick={() => execCmd('undo')} className="p-2 text-gray-600 hover:bg-gray-200 rounded" title="Undo">
          <Undo size={16} />
        </button>
        <button type="button" onClick={() => execCmd('redo')} className="p-2 text-gray-600 hover:bg-gray-200 rounded" title="Redo">
          <Redo size={16} />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text Styling */}
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }} className="p-2 text-gray-600 hover:bg-gray-200 rounded" title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }} className="p-2 text-gray-600 hover:bg-gray-200 rounded" title="Italic">
          <Italic size={16} />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Size Dropdown */}
        <div className="relative">
            <button 
                type="button"
                onMouseDown={(e) => { e.preventDefault(); saveSelection(); setShowSizeDropdown(!showSizeDropdown); }}
                className="flex items-center gap-1 p-2 text-gray-600 hover:bg-gray-200 rounded text-xs font-bold"
                title="Text Size"
            >
                <Type size={16} />
                <span>Size</span>
                <ChevronDown size={12} />
            </button>
            {showSizeDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-xl rounded-lg z-50 w-32 py-1 flex flex-col">
                    <button type="button" onClick={() => setFontSize('normal')} className="px-4 py-2 text-left hover:bg-pink-50 text-sm">Normal</button>
                    <button type="button" onClick={() => setFontSize('large')} className="px-4 py-2 text-left hover:bg-pink-50 text-lg font-bold">Large</button>
                    <button type="button" onClick={() => setFontSize('huge')} className="px-4 py-2 text-left hover:bg-pink-50 text-xl font-bold">Huge</button>
                </div>
            )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }} className="p-2 text-gray-600 hover:bg-gray-200 rounded" title="Bullet List">
          <List size={16} />
        </button>
        <button type="button" onClick={() => openModal('link')} className="p-2 text-gray-600 hover:bg-gray-200 rounded" title="Insert Link">
          <LinkIcon size={16} />
        </button>
        <button type="button" onClick={() => openModal('image')} className="p-2 text-gray-600 hover:bg-gray-200 rounded" title="Insert Image">
          <ImageIcon size={16} />
        </button>
      </div>

      {/* Editor CSS */}
      <style>{`
        .editor-content h2 { font-size: 1.75em; font-weight: 800; margin-top: 1em; margin-bottom: 0.5em; color: #1f2937; line-height: 1.2; }
        .editor-content h3 { font-size: 1.4em; font-weight: 700; margin-top: 1em; margin-bottom: 0.5em; color: #374151; line-height: 1.3; }
        .editor-content p { margin-bottom: 1em; line-height: 1.6; }
        .editor-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .editor-content ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        /* Force link styling in editor */
        .editor-content a { color: #2563eb; text-decoration: underline; cursor: pointer; font-weight: 500; }
        .editor-content img { max-width: 100%; border-radius: 0.75rem; margin: 1.5rem 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .editor-content blockquote { border-left: 4px solid #db2777; padding-left: 1em; font-style: italic; color: #4b5563; background: #fdf2f8; padding: 1rem; border-radius: 0 0.5rem 0.5rem 0; }
      `}</style>
      
      {/* Editor Content Area with Fixed Height and Scroll */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="editor-content p-6 h-[500px] overflow-y-auto outline-none text-gray-700 leading-relaxed font-serif bg-white"
        suppressContentEditableWarning={true}
      />

      {/* --- MODALS --- */}
      
      {/* Link Modal */}
      {activeModal === 'link' && (
        <div className="absolute top-14 left-10 z-50 bg-white shadow-xl border border-gray-200 p-4 rounded-xl w-80 animate-fade-in" onClick={(e) => e.stopPropagation()}>
           <h4 className="font-bold text-sm mb-3 text-gray-800 flex items-center gap-2">
             <Globe size={14} className="text-blue-500" /> Insert Link
           </h4>
           
           {/* Show Selected Text */}
           <div className="mb-3 bg-gray-50 p-2 rounded border border-gray-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Text to link</span>
              <p className="text-sm font-medium text-gray-700 truncate">{selectedText || <span className="italic text-gray-400">No text selected</span>}</p>
           </div>

           <div className="flex flex-col gap-3">
             <input 
               type="text"
               className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
               placeholder="https://example.com" 
               value={linkUrl}
               onChange={e => setLinkUrl(e.target.value)}
               autoFocus
               onKeyDown={(e) => { if(e.key === 'Enter') insertLink(e); }}
             />
             <div className="flex gap-2">
               <button type="button" onClick={insertLink} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">Apply Link</button>
               <button type="button" onClick={closeModal} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">Cancel</button>
             </div>
           </div>
        </div>
      )}

      {/* Image Modal - Upload Only */}
      {activeModal === 'image' && (
        <div className="absolute top-14 left-10 z-50 bg-white shadow-2xl border border-gray-200 p-5 rounded-xl w-80 animate-fade-in" onClick={(e) => e.stopPropagation()}>
           <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-sm text-gray-800">Add Image</h4>
              <button type="button" onClick={closeModal}><X size={16} className="text-gray-400 hover:text-red-500" /></button>
           </div>
           
           <div className="space-y-4">
               {/* Upload Option */}
               <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-pink-50 hover:border-pink-300 transition-all bg-gray-50/50 group">
                 {uploading ? (
                    <div className="flex flex-col items-center text-pink-600">
                       <Loader2 className="animate-spin mb-1" size={20} />
                       <span className="text-xs font-bold">Uploading...</span>
                    </div>
                 ) : (
                    <>
                       <UploadCloud className="mx-auto text-gray-400 group-hover:text-pink-500 mb-2" size={24} />
                       <span className="text-xs font-bold text-gray-600 group-hover:text-pink-700 block">Upload from Device</span>
                       <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </>
                 )}
               </label>
           </div>
        </div>
      )}

      {/* Overlay to close modals */}
      {(activeModal !== 'none' || showSizeDropdown) && (
         <div className="fixed inset-0 z-40 bg-transparent" onClick={() => { closeModal(); setShowSizeDropdown(false); }}></div>
      )}
    </div>
  );
};
