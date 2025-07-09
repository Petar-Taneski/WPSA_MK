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

/**
 * Parses a date string in various formats (ISO, '15 May 2025', '11 октомври 2024 г.', etc.)
 * Returns a Date object if valid, otherwise null.
 */
export function parseDateString(dateString: string): Date | null {
  if (!dateString) return null;
  // Try native Date parsing first
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) return date;

  // Try '15 May 2025' (day month year, English)
  let match = dateString.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/);
  if (match) {
    const [, day, month, year] = match;
    return new Date(`${year}-${month}-${day}`);
  }

  // Try '11 октомври 2024 г.' (day month year, Macedonian, with or without 'г.')
  match = dateString.match(/^(\d{1,2}) ([^\d]+) (\d{4})(?: г\.)?$/);
  if (match) {
    const [, day, mkMonth, year] = match;
    // Map Macedonian month names to numbers
    const mkMonths = [
      "јануари",
      "февруари",
      "март",
      "април",
      "мај",
      "јуни",
      "јули",
      "август",
      "септември",
      "октомври",
      "ноември",
      "декември",
    ];
    const monthIndex = mkMonths.findIndex((m) =>
      mkMonth.trim().toLowerCase().startsWith(m)
    );
    if (monthIndex !== -1) {
      // JS months are 0-based
      return new Date(Number(year), monthIndex, Number(day));
    }
  }

  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const undefinedToNull = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "undefined") {
      obj[key] = null;
    }
  });
  return obj;
};
