// @flow

import {
    getCompanyCard,
    updateCompany,
    getCompaniesSearch,
} from 'crm-api/companyCardService/companyCardService';
import { updateSale } from 'crm-api/saleService';
import {
    GET_COMPANY_CARD_REQUEST,
    GET_COMPANY_CARD_SUCCESS_REQUEST,
    GET_COMPANY_CARD_ERROR,
    UPDATE_COMPANY_CARD,
    EDIT_COMMENT,
    GET_SEARCH_COMPANY_LIST,
} from 'crm-constants/salePage/companyCardConstant';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';
import type { Dispatch } from 'redux';
import type { Company } from 'crm-types/resourceDataTypes';
import Notification from 'crm-components/notification/NotificationSingleton';
import { CRMError } from 'crm-utils/errors';

type CompanyInfo = {
    description: string,
    name: string,
    phone: string,
    url: string,
    responsibleRm: {
        id: number,
        firstName: string,
        lastName: string,
    },
}

type UpdateCompanyProps = {
    description?: string,
    name?: string,
    phone?: string,
    url?: string,
    responsibleRmId?: number,
    industry?: Array<number>,
}

type Error = {
    errorCode: string,
    errorMessage: string,
    responseCode: number,
    success: boolean,
}

type ResponseCompany = {
    content: Company[],
}

export const fetchCompanyCard = (companyId: number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_COMPANY_CARD_REQUEST,
    });

    return getCompanyCard(companyId)
        .then((response: CompanyInfo) => {
            dispatch({
                type: GET_COMPANY_CARD_SUCCESS_REQUEST,
                payload: response,
            });
        })
        .catch((error: Error) => {
            dispatch({
                type: GET_COMPANY_CARD_ERROR,
                payload: error,
            });
        });
};

export const updateCompanyCard = (companyId: number, newInfo: UpdateCompanyProps) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_COMPANY_CARD_REQUEST,
    });

    return updateCompany(companyId, newInfo)
        .then(() => {
            dispatch({
                type: UPDATE_COMPANY_CARD,
            });
            dispatch(fetchCompanyCard(companyId));
            return true;
        })
        .catch((error: CRMError) => {
            dispatch({
                type: GET_COMPANY_CARD_ERROR,
                payload: error,
            });
            Notification.showMessage({ message: error.response.data.errorMessage, closeTimeout: 15000 });
            return false;
        });
};

export const editComment = (comment: string) => ({
    type: EDIT_COMMENT,
    payload: comment,
});

export const fetchSearchCompanyList = (name: string) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_COMPANY_CARD_REQUEST,
    });

    return getCompaniesSearch(name, 150, CANCELED_REQUEST)
        .then((response: ResponseCompany) => {
            dispatch({
                type: GET_SEARCH_COMPANY_LIST,
                payload: response.content,
            });
        })
        .catch((error: Error) => {
            dispatch({
                type: GET_COMPANY_CARD_ERROR,
                payload: error,
            });
        });
};

export const updateCompanyForSale = (saleId: number, companyId: number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_COMPANY_CARD_REQUEST,
    });

    return updateSale(saleId, { companyId })
        .then(() => {
            dispatch({
                type: UPDATE_COMPANY_CARD,
            });
            dispatch(fetchCompanyCard(companyId));
        })
        .catch((error: Error) => {
            dispatch({
                type: GET_COMPANY_CARD_ERROR,
                payload: error,
            });
        });
};
