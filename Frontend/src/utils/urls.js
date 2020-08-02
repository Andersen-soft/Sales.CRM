// @flow

export const removeProtocol = (url:string = '') => url.replace(/^https?:\/\//, '');
