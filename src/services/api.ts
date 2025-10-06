import { db } from "@/config/firebase";
import { addDoc, collection } from "firebase/firestore";

export * from "./api/events";
export * from "./api/images";
export * from "./api/news";

const CONTACT_TO: string =
  (import.meta.env.VITE_CONTACT_TO as string | undefined) ?? "";

/** Parse comma-separated recipients into string | string[] for the Firebase Email extension */
function recipients(): string | string[] {
  if (!CONTACT_TO) {
    throw new Error("Missing env variable in your environment.");
  }
  const list = CONTACT_TO.split(",").map((s) => s.trim()).filter(Boolean);
  if (list.length === 0) {
    throw new Error("env variable is empty. Please add at least one address.");
  }
  return list.length === 1 ? list[0] : list;
}


/** --- NEW: for your ContactForm modal --- */
export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export const sendContactEmail = async (data: ContactPayload): Promise<void> => {
  const to = recipients();

  const text = `Name: ${data.name}
Email: ${data.email}

Message:
${data.message}
`;


  await addDoc(collection(db, "mail"), {
    to,
    replyTo: data.email,
    message: {
      subject: `Contact: ${data.name}`,
      text,
    },
  });
};

export interface JoinUsFormData {
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
}

export const sendJoinUsEmail = async (formData: JoinUsFormData): Promise<void> => {
  try {
    const to = recipients();

    const emailText = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    await addDoc(collection(db, "mail"), {
      to,
      replyTo: formData.email,
      message: {
        subject: "Пријавување на нов член",
        text: emailText,
      },
    });
  } catch (error) {
    // keep your behavior
    console.error("Error sending join us email:", error);
    throw error;
  }
};
//nikogasseverna