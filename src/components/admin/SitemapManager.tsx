import { useState } from "react";
import {
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const SitemapManager = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");

  const SITEMAP_URL = "https://wpsa-mk.com/api/sitemap";

  const handleGenerateSitemap = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(SITEMAP_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const sitemapXml = await response.text();
      setPreviewContent(sitemapXml);
      setLastGenerated(new Date().toLocaleString());
    } catch (err) {
      setError(
        "Failed to fetch sitemap from server. Please check your connection and try again."
      );
      console.error("Sitemap fetch error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSitemap = async () => {
    if (previewContent) {
      // Download the already fetched content
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
      // Fetch and download
      try {
        const response = await fetch(SITEMAP_URL);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const sitemapXml = await response.text();
        const blob = new Blob([sitemapXml], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sitemap.xml";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        setError("Failed to download sitemap.");
        console.error("Sitemap download error:", err);
      }
    }
  };

  const handleViewLive = () => {
    window.open(SITEMAP_URL, "_blank");
  };

  const urlCount = previewContent
    ? (previewContent.match(/<url>/g) || []).length
    : 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-4">Sitemap Management</h2>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Your website uses a dynamic sitemap at{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">{SITEMAP_URL}</code>{" "}
          that automatically includes all static pages and news articles from
          Firebase.
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
                Fetching...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Fetch Current Sitemap
              </>
            )}
          </button>

          <button
            onClick={handleViewLive}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live Sitemap
          </button>

          <button
            onClick={handleDownloadSitemap}
            disabled={!previewContent && !isGenerating}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Sitemap
          </button>
        </div>

        {lastGenerated && (
          <div className="flex items-center text-sm text-green-600 mb-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            Last fetched: {lastGenerated} ({urlCount} URLs)
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
                  )}...\n\n[Content truncated - Full sitemap available at live URL]`
                : previewContent}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="font-semibold mb-2">How it works:</h4>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>
            The sitemap automatically updates when new articles are published
          </li>
          <li>It includes all static pages and individual news articles</li>
          <li>Search engines can find it via robots.txt</li>
          <li>No manual intervention required - it's fully automated</li>
        </ul>

        <h4 className="font-semibold mb-2 mt-4">For SEO:</h4>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
          <li>The sitemap is already linked in robots.txt</li>
          <li>
            Submit <code className="bg-white px-1 rounded">{SITEMAP_URL}</code>{" "}
            to Google Search Console
          </li>
          <li>Check the "View Live Sitemap" to verify all URLs are included</li>
        </ol>
      </div>
    </div>
  );
};

export default SitemapManager;
