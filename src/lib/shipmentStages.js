// Mirrors STAGE_ORDER in ImportEase-Backend/shipment_routes.py -- a shipment
// can only ever move to the next stage in this list, never skip or go back.
export const STAGE_ORDER = [
  "draft",
  "assigned",
  "cusdec_lodged",
  "duty_paid",
  "inspection",
  "cargo_released",
];

export const STAGE_LABELS = {
  draft: "Draft",
  assigned: "Assigned",
  cusdec_lodged: "CUSDEC Lodged",
  duty_paid: "Duty Paid",
  inspection: "Inspection",
  cargo_released: "Cargo Released",
};

export const STAGE_DESCRIPTIONS = {
  draft: "Shipment created and not yet assigned to a clearing agent.",
  assigned: "A clearing agent has been assigned and will begin processing your shipment.",
  cusdec_lodged: "The customs declaration (CUSDEC) has been lodged with customs.",
  duty_paid: "Applicable duties and taxes have been paid.",
  inspection: "The shipment is undergoing customs inspection.",
  cargo_released: "Cargo has been released -- clearance is complete.",
};

export function stageIndex(stage) {
  const index = STAGE_ORDER.indexOf(stage);
  return index === -1 ? 0 : index;
}

export function nextStage(stage) {
  const index = stageIndex(stage);
  return index >= STAGE_ORDER.length - 1 ? null : STAGE_ORDER[index + 1];
}

export function isFinalStage(stage) {
  return stageIndex(stage) === STAGE_ORDER.length - 1;
}
