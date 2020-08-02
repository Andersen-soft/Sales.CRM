// @flow

import type { AxiosXHR, AxiosXHRConfig } from 'axios';
import type { CRMResponse } from 'crm-types/resourceDataTypes';

// TODO: extend AxiosError after flow-typed integration
export class CRMError extends Error {
    constructor(response: AxiosXHR) {
        const {
            responseCode,
            errorCode,
            errorMessage,
        }: CRMResponse = response.data;

        super(errorMessage);

        this.status = responseCode;
        this.code = errorCode;
        this.request = response.request;
        this.config = response.config;
        this.response = response;
    }

    status: number;

    code: string | null;

    request: XMLHttpRequest;

    config: AxiosXHRConfig;

    response: AxiosXHR;
}

CRMError.prototype.name = 'CRMError';
