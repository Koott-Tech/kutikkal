'use client';

import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Move, 
  Type, 
  Heading, 
  Image, 
  List, 
  Link, 
  Quote,
  Eye,
  EyeOff,
  Upload,
  X,
  FileText
} from 'lucide-react';

// Utility function to parse markdown-style links in text
const parseInlineLinks = (text) => {
  if (!text) return text;
  
  // Regular expression to match [text](url) pattern
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, match.index)
      });
    }
    
    // Add the link
    parts.push({
      type: 'link',
      text: match[1],
      url: match[2]
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after the last link
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex)
    });
  }
  
  return parts.length > 0 ? parts : [{ type: 'text', content: text }];
};

const DEFAULT_TEXT_STYLE = () => ({
  bold: false,
  italic: false,
  underline: false,
});

const TOOLBAR_BUTTON_BASE =
  'flex items-center justify-center w-full h-10 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700';

const TOOLBAR_BUTTON_ACCENT = `${TOOLBAR_BUTTON_BASE} !bg-green-50 !border-green-300 !text-green-700 hover:!bg-green-100`;

const TOOLBAR_BUTTON_PRIMARY =
  'flex items-center justify-center w-full h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors';

const STYLE_BUTTON_BASE =
  'flex items-center justify-center w-9 h-9 border rounded-md text-sm font-semibold transition-colors';

const STYLE_ACTIVE_CLASSES = 'bg-blue-100 border-blue-400 text-blue-700';
const STYLE_INACTIVE_CLASSES = 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100';

const getTextStyleClasses = (style = {}) => {
  const classes = [];
  if (style.bold) classes.push('font-semibold');
  if (style.italic) classes.push('italic');
  if (style.underline) classes.push('underline');
  return classes.join(' ');
};

