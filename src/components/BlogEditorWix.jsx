'use client';

import { useState, useRef, useMemo, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import {
  Plus,
  Settings,
  Search,
  Upload,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  List,
  ListOrdered,
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  IndentIncrease,
  IndentDecrease,
  Undo2,
  Redo2,
  Minus,
  Smile,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  Code,
} from 'lucide-react';
import DocumentStyleEditor, { getDefaultToolbarState } from '@/components/DocumentStyleEditor';
import styles from './BlogEditorWix.module.css';

const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const BLOCK_TYPES = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'quote', label: 'Quote' },
  { value: 'code', label: 'Code Block' },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 32, 48];

const FONT_FAMILIES = [
  { value: '', label: 'Default' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
];

const ACCEPT_IMAGE = 'image/jpeg,image/jpg,image/png,image/webp';

// Toolbar button: prevent default so editor keeps focus/selection (Google Docs style), then run command
const toolbarCmd = (e, fn) => {
  e.preventDefault();
  e.stopPropagation();
  fn();
};

const BlogEditorWix = forwardRef(function BlogEditorWix({
  blog,
  onChange,
  onFeaturedImageUpload,
  onContentImageUpload,
  uploadProgress = false,
  defaultAuthorName = '',
  featuredImagePreview = null,
  adminSidebarCollapsed = false,
}, ref) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.getContent?.() ?? ''
  }), []);

  const [sidebarTab, setSidebarTab] = useState('add');
  const [seoPreviewOpen, setSeoPreviewOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [toolbarState, setToolbarState] = useState(() => getDefaultToolbarState());
  const [blockTypeDropdownOpen, setBlockTypeDropdownOpen] = useState(false);
  const blockTypeDropdownRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (blockTypeDropdownRef.current && !blockTypeDropdownRef.current.contains(e.target)) setBlockTypeDropdownOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const autoSlug = useMemo(() => generateSlug(blog.title || ''), [blog.title]);
  const displaySlug = blog.slug || autoSlug;

  const handleImageUpload = useCallback(async (file) => {
    if (!onContentImageUpload || !file) return { success: false, error: 'No file provided' };
    try {
      const formData = new FormData();
      formData.append('images', file);
      formData.append('blogTitle', blog.title || 'untitled');
      const result = await onContentImageUpload(formData);
      const d = result?.data;
      if (result?.success && d) {
        if (d.uploadedImages?.[0]) {
          const first = d.uploadedImages[0];
          return { success: true, data: { imageUrl: first.imageUrl || first.url || first } };
        }
        if (Array.isArray(d) && d[0]) {
          const first = d[0];
          return { success: true, data: { imageUrl: first.imageUrl || first.url || first } };
        }
        if (d?.imageUrl) return result;
        if (typeof d === 'string') return { success: true, data: { imageUrl: d } };
      }
      return result;
    } catch (e) {
      console.error(e);
      return { success: false, error: e.message };
    }
  }, [onContentImageUpload, blog.title]);

  const insertImageFromSidebar = useCallback(async (file) => {
    if (!file || !editorRef.current?.insertImageByUrl) return;
    const result = await handleImageUpload(file);
    if (result?.success && result?.data?.imageUrl) {
      editorRef.current.insertImageByUrl(result.data.imageUrl);
      editorRef.current.focus?.();
      const input = fileInputRef.current;
      if (input) input.value = '';
    }
  }, [handleImageUpload]);

  const onAddZoneClick = () => fileInputRef.current?.click();
  const onAddZoneDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && /^image\/(jpeg|jpg|png|webp)$/i.test(file.type)) insertImageFromSidebar(file);
  };
  const onAddZoneDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onAddZoneDragLeave = () => setIsDragging(false);
  const onAddZoneChange = (e) => {
    const file = e.target?.files?.[0];
    if (file) insertImageFromSidebar(file);
  };

  const addTag = () => {
    const input = document.getElementById('bec-tag-input');
    const v = input?.value?.trim();
    if (v && !(blog.tags || []).includes(v)) {
      onChange({ ...blog, tags: [...(blog.tags || []), v] });
      if (input) input.value = '';
    }
  };
  const removeTag = (t) => onChange({ ...blog, tags: (blog.tags || []).filter((x) => x !== t) });

  const addCategory = () => {
    const input = document.getElementById('bec-category-input');
    const v = input?.value?.trim();
    if (v && !(blog.categories || []).includes(v)) {
      onChange({ ...blog, categories: [...(blog.categories || []), v] });
      if (input) input.value = '';
    }
  };
  const removeCategory = (c) => onChange({ ...blog, categories: (blog.categories || []).filter((x) => x !== c) });

  const addMetaKeyword = () => {
    const input = document.getElementById('bec-meta-keyword-input');
    const v = input?.value?.trim();
    if (v && !(blog.meta_keywords || []).includes(v)) {
      onChange({ ...blog, meta_keywords: [...(blog.meta_keywords || []), v] });
      if (input) input.value = '';
    }
  };
  const removeMetaKeyword = (k) => onChange({ ...blog, meta_keywords: (blog.meta_keywords || []).filter((x) => x !== k) });

  const wordCount = useMemo(() => {
    const html = blog.content ?? '';
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(/\s+/).length : 0;
  }, [blog.content]);

  const readingTime = useMemo(() => {
    const w = wordCount || 0;
    return Math.max(1, Math.ceil(w / 200));
  }, [wordCount]);

  return (
    <div className={`${styles.root} ${adminSidebarCollapsed ? styles.rootExpanded : ''}`}>
      <div className={styles.layout}>
        <div className={styles.layoutRow}>
          {/* Left sidebar: 220–250px, only Add / Settings / SEO */}
          <aside className={styles.sidebar}>
            <nav className={styles.sidebarNav}>
              <button
                type="button"
                className={sidebarTab === 'add' ? `${styles.sidebarNavBtn} ${styles.sidebarNavBtnActive}` : styles.sidebarNavBtn}
                onClick={() => setSidebarTab('add')}
                title="Add"
                aria-label="Add"
              >
                <Plus size={20} />
              </button>
              <button
                type="button"
                className={sidebarTab === 'settings' ? `${styles.sidebarNavBtn} ${styles.sidebarNavBtnActive}` : styles.sidebarNavBtn}
                onClick={() => setSidebarTab('settings')}
                title="Settings"
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>
              <button
                type="button"
                className={sidebarTab === 'seo' ? `${styles.sidebarNavBtn} ${styles.sidebarNavBtnActive}` : styles.sidebarNavBtn}
                onClick={() => setSidebarTab('seo')}
                title="SEO"
                aria-label="SEO"
              >
                <Search size={20} />
              </button>
            </nav>

            <div className={styles.sidebarPanel}>
              {sidebarTab === 'add' && (
                <>
                  <span className={styles.sidebarPanelTitle} role="heading" aria-level={2}>Add</span>
                  <div
                    className={`${styles.addImageZone} ${isDragging ? styles.addImageZoneDragging : ''} ${uploadProgress ? styles.addImageZoneDisabled : ''}`}
                    onMouseDown={() => editorRef.current?.saveSelection?.()}
                    onClick={onAddZoneClick}
                    onDrop={onAddZoneDrop}
                    onDragOver={onAddZoneDragOver}
                    onDragLeave={onAddZoneDragLeave}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onAddZoneClick()}
                  >
                    {uploadProgress ? (
                      <div style={{ margin: '12px 0' }}>Uploading…</div>
                    ) : (
                      <>
                        <Upload className={styles.addImageZoneIcon} size={40} />
                        <p className={styles.addImageZoneText}>Image upload</p>
                        <p className={styles.addImageZoneHint}>Drag & drop or click · JPG, PNG, WEBP</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPT_IMAGE}
                    onChange={onAddZoneChange}
                    style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
                    aria-hidden
                  />
                </>
              )}

              {sidebarTab === 'settings' && (
                <>
                  <span className={styles.sidebarPanelTitle} role="heading" aria-level={2}>Settings</span>
                  <div className={styles.settingsSection}>
                    <label className={styles.settingsLabel}>Featured image</label>
                    <label style={{ display: 'block', border: '2px dashed var(--bec-border)', borderRadius: 8, padding: 16, textAlign: 'center', cursor: 'pointer', background: 'var(--bec-hover)' }}>
                      {uploadProgress ? 'Uploading…' : 'Upload'}
                      <input
                        type="file"
                        accept={ACCEPT_IMAGE}
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFeaturedImageUpload?.(f); }}
                        disabled={uploadProgress}
                      />
                    </label>
                    {(blog.featured_image_url || featuredImagePreview) && (
                      <div style={{ position: 'relative', marginTop: 8 }}>
                        <img src={featuredImagePreview || blog.featured_image_url} alt="Featured" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8 }} />
                        <button type="button" onClick={() => onChange({ ...blog, featured_image_url: '' })} style={{ position: 'absolute', top: 4, right: 4, padding: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer' }}><X size={14} /></button>
                      </div>
                    )}
                  </div>
                  <div className={styles.settingsSection}>
                    <label className={styles.settingsLabel}>Author</label>
                    <input
                      type="text"
                      className={styles.settingsInput}
                      value={blog.author_name ?? defaultAuthorName}
                      onChange={(e) => onChange({ ...blog, author_name: e.target.value })}
                      placeholder="Author name"
                    />
                  </div>
                  <div className={styles.settingsSection}>
                    <label className={styles.settingsLabel}>Status</label>
                    <select
                      className={styles.settingsInput}
                      value={blog.status ?? 'draft'}
                      onChange={(e) => onChange({ ...blog, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className={styles.settingsSection}>
                    <label className={styles.settingsLabel}>Read time (min)</label>
                    <input
                      type="number"
                      min={1}
                      className={styles.settingsInput}
                      value={blog.read_time_minutes ?? 5}
                      onChange={(e) => onChange({ ...blog, read_time_minutes: parseInt(e.target.value, 10) || 5 })}
                    />
                  </div>
                  <div className={styles.settingsSection}>
                    <label className={styles.settingsLabel}>Category</label>
                    <input
                      id="bec-category-input"
                      type="text"
                      className={styles.settingsInput}
                      placeholder="Add category"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                    />
                    <button type="button" onClick={addCategory} style={{ marginTop: 6, padding: '6px 12px', background: 'var(--bec-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Add</button>
                    <div className={styles.tagChipWrap}>
                      {(blog.categories || []).map((cat) => (
                        <span key={cat} className={styles.tagChip}>
                          {cat}
                          <button type="button" onClick={() => removeCategory(cat)} className={styles.tagChipRemove}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.settingsSection}>
                    <label className={styles.settingsLabel}>Tags</label>
                    <input
                      id="bec-tag-input"
                      type="text"
                      className={styles.settingsInput}
                      placeholder="Add tag (Enter to add)"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button type="button" onClick={addTag} style={{ marginTop: 6, padding: '6px 12px', background: 'var(--bec-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Add</button>
                    <div className={styles.tagChipWrap}>
                      {(blog.tags || []).map((tag) => (
                        <span key={tag} className={styles.tagChip}>
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)} className={styles.tagChipRemove}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {sidebarTab === 'seo' && (
                <>
                  <span className={styles.sidebarPanelTitle} role="heading" aria-level={2}>SEO</span>
                  <button type="button" onClick={() => setSeoPreviewOpen((o) => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', marginBottom: 12, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                    <span>Google Preview</span>
                    {seoPreviewOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {seoPreviewOpen && (
                    <div className={styles.seoPreviewBox}>
                      <p className={styles.seoPreviewUrl}>{displaySlug ? `www.example.com/blog/${displaySlug}` : '…'}</p>
                      <p className={styles.seoPreviewTitle}>{(blog.seo_title || blog.title || 'Your title').slice(0, 60)}</p>
                      <p className={styles.seoPreviewDesc}>{(blog.seo_description || blog.excerpt || 'Meta description…').slice(0, 160)}</p>
                      <div className={styles.seoPreviewStats}>
                        <span className={(blog.seo_title || blog.title || '').length <= 60 && (blog.seo_title || blog.title || '').length >= 30 ? 'text-green-600' : ''}>Title: {(blog.seo_title || blog.title || '').length}/60</span>
                        <span className={(blog.seo_description || blog.excerpt || '').length <= 160 && (blog.seo_description || blog.excerpt || '').length >= 120 ? 'text-green-600' : ''}>Desc: {(blog.seo_description || blog.excerpt || '').length}/160</span>
                      </div>
                    </div>
                  )}
                  <div className={styles.settingsSection}>
                    <label className={styles.settingsLabel}>URL Slug</label>
                    <input
                      type="text"
                      className={styles.settingsInput}
                      value={displaySlug}
                      onChange={(e) => onChange({ ...blog, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-') })}
                      placeholder="auto-from-title"
                    />
                  </div>
                  <div className={styles.settingsSection}>
                    <label className={styles.settingsLabel}>Meta title (≤60)</label>
                    <input
                      type="text"
                      className={styles.settingsInput}
                      value={blog.seo_title ?? ''}
                      onChange={(e) => onChange({ ...blog, seo_title: e.target.value.slice(0, 60) })}
                      placeholder={blog.title || 'SEO title'}
                      maxLength={60}
                    />
                  </div>
                  <div className={styles.settingsSection}>
                    <label className={styles.settingsLabel}>Meta description (≤160)</label>
                    <textarea
                      className={styles.settingsInput}
                      value={blog.seo_description ?? ''}
                      onChange={(e) => onChange({ ...blog, seo_description: e.target.value.slice(0, 160) })}
                      placeholder={blog.excerpt || 'Meta description'}
                      maxLength={160}
                      rows={3}
                    />
                  </div>
                  <div className={styles.settingsSection}>
                    <label className={styles.settingsLabel}>Focus keyword</label>
                    <input
                      type="text"
                      className={styles.settingsInput}
                      value={blog.focus_keyword ?? ''}
                      onChange={(e) => onChange({ ...blog, focus_keyword: e.target.value })}
                      placeholder="e.g. child psychology"
                    />
                  </div>
                  <div className={styles.settingsSection}>
                    <label className={styles.settingsLabel}>Meta keywords (SEO)</label>
                    <input
                      id="bec-meta-keyword-input"
                      type="text"
                      className={styles.settingsInput}
                      placeholder="Add keyword (Enter to add)"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMetaKeyword())}
                    />
                    <button type="button" onClick={addMetaKeyword} style={{ marginTop: 6, padding: '6px 12px', background: 'var(--bec-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Add</button>
                    <div className={styles.tagChipWrap}>
                      {(blog.meta_keywords || []).map((kw) => (
                        <span key={kw} className={styles.tagChip}>
                          {kw}
                          <button type="button" onClick={() => removeMetaKeyword(kw)} className={styles.tagChipRemove}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.settingsSection}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={blog.no_index !== true}
                        onChange={(e) => onChange({ ...blog, no_index: !e.target.checked })}
                      />
                      <span className={styles.settingsLabel} style={{ margin: 0 }}>Index in search engines</span>
                    </label>
                  </div>
                </>
              )}
            </div>
          </aside>

          {/* Main: toolbar + editor */}
          <div className={styles.mainWrap}>
            {/* Sticky top toolbar – save selection on mousedown (capture) so it's preserved before browser clears it */}
            <div
              className={styles.toolbarWrap}
              onMouseDownCapture={() => editorRef.current?.saveSelection?.()}
            >
              <div className={styles.toolbarGroup} ref={blockTypeDropdownRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className={styles.toolbarSelect}
                  title="Block type"
                  style={{ minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editorRef.current?.saveSelection?.();
                    setBlockTypeDropdownOpen((open) => !open);
                  }}
                >
                  <span>{(BLOCK_TYPES.find((o) => o.value === toolbarState.blockType) || BLOCK_TYPES[0]).label}</span>
                  <ChevronDown size={14} style={{ flexShrink: 0 }} />
                </button>
                {blockTypeDropdownOpen && (
                  <div className={styles.blockTypeDropdownMenu} role="listbox">
                    {BLOCK_TYPES.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        role="option"
                        aria-selected={toolbarState.blockType === o.value}
                        className={`${styles.blockTypeDropdownItem} ${toolbarState.blockType === o.value ? styles.toolbarBtnActive : ''}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setBlockTypeDropdownOpen(false);
                          // Save selection right before setBlockType – ensure we have it before any re-render
                          editorRef.current?.saveSelection?.();
                          editorRef.current?.setBlockType?.(o.value);
                          editorRef.current?.focus?.();
                        }}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}
                <select
                  className={styles.toolbarSelect}
                  style={{ minWidth: 72 }}
                  title="Font"
                  onMouseDown={() => editorRef.current?.saveSelection?.()}
                  onChange={(e) => {
                    const v = e.target.value;
                    editorRef.current?.restoreSelection?.();
                    editorRef.current?.focus?.();
                    if (v) editorRef.current?.applyFontFamily?.(v);
                    e.target.value = '';
                  }}
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f.value || 'default'} value={f.value}>{f.label}</option>
                  ))}
                </select>
                <select
                  className={styles.toolbarSelect}
                  style={{ minWidth: 64 }}
                  title="Font size"
                  defaultValue={16}
                  onMouseDown={() => editorRef.current?.saveSelection?.()}
                  onChange={(e) => {
                    const px = Number(e.target.value);
                    editorRef.current?.restoreSelection?.();
                    editorRef.current?.focus?.();
                    editorRef.current?.applyFontSize?.(px);
                  }}
                >
                  {FONT_SIZES.map((px) => (
                    <option key={px} value={px}>{px}px</option>
                  ))}
                </select>
              </div>
              <div className={styles.toolbarDivider} />
              <div className={styles.toolbarGroup}>
                <button type="button" className={`${styles.toolbarBtn} ${toolbarState.bold ? styles.toolbarBtnActive : ''}`} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.formatText?.('bold'); })} title="Bold"><Bold size={18} /></button>
                <button type="button" className={`${styles.toolbarBtn} ${toolbarState.italic ? styles.toolbarBtnActive : ''}`} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.formatText?.('italic'); })} title="Italic"><Italic size={18} /></button>
                <button type="button" className={`${styles.toolbarBtn} ${toolbarState.underline ? styles.toolbarBtnActive : ''}`} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.formatText?.('underline'); })} title="Underline"><Underline size={18} /></button>
                <button type="button" className={`${styles.toolbarBtn} ${toolbarState.strike ? styles.toolbarBtnActive : ''}`} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.formatText?.('strikeThrough'); })} title="Strikethrough"><Strikethrough size={18} /></button>
              </div>
              <div className={styles.toolbarDivider} />
              <div className={styles.toolbarGroup}>
                <button type="button" className={`${styles.toolbarBtn} ${toolbarState.inLink ? styles.toolbarBtnActive : ''}`} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.handleAddLink?.(); })} title="Link"><LinkIcon size={18} /></button>
              </div>
              <div className={styles.toolbarDivider} />
              <div className={styles.toolbarGroup}>
                <input type="color" title="Text color" className={styles.toolbarColorInput} onMouseDown={(e) => { e.preventDefault(); editorRef.current?.saveSelection?.(); }} onChange={(e) => { requestAnimationFrame(() => { editorRef.current?.restoreSelection?.(); editorRef.current?.focus?.(); editorRef.current?.applyTextColor?.(e.target.value); }); }} />
                <input type="color" title="Highlight" className={styles.toolbarColorInput} data-highlight onMouseDown={(e) => { e.preventDefault(); editorRef.current?.saveSelection?.(); }} defaultValue="#fde047" onChange={(e) => { requestAnimationFrame(() => { editorRef.current?.restoreSelection?.(); editorRef.current?.focus?.(); editorRef.current?.applyHighlight?.(e.target.value); }); }} />
              </div>
              <div className={styles.toolbarDivider} />
              <div className={styles.toolbarGroup}>
                <button type="button" className={`${styles.toolbarBtn} ${toolbarState.listType === 'ul' ? styles.toolbarBtnActive : ''}`} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.runWithSelection?.(() => document.execCommand('insertUnorderedList')); })} title="Bullet list"><List size={18} /></button>
                <button type="button" className={`${styles.toolbarBtn} ${toolbarState.listType === 'ol' ? styles.toolbarBtnActive : ''}`} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.runWithSelection?.(() => document.execCommand('insertOrderedList')); })} title="Numbered list"><ListOrdered size={18} /></button>
                <button type="button" className={styles.toolbarBtn} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.insertChecklist?.(); })} title="Checklist"><CheckSquare size={18} /></button>
              </div>
              <div className={styles.toolbarDivider} />
              <div className={styles.toolbarGroup}>
                <button type="button" className={`${styles.toolbarBtn} ${(!toolbarState.alignment || toolbarState.alignment === 'left') ? styles.toolbarBtnActive : ''}`} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.setAlignment?.('left'); })} title="Align left"><AlignLeft size={18} /></button>
                <button type="button" className={`${styles.toolbarBtn} ${toolbarState.alignment === 'center' ? styles.toolbarBtnActive : ''}`} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.setAlignment?.('center'); })} title="Center"><AlignCenter size={18} /></button>
                <button type="button" className={`${styles.toolbarBtn} ${toolbarState.alignment === 'right' ? styles.toolbarBtnActive : ''}`} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.setAlignment?.('right'); })} title="Align right"><AlignRight size={18} /></button>
                <button type="button" className={`${styles.toolbarBtn} ${toolbarState.alignment === 'justify' ? styles.toolbarBtnActive : ''}`} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.setAlignment?.('justify'); })} title="Justify"><AlignJustify size={18} /></button>
              </div>
              <div className={styles.toolbarDivider} />
              <div className={styles.toolbarGroup}>
                <button type="button" className={styles.toolbarBtn} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.runWithSelection?.(() => document.execCommand('outdent')); })} title="Decrease indent"><IndentDecrease size={18} /></button>
                <button type="button" className={styles.toolbarBtn} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.runWithSelection?.(() => document.execCommand('indent')); })} title="Increase indent"><IndentIncrease size={18} /></button>
              </div>
              <div className={styles.toolbarDivider} />
              <div className={styles.toolbarGroup}>
                <button type="button" className={styles.toolbarBtn} onMouseDown={(e) => toolbarCmd(e, () => editorRef.current?.undo?.())} title="Undo"><Undo2 size={18} /></button>
                <button type="button" className={styles.toolbarBtn} onMouseDown={(e) => toolbarCmd(e, () => editorRef.current?.redo?.())} title="Redo"><Redo2 size={18} /></button>
                <button type="button" className={styles.toolbarBtn} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.insertDivider?.(); })} title="Divider"><Minus size={18} /></button>
                <button type="button" className={styles.toolbarBtn} onMouseDown={(e) => toolbarCmd(e, () => { editorRef.current?.focus?.(); editorRef.current?.runWithSelection?.(() => document.execCommand('insertText', false, '😊')); })} title="Emoji"><Smile size={18} /></button>
              </div>
            </div>

            {/* Scrollable editor area, centered max-width 800px */}
            <div className={styles.editorScroll}>
              <div className={styles.editorInner}>
                <input
                  type="text"
                  required
                  className={styles.editorTitle}
                  value={blog.title ?? ''}
                  onChange={(e) => onChange({ ...blog, title: e.target.value })}
                  placeholder="Post title"
                />
                <textarea
                  className={styles.editorExcerpt}
                  value={blog.excerpt ?? ''}
                  onChange={(e) => onChange({ ...blog, excerpt: e.target.value })}
                  placeholder="Brief description (excerpt)"
                  rows={2}
                />
                <div className={styles.becDocumentEditorWrap}>
                  <DocumentStyleEditor
                    ref={editorRef}
                    content={blog.content || ''}
                    onChange={(html) => onChange({ ...blog, content: html })}
                    onImageUpload={handleImageUpload}
                    onToolbarStateChange={setToolbarState}
                    placeholder="Start writing... Type / for blocks"
                    hideInsertImageBar
                  />
                </div>
                <div className={styles.statsBar}>
                  <span>{wordCount} words</span>
                  <span>~{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BlogEditorWix;
