// @flow

export type MultiValuedParams = {
    [key: string]: Array<string>
};

const stringifyMultiValuedParam = ([key, values]): string => (
    (values: any).map((val: string) => `${key}=${val}`).join('&')
);

export const getMultiValuedParamsString = (multiParams: MultiValuedParams): string => (
    Object.entries(multiParams)
        .map(stringifyMultiValuedParam)
        .join('&')
);

export default function applyMultiParams(url: string, multiParams: MultiValuedParams): string {
    return url.concat(
        url.includes('?') ? '&' : '?',
        getMultiValuedParamsString(multiParams),
    );
}
