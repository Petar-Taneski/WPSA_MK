import { useTranslation } from "react-i18next";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "../ui/button";

const ShareButtons = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-gray-500">
        {t("news.shareArticle")}
      </h3>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
        >
          <Facebook className="h-5 w-5" />
          <span className="sr-only">Share on Facebook</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-sky-500 text-white hover:bg-sky-600 hover:text-white"
        >
          <Twitter className="h-5 w-5" />
          <span className="sr-only">Share on Twitter</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-green-600 text-white hover:bg-green-700 hover:text-white"
        >
          <Linkedin className="h-5 w-5" />
          <span className="sr-only">Share on LinkedIn</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-gray-800 text-white hover:bg-black hover:text-white"
        >
          <Instagram className="h-5 w-5" />
          <span className="sr-only">Share on Instagram</span>
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons;
