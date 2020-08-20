// @flow

import { pathOr } from 'ramda';
import { SOURCE_REFERENCE_ID } from 'crm-constants/salePage/saleCardConstant';
import { NEW_COMPANY } from 'crm-constants/addSaleModal/addSaleModalConstatnts';

type Employee = {
    id: number,
    firstName: string,
    lastName: string,
    responsibleRm: boolean,
}

type valuesType = {
    company: { responsibleRm: Employee },
    source: {
        label: string,
        value: number,
    },
    recomendation: { responsibleRm: Employee },
    createNewCompany: string,
}

const getRm = (values: valuesType) => {
    const { company, source, recomendation, createNewCompany } = values;

    if (createNewCompany === NEW_COMPANY) {
        return (pathOr(null, ['value'], source) === SOURCE_REFERENCE_ID)
            && pathOr(null, ['responsibleRm'], recomendation);
    } else {
        return pathOr(null, ['responsibleRm'], company)
            || ((pathOr(null, ['value'], source) === SOURCE_REFERENCE_ID)
                && pathOr(null, ['responsibleRm'], recomendation));
    }
};

const getDeliveryDirector = (values: valuesType) => {
    const rm = getRm(values);

    if (rm && rm.responsibleRM) {
        const { id, firstName, lastName } = rm;

        return { label: `${firstName} ${lastName}`, value: id };
    }

    return null;
};

export default getDeliveryDirector;
