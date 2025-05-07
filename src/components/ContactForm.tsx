import React, { useState, useRef, useEffect } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
// import { toastDefaultOptions } from 'lib/consts';
import { toast } from "react-toastify";
// import { validateEmail } from 'lib/utils';
import { useTranslation } from "react-i18next";
import { SOCIAL_MEDIA_LINKS } from "@/utils/consts";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // const recaptcha = useRef<ReCAPTCHA>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // const sitekey = import.meta.env.VITE_RECAPTCHA_SITEKEY;

  // Simple email validation
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Mock handleSubmit function
  const handleSubmit = () => {
    // const token = recaptcha?.current?.getValue();
    if (name === "" || email === "" || message === "") {
      toast.error(t("contact.errors.emptyFields"));
      return;
    }
    if (!validateEmail(email)) {
      toast.error(t("contact.errors.invalidEmail"));
      return;
    }

    // Mock successful submission
    toast.success(t("contact.success.messageSent"));

    // Reset form
    setName("");
    setEmail("");
    setMessage("");

    // Close modal
    onClose();
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(t("contact.clipboard.success", { type }));
      },
      (err) => {
        toast.error(t("contact.clipboard.error", { error: err }));
      }
    );
  };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current overflow value
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Disable scrolling on body
      document.body.style.overflow = "hidden";

      // Re-enable scrolling when component unmounts or modal closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // const handleSubmit = async () => {
  //   const token = recaptcha?.current?.getValue();
  //   if (name === "" || email === "" || message === "" || !token) {
  //     toast.error("Please fill in all fields.", toastDefaultOptions);
  //     return;
  //   }
  //   if (!validateEmail(email)) {
  //     toast.error("Please enter a valid email address.", toastDefaultOptions);
  //     return;
  //   }
  //   try {
  //     await sendContactEmail({ name, email, message, token });
  //     toast.success("Message sent successfully!", toastDefaultOptions);
  //     setName("");
  //     setEmail("");
  //     setMessage("");
  //   } catch (error: any) {
  //     toast.error(
  //       error.message || "Failed to send message. Please try again.",
  //       toastDefaultOptions
  //     );
  //   }
  // };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  if (!isOpen) return null;

  // Contact information
  const phoneNumber = "+389 71 234 567";
  const emailAddress = "contact@example.com";

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-gray-800/50 overflow-hidden"
      onClick={handleClickOutside}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-8 md:p-10 max-w-md w-full max-h-[90vh] overflow-y-auto z-[1002] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-gray-700"
            aria-label={t("common.close")}
          >
            ✕
          </button>
        </div>

        {/* Localized Title */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold md:text-3xl text-primary">
            {t("contact.mainTitle")}
          </h1>
        </div>

        <div className="w-full text-gray-800/85 h-fit">
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("contact.form.namePlaceholder")}
              className="w-full bg-white text-gray-800/85 placeholder:text-gray-800/85 border-b border-primary laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
            />

            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("contact.form.emailPlaceholder")}
              className="laptop-l:mt-[30px] mt-[21px] w-full bg-white text-gray-800/85 placeholder:text-gray-800/85 border-b border-primary focus:outline-none focus:border-primary"
            />
            <label
              htmlFor="message"
              className="laptop-l:mt-[30px] mt-[21px] text-gray-800/85"
            >
              {t("contact.form.messageLabel")}
            </label>

            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                e.target.style.height = "auto"; // Reset height
                e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on content
              }}
              className="border-b border-primary w-full h-fit bg-white text-gray-800/85 resize-none overflow-hidden laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
              rows={1}
            />
            {/* {sitekey && (
              <div className="my-2">
                {<ReCAPTCHA ref={recaptcha} sitekey={sitekey} />}
              </div>
            )} */}
            <button
              type="submit"
              className="self-center px-6 py-3 mt-6 font-medium transition-all duration-300 rounded-sm shadow-lg cursor-pointer hover:scale-101 w-fit text-primary hover:shadow-xl"
            >
              {t("contact.form.submitButton")}
            </button>
          </form>

          {/* Contact Info Section */}
          <div className="relative pt-6 mt-8 border-t border-gray-200">
            <div className="absolute top-5 right-0 max-[360px]:top-6 max-[360px]:space-x-1 flex space-x-2">
              {SOCIAL_MEDIA_LINKS.map((social) => (
                <div
                  key={social.name}
                  className="hover:scale-102 hover:shadow-sm shadow-primary hover:border-1 rounded-sm p-0.5 hover:border-primary transition-all duration-100"
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="text-gray-600 hover:text-primary flex items-center justify-center w-6 h-6 max-[360px]:w-5 max-[360px]:h-5"
                  >
                    <img
                      src={social.icon}
                      alt={social.name}
                      className="w-full h-full bg-transparent"
                    />
                  </a>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div
                className="flex items-center space-x-2 transition-colors cursor-pointer hover:text-primary"
                onClick={() =>
                  copyToClipboard(phoneNumber, t("contact.info.phone"))
                }
              >
                <span className="material-icons text-primary">phone</span>
                <span>{phoneNumber}</span>
              </div>
              <div
                className="flex items-center space-x-2 transition-colors cursor-pointer hover:text-primary"
                onClick={() =>
                  copyToClipboard(emailAddress, t("contact.info.email"))
                }
              >
                <span className="material-icons text-primary">email</span>
                <span>{emailAddress}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {t("contact.info.clickToCopy")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