const StructuredContentEditor = ({ content, onChange, onImageUpload }) => {
  const [showPreview, setShowPreview] = useState(false);

  const toggleStyle = (index, styleKey, targetKey = 'style') => {
    const block = content[index];
    const currentStyle = {
      ...DEFAULT_TEXT_STYLE(),
      ...(block?.[targetKey] || {}),
    };
    const updatedStyle = {
      ...currentStyle,
      [styleKey]: !currentStyle[styleKey],
    };
    updateBlock(index, {
      ...block,
      [targetKey]: updatedStyle,
    });
  };

  const renderStyleControls = (style = {}, index, targetKey = 'style') => (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => toggleStyle(index, 'bold', targetKey)}
        className={`${STYLE_BUTTON_BASE} ${style.bold ? STYLE_ACTIVE_CLASSES : STYLE_INACTIVE_CLASSES}`}
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => toggleStyle(index, 'italic', targetKey)}
        className={`${STYLE_BUTTON_BASE} ${style.italic ? STYLE_ACTIVE_CLASSES : STYLE_INACTIVE_CLASSES}`}
        title="Italic"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => toggleStyle(index, 'underline', targetKey)}
        className={`${STYLE_BUTTON_BASE} ${style.underline ? STYLE_ACTIVE_CLASSES : STYLE_INACTIVE_CLASSES}`}
        title="Underline"
      >
        U
      </button>
    </div>
  );

  const addBlock = (type) => {
    let newBlock = {};
    
    switch (type) {
      case 'paragraph':
        newBlock = { type: 'paragraph', content: '', style: DEFAULT_TEXT_STYLE() };
        break;
      case 'heading':
        newBlock = { type: 'heading', level: 2, content: '', style: DEFAULT_TEXT_STYLE() };
        break;
      case 'image':
        newBlock = { type: 'image', src: '', alt: '', caption: '' };
        break;
      case 'bulletList':
        newBlock = { type: 'bulletList', items: [''] };
        break;
      case 'numberedList':
        newBlock = { type: 'numberedList', items: [''] };
        break;
      case 'textBox':
        newBlock = {
          type: 'textBox',
          title: '',
          level: 3,
          content: '',
          titleStyle: DEFAULT_TEXT_STYLE(),
          bodyStyle: DEFAULT_TEXT_STYLE(),
        };
        break;
      case 'link':
        newBlock = { type: 'link', href: '', text: '', target: '_self' };
        break;
      case 'quote':
        newBlock = { type: 'quote', content: '', author: '' };
        break;
      default:
        newBlock = { type: 'paragraph', content: '' };
    }
    
    onChange([...content, newBlock]);
  };

  const insertInlineLink = () => {
    const linkText = prompt('Enter link text:');
    const linkUrl = prompt('Enter URL:');
    
    if (linkText && linkUrl) {
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      
      // Insert at cursor position in the last paragraph block
      const lastParagraphIndex = content.findLastIndex(block => block.type === 'paragraph');
      
      if (lastParagraphIndex !== -1) {
        const updatedContent = [...content];
        const currentContent = updatedContent[lastParagraphIndex].content;
        updatedContent[lastParagraphIndex] = {
          ...updatedContent[lastParagraphIndex],
          content: currentContent + (currentContent ? ' ' : '') + linkMarkdown
        };
        onChange(updatedContent);
      } else {
        // If no paragraph exists, create one with the link
        onChange([...content, { type: 'paragraph', content: linkMarkdown }]);
      }
    }
  };

  const updateBlock = (index, updatedBlock) => {
    const newContent = [...content];
    newContent[index] = updatedBlock;
    onChange(newContent);
  };

  const deleteBlock = (index) => {
    const newContent = content.filter((_, i) => i !== index);
    onChange(newContent);
  };

  const moveBlock = (index, direction) => {
    const newContent = [...content];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newContent.length) {
      [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]];
      onChange(newContent);
    }
  };

  const handleImageUpload = async (file, blockIndex) => {
    try {
      const formData = new FormData();
      formData.append('images', file);
      
      const response = await onImageUpload(formData);
      if (response.success && response.data.uploadedImages.length > 0) {
        const imageUrl = response.data.uploadedImages[0].imageUrl;
        updateBlock(blockIndex, {
          ...content[blockIndex],
          src: imageUrl
        });
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const renderBlockEditor = (block, index) => {
    return (
      <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
        {/* Block Controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500 uppercase">
              {block.type.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            {(block.type === 'heading' || block.type === 'textBox') && (
              <select
                value={block.level}
                onChange={(e) => updateBlock(index, { ...block, level: parseInt(e.target.value) })}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
                <option value={4}>H4</option>
                <option value={5}>H5</option>
                <option value={6}>H6</option>
              </select>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => moveBlock(index, 'up')}
              disabled={index === 0}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => moveBlock(index, 'down')}
              disabled={index === content.length - 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => deleteBlock(index)}
              className="p-1 text-red-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Block Content Editor */}
        {block.type === 'paragraph' && (
          <div className="space-y-3">
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(index, { ...block, content: e.target.value })}
              placeholder="Enter paragraph content..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            {renderStyleControls(block.style, index)}
            <div className="text-xs text-gray-500">
              <p className="mb-2">💡 <strong>Tip:</strong> To add links within text, use this format:</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                This is a paragraph with a [link text](https://example.com) inside it.
              </code>
            </div>
          </div>
        )}

        {block.type === 'heading' && (
          <input
            type="text"
            value={block.content}
            onChange={(e) => updateBlock(index, { ...block, content: e.target.value })}
            placeholder={`Enter H${block.level} heading...`}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
          />
        )}
        {block.type === 'heading' && (
          <div className="mt-2">
            {renderStyleControls(block.style, index)}
          </div>
        )}

        {block.type === 'textBox' && (
          <div className="space-y-3">
            <input
              type="text"
              value={block.title}
              onChange={(e) => updateBlock(index, { ...block, title: e.target.value })}
              placeholder={`Enter H${block.level || 3} heading...`}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
            />
            {renderStyleControls(block.titleStyle, index, 'titleStyle')}
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(index, { ...block, content: e.target.value })}
              placeholder="Add supporting paragraph text..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {renderStyleControls(block.bodyStyle, index, 'bodyStyle')}
          </div>
        )}

        {block.type === 'image' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleImageUpload(file, index);
                }}
                className="hidden"
                id={`image-upload-${index}`}
              />
              <label
                htmlFor={`image-upload-${index}`}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </label>
              <span className="text-gray-500 text-sm">or</span>
              <input
                type="url"
                value={block.src}
                onChange={(e) => updateBlock(index, { ...block, src: e.target.value })}
                placeholder="Paste image URL..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {block.src && (
              <div className="space-y-2">
                <img
                  src={block.src}
                  alt="Preview"
                  className="max-w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <input
                  type="text"
                  value={block.alt}
                  onChange={(e) => updateBlock(index, { ...block, alt: e.target.value })}
                  placeholder="Alt text (for accessibility and SEO)"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 <strong>SEO Tip:</strong> Include your focus keyword in alt text when relevant
                </p>
                <input
                  type="text"
                  value={block.caption}
                  onChange={(e) => updateBlock(index, { ...block, caption: e.target.value })}
                  placeholder="Image caption (optional)"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        )}

        {block.type === 'bulletList' && (
          <div className="space-y-2">
            {block.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center space-x-2">
                <span className="text-gray-500">•</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...block.items];
                    newItems[itemIndex] = e.target.value;
                    updateBlock(index, { ...block, items: newItems });
                  }}
                  placeholder="List item..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newItems = block.items.filter((_, i) => i !== itemIndex);
                    updateBlock(index, { ...block, items: newItems });
                  }}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                updateBlock(index, { ...block, items: [...block.items, ''] });
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add item
            </button>
          </div>
        )}

        {block.type === 'numberedList' && (
          <div className="space-y-2">
            {block.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center space-x-2">
                <span className="text-gray-500 w-6">{itemIndex + 1}.</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...block.items];
                    newItems[itemIndex] = e.target.value;
                    updateBlock(index, { ...block, items: newItems });
                  }}
                  placeholder="List item..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newItems = block.items.filter((_, i) => i !== itemIndex);
                    updateBlock(index, { ...block, items: newItems });
                  }}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                updateBlock(index, { ...block, items: [...block.items, ''] });
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add item
            </button>
          </div>
        )}

        {block.type === 'link' && (
          <div className="space-y-2">
            <input
              type="url"
              value={block.href}
              onChange={(e) => updateBlock(index, { ...block, href: e.target.value })}
              placeholder="Link URL..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              value={block.text}
              onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
              placeholder="Link text..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={block.target}
              onChange={(e) => updateBlock(index, { ...block, target: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="_self">Same window</option>
              <option value="_blank">New window</option>
            </select>
          </div>
        )}

        {block.type === 'quote' && (
          <div className="space-y-2">
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(index, { ...block, content: e.target.value })}
              placeholder="Quote content..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <input
              type="text"
              value={block.author}
              onChange={(e) => updateBlock(index, { ...block, author: e.target.value })}
              placeholder="Quote author (optional)"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>
    );
  };

  const renderPreview = () => {
    return (
      <div className="space-y-4">
        {content.map((block, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {block.type === 'paragraph' && (
              <p className={`text-gray-700 leading-relaxed ${getTextStyleClasses(block.style)}`}>
                {(() => {
                  const parts = parseInlineLinks(block.content);
                  return parts.map((part, partIndex) => {
                    if (part.type === 'link') {
                      return (
                        <a
                          key={partIndex}
                          href={part.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          {part.text}
                        </a>
                      );
                    }
                    return <span key={partIndex}>{part.content}</span>;
                  });
                })()}
              </p>
            )}
            
            {block.type === 'heading' && (() => {
              const HeadingTag = `h${block.level}`;
              return (
                <HeadingTag className={`text-gray-900 font-semibold ${getTextStyleClasses(block.style)}`}>
                  {block.content}
                </HeadingTag>
              );
            })()}
            
            {block.type === 'image' && block.src && (
              <div className="space-y-2">
                <img
                  src={block.src}
                  alt={block.alt}
                  className="w-full rounded-lg"
                />
                {block.caption && (
                  <p className="text-sm text-gray-600 italic text-center">{block.caption}</p>
                )}
              </div>
            )}
            
            {block.type === 'bulletList' && (
              <ul className="list-disc list-inside space-y-1">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700">{item}</li>
                ))}
              </ul>
            )}
            
            {block.type === 'numberedList' && (
              <ol className="list-decimal list-inside space-y-1">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700">{item}</li>
                ))}
              </ol>
            )}
            
            {block.type === 'link' && (
              <a
                href={block.href}
                target={block.target}
                rel={block.target === '_blank' ? 'noopener noreferrer' : ''}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {block.text}
              </a>
            )}
            
            {block.type === 'quote' && (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700">
                <p>"{block.content}"</p>
                {block.author && (
                  <cite className="text-sm text-gray-500 not-italic">— {block.author}</cite>
                )}
              </blockquote>
            )}

            {block.type === 'textBox' && (() => {
              const HeadingTag = `h${block.level || 3}`;
              const rawBody = parseInlineLinks(block.content || '');
              const bodyParts = Array.isArray(rawBody)
                ? rawBody
                : [{ type: 'text', content: rawBody || '' }];
              return (
                <div className="space-y-2">
                  {block.title && (
                    <HeadingTag className={`text-gray-900 font-semibold ${getTextStyleClasses(block.titleStyle)}`}>
                      {block.title}
                    </HeadingTag>
                  )}
                  <p className={`text-gray-700 leading-relaxed ${getTextStyleClasses(block.bodyStyle)}`}>
                    {bodyParts.map((part, partIndex) => {
                      if (part.type === 'link') {
                        return (
                          <a
                            key={partIndex}
                            href={part.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline font-medium"
                          >
                            {part.text}
                          </a>
                        );
                      }
                      return <span key={partIndex}>{part.content}</span>;
                    })}
                  </p>
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 lg:flex lg:items-start lg:gap-6">
      {/* Toolbar */}
      <div className="lg:sticky lg:top-24 lg:self-start w-full lg:w-[72px] flex flex-col items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col items-center gap-2 w-full">
          <button
            type="button"
            onClick={() => addBlock('paragraph')}
            className={TOOLBAR_BUTTON_BASE}
            title="Paragraph"
          >
            <Type className="h-5 w-5" aria-hidden />
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('heading')}
            className={TOOLBAR_BUTTON_BASE}
            title="Heading"
          >
            <Heading className="h-5 w-5" aria-hidden />
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('image')}
            className={TOOLBAR_BUTTON_BASE}
            title="Image"
          >
            <Image className="h-5 w-5" aria-hidden />
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('bulletList')}
            className={TOOLBAR_BUTTON_BASE}
            title="Bullet list"
          >
            <List className="h-5 w-5" aria-hidden />
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('numberedList')}
            className={TOOLBAR_BUTTON_BASE}
            title="Numbered list"
          >
            <List className="h-5 w-5" aria-hidden />
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('link')}
            className={TOOLBAR_BUTTON_BASE}
            title="Link"
          >
            <Link className="h-5 w-5" aria-hidden />
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('quote')}
            className={TOOLBAR_BUTTON_BASE}
            title="Quote"
          >
            <Quote className="h-5 w-5" aria-hidden />
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('textBox')}
            className={TOOLBAR_BUTTON_BASE}
            title="Text box"
          >
            <FileText className="h-5 w-5" aria-hidden />
          </button>
          
          <button
            type="button"
            onClick={insertInlineLink}
            className={TOOLBAR_BUTTON_ACCENT}
            title="Quick link"
          >
            <Link className="h-5 w-5" aria-hidden />
          </button>
        </div>
        
        <div className="flex justify-end w-full">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={TOOLBAR_BUTTON_PRIMARY}
            title={showPreview ? 'Switch to edit mode' : 'Switch to preview mode'}
          >
            {showPreview ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px] flex-1">
        {showPreview ? renderPreview() : (
          <div className="space-y-4">
            {content.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">No content blocks yet</p>
                <p className="text-sm">Click the buttons above to add content blocks</p>
              </div>
            ) : (
              content.map((block, index) => renderBlockEditor(block, index))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StructuredContentEditor;
