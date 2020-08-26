// @flow

export const PHONE_REGEXP: RegExp = /([0-9\+\(\)\-\ ])$/;
export const ALLOWED_PHONE_SYMBOLS: RegExp = /^[\d+\s-()]*$/gm;
export const SITE_REGEXP: RegExp = /^https?:\/\/[\w\d-]{1,}\.([\w\d\.&#-=?%]{2,})$/;
export const EMAIL_REGEXP: RegExp = /^['-._A-Za-z0-9]+@(?:[A-Za-z0-9][-a-z0-9]+\.)+[A-Za-z]{2,}|^$/;
export const PASSWORD_REGEXP: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])[a-zA-Z\d]{6,12}$/;
export const CYRILLIC_REGEXP = /\W/;
export const SKYPE_REGEXP: RegExp = /^[_.:A-Za-z0-9]+$/;
