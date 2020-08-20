// @flow

import { pathOr } from 'ramda';
import crmRequest from 'crm-helpers/api/crmRequest';
import getObjectWithoutEmptyProperties from 'crm-utils/dataTransformers/getObjectWithoutEmptyProperties';

export const CREATE_EXPRESS_SALE: string = '/company_sale/express_sale';

export const CREATE_MAIL_EXPRESS_SALE: string = '/company_sale/mail_express_sale';
export const URL_GET_PUBLIC_RESPONSIBLE_EMPLOYEES: string = '/employee/get_for_express_sale';

type SaleData = {
    country: { label: string, value: number },
    comment: ?string,
    email: ?string,
    name: ?string,
    phone: ?string,
}

type MailSaleData = {
    country: { label: string, value: number } | null,
    responsible: { label: string, value: number },
    comment: ?string,
    email: ?string,
    name: ?string,
    phone: ?string,
}

export const createExpressSale = ({
    country,
    comment,
    email,
    name,
    phone,
}: SaleData) => crmRequest({
    url: CREATE_EXPRESS_SALE,
    method: 'POST',
    data: getObjectWithoutEmptyProperties({
        countryId: country.value,
        description: comment || null,
        mail: email || null,
        name: name || null,
        phone: phone || null,
    }),
});

export const getResponsible = () => crmRequest({
    url: URL_GET_PUBLIC_RESPONSIBLE_EMPLOYEES,
    method: 'GET',
});

export const createMailExpressSale = ({
    country,
    comment,
    email,
    name,
    phone,
    responsible,
}: MailSaleData) => crmRequest({
    url: CREATE_MAIL_EXPRESS_SALE,
    method: 'POST',
    data: getObjectWithoutEmptyProperties({
        countryId: pathOr(null, ['value'], country),
        responsibleId: responsible.value,
        description: comment || null,
        mail: email || null,
        name: name || null,
        phone: phone || null,
    }),
});


