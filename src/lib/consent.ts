export const ANALYTICS_CONSENT_KEY = "ombachi_analytics_consent";
export const ANALYTICS_CONSENT_EVENT = "ombachi:analytics-consent";

export type AnalyticsConsent = "accepted" | "declined";

export const getAnalyticsConsent = (): AnalyticsConsent | null => {
  const value = localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === "accepted" || value === "declined" ? value : null;
};

export const setAnalyticsConsent = (value: AnalyticsConsent) => {
  localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: value }));
};

export const openCookiePreferences = () => {
  window.dispatchEvent(new Event("ombachi:open-cookie-preferences"));
};