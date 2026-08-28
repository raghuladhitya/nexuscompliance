// Mock CustomFieldDefinition + CustomFieldValue data.

export const ENTITY_OPTIONS = ["Student", "Staff", "Enrolment", "Guardian"];
export const FIELD_TYPES = ["text", "number", "date", "boolean", "select"];

export const CUSTOM_FIELD_DEFINITIONS = [
  { id: "cf_001", entity_name: "Student", field_label: "Crisis contact", field_type: "text" },
  { id: "cf_002", entity_name: "Student", field_label: "Hall of residence", field_type: "select", select_options: ["North Halls", "South Halls", "Off-campus"] },
  { id: "cf_003", entity_name: "Student", field_label: "Visa expiry", field_type: "date" },
  { id: "cf_004", entity_name: "Staff", field_label: "DBS check expiry", field_type: "date" },
];

export const CUSTOM_FIELD_VALUES = [
  { field_definition_id: "cf_001", entity_id: "STU-2021-4471", value: "Robert Whitfield (father) — 07700 900123" },
  { field_definition_id: "cf_002", entity_id: "STU-2021-4471", value: "Off-campus" },
  { field_definition_id: "cf_003", entity_id: "STU-2021-4471", value: "2027-01-31" },
  { field_definition_id: "cf_004", entity_id: "STF-001", value: "2026-11-30" },
];

export function definitionsForEntity(entityName) {
  return CUSTOM_FIELD_DEFINITIONS.filter((d) => d.entity_name === entityName);
}