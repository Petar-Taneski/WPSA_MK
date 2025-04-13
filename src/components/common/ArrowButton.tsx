import { ArrowRight } from "lucide-react";

type Props = {
  text: string;
  onClick: () => void;
  className?: string;
};

export default function ArrowButton({ text, onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={`hover:scale-101 transition-all duration-300 inline-flex cursor-pointer items-center gap-2 px-6 py-3 text-primary font-medium rounded-sm hover:shadow-lg shadow-md ${className}`}
      aria-label={text}
    >
      {text}
      <ArrowRight className="w-4 h-4 ml-1" />
    </button>
  );
}
