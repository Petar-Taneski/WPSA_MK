import { db } from "@/config/firebase";
import { addDoc, collection } from "firebase/firestore";

export * from "./api/events";
export * from "./api/images";
export * from "./api/news";

export const sendJoinUsEmail = async (formData: {
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  zvanje: string;
  pol: string;
  datumNaRagjanje: string;
  kompanija: string;
  adresa: string;
  postenskiBroj: string;
  grad: string;
}) => {
  try {
    const emailText = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    await addDoc(collection(db, "mail"), {
      to: ["1nikolablagoevski6@gmail.com"],
      message: {
        subject: "Пријавување на нов член",
        text: emailText,
      },
    });
  } catch (error) {
    console.error("Error sending join us email:", error);
    throw error;
  }
};
