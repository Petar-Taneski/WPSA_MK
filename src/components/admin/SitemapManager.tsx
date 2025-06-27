import { useState } from "react";
import { generateSitemap, downloadSitemap } from "@/utils/sitemap";
import { Download, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

const SitemapManager = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");

  const handleGenerateSitemap = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const sitemapXml = await generateSitemap();
      setPreviewContent(sitemapXml);
      setLastGenerated(new Date().toLocaleString());
    } catch (err) {
      setError(
        "Failed to generate sitemap. Please check your connection and try again."
      );
      console.error("Sitemap generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSitemap = async () => {
    if (previewContent) {
      // Download the already generated content
      const blob = new Blob([previewContent], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sitemap.xml";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Generate and download
      try {
        await downloadSitemap();
      } catch (err) {
        setError("Failed to download sitemap.");
        console.error("Sitemap download error:", err);
      }
    }
  };

  const urlCount = previewContent
    ? (previewContent.match(/<url>/g) || []).length
    : 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-4">Sitemap Management</h2>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Generate a dynamic sitemap that includes all static pages, news
          articles, and events. This sitemap will automatically include all
          content from your Firebase database.
        </p>

        <div className="flex gap-4 mb-4">
          <button
            onClick={handleGenerateSitemap}
            disabled={isGenerating}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Sitemap
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSitemap}
            disabled={!previewContent && !isGenerating}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Sitemap
          </button>
        </div>

        {lastGenerated && (
          <div className="flex items-center text-sm text-green-600 mb-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            Last generated: {lastGenerated} ({urlCount} URLs)
          </div>
        )}

        {error && (
          <div className="flex items-center text-sm text-red-600 mb-2">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
      </div>

      {previewContent && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Sitemap Preview</h3>
          <div className="bg-gray-50 p-4 rounded-md border max-h-64 overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {previewContent.length > 2000
                ? `${previewContent.substring(
                    0,
                    2000
                  )}...\n\n[Content truncated - Full sitemap available in download]`
                : previewContent}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="font-semibold mb-2">Instructions:</h4>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
          <li>
            Click "Generate Sitemap" to create a current version with all
            content
          </li>
          <li>Review the preview to ensure all URLs are included</li>
          <li>Download the sitemap.xml file</li>
          <li>Upload the sitemap.xml to your website root directory</li>
          <li>
            Submit the sitemap URL (https://wpsa.mk/sitemap.xml) to Google
            Search Console
          </li>
        </ol>
      </div>
    </div>
  );
};

export default SitemapManager;
