// @flow

import crmRequest from 'crm-helpers/api/crmRequest';
import qs from 'qs';
import trimValue from 'crm-utils/trimValue';
import { PAGE_SIZE } from 'crm-constants/reportBySocialContactsPage/socialContactsConstants';
import getObjectWithoutEmptyProperties from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';

const URL_FETCH_SOCIAL_CONTACTS_FOR_SALE = '/social_answer';
const URL_REJECT_SOCIAL_CONTACT_FOR_SALE = '/social_answer/reject';
const URL_APPLY_SOCIAL_CONTACT_FOR_SALE = '/social_answer/save';

type BuiltRowItem = {
    name?: string,
    id?: number,
};

type BuiltRowForUpdateType = {
    id?: number,
    companyName?: string | null,
    country?: BuiltRowItem | null,
    created?: string | null,
    email?: string | null,
    emailPrivate?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    linkLead?: string | null,
    message?: string | null,
    phone?: string | null,
    phoneCompany?: string | null,
    position?: string | null,
    sex?: string | null,
    skype?: string | null,
};

type SalesContactParamsType = {
    search: string,
    page?: ?number,
    status?: string,
    currentUserId: number,
};

const fetchSocialContactsForSale = ({
    search,
    page,
    status,
    currentUserId,
}: SalesContactParamsType) => crmRequest({
    url: URL_FETCH_SOCIAL_CONTACTS_FOR_SALE,
    method: 'GET',
    params: getObjectWithoutEmptyProperties({
        'search': trimValue(search),
        page,
        'size': PAGE_SIZE,
        status,
        'socialNetworkContact.sales': currentUserId,
        'sort': 'createDate,desc',
    }),
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

const rejectSocialAnswer = (ids: Array<mixed>) => crmRequest({
    url: URL_REJECT_SOCIAL_CONTACT_FOR_SALE,
    method: 'POST',
    data: ids,
});

const applySocialAnswer = (ids: Array<mixed>) => crmRequest({
    url: URL_APPLY_SOCIAL_CONTACT_FOR_SALE,
    method: 'POST',
    data: ids,
});

const updateSocialAnswerByID = (id: number, data: BuiltRowForUpdateType) => crmRequest({
    url: `${URL_FETCH_SOCIAL_CONTACTS_FOR_SALE}/${id}`,
    method: 'PUT',
    data,
});

export {
    fetchSocialContactsForSale,
    rejectSocialAnswer,
    applySocialAnswer,
    updateSocialAnswerByID,
};
