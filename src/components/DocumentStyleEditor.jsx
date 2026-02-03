'use client';

import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { 
  Bold, 
  Italic, 
  Underline,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  Image as ImageIcon,
  Quote,
  Type,
  X,
  Check
} from 'lucide-react';

/**
 * Google Docs / Wix-style document editor
 * - Click anywhere to type
 * - Floating toolbar on text selection
 * - Type "/" to insert blocks
 * - Clean, minimal UI
 */
const DocumentStyleEditor = forwardRef(function DocumentStyleEditor({ 
  content = '', 
  onChange,
  onImageUpload,
  placeholder = 'Start writing...'
}, ref) {
  const editorRef = useRef(null);
  const savedSelectionRef = useRef(null); // store last cursor/selection in editor so we can insert image there
  const skipContentSyncRef = useRef(false); // prevent useEffect from overwriting editor right after we insert image
  const linkRangeRef = useRef(null); // store range when opening link dialog so we can insert link after user fills URL
  const linkElementRef = useRef(null); // when editing existing link, store the <a> element
  const insertionMarkerRef = useRef(null); // marker for image insertion point (survives async upload)
  
  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.innerHTML ?? ''
  }), []);
  const toolbarRef = useRef(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0, visible: false });
  const [linkDialog, setLinkDialog] = useState({ visible: false, url: '', text: '', isEdit: false });
  const [linkDialogPosition, setLinkDialogPosition] = useState({ top: 0, left: 0 });
  const [slashMenu, setSlashMenu] = useState({ visible: false, position: { top: 0, left: 0 } });
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const contextMenuRef = useRef(null);

  // Ensure Enter creates <p> tags for proper new lines on frontend
  useEffect(() => {
    if (editorRef.current && document.queryCommandSupported?.('defaultParagraphSeparator')) {
      try {
        document.execCommand('defaultParagraphSeparator', false, 'p');
      } catch (_) {}
    }
  }, []);

  // Initialize editor content (don't overwrite right after we inserted image - parent state may not have updated yet)
  // When skipContentSyncRef is true we only skip; do NOT clear it here (only the insert-image flow clears it)
  useEffect(() => {
    if (skipContentSyncRef.current) return;
    if (editorRef.current) {
      if (content && content !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = content;
      } else if (!content && !editorRef.current.innerHTML) {
        editorRef.current.innerHTML = '';
      }
    }
  }, [content]);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (html !== content) onChange?.(html);
    }
  }, [onChange, content]);

  // Convert plain text to HTML - like Google Docs: bullets + text on same line, normal spacing
  const plainTextToHtml = useCallback((text) => {
    if (!text || typeof text !== 'string') return '';
    
    const blocks = text.split(/\n\n+/);
    const bulletChar = /^[\u2022\u2023\u25E6\u2043\u2219\-\*]\s*$/;  // bullet alone on line
    const bulletWithText = /^[\u2022\u2023\u25E6\u2043\u2219\-\*]\s+(.+)$/;  // • text
    const numberedWithText = /^(\d+)[\.\)]\s+(.+)$/;

    return blocks.map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '<p><br></p>';
      
      const lines = trimmed.split(/\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return '<p><br></p>';
      
      // Build list items: merge "bullet on own line" + "text on next line" into one item (like Google Docs)
      const bulletItems = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (bulletChar.test(line) && i + 1 < lines.length && !bulletChar.test(lines[i + 1]) && !/^[\u2022\u2023\u25E6\u2043\u2219\-\*]\s+/.test(lines[i + 1])) {
          bulletItems.push(lines[i + 1]);
          i++;
        } else if (bulletWithText.test(line)) {
          bulletItems.push(line.replace(bulletWithText, '$1'));
        } else if (bulletChar.test(line)) {
          // bullet alone with no next line - skip or add empty
          bulletItems.push('');
        }
      }
      
      if (bulletItems.length > 0) {
        const items = bulletItems.map(t => `<li>${t}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      
      // Numbered list: "1." on one line + text on next, or "1. text" on one line
      const numberedItems = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^\d+[\.\)]\s*$/.test(line) && i + 1 < lines.length) {
          numberedItems.push(lines[i + 1]);
          i++;
        } else {
          const m2 = line.match(numberedWithText);
          if (m2) numberedItems.push(m2[2]);
        }
      }
      if (numberedItems.length >= 2) {
        const items = numberedItems.map(t => `<li>${t}</li>`).join('');
        return `<ol>${items}</ol>`;
      }
      
      return '<p>' + trimmed.replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }, []);

  // Sanitize pasted HTML: allow safe block and inline elements
  const sanitizePasteHtml = useCallback((html) => {
    if (!html || typeof html !== 'string') return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const allowedTags = ['p', 'div', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 'span', 'a', 'blockquote'];
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.cloneNode(true);
      if (node.nodeType !== Node.ELEMENT_NODE) return null;
      const tag = node.tagName?.toLowerCase();
      if (!tag || !allowedTags.includes(tag)) {
        const frag = document.createDocumentFragment();
        [...node.childNodes].forEach((child) => {
          const c = walk(child);
          if (c) frag.appendChild(c);
        });
        return frag.childNodes.length ? frag : null;
      }
      const el = document.createElement(tag);
      if (tag === 'a' && node.getAttribute('href')) el.setAttribute('href', node.getAttribute('href'));
      
      [...node.childNodes].forEach((child) => {
        const c = walk(child);
        if (c) el.appendChild(c);
      });
      return el;
    };
    const frag = document.createDocumentFragment();
    [...doc.body.childNodes].forEach((child) => {
      const c = walk(child);
      if (c) frag.appendChild(c);
    });
    const div = document.createElement('div');
    div.appendChild(frag);
    return div.innerHTML;
  }, []);

  const handlePaste = useCallback((e) => {
    const pastedHtml = e.clipboardData?.getData?.('text/html');
    const pastedText = e.clipboardData?.getData?.('text/plain') || '';
    if (!editorRef.current) return;

    e.preventDefault();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    let htmlToInsert = '';
    if (pastedHtml && pastedHtml.trim().length > 0 && /<(?:\w+)[^>]*>/i.test(pastedHtml)) {
      htmlToInsert = sanitizePasteHtml(pastedHtml);
      if (!htmlToInsert) htmlToInsert = plainTextToHtml(pastedText);
    } else {
      htmlToInsert = plainTextToHtml(pastedText);
    }

    if (!htmlToInsert) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const div = document.createElement('div');
    div.innerHTML = htmlToInsert;
    const frag = document.createDocumentFragment();
    while (div.firstChild) frag.appendChild(div.firstChild);
    range.insertNode(frag);
    selection.collapseToEnd();
    handleInput();
  }, [plainTextToHtml, sanitizePasteHtml, handleInput]);

  // Handle text selection for floating toolbar
  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setToolbarPosition(prev => ({ ...prev, visible: false }));
      return;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      setToolbarPosition(prev => ({ ...prev, visible: false }));
      return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) {
      setToolbarPosition(prev => ({ ...prev, visible: false }));
      return;
    }

    setSelectedText(selectedText);
    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current?.getBoundingClientRect();
    
    if (editorRect) {
      setToolbarPosition({
        top: rect.top - editorRect.top - 40,
        left: rect.left - editorRect.left + (rect.width / 2) - 100,
        visible: true
      });
    }
  }, []);

  // Format text
  const formatText = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
    setToolbarPosition(prev => ({ ...prev, visible: false }));
  }, [handleInput]);

  // Handle link: add new or edit existing (save range so it works after dialog steals focus)
  const handleAddLink = useCallback(() => {
    const selection = window.getSelection();
    linkElementRef.current = null;
    const anchor = selection?.anchorNode && selection.anchorNode.nodeType === Node.ELEMENT_NODE
      ? selection.anchorNode
      : selection?.anchorNode?.parentElement;
    const existingLink = anchor?.closest?.('a');
    if (existingLink && editorRef.current?.contains(existingLink)) {
      linkElementRef.current = existingLink;
      const url = existingLink.getAttribute('href') || '';
      const text = existingLink.textContent || '';
      setLinkDialogPosition({ top: toolbarPosition.top, left: toolbarPosition.left });
      setLinkDialog({ visible: true, url, text, isEdit: true });
      return;
    }
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      try {
        linkRangeRef.current = selection.getRangeAt(0).cloneRange();
      } catch (_) {
        linkRangeRef.current = null;
      }
      setLinkDialogPosition({ top: toolbarPosition.top, left: toolbarPosition.left });
      setLinkDialog({ visible: true, url: '', text: selection.toString(), isEdit: false });
    }
  }, [toolbarPosition.top, toolbarPosition.left]);

  const handleSaveLink = useCallback(() => {
    if (!linkDialog.url.trim()) return;
    const href = linkDialog.url.startsWith('http') ? linkDialog.url : `https://${linkDialog.url}`;
    const text = linkDialog.text?.trim() || linkDialog.url;

    if (linkElementRef.current && editorRef.current?.contains(linkElementRef.current)) {
      linkElementRef.current.href = href;
      linkElementRef.current.textContent = text;
      linkElementRef.current.className = 'document-editor-link underline';
      linkElementRef.current.target = '_blank';
      linkElementRef.current.rel = 'noopener noreferrer';
      linkElementRef.current = null;
      handleInput();
    } else if (linkRangeRef.current && editorRef.current?.contains(linkRangeRef.current.commonAncestorContainer)) {
      try {
        const range = linkRangeRef.current;
        const link = document.createElement('a');
        link.href = href;
        link.textContent = text;
        link.className = 'document-editor-link underline';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        range.deleteContents();
        range.insertNode(link);
        window.getSelection()?.removeAllRanges();
        handleInput();
      } catch (_) {}
      linkRangeRef.current = null;
    } else {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          const link = document.createElement('a');
          link.href = href;
          link.textContent = text;
          link.className = 'document-editor-link underline';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          range.deleteContents();
          range.insertNode(link);
          selection.removeAllRanges();
          handleInput();
        }
      }
      linkRangeRef.current = null;
    }
    setLinkDialog({ visible: false, url: '', text: '', isEdit: false });
    setToolbarPosition(prev => ({ ...prev, visible: false }));
  }, [linkDialog, handleInput]);

  // Save cursor/selection when user interacts with editor (so we can insert image at that position later)
  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!editorRef.current || !sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (!range || !editorRef.current.contains(range.commonAncestorContainer)) return;
    try {
      savedSelectionRef.current = range.cloneRange();
    } catch (_) {}
  }, []);

  const handleContextMenu = useCallback((e) => {
    const target = e.target;
    if (!editorRef.current?.contains(target)) return;
    const link = target.closest?.('a');
    if (link && editorRef.current?.contains(link)) {
      e.preventDefault();
      linkElementRef.current = link;
      const rect = editorRef.current.getBoundingClientRect();
      setLinkDialogPosition({ top: e.clientY - rect.top - 10, left: e.clientX - rect.left });
      setLinkDialog({
        visible: true,
        url: link.getAttribute('href') || '',
        text: link.textContent || '',
        isEdit: true
      });
      setContextMenu(prev => ({ ...prev, visible: false }));
      return;
    }
    // Right-click elsewhere: show action context menu and save cursor so image/link insert here
    e.preventDefault();
    saveSelection();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
  }, [saveSelection]);

  // Handle "/" for slash menu
  const handleKeyDown = useCallback((e) => {
    if (e.key === '/' && editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();
        
        setSlashMenu({
          visible: true,
          position: {
            top: rect.top - editorRect.top + 20,
            left: rect.left - editorRect.left
          }
        });
      }
    }
  }, [handleInput]);

  // Insert image at saved cursor/selection (so it works between any content, even after file dialog opens)
  // Uses a DOM marker so the insertion point survives the async upload (selection is lost when file dialog opens).
  const insertImageAtSelection = useCallback(() => {
    const editor = editorRef.current;
    if (!editor || !onImageUpload) return;

    // Remove any leftover marker from a previous insert
    const existingMarker = editor.querySelector('[data-insertion-marker]');
    if (existingMarker) existingMarker.remove();

    const sel = window.getSelection();
    let rangeToUse = null;
    if (sel && sel.rangeCount > 0) {
      const r = sel.getRangeAt(0);
      if (editor.contains(r?.commonAncestorContainer)) rangeToUse = r.cloneRange();
    }
    if (!rangeToUse && savedSelectionRef.current) {
      try {
        const saved = savedSelectionRef.current;
        if (saved && editor.contains(saved.commonAncestorContainer)) rangeToUse = saved.cloneRange();
      } catch (_) {}
    }

    // Place a marker at the insertion point so we can find it after the async upload
    if (rangeToUse) {
      try {
        rangeToUse.collapse(true);
        const blockSelector = 'p, h1, h2, h3, h4, h5, h6, li, blockquote';
        let node = rangeToUse.startContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
        const block = node?.nodeType === Node.ELEMENT_NODE ? node.closest?.(blockSelector) : null;
        if (block && editor.contains(block)) {
          rangeToUse.setStartAfter(block);
          rangeToUse.collapse(true);
        }
        const marker = document.createElement('span');
        marker.setAttribute('data-insertion-marker', 'true');
        marker.style.cssText = 'display:inline;width:0;height:0;overflow:hidden;position:absolute;pointer-events:none;';
        rangeToUse.insertNode(marker);
        insertionMarkerRef.current = marker;
      } catch (_) {}
    }

    // Prevent content sync from overwriting editor (and the marker) during upload
    skipContentSyncRef.current = true;

    // If user cancels the file dialog, clean up marker and flag (onchange won't run)
    const cancelCleanup = () => {
      const m = insertionMarkerRef.current;
      if (m && m.parentNode) m.remove();
      insertionMarkerRef.current = null;
      skipContentSyncRef.current = false;
    };
    const cancelTimer = setTimeout(() => {
      window.addEventListener('focus', cancelCleanup, { once: true });
    }, 300);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      window.clearTimeout(cancelTimer);
      window.removeEventListener('focus', cancelCleanup);
      const file = e.target.files?.[0];
      if (!file) {
        cancelCleanup();
        return;
      }
      try {
        const result = await onImageUpload(file);
        if (!editorRef.current) {
          skipContentSyncRef.current = false;
          return;
        }
        const editorEl = editorRef.current;
        // Accept imageUrl from data, or from data.uploadedImages[0] (backend upload-multiple shape)
        const imageUrl = result?.data?.imageUrl
          || (result?.data?.uploadedImages?.[0] && (result.data.uploadedImages[0].imageUrl || result.data.uploadedImages[0].url));
        if (result?.success && imageUrl) {
          const img = document.createElement('img');
          img.src = imageUrl;
          img.alt = 'Uploaded image';
          img.setAttribute('draggable', 'false');
          const wrapper = document.createElement('div');
          wrapper.className = 'document-editor-image-wrapper my-4';
          wrapper.title = 'Drag the bottom-right corner to resize. Image stays centered.';
          wrapper.appendChild(img);

          const marker = editorEl.querySelector('[data-insertion-marker]');
          if (marker && marker.parentNode) {
            marker.parentNode.insertBefore(wrapper, marker);
            marker.remove();
            insertionMarkerRef.current = null;
          } else {
            editorEl.appendChild(wrapper);
          }

          handleInput();
          setTimeout(() => {
            if (editorRef.current) {
              const html = editorRef.current.innerHTML;
              if (html !== content) onChange?.(html);
            }
            skipContentSyncRef.current = false;
          }, 0);
        } else {
          skipContentSyncRef.current = false;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        skipContentSyncRef.current = false;
      }
    };
    input.click();
  }, [onImageUpload, handleInput, content, onChange]);

  // Insert block from slash menu
  const insertBlock = useCallback((type) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const block = document.createElement('div');
      block.className = 'my-4';
      
      switch (type) {
        case 'h1':
          block.innerHTML = '<h1 class="text-4xl font-bold mb-4">Heading 1</h1>';
          break;
        case 'h2':
          block.innerHTML = '<h2 class="text-3xl font-semibold mb-3">Heading 2</h2>';
          break;
        case 'h3':
          block.innerHTML = '<h3 class="text-2xl font-semibold mb-2">Heading 3</h3>';
          break;
        case 'ul':
          block.innerHTML = '<ul><li>List item</li></ul>';
          break;
        case 'ol':
          block.innerHTML = '<ol><li>List item</li></ol>';
          break;
        case 'quote':
          block.innerHTML = '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">Quote</blockquote>';
          break;
        case 'image':
          setSlashMenu({ visible: false, position: { top: 0, left: 0 } });
          insertImageAtSelection();
          return;
        default:
          block.innerHTML = '<p>Paragraph</p>';
      }
      
      range.deleteContents();
      range.insertNode(block);
      selection.removeAllRanges();
      handleInput();
    }
    setSlashMenu({ visible: false, position: { top: 0, left: 0 } });
  }, [insertImageAtSelection, handleInput]);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target) && 
          editorRef.current && !editorRef.current.contains(e.target)) {
        setToolbarPosition(prev => ({ ...prev, visible: false }));
      }
      if (!e.target.closest('.slash-menu')) {
        setSlashMenu(prev => ({ ...prev, visible: false }));
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target) && contextMenu.visible) {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu.visible]);

  const blockOptions = [
    { type: 'h1', label: 'Heading 1', icon: Heading1 },
    { type: 'h2', label: 'Heading 2', icon: Heading2 },
    { type: 'h3', label: 'Heading 3', icon: Heading3 },
    { type: 'ul', label: 'Bullet List', icon: List },
    { type: 'ol', label: 'Numbered List', icon: List },
    { type: 'quote', label: 'Quote', icon: Quote },
    { type: 'image', label: 'Image', icon: ImageIcon },
  ];

  return (
    <div className="relative w-full">
      {/* Floating Toolbar */}
      {toolbarPosition.visible && (
        <div
          ref={toolbarRef}
          className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex items-center gap-1"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <button
            type="button"
            onClick={() => formatText('bold')}
            className="p-2 hover:bg-gray-100 rounded"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => formatText('italic')}
            className="p-2 hover:bg-gray-100 rounded"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => formatText('underline')}
            className="p-2 hover:bg-gray-100 rounded"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={handleAddLink}
            className="p-2 hover:bg-gray-100 rounded"
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => { setToolbarPosition(prev => ({ ...prev, visible: false })); insertImageAtSelection(); }}
            className="p-2 hover:bg-gray-100 rounded"
            title="Insert image"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Insert image bar - always visible */}
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
        <button
          type="button"
          onClick={insertImageAtSelection}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors"
          title="Insert image at cursor"
        >
          <ImageIcon className="h-4 w-4" />
          <span>Insert image</span>
        </button>
        <span className="text-xs text-gray-400">or type / and choose Image</span>
      </div>

      {/* Right-click context menu: Add link, Insert image */}
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className="fixed z-[100] bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[180px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            type="button"
            onClick={() => {
              setContextMenu(prev => ({ ...prev, visible: false }));
              handleAddLink();
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <LinkIcon className="h-4 w-4 text-gray-600" />
            Add link
          </button>
          <button
            type="button"
            onClick={() => {
              setContextMenu(prev => ({ ...prev, visible: false }));
              insertImageAtSelection();
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4 text-gray-600" />
            Insert image
          </button>
        </div>
      )}

      {/* Link Dialog */}
      {linkDialog.visible && (
        <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
          style={{
            top: `${linkDialogPosition.top}px`,
            left: `${linkDialogPosition.left}px`,
            transform: 'translateX(-50%)',
            minWidth: '300px'
          }}
        >
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Link text"
              value={linkDialog.text}
              onChange={(e) => setLinkDialog(prev => ({ ...prev, text: e.target.value }))}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="URL"
              value={linkDialog.url}
              onChange={(e) => setLinkDialog(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveLink()}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  linkElementRef.current = null;
                  linkRangeRef.current = null;
                  setLinkDialog({ visible: false, url: '', text: '', isEdit: false });
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLink}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {linkDialog.isEdit ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slash Menu */}
      {slashMenu.visible && (
        <div
          className="slash-menu absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          style={{
            top: `${slashMenu.position.top}px`,
            left: `${slashMenu.position.left}px`
          }}
        >
          {blockOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                type="button"
                onClick={() => insertBlock(option.type)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              >
                <Icon className="h-4 w-4 text-gray-600" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Editor Styles - compact bullet lists, no extra space (override pasted margins) */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .document-editor ul,
          .document-editor ol {
            list-style-position: outside !important;
            padding-left: 1.25rem !important;
            margin: 0.35rem 0 !important;
            display: block !important;
          }
          .document-editor ul { list-style-type: disc !important; }
          .document-editor ol { list-style-type: decimal !important; }
          .document-editor li {
            display: list-item !important;
            margin: 0 !important;
            padding: 0 0 1px 0 !important;
            line-height: 1.5 !important;
            list-style-position: outside !important;
          }
          /* Override pasted inline styles that add extra space */
          .document-editor ul li[style],
          .document-editor ol li[style] {
            margin: 0 !important;
            padding: 0 0 1px 0 !important;
          }
          /* Pasted content often has p/div inside li - remove their margin so no extra gap */
          .document-editor li p,
          .document-editor li div {
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Links: brand color (same as Get Started button) */
          .document-editor a,
          .document-editor .document-editor-link {
            color: #3f2e73 !important;
            text-decoration: underline !important;
          }
          .document-editor a:hover,
          .document-editor .document-editor-link:hover {
            color: #1d1733 !important;
          }
          /* Resizable, center-aligned image wrapper */
          .document-editor .document-editor-image-wrapper,
          .document-editor div.my-4:has(> img:only-child) {
            display: block !important;
            margin-left: auto !important;
            margin-right: auto !important;
            width: 100%;
            max-width: min(100%, 720px);
            min-width: 200px;
            min-height: 60px;
            resize: both;
            overflow: auto;
            padding: 0;
            box-sizing: border-box;
            position: relative;
          }
          /* Resize grip hint in bottom-right (drag this corner to resize) */
          .document-editor .document-editor-image-wrapper::after,
          .document-editor div.my-4:has(> img:only-child)::after {
            content: '';
            position: absolute;
            right: 0;
            bottom: 0;
            border-width: 0 0 14px 14px;
            border-style: solid;
            border-color: transparent transparent rgba(0,0,0,0.25) transparent;
            pointer-events: none;
          }
          .document-editor .document-editor-image-wrapper img,
          .document-editor div.my-4:has(> img:only-child) img {
            width: 100% !important;
            height: auto !important;
            max-width: 100% !important;
            display: block !important;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
            pointer-events: none;
          }
        `
      }} />

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onMouseUp={(e) => { saveSelection(); handleSelection(e); }}
        onKeyUp={(e) => { saveSelection(); handleSelection(e); }}
        onFocus={saveSelection}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
        className="document-editor w-full min-h-[500px] p-8 text-gray-800 focus:outline-none
          [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-gray-900
          [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-gray-900
          [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-gray-900
          [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-base
          [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-gray-700
          [&_a]:underline [&_a]:cursor-pointer
          [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:shadow-sm
          [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400 [&:empty]:before:pointer-events-none"
        data-placeholder={placeholder}
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: '1.75'
        }}
      />
    </div>
  );
});

export default DocumentStyleEditor;
