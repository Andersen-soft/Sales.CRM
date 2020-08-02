// @flow

import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { withFormik } from 'formik';
import { withRouter } from 'react-router-dom';
import { addDays } from 'date-fns';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import getValueOrNull from 'crm-utils/getValueOrNull';
import Notification from 'crm-components/notification/NotificationSingleton';
import { addEstimationRequest } from 'crm-api/addEstimationRequestService/addEstimationRequestService';
import { getCompaniesSearch, getSales } from 'crm-api/companyCardService/companyCardService';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import {
    MAX_INPUT_LENGTH,
    MAX_FILE_SIZE,
} from 'crm-constants/addEstimationRequest/addEstimationRequestConstants';
import { pages } from 'crm-constants/navigation';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import { useTranslation } from 'crm-hooks/useTranslation';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';
import { crmTrim } from 'crm-utils/trimValue';

import type { FormikProps } from 'crm-types/formik';

import MobileForm from './MobileForm/MobileForm';
import DesktopForm from './DesktopForm/DesktopForm';

const validationSchema = Yup.object().shape({
    companyId: Yup.string().required(),
    name: Yup.string().required('header.modals.addRequest.requiredField'),
    deadline: Yup.string(),
    comment: Yup.string(),
    sales: Yup.string().required(),
});

export type Company = {
    id: number,
    name: string,
    responsibleRm: ?Object,
}

type Props = {
    open: boolean,
    onClose: () => void,
    userId: number,
} & FormikProps;

