export type ContactMessage = { name: string; email: string; message: string; website: string };
export type ContactResult = { ok: boolean; message: string };
export type SendContact = (message: ContactMessage) => Promise<ContactResult>;
export type DeliverContact = (message: ContactMessage) => Promise<void>;
