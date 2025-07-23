import { useTranslation } from "react-i18next";
import { Plus, X, Link as LinkIcon, ExternalLink } from "lucide-react";

interface LinkPair {
  name: string;
  url: string;
}

interface LinkManagerProps {
  links: LinkPair[];
  onChange: (links: LinkPair[]) => void;
  errors: { [key: string]: string };
}

export const LinkManager: React.FC<LinkManagerProps> = ({ links, onChange, errors }) => {
  const { t } = useTranslation();
  
  // Add new link
  const addLink = () => {
    onChange([...links, { name: '', url: '' }]);
  };
  
  // Remove link
  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    onChange(newLinks);
  };
  
  // Update link field
  const updateLink = (index: number, field: 'name' | 'url', value: string) => {
    const newLinks = links.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    );
    onChange(newLinks);
  };
  
  // Test link (opens in new tab)
  const testLink = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('dashboard.relatedLinks', 'Related Links')}
          </label>
          <p className="text-xs text-gray-500 mt-1">
            {t('dashboard.linksDescription', 'Add relevant links to external resources')}
          </p>
        </div>
        <button
          type="button"
          onClick={addLink}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center font-medium"
        >
          <Plus className="w-4 h-4 mr-1" />
          {t('dashboard.addLink', 'Add Link')}
        </button>
      </div>
      
      {/* Links List */}
      {links.length > 0 ? (
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 pt-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="flex-grow space-y-3">
                  {/* Link Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.linkName', 'Link Name')} *
                    </label>
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => updateLink(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t('dashboard.linkNamePlaceholder', 'e.g., Research Paper, Official Website')}
                    />
                  </div>
                  
                  {/* Link URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('dashboard.linkUrl', 'Link URL')} *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                        className={`flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`link_${index}_url`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://example.com"
                      />
                      
                      {/* Test Link Button */}
                      {link.url && (
                        <button
                          type="button"
                          onClick={() => testLink(link.url)}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center"
                          title={t('dashboard.testLink', 'Test link')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {/* Error Message */}
                    {errors[`link_${index}_url`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`link_${index}_url`]}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="flex-shrink-0 text-red-600 hover:text-red-800 p-1 mt-1"
                  title={t('dashboard.removeLink', 'Remove link')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <LinkIcon className="mx-auto w-8 h-8 text-gray-400 mb-3" />
          <p className="text-gray-500 mb-2">
            {t('dashboard.noLinks', 'No links added yet')}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            {t('dashboard.linksHelp', 'Add links to related resources, research papers, or external websites')}
          </p>
          <button
            type="button"
            onClick={addLink}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('dashboard.addFirstLink', 'Add First Link')}
          </button>
        </div>
      )}
      
      {/* Guidelines */}
      {links.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            {t('dashboard.linkGuidelines', 'Link Guidelines')}
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• {t('dashboard.linkGuideline1', 'Use descriptive names that clearly indicate the resource')}</li>
            <li>• {t('dashboard.linkGuideline2', 'Ensure URLs are complete and accessible')}</li>
            <li>• {t('dashboard.linkGuideline3', 'Test links before publishing to verify they work')}</li>
            <li>• {t('dashboard.linkGuideline4', 'Remove empty links before saving')}</li>
          </ul>
        </div>
      )}
    </div>
  );
}; 