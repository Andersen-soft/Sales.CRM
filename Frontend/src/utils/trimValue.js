// @flow

export default (value: any) => value ? value.trim() : value;

export const crmTrim = (text: string) => {
    // trow
    if (typeof text !== 'string') {
        throw new Error('value isn\'t a string');
    }

    const trimmedText = text.trim();

    if (trimmedText) {
        return trimmedText
            .replace(/ {2,}/g, ' ')
            .replace(/\s{2,}/g, '\n');
    }

    return '';
};
