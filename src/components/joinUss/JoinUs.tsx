import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const JoinUs: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen: initialIsOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [zvanje, setZvanje] = useState("");
  const [pol, setPol] = useState("");
  const [datumNaRagjanje, setDatumNaRagjanje] = useState("");
  const [kompanija, setKompanija] = useState("");
  const [adresa, setAdresa] = useState("");
  const [postenskiBroj, setPostenskiBroj] = useState("");
  const [grad, setGrad] = useState("");

  useEffect(() => {
    setIsOpen(initialIsOpen);
  }, [initialIsOpen]);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (
      ime === "" ||
      prezime === "" ||
      email === "" ||
      telefon === "" ||
      zvanje === "" ||
      pol === "" ||
      datumNaRagjanje === "" ||
      kompanija === "" ||
      adresa === "" ||
      postenskiBroj === "" ||
      grad === ""
    ) {
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
    setIme("");
    setPrezime("");
    setEmail("");
    setTelefon("");
    setZvanje("");
    setPol("");
    setDatumNaRagjanje("");
    setKompanija("");
    setAdresa("");
    setPostenskiBroj("");
    setGrad("");

    // Close modal
    onClose();
  };

  // const handleSubmit = async () => {
  //   const token = recaptcha?.current?.getValue();
  //   if (ime === "" || prezime === "" || email === "" || telefon === "" || zvanje === "" || pol === "" || datumNaRagjanje === "" || kompanija === "" || adresa === "" || postenskiBroj === "" || grad === "" || !token) {
  //     toast.error("Please fill in all fields.", toastDefaultOptions);
  //     return;
  //   }
  //   if (!validateEmail(email)) {
  //     toast.error("Please enter a valid email address.", toastDefaultOptions);
  //     return;
  //   }
  //   try {
  //     await sendJoinUsEmail({ ime, prezime, email, telefon, zvanje, pol, datumNaRagjanje, kompanija, adresa, postenskiBroj, grad, token });
  //     toast.success("Message sent successfully!", toastDefaultOptions);
  //     setIme("");
  //     setPrezime("");
  //     setEmail("");
  //     setTelefon("");
  //     setZvanje("");
  //     setPol("");
  //     setDatumNaRagjanje("");
  //     setKompanija("");
  //     setAdresa("");
  //     setPostenskiBroj("");
  //     setGrad("");
  //   } catch (error: any) {
  //     toast.error(
  //       error.message || "Failed to send message. Please try again.",
  //       toastDefaultOptions
  //     );
  //   }
  // };

  // Simple email validation
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[1001] flex items-center justify-center bg-gray-800/50 overflow-hidden"
        onClick={handleClickOutside}
        aria-modal="true"
        role="dialog"
      >
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-xl p-8 md:p-10 max-w-md w-full max-h-[90vh] overflow-y-auto z-[1002] relative mx-4"
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

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold md:text-3xl text-primary">
              {t("joinUs.mainTitle")}
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
                id="ime"
                name="ime"
                value={ime}
                onChange={(e) => setIme(e.target.value)}
                placeholder={t("joinUs.form.imePlaceholder")}
                className="w-full bg-white text-gray-800/85 placeholder:text-gray-800/85 border-b border-primary laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                id="prezime"
                name="prezime"
                value={prezime}
                onChange={(e) => setPrezime(e.target.value)}
                placeholder={t("joinUs.form.prezimePlaceholder")}
                className="w-full bg-white text-gray-800/85 placeholder:text-gray-800/85 border-b border-primary laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
              />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("joinUs.form.emailPlaceholder")}
                className="w-full bg-white text-gray-800/85 placeholder:text-gray-800/85 border-b border-primary laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
              />
              <input
                type="tel"
                id="telefon"
                name="telefon"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder={t("joinUs.form.telefonPlaceholder")}
                className="w-full bg-white text-gray-800/85 placeholder:text-gray-800/85 border-b border-primary laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                id="zvanje"
                name="zvanje"
                value={zvanje}
                onChange={(e) => setZvanje(e.target.value)}
                placeholder={t("joinUs.form.zvanjePlaceholder")}
                className="w-full bg-white text-gray-800/85 placeholder:text-gray-800/85 border-b border-primary laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
              />
              <select
                id="pol"
                name="pol"
                value={pol}
                onChange={(e) => setPol(e.target.value)}
                className="w-full bg-white text-gray-800/85 border-b border-primary laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
              >
                <option value="" disabled>
                  {t("joinUs.form.polPlaceholder")}
                </option>
                <option value="male">{t("joinUs.form.male")}</option>
                <option value="female">{t("joinUs.form.female")}</option>
              </select>
              <input
                type="date"
                id="datumNaRagjanje"
                name="datumNaRagjanje"
                value={datumNaRagjanje}
                onChange={(e) => setDatumNaRagjanje(e.target.value)}
                placeholder={t("joinUs.form.datumNaRagjanjePlaceholder")}
                className="w-full bg-white text-gray-800/85 placeholder:text-gray-800/85 border-b border-primary laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                id="kompanija"
                name="kompanija"
                value={kompanija}
                onChange={(e) => setKompanija(e.target.value)}
                placeholder={t("joinUs.form.kompanijaPlaceholder")}
                className="w-full bg-white text-gray-800/85 placeholder:text-gray-800/85 border-b border-primary laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                id="adresa"
                name="adresa"
                value={adresa}
                onChange={(e) => setAdresa(e.target.value)}
                placeholder={t("joinUs.form.adresaPlaceholder")}
                className="w-full bg-white text-gray-800/85 placeholder:text-gray-800/85 border-b border-primary laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                id="postenskiBroj"
                name="postenskiBroj"
                value={postenskiBroj}
                onChange={(e) => setPostenskiBroj(e.target.value)}
                placeholder={t("joinUs.form.postenskiBrojPlaceholder")}
                className="w-full bg-white text-gray-800/85 placeholder:text-gray-800/85 border-b border-primary laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                id="grad"
                name="grad"
                value={grad}
                onChange={(e) => setGrad(e.target.value)}
                placeholder={t("joinUs.form.gradPlaceholder")}
                className="w-full bg-white text-gray-800/85 placeholder:text-gray-800/85 border-b border-primary laptop-l:mt-[15px] mt-[10px] focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="self-center px-6 py-3 mt-6 font-medium transition-all duration-300 rounded-sm shadow-lg cursor-pointer hover:scale-101 w-fit text-primary hover:shadow-xl"
              >
                {t("contact.form.submitButton")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinUs;
