export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type ConsentState = Record<ConsentCategory, boolean>;

export type ConsentRecord = {
  version: number;
  decided: boolean;
  categories: ConsentState;
};
