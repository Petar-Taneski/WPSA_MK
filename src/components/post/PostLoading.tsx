import React from "react";
import { useTranslation } from "react-i18next";

const PostLoading: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] w-full">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
      <p>{t("post.loading")}</p>
    </div>
  );
};

export default PostLoading;
