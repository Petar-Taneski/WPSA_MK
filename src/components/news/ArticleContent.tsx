interface ArticleContentProps {
  content: string;
}

const ArticleContent = ({ content }: ArticleContentProps) => {
  return (
    <div className="prose prose-lg max-w-none">
      {content.split("\n").map((paragraph, index) => (
        <p key={index} className="mb-6 text-gray-700 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default ArticleContent;