const AddEstimationRequest = ({
    values,
    setFieldValue,
    onClose,
    handleChange,
    userId,
    setFieldTouched,
    setFieldError,
    handleSubmit,
    isValid,
    open,
    errors,
    touched,
    resetForm,
    validateForm,
}: Props) => {
    const translations = {
        requiredField: useTranslation('header.modals.addRequest.requiredField'),
        maxSizeOfFiles: useTranslation('header.modals.addRequest.maxSizeOfFiles'),
        maxCommentNumOfChars: useTranslation('header.modals.addRequest.maxCommentNumOfChars'),
        pleaseCreateSale: useTranslation('header.modals.addRequest.createSaleError'),
    };
    const [localOpen, setLocalOpen] = useState(false);
    const [searchCompanySuggestion, setSearchCompanySuggestion] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [sales, setSales] = useState([]);
    const [salesMessage, setSalesMessage] = useState('');
    const [allFilesSize, setAllFilesSize] = useState(0);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const isMobile = useMobile();

    useEffect(() => {
        if (open && !localOpen) {
            setLocalOpen(true);
        }

        if (!open && localOpen) {
            resetForm();
            setFieldValue('deadline', addDays(new Date(), 1), false);

            setSearchCompanySuggestion(null);
            setSelectedFiles([]);
            setLocalOpen(false);
        }
    }, [open]);

    const validateFiles = files => {
        const filesSize = files.reduce((sum, { size }) => sum + size, 0);

        if (filesSize > MAX_FILE_SIZE) {
            Notification.showMessage({
                message: translations.maxSizeOfFiles,
                closeTimeout: 15000,
            });
            return false;
        }

        setAllFilesSize(filesSize);

        return true;
    };

    const localResetForm = () => {
        setSearchCompanySuggestion(null);
        setSelectedFiles([]);
        resetForm();
        setFieldValue('deadline', addDays(new Date(), 1), false);
    };

    const handleOnDeleteFile = index => {
        const filesList = selectedFiles.filter((file, i) => index !== i);

        if (validateFiles(filesList)) {
            setSelectedFiles(filesList);
            setFieldValue('selectedFiles', filesList, false);
        }
    };

    const handleOnClose = () => {
        setShowConfirmationDialog(false);
        setSales([]);
        localResetForm();
        onClose();
    };

    const handleSearch = (searchCompanyValue: string, callback: (Array<{id: number, name: string}>) => void) => {
        getCompaniesSearch(searchCompanyValue, 150, CANCELED_REQUEST).then(({ content }) => {
            callback(content);
        });
    };

    const debounceHandleSearch = useCallback(debounce((
        searchCompanyValue: string,
        callback: (Array<{id: number, name: string}>) => void,
    ) => handleSearch(searchCompanyValue, callback), 300), []);

    const clearSelectedCompany = () => {
        setSales([]);
        setFieldValue('companyId', '');
    };

    const setDependentsCompanyParams = async ({ id }) => {
        setLoading(true);

        const salesResponse = await getSales(userId, id);

        setLoading(false);

        const findedSales = salesResponse.content.length && salesResponse.content.map(sale => String(sale.id));

        if (findedSales) {
            setSales(findedSales);
            setSalesMessage('');
            setFieldValue('sales', findedSales[0], true);
        } else {
            setSalesMessage(translations.pleaseCreateSale);
            setFieldValue('sales', '');
        }

        setFieldValue('companyId', String(id));
    };

    const handleCompanyChange = (companySugestion: Company | null) => {
        setSearchCompanySuggestion(companySugestion);

        companySugestion ? setDependentsCompanyParams(companySugestion) : clearSelectedCompany();
    };

    const handleNameChange = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        if (value.length <= 100) {
            setFieldValue('name', value, true);
        } else {
            setFieldValue('name', value.slice(0, 100), false);
            setFieldTouched('name', true, false);
            setFieldError('name', 'header.modals.addRequest.maxNumOfChars');
        }
    };

    const handleNameBlur = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        const newValue = crmTrim(value);

        setFieldValue('name', newValue, true);
    };

    const handleCommentChange = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        if (value.length <= MAX_INPUT_LENGTH) {
            setFieldValue('comment', value, true);
        } else {
            setFieldValue('comment', value.slice(0, MAX_INPUT_LENGTH), false);
            setFieldTouched('comment', true, false);
            setFieldError('comment', translations.maxCommentNumOfChars);
        }
    };

    const handleCommentBlur = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        const newValue = crmTrim(value);

        setFieldValue('comment', newValue, true);
    };

    const handleChangeInputFile = (files: FileList): void => {
        const filesList = [...selectedFiles, ...files];

        if (validateFiles(filesList)) {
            setSelectedFiles(filesList);
            setFieldValue('selectedFiles', filesList, false);
        }
    };

    const handleConfirmationDialogOpen = () => {
        if (loading) {
            return;
        }

        setShowConfirmationDialog(true);
    };

    const localHandleSubmit = event => {
        event.persist();

        validateForm().then(formErrors => {
            if (!Object.keys(formErrors).length) {
                setLoading(true);
                setDisabled(true);
            }
            handleSubmit(event);
        });
    };

    const Form = isMobile ? MobileForm : DesktopForm;

    return <Form
        open={open}
        confirmationDialogOpen={handleConfirmationDialogOpen}
        submit={localHandleSubmit}
        companyChange={handleCompanyChange}
        debounceHandleSearch={debounceHandleSearch}
        touched={touched}
        errors={errors}
        values={values}
        searchCompanySuggestion={searchCompanySuggestion}
        nameChange={handleNameChange}
        nameBlur={handleNameBlur}
        setFieldValue={setFieldValue}
        commentChange={handleCommentChange}
        commentBlur={handleCommentBlur}
        sales={sales}
        salesMessage={salesMessage}
        selectedFiles={selectedFiles}
        changeInputFile={handleChangeInputFile}
        deleteFile={handleOnDeleteFile}
        allFilesSize={allFilesSize}
        disabled={disabled}
        showConfirmationDialog={showConfirmationDialog}
        setShowConfirmationDialog={setShowConfirmationDialog}
        onClose={handleOnClose}
        loading={loading}
    />;
};

const mapStateToProps = state => ({
    userId: state.session.userData.id,
});

export default connect(mapStateToProps)(withRouter(withFormik({
    mapPropsToValues: () => ({
        companyId: '',
        name: '',
        deadline: addDays(new Date(), 1),
        comment: '',
        selectedFiles: [],
        sales: '',
    }),
    handleSubmit: ({
        companyId, name, deadline, comment, selectedFiles, sales,
    }, { props: { onClose, history } }) => {
        addEstimationRequest({
            companyId,
            name,
            deadline: getDate(deadline, FULL_DATE_DS),
            comment: getValueOrNull(comment),
            selectedFiles,
            companySale: sales,
        })
            .then(response => {
                onClose();
                history.push(`${pages.ESTIMATION_REQUESTS}/${response.id}`);
            });
    },
    validationSchema,
})(AddEstimationRequest)));
