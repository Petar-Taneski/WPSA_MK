import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

export const toTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// export const toTopMobile = () => {
//   gsap.to(window, {
//     duration: 1,
//     scrollTo: 0,
//     ease: "power2.inOut",
//   });
// };

// export const copyToClipboard = (text: string) => {
//   navigator.clipboard.writeText(text);
//   toast.success(`${text} copied to clipboard.`, toastDefaultOptions);
// };

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatDate = (date: number, language: string) => {
  const dateObj = new Date(date);
  const locale = language === "en" ? "en-GB" : "mk-MK";
  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
