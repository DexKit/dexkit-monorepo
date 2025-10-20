export const CUSTOM_DOMAINS_PRICE = 100;

export const ECOMMERCE_PRICE = 0.5;

export const API_KEY_PRICE = 0.0001;

export const API_KEY_FREE_MONTHLY_LIMIT = 100000;


export const FREE_PLAN = "free";
export const FREE_PLAN_NAME = "Free";

export enum SUBSCRIPTION_STATUS {
  active = "active",
}

export const AI_FEATS = ["image", "chat-input", "chat-output"];

export const CUSTOM_DOMAINS_AND_SIGNATURE_FEAT = "custom-domains-signature";

export const WIDGET_SIGNATURE_FEAT = 'widget-signature';

export const ECOMMERCE_FEAT = "ecommerce";

export const CUSTOM_DOMAINS_AND_SIGNATURE_FEAT_FREE_PLAN_SLUG = `custom-domains-signature;${FREE_PLAN}`;

export const FEATS_WITHOUT_MODEL = [CUSTOM_DOMAINS_AND_SIGNATURE_FEAT, WIDGET_SIGNATURE_FEAT, ECOMMERCE_FEAT];
