import { db } from "@/config/firebase";
import { addDoc, collection } from "firebase/firestore";

export * from "./api/events";
export * from "./api/images";
export * from "./api/news";

const CONTACT_TO: string =
  (import.meta.env.VITE_CONTACT_TO as string | undefined) ?? "";

/** Parse comma-separated recipients into string | string[] for the Firebase Email extension */
function recipients(): string | string[] {
  const list = CONTACT_TO.split(",").map((s) => s.trim()).filter(Boolean);
  if (list.length === 0) {
    return "petar686@gmail.com"; // fallback to avoid silent no-recipient
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

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
      <p> ${escapeHtml(data.name)}</p>
      <p>${escapeHtml(data.email)}</p>
      <p><strong>Message:</strong></p>
      <div>${escapeHtml(data.message)}</div>
    </div>
  `;

  await addDoc(collection(db, "mail"), {
    to,
    replyTo: data.email,
    message: {
      subject: `Contact: ${data.name}`,
      text,
      html,
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

/** small HTML escaper (TS-safe, no any) */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

