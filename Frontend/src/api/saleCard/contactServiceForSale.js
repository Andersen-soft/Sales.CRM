// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

const URL_UPDATE_CONTACT: string = '/contact/update_contact';

export const updateContact = (companyId: number, data: Request) => (
    crmRequest({
        url: URL_UPDATE_CONTACT,
        method: 'PUT',
        params: { id: companyId },
        data,
        headers: { 'content-type': 'application/json' },
    })
);
