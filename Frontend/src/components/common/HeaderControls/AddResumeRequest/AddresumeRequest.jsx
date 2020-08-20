// @flow

import React, { useEffect, useState, useCallback } from 'react';
import { withFormik } from 'formik';
import { addDays } from 'date-fns';
import * as Yup from 'yup';
import { head } from 'ramda';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { withRouter } from 'react-router-dom';
import { addResumeRequest, getPriorities } from 'crm-api/addResumeRequestService';
import getValueOrNull from 'crm-utils/getValueOrNull';
import { getCompaniesSearch, getSales } from 'crm-api/companyCardService/companyCardService';
import { pages } from 'crm-constants/navigation/index';
import Notification from 'crm-components/notification/NotificationSingleton';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { MAX_INPUT_LENGTH, MAX_FILE_SIZE } from 'crm-constants/addResumeRequest/addResumeRequestConstants';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import { useTranslation } from 'crm-hooks/useTranslation';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';
import { crmTrim } from 'crm-utils/trimValue';

import type { FormikProps } from 'crm-types/formik';

import DesktopForm from './DesktopForm/DesktopForm';
import MobileForm from './MobileForm/MobileForm';

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

const validationSchema = Yup.object().shape({
    companyId: Yup.string().required(),
    name: Yup.string().required('header.modals.addRequest.requiredField'),
    deadline: Yup.string().required(' '),
    priority: Yup.string().required(' '),
    comment: Yup.string(),
    sales: Yup.string().required('header.modals.addRequest.requiredField'),
});

const AddresumeRequest = ({
    values,
    setValues,
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
    const [priorities, setPriorities] = useState([]);
    const [searchCompanySuggestion, setSearchCompanySuggestion] = useState(null);
    const [searchCompanyInput, setSearchCompanyInput] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [sales, setSales] = useState([]);
    const [salesMessage, setSalesMessage] = useState('');
    const [allFilesSize, setAllFilesSize] = useState(0);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [priority, setPriority] = useState('');

    const isMobile = useMobile();

    useEffect(() => {
        getPriorities()
            .then(response => {
                const priorityFinded: Array<{title: string, value: string}> = response.map(
                    value => ({ title: value, value })
                );

                setPriorities(priorityFinded);
                setPriority(head(priorityFinded).title);

                setFieldValue('priority', head(priorityFinded).title, false);
            });
    }, []);

    useEffect(() => {
        if (open && !localOpen) {
            setLocalOpen(true);
        }

        if (!open && localOpen) {
            resetForm();
            setFieldValue('deadline', addDays(new Date(), 1), false);
            setFieldValue('priority', head(priorities).title, false);

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
        setFieldValue('priority', head(priorities).title, false);
    };

    const handleDeleteFile = index => {
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

    const setDependentsComapnyParams = async ({ id }) => {
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
        companySugestion ? setDependentsComapnyParams(companySugestion) : clearSelectedCompany();
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

    const handleChangePriority = (event: SyntheticInputEvent<HTMLInputElement>) => {
        handleChange(event);
        setPriority(event.target.value);
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
        companyOnInputChange={setSearchCompanyInput}
        debounceHandleSearch={debounceHandleSearch}
        touched={touched}
        errors={errors}
        values={values}
        searchCompanySuggestion={searchCompanySuggestion}
        searchCompanyInput={searchCompanyInput}
        nameChange={handleNameChange}
        nameBlur={handleNameBlur}
        setFieldValue={setFieldValue}
        changePriority={handleChangePriority}
        priorities={priorities}
        priority={priority}
        commentChange={handleCommentChange}
        commentBlur={handleCommentBlur}
        sales={sales}
        salesMessage={salesMessage}
        selectedFiles={selectedFiles}
        changeInputFile={handleChangeInputFile}
        deleteFile={handleDeleteFile}
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
        priority: '',
        comment: '',
        selectedFiles: [],
        sales: '',
    }),
    handleSubmit: ({
        companyId, name, deadline, priority, comment, selectedFiles, sales,
    }, { props: { onClose, history } }) => {
        addResumeRequest({
            companyId,
            name,
            deadline: getDate(deadline, FULL_DATE_DS),
            priority,
            comment: getValueOrNull(comment),
            selectedFiles,
            companySale: sales,
        })
            .then(response => {
                onClose();
                history.push(`${pages.RESUME_REQUESTS}/${response.id}`);
            });
    },
    validationSchema,
})(AddresumeRequest)));
