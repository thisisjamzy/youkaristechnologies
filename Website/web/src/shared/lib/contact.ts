/**
 * Contact-field rules shared by the sign-up and role application schemas. They mirror
 * checkPhone_ and checkEmail_ in Website/apps-script/Code.gs, so the browser, our routes and
 * the backend agree on what is valid.
 */

export const CONTACT_LIMITS = { email: 254, phone: 40 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9 ()-]{6,}$/;
const PHONE_MIN_DIGITS = 7;

export const isValidEmail = (value: string) => value.length <= CONTACT_LIMITS.email && EMAIL.test(value);

export const isValidPhone = (value: string) =>
  PHONE.test(value) && value.replace(/\D/g, "").length >= PHONE_MIN_DIGITS;
