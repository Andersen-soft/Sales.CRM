// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

const URL_DOWNLOAD_FILE = '/file/download';

export const downloadFile = (id: number) => crmRequest({
    url: `${URL_DOWNLOAD_FILE}/${id}`,
    method: 'GET',
    responseType: 'blob',
});
