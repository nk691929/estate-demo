export type LeadStatus =
  | "new"
  | "contacted"
  | "viewing"
  | "negotiating"
  | "won"
  | "lost";

export type LeadSource = "property" | "contact";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  source: LeadSource;
  propertyId?: string;
  propertyTitle?: string;
  status: LeadStatus;
  createdAt: string;
  notes: string;
  archived: boolean;
}