// @flow

import axios, { CancelToken } from 'axios';
import { path, isNil } from 'ramda';
import type {
    Axios,
    AxiosXHRConfig,
    AxiosPromise,
    AxiosXHR,
} from 'axios';

import auth from 'crm-helpers/auth';
import { CRMError } from 'crm-utils/errors';
import {
    CREATE_EXPRESS_SALE,
    URL_GET_PUBLIC_RESPONSIBLE_EMPLOYEES,
    CREATE_MAIL_EXPRESS_SALE,
} from 'crm-api/ExpressSale/ExpressSale';
import { REQUEST_WAS_CANCELED } from 'crm-constants/common/constants';
import {
    URL_LOGIN, URL_LOGOUT, URL_REFRESH,
} from 'crm-constants/authConstants';
import { URL_CHECK_TOKEN } from 'crm-api/login/loginService';
import getCurrentLanguage from 'crm-utils/getCurrentLanguage';
import type { CRMResponse } from 'crm-types/resourceDataTypes';

import EventEmitter from 'crm-helpers/eventEmitter';
import type { MultiValuedParams } from './applyMultiParams';
import applyMultiParams from './applyMultiParams';

const URL_GET_COUNTRY = '/country';

const OPEN_URLS = [
    URL_GET_COUNTRY,
    CREATE_EXPRESS_SALE,
    URL_GET_PUBLIC_RESPONSIBLE_EMPLOYEES,
    CREATE_MAIL_EXPRESS_SALE,
];

const axiosForCRM: Axios = axios.create({
    baseURL: process.env.API_URL || '',
    timeout: 60000,
});

let cancelRequest;
let prevUrl = '';

const isLogin = httpResponse => httpResponse.config.url.endsWith(URL_LOGIN);

const isLoginOrRefresh = httpResponse => httpResponse.config.url.endsWith(URL_LOGIN)
    || httpResponse.config.url.endsWith(URL_REFRESH);

const httpSuccessHandler = (httpResponse: AxiosXHR) => {
    const crmResponse: CRMResponse | null = httpResponse.data;

    if (!crmResponse || (crmResponse.responseCode && crmResponse.responseCode !== 200)) {
        throw new CRMError(httpResponse);
    }

    if (isLoginOrRefresh(httpResponse)) {
        auth.saveAccessToken(httpResponse.headers.authorization);
        auth.saveRefreshToken(httpResponse.headers.refresh);
    }

    if (isLogin(httpResponse)) {
        auth.saveUserData(crmResponse.data);
    }

    return isNil(crmResponse.data) ? crmResponse : crmResponse.data;
};

// this func catches errors of two types:
// 1. Axios errors which are thrown by axios
// 2. CRM errors which are thrown by httpSuccessHandler
const commonFailureHandler = (err: CRMError): CRMError => {
    if (path(['response', 'status'], err) === 401) {
        auth.eraseSessionData();
        EventEmitter.emit('unauthorized');
    }

    if (axios.isCancel(err)) {
        throw new Error(REQUEST_WAS_CANCELED);
    }

    throw err;
};

const withCRMResponseHandler = (response: AxiosPromise): AxiosPromise => (
    response
        .then(httpSuccessHandler)
        .catch(commonFailureHandler)
);

export type CRMXHRConfig = AxiosXHRConfig & {
    multiParams?: MultiValuedParams,
};

const processingCanceledRequests = (url: string) => {
    if (prevUrl === url) {
        cancelRequest && cancelRequest();
    } else {
        prevUrl = url;
    }
};

export default function CRMRequest(reqProps: CRMXHRConfig, canceled: boolean = false): AxiosPromise {
    const { method = 'POST', multiParams } = reqProps;
    const { headers = {} } = reqProps;
    let { cancelToken = null } = reqProps;
    let { url } = reqProps;

    if (canceled) {
        processingCanceledRequests(url);

        cancelToken = new CancelToken(cancel => { cancelRequest = cancel; });
    }

    headers['Accept-Language'] = getCurrentLanguage();

    if (!headers['content-type'] && ['POST', 'PUT', 'PATCH'].includes(method)) {
        headers['content-type'] = 'application/json';
    }

    if (url !== URL_LOGIN && url !== URL_CHECK_TOKEN && !OPEN_URLS.includes(url)) {
        headers.Authorization = auth.getAccessToken();
    }

    if (url === URL_LOGOUT) {
        auth.eraseSessionData();
    }

    if (multiParams) {
        url = applyMultiParams(url, multiParams);
    }

    const {
        timeout, params, data, responseType, paramsSerializer,
    } = reqProps;

    return withCRMResponseHandler(axiosForCRM({
        url,
        method,
        params,
        headers,
        timeout,
        data,
        responseType,
        paramsSerializer,
        cancelToken,
    }));
}
