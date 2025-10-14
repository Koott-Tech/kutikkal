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
  X
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

const StructuredContentEditor = ({ content, onChange, onImageUpload }) => {
  const [showPreview, setShowPreview] = useState(false);

  const addBlock = (type) => {
    let newBlock = {};
    
    switch (type) {
      case 'paragraph':
        newBlock = { type: 'paragraph', content: '' };
        break;
      case 'heading':
        newBlock = { type: 'heading', level: 2, content: '' };
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
            {block.type === 'heading' && (
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
              <p className="text-gray-700 leading-relaxed">
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
                <HeadingTag className="text-gray-900 font-semibold">
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
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 bg-gray-50 rounded-lg gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => addBlock('paragraph')}
            className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Type className="h-4 w-4 mr-2" />
            Paragraph
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('heading')}
            className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Heading className="h-4 w-4 mr-2" />
            Heading
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('image')}
            className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Image className="h-4 w-4 mr-2" />
            Image
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('bulletList')}
            className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <List className="h-4 w-4 mr-2" />
            Bullet List
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('numberedList')}
            className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <List className="h-4 w-4 mr-2" />
            Numbered List
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('link')}
            className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Link className="h-4 w-4 mr-2" />
            Link
          </button>
          
          <button
            type="button"
            onClick={() => addBlock('quote')}
            className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Quote className="h-4 w-4 mr-2" />
            Quote
          </button>
          
          <div className="border-l border-gray-300 mx-2 h-6"></div>
          
          <button
            type="button"
            onClick={insertInlineLink}
            className="flex items-center px-3 py-2 text-sm bg-green-50 border border-green-300 text-green-700 rounded-lg hover:bg-green-100"
          >
            <Link className="h-4 w-4 mr-2" />
            Quick Link
          </button>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
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
