// @flow

import crmRequest from 'crm-helpers/api/crmRequest';

const URL_GET_CATEGORY: string = '/company_sale/get_categories';

export default () => crmRequest({
    url: URL_GET_CATEGORY,
    method: 'GET',
});
