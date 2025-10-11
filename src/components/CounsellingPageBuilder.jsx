"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/backendApi';
import HeroSection from '@/components/HeroSection';
import LogosStrip from '@/components/LogosStrip';
import HowItWorks from '@/components/HowItWorks';
import ConsultationBanner from '@/components/ConsultationBanner';
import BenefitsSection from '@/components/BenefitsSection';
import TherapyTypesSplit from '@/components/TherapyTypesSplit';
import HelpFaq from '@/components/HelpFaq';

export default function CounsellingPageBuilder({ 
  serviceId, 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    slug: '',
    status: 'draft',
    category: '',
    menu_order: 0,
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    robots: 'index,follow',
    schema_enabled: true,
    schema_service_type: '',
    hero_title: '',
    hero_subtext: '',
    hero_image_url: '',
    benefits: [],
    types: [],
    faqs: [],
    right_image_url: '',
    mobile_image_url: ''
  });

  const [activeElement, setActiveElement] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (initialData) {
      console.log('Initializing form data with:', initialData);
      console.log('Benefits from initialData:', initialData.benefits);
      console.log('Benefits length:', initialData.benefits?.length);
      console.log('FAQs from initialData:', initialData.faqs);
      console.log('FAQs length:', initialData.faqs?.length);
      setFormData({
        slug: initialData.slug || '',
        status: initialData.status || 'draft',
        category: initialData.category || '',
        menu_order: initialData.menu_order || 0,
        seo_title: initialData.seo_title || '',
        seo_description: initialData.seo_description || '',
        seo_keywords: initialData.seo_keywords || '',
        og_title: initialData.og_title || '',
        og_description: initialData.og_description || '',
        og_image: initialData.og_image || '',
        canonical_url: initialData.canonical_url || '',
        robots: initialData.robots || 'index,follow',
        schema_enabled: initialData.schema_enabled !== false,
        schema_service_type: initialData.schema_service_type || '',
        hero_title: initialData.hero_title || '',
        hero_subtext: initialData.hero_subtext || '',
        hero_image_url: initialData.hero_image_url || '',
        benefits: initialData.benefits || [],
        types: initialData.types || [],
        faqs: initialData.faqs || [],
        right_image_url: initialData.right_image_url || '',
        left_image_url: initialData.left_image_url || '',
        mobile_image_url: initialData.mobile_image_url || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Debug formData.benefits and faqs
  console.log('PageBuilder - formData.benefits:', formData.benefits);
  console.log('PageBuilder - formData.benefits.length:', formData.benefits?.length);
  console.log('PageBuilder - formData.faqs:', formData.faqs);
  console.log('PageBuilder - formData.faqs.length:', formData.faqs?.length);

  const handleArrayItemAdd = (field) => {
    const newItem = field === 'benefits' ? { title: '', description: '', iconUrl: '' } :
                   field === 'types' ? { title: '', description: '' } :
                   field === 'faqs' ? { question: '', answer: '' } :
                   { title: '', description: '' };
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newItem]
    }));
  };

  const handleArrayItemUpdate = (field, index, itemField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [itemField]: value } : item
      )
    }));
  };

  const handleArrayItemRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleElementClick = (elementType, elementData = {}) => {
    setActiveElement({ type: elementType, data: elementData });
  };

  const handleSave = () => {
    // When editing an existing service, exclude the slug from the update
    const dataToSave = serviceId ? { ...formData, slug: undefined } : formData;
    onSubmit(dataToSave);
  };

  const renderEditableElement = (elementType, children, elementData = {}) => {
    return (
      <div 
        className={`relative group ${isPreviewMode ? 'hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50' : ''}`}
        onClick={() => isPreviewMode && handleElementClick(elementType, elementData)}
      >
        {children}
        {isPreviewMode && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
              Click to edit
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderElementEditor = () => {
    if (!activeElement) return null;

    switch (activeElement.type) {
      case 'hero':
        return (
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold">Edit Hero Section</h3>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Hero Title
              </label>
              <input
                type="text"
                value={formData.hero_title}
                onChange={(e) => handleInputChange('hero_title', e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Hero Subtext
              </label>
              <textarea
                value={formData.hero_subtext}
                onChange={(e) => handleInputChange('hero_subtext', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Hero Image URL
              </label>
              <input
                type="url"
                value={formData.hero_image_url}
                onChange={(e) => handleInputChange('hero_image_url', e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'benefits':
        return (
          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-base md:text-lg font-semibold">Edit Benefits</h3>
              <button
                onClick={() => handleArrayItemAdd('benefits')}
                className="bg-blue-500 text-white px-3 py-1 rounded text-xs md:text-sm hover:bg-blue-600 whitespace-nowrap"
              >
                Add Benefit
              </button>
            </div>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 md:p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-sm md:text-base font-medium">Benefit {index + 1}</h4>
                  <button
                    onClick={() => handleArrayItemRemove('benefits', index)}
                    className="text-red-600 hover:text-red-800 text-xs md:text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={benefit.title}
                      onChange={(e) => handleArrayItemUpdate('benefits', index, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Icon URL
                    </label>
                    <input
                      type="url"
                      value={benefit.iconUrl}
                      onChange={(e) => handleArrayItemUpdate('benefits', index, 'iconUrl', e.target.value)}
                      className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={benefit.description}
                      onChange={(e) => handleArrayItemUpdate('benefits', index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'types':
        return (
          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-base md:text-lg font-semibold">Edit Therapy Types</h3>
              <button
                onClick={() => handleArrayItemAdd('types')}
                className="bg-blue-500 text-white px-3 py-1 rounded text-xs md:text-sm hover:bg-blue-600 whitespace-nowrap"
              >
                Add Type
              </button>
            </div>
            {formData.types.map((type, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 md:p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-sm md:text-base font-medium">Type {index + 1}</h4>
                  <button
                    onClick={() => handleArrayItemRemove('types', index)}
                    className="text-red-600 hover:text-red-800 text-xs md:text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={type.title}
                      onChange={(e) => handleArrayItemUpdate('types', index, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={type.description}
                      onChange={(e) => handleArrayItemUpdate('types', index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'faqs':
        return (
          <div className="space-y-3 md:space-y-4">
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Edit FAQs</h3>
              
              {/* Getting Started Section */}
              <div className="mb-4 md:mb-6">
                <h4 className="text-sm md:text-base font-medium mb-2 md:mb-3 text-blue-600">Getting Started (First 3 FAQs)</h4>
                {formData.faqs.slice(0, 3).map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 md:p-4 mb-3">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="text-sm md:text-base font-medium">FAQ {index + 1}</h5>
                      <button
                        onClick={() => handleArrayItemRemove('faqs', index)}
                        className="text-red-600 hover:text-red-800 text-xs md:text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleArrayItemUpdate('faqs', index, 'question', e.target.value)}
                          className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                          Answer
                        </label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => handleArrayItemUpdate('faqs', index, 'answer', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Understanding Therapy Section */}
              <div className="mb-4 md:mb-6">
                <h4 className="text-sm md:text-base font-medium mb-2 md:mb-3 text-green-600">Understanding Therapy (Last 3 FAQs)</h4>
                {formData.faqs.slice(3, 6).map((faq, index) => (
                  <div key={index + 3} className="border border-gray-200 rounded-lg p-3 md:p-4 mb-3">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="text-sm md:text-base font-medium">FAQ {index + 4}</h5>
                      <button
                        onClick={() => handleArrayItemRemove('faqs', index + 3)}
                        className="text-red-600 hover:text-red-800 text-xs md:text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleArrayItemUpdate('faqs', index + 3, 'question', e.target.value)}
                          className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                          Answer
                        </label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => handleArrayItemUpdate('faqs', index + 3, 'answer', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleArrayItemAdd('faqs')}
                className="bg-blue-500 text-white px-4 py-2 rounded text-xs md:text-sm hover:bg-blue-600"
              >
                Add FAQ
              </button>
            </div>
          </div>
        );


      case 'images':
        return (
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold">Edit Images</h3>
            
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Hero Image URL
              </label>
              <input
                type="url"
                value={formData.hero_image_url}
                onChange={(e) => handleInputChange('hero_image_url', e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Therapy Types Right Image URL
              </label>
              <input
                type="url"
                value={formData.right_image_url}
                onChange={(e) => handleInputChange('right_image_url', e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                FAQ Left Image URL
              </label>
              <input
                type="url"
                value={formData.left_image_url || ''}
                onChange={(e) => handleInputChange('left_image_url', e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Mobile Image URL
              </label>
              <input
                type="url"
                value={formData.mobile_image_url}
                onChange={(e) => handleInputChange('mobile_image_url', e.target.value)}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
              <p className="text-sm text-gray-600 mb-4">Optimize your page for search engines and social media sharing</p>
            </div>

            {/* Basic SEO */}
            <div className="border-b pb-4">
              <h4 className="text-md font-medium mb-3 text-gray-800">📊 Basic SEO</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title (Meta Title)
                  </label>
                  <input
                    type="text"
                    value={formData.seo_title}
                    onChange={(e) => handleInputChange('seo_title', e.target.value)}
                    placeholder="e.g., Anxiety Counselling for Children - Little Care"
                    maxLength={60}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seo_title?.length || 0}/60 characters (optimal: 50-60)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.seo_description}
                    onChange={(e) => handleInputChange('seo_description', e.target.value)}
                    placeholder="Brief description that appears in search results..."
                    maxLength={160}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seo_description?.length || 0}/160 characters (optimal: 150-160)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Focus Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.seo_keywords || ''}
                    onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                    placeholder="e.g., child anxiety, kids counselling, therapy for children"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Main keywords for this page (3-5 recommended)</p>
                </div>
              </div>
            </div>

            {/* Open Graph / Social Media */}
            <div className="border-b pb-4">
              <h4 className="text-md font-medium mb-3 text-gray-800">📱 Social Media Preview (Open Graph)</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Social Media Title
                  </label>
                  <input
                    type="text"
                    value={formData.og_title || ''}
                    onChange={(e) => handleInputChange('og_title', e.target.value)}
                    placeholder="Leave empty to use SEO Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Title when shared on Facebook, LinkedIn, etc.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Social Media Description
                  </label>
                  <textarea
                    value={formData.og_description || ''}
                    onChange={(e) => handleInputChange('og_description', e.target.value)}
                    placeholder="Leave empty to use Meta Description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Social Media Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.og_image || ''}
                    onChange={(e) => handleInputChange('og_image', e.target.value)}
                    placeholder="https://example.com/image.jpg (1200x630px recommended)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Image shown when shared on social media (1200x630px optimal)</p>
                </div>
              </div>
            </div>

            {/* Advanced SEO */}
            <div className="border-b pb-4">
              <h4 className="text-md font-medium mb-3 text-gray-800">🎯 Advanced SEO</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Canonical URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.canonical_url || ''}
                    onChange={(e) => handleInputChange('canonical_url', e.target.value)}
                    placeholder="Leave empty for default"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Prevent duplicate content issues</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Robots Meta Tag
                  </label>
                  <select
                    value={formData.robots || 'index,follow'}
                    onChange={(e) => handleInputChange('robots', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="index,follow">Index, Follow (Default - Allow search engines)</option>
                    <option value="noindex,follow">No Index, Follow (Hide from search)</option>
                    <option value="index,nofollow">Index, No Follow (Show but don't follow links)</option>
                    <option value="noindex,nofollow">No Index, No Follow (Completely hide)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Control how search engines crawl this page</p>
                </div>
              </div>
            </div>

            {/* Structured Data */}
            <div>
              <h4 className="text-md font-medium mb-3 text-gray-800">🏗️ Structured Data (Schema.org)</h4>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.schema_enabled !== false}
                      onChange={(e) => handleInputChange('schema_enabled', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Medical Service Schema</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Helps Google understand this is a mental health service</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type
                  </label>
                  <input
                    type="text"
                    value={formData.schema_service_type || ''}
                    onChange={(e) => handleInputChange('schema_service_type', e.target.value)}
                    placeholder="e.g., Child Anxiety Counselling, ADHD Therapy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Specific service type for schema markup</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col max-h-[50vh] md:max-h-full overflow-hidden">
          {/* Header */}
          <div className="p-3 md:p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm md:text-base font-medium text-gray-700">Page Builder</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => setIsPreviewMode(true)}
                className={`flex-1 md:flex-none px-3 py-1 rounded text-xs md:text-sm ${
                  isPreviewMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setIsPreviewMode(false)}
                className={`flex-1 md:flex-none px-3 py-1 rounded text-xs md:text-sm ${
                  !isPreviewMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4">
            {activeElement ? (
              <div>
                {renderElementEditor()}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setActiveElement(null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 hover:bg-gray-50"
                  >
                    Close Editor
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-2">Basic Settings</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug {serviceId && <span className="text-xs text-gray-500">(Cannot be changed after creation)</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        disabled={!!serviceId}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${serviceId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      />
                      {serviceId && (
                        <p className="text-xs text-gray-500 mt-1">The URL slug cannot be changed after the page is created to prevent broken links.</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Menu Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Category</option>
                        <option value="emotional">Emotional & Mental Health</option>
                        <option value="development">Child Development & Learning</option>
                        <option value="behaviour">Behaviour & Confidence</option>
                        <option value="stress">Stress & Academic Support</option>
                        <option value="trauma">Trauma & Healing</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Choose which submenu this page will appear under in the header</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Menu Order
                      </label>
                      <input
                        type="number"
                        value={formData.menu_order}
                        onChange={(e) => handleInputChange('menu_order', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the menu (0 = first)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-2">Page Elements</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleElementClick('hero')}
                      className="w-full text-left px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      🎯 Hero Section
                    </button>
                    <button
                      onClick={() => handleElementClick('benefits')}
                      className="w-full text-left px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      ✨ Benefits
                    </button>
                    <button
                      onClick={() => handleElementClick('types')}
                      className="w-full text-left px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      🎭 Therapy Types
                    </button>
                    <button
                      onClick={() => handleElementClick('faqs')}
                      className="w-full text-left px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      ❓ FAQs
                    </button>
                    <button
                      onClick={() => handleElementClick('images')}
                      className="w-full text-left px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      🖼️ Images
                    </button>
                    <button
                      onClick={() => handleElementClick('seo')}
                      className="w-full text-left px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      🔍 SEO Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 md:p-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md text-sm md:text-base hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-2 md:p-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs md:text-sm whitespace-nowrap"
              >
                {showSidebar ? 'Hide Editor' : 'Show Editor'}
              </button>
              <h1 className="text-xs md:text-sm font-light text-gray-400 truncate">
                {formData.slug ? `/counselling/${formData.slug}` : 'New Counselling Page'}
              </h1>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => window.open(`/counselling/${formData.slug}`, '_blank')}
                disabled={!formData.slug}
                className="flex-1 sm:flex-none px-3 md:px-4 py-2 border border-gray-300 rounded-md text-xs md:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View Live
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="bg-white min-h-full">
            {/* Hero Section */}
            {renderEditableElement('hero', (
              <HeroSection 
                key={`hero-${formData.hero_title}-${formData.hero_subtext}`}
                therapyType="anxiety-sadness" 
                cmsData={{
                  title: formData.hero_title,
                  subtext: formData.hero_subtext,
                  imageUrl: formData.hero_image_url
                }}
              />
            ))}

            {/* Logos Strip */}
            <LogosStrip bgColor="bg-[#123331]" height="py-4" logosCount={6} />

            {/* How It Works */}
            <HowItWorks />

            {/* Consultation Banner */}
            <ConsultationBanner />

            {/* Benefits Section */}
            {renderEditableElement('benefits', (
              <BenefitsSection 
                key={`benefits-${JSON.stringify(formData.benefits)}`}
                therapyType="anxiety-sadness" 
                cmsData={{
                  benefits: formData.benefits
                }}
                showAllBenefits={true}
              />
            ))}

            {/* Therapy Types */}
            {renderEditableElement('types', (
              <TherapyTypesSplit 
                key={`types-${JSON.stringify(formData.types)}-${formData.right_image_url}`}
                therapyType="anxiety-sadness" 
                cmsData={{
                  types: formData.types,
                  rightImageUrl: formData.right_image_url
                }}
              />
            ))}

            {/* FAQs */}
            {renderEditableElement('faqs', (
              <div className="mt-24" key={`faqs-${JSON.stringify(formData.faqs)}-${formData.left_image_url}`}>
                <HelpFaq 
                  cmsData={{
                    faqs: formData.faqs,
                    leftImageUrl: formData.left_image_url
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
