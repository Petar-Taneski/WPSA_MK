import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface PostErrorProps {
  message: string;
}

const PostError: React.FC<PostErrorProps> = ({ message }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 m-8 max-w-xl mx-auto rounded-lg bg-red-50 border border-red-100">
      <h2 className="text-xl font-bold text-red-600 mb-4">
        {t("post.errorTitle")}
      </h2>
      <p className="mb-6 text-gray-700">{message || t("post.errorDefault")}</p>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
      >
        {t("post.goBack")}
      </button>
    </div>
  );
};

export default PostError;
