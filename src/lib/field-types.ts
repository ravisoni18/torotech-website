/** Client-safe field definition types. */
export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "url" | "date" | "list";
export const FIELD_TYPES: FieldType[] = ["text", "textarea", "number", "boolean", "select", "url", "date", "list"];
export type FieldEntity = "service" | "case_study" | "post" | "page" | "lead";
export const FIELD_ENTITIES: { value: FieldEntity; label: string }[] = [
  { value: "service", label: "Service" },
  { value: "case_study", label: "Case study" },
  { value: "post", label: "Insight" },
  { value: "page", label: "Page" },
  { value: "lead", label: "Lead (contact form)" },
];

export type FieldDef = {
  id: string;
  entity: FieldEntity;
  key: string;
  label: string;
  type: FieldType;
  options: string[];
  required: boolean;
  sort_order: number;
};
