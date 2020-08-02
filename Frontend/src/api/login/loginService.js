// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

export const URL_CHECK_TOKEN = '/admin/check-token';
const URL_CHANGE_PASSWORD = '/admin/change-password';

export const checkToken = (tokenId: string) => crmRequest({
    url: URL_CHECK_TOKEN,
    method: 'POST',
    data: tokenId,
});

export const changePassword = (
    login: string,
    pass: string,
    token: string,
    tokenKey: string,
) => crmRequest({
    url: URL_CHANGE_PASSWORD,
    method: 'POST',
    data: {
        login,
        pass,
        token,
        tokenKey,
    },
});

