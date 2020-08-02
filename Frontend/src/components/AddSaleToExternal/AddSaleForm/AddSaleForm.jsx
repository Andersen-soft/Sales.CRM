// @flow

import React, { useState, useEffect } from 'react';

import {
    Grid,
    DialogActions,
    Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';
import CRMFormControlCheckboxLabel from 'crm-ui/CRMFormControlCheckboxLabel/CRMFormControlCheckboxLabel';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';

import Notification from 'crm-components/notification/NotificationSingleton';
import { addDays } from 'date-fns';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import { connect } from 'react-redux';
import { path, pathOr, head } from 'ramda';
import { getDate } from 'crm-utils/dates';
import {
    getUniqSources, createUsers, createCountries, transformDataForRequest,
} from 'crm-utils/AddSaleToExternal/AddSaleToExternal';
import {
    getUsers, getCountries, getSources, exportSale,
} from 'crm-api/addToExternalService/addToExternalService';
import { useTranslation } from 'crm-hooks/useTranslation';
import cn from 'classnames';
import { CONTRACT } from 'crm-constants/companySalesStatuses';

import styles from './styles';

type SelectItems = {
    label: string,
    value: string,
}

type Props= {
    onHandleConfirmationOpen: () => void,
    classes: Object,
    company: { name: string, url: string, responsibleRm: Object },
    saleCard: {
        sale: {
            createDate?: string,
            firstActivity: Object,
            mainContactId: number,
            mainContact: Object,
            status: string,
            source: { label: string, value: number },
        },
    },
    contactUserList: Object,
    userData: {
        username: string
    },
    values: Object,
    touched: Object,
    errors: Object,
    status: Object,
    setFieldTouched: (name: string, param: string | Object) => void,
    handleChange: (param: string | Object) => Function,
    setFieldValue: (name: string, param: string | Object) => void,
    setStatus: (status: { success: boolean }) => void,
    handleSubmit: () => void,
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required('forms.errorInputRequired'),
    mainRM: Yup.string().nullable().required('forms.errorInputRequired'),
    subMainRM: Yup.string().nullable().required('forms.errorInputRequired'),
    country: Yup.string().nullable().required('forms.errorInputRequired'),
    startDate: Yup.string().required('forms.errorInputRequired'),
    url: Yup.string().required('forms.errorInputRequired'),
    projectType: Yup.string().nullable().required('forms.errorInputRequired'),
    sales: Yup.string().required('forms.errorInputRequired'),
    firstContactDate: Yup.string().required('forms.errorInputRequired'),
    source: Yup.string().nullable().required('forms.errorInputRequired'),
    isSigned: Yup.string(),
});

const AddSaleForm = ({
    onHandleConfirmationOpen,
    classes,
    company,
    saleCard,
    contactUserList,
    userData,
    values,
    touched,
    errors,
    status,
    setFieldTouched,
    handleChange,
    setFieldValue,
    setStatus,
    handleSubmit,
}: Props) => {
    const [users, setUsers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [sources, setSources] = useState([]);
    const [signed, setSigned] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const translations = {
        projectName: useTranslation('sale.companySection.addTo1C.projectName'),
        projectType: useTranslation('sale.companySection.addTo1C.projectType'),
        projectCountry: useTranslation('sale.companySection.addTo1C.projectCountry'),
        customerUrl: useTranslation('sale.companySection.addTo1C.customerUrl'),
        leadSource: useTranslation('sale.companySection.addTo1C.leadSource'),
        startDateSelect: useTranslation('sale.companySection.addTo1C.startDate'),
        firstContactDate: useTranslation('sale.companySection.addTo1C.firstContactDate'),
        salesManager: useTranslation('sale.companySection.addTo1C.salesManager'),
        isSigned: useTranslation('sale.companySection.addTo1C.isSigned'),
        cancel: useTranslation('sale.companySection.addTo1C.cancel'),
        createProject: useTranslation('sale.companySection.addTo1C.createProject'),
        errorTitle: useTranslation(errors.title),
        errorMainRM: useTranslation(errors.mainRM),
        errorSubMainRM: useTranslation(errors.subMainRM),
        errorCountry: useTranslation(errors.country),
        errorStartDate: useTranslation(errors.startDate),
        errorUrl: useTranslation(errors.url),
        errorProjectType: useTranslation(errors.projectType),
        errorSales: useTranslation(errors.sales),
        errorFirstContactDate: useTranslation(errors.firstContactDate),
        errorSource: useTranslation(errors.source),
    };

    const types = [
        { label: 'TM', value: 'TM' },
        { label: 'Project', value: 'Project' },
    ];

    const setField = (userInfo, name) => {
        const changeField = handleChange(name);

        changeField(userInfo || '');
    };

    const setFieldsValue = ({
        companyName,
        startDate,
        url,
        username,
        firstContactDate,
        currentCountry,
        source,
        deliveryDirector,
    }) => {
        setField(companyName, 'title');
        setField(startDate, 'startDate');
        setField(url, 'url');
        setField(username, 'sales');
        setField(firstContactDate, 'firstContactDate');
        setField(head(types), 'projectType');
        setField(currentCountry, 'country');
        source && setField(source, 'source');
        deliveryDirector && setField(deliveryDirector, 'mainRM');
        deliveryDirector && setField(deliveryDirector, 'subMainRM');
    };

    const setSignedField = isContract => {
        setSigned(isContract);
        handleChange('isSigned')(isContract);
    };

    useEffect(() => {
        (async () => {
            const { name, url, responsibleRm } = company;

            const sourcePromise = getSources();
            const usersPromise = getUsers();
            const countriesPromise = getCountries();

            const [
                sourcesData,
                usersData,
                countriesData,
            ] = await Promise.all([sourcePromise, usersPromise, countriesPromise]);

            const sourcesUniq = getUniqSources(sourcesData.content);

            setStatus({ success: true });

            setIsLoading(false);
            setUsers(createUsers(usersData.content));
            setCountries(createCountries(countriesData.content));
            setSources(sourcesUniq);

            const startDate = addDays(new Date(), 0);

            const firstContactDate = path(['sale', 'firstActivity'], saleCard)
                ? path(['sale', 'firstActivity', 'dateActivity'], saleCard) || path(['sale', 'createDate'], saleCard)
                : path(['sale', 'createDate'], saleCard);

            const mainContact = contactUserList.find(contact => contact.id === path(['sale', 'mainContactId'], saleCard));
            const { sale } = saleCard;
            const currentCountry = mainContact
                && mainContact.country
                && { label: path(['country', 'name'], mainContact), value: path(['country', 'id'], mainContact) };

            const source = sale.source
                && (path(['source', 'type'], sale) === 'Социальная сеть'
                    ? { label: 'Social network', value: 'Соцсеть' }
                    : { label: path(['source', 'name'], sale), value: path(['source', 'name'], sale) }
                );

            const deliveryDirector = path(['responsibleRm'], responsibleRm)
                && { label: `${responsibleRm.firstName} ${responsibleRm.lastName}`, value: responsibleRm.id };

            setFieldsValue({
                companyName: name,
                startDate,
                url,
                username: userData.username,
                firstContactDate,
                currentCountry,
                source,
                deliveryDirector,
            });
            setSignedField(saleCard.sale.status === CONTRACT);
        })();
    }, []);

    const handleOnChange = (name: string) => (e: SyntheticInputEvent<HTMLInputElement>) => {
        handleChange(e);
        setFieldTouched(name, e.target.value);
    };

    const handleSelectChange = name => (option: Array<SelectItems>) => {
        const changeSelect = handleChange(name);

        if (!changeSelect) {
            return;
        }
        changeSelect(option);
        name === 'mainRM' && !values.subMainRM && handleChange('subMainRM')(option);
    };

    const handleChangeSigned = () => {
        handleChange('isSigned')(!signed);
        setSigned(!signed);
    };

    const handleChangeDate = (date: ?Date): void => setFieldValue('startDate', date);

    const renderLeftForm = () => (
        <>
            <CRMInput
                onChange={handleOnChange('title')}
                value={values.title}
                name='title'
                label={translations.projectName}
                error={touched.title && translations.errorTitle}
                className={classes.inputContainer}
                fullWidth
            />
            <CRMAutocompleteSelect
                options={types}
                value={values.projectType}
                onChange={handleSelectChange('projectType')}
                controlled
                label={translations.projectType}
                error={touched.projectType && translations.errorProjectType}
                classes={{ container: classes.inputContainer }}
                name='type'
            />
            <CRMAutocompleteSelect
                options={countries}
                value={values.country}
                onChange={handleSelectChange('country')}
                controlled
                label={translations.projectCountry}
                error={touched.country && translations.errorCountry}
                classes={{ container: classes.inputContainer }}
                name='country'
                menuPosition='fixed'
                menuShouldBlockScroll
            />
            <CRMInput
                onChange={handleOnChange('url')}
                value={values.url}
                name='url'
                label={translations.customerUrl}
                error={touched.url && translations.errorUrl}
                className={classes.lastInputContainer}
                fullWidth
            />

            <Grid container alignItems='center' className={classes.inputContainerGroup}>
                <Typography className={classes.textLabel}>{translations.firstContactDate}:</Typography>
                <CRMInput
                    value={getDate(values.firstContactDate, FULL_DATE_CS)}
                    name='firstContactDate'
                    error={touched.firstContactDate && translations.errorFirstContactDate}
                    disabled
                />
            </Grid>
            <Grid container alignItems='center' className={classes.inputContainerGroup}>
                <Typography className={classes.textLabel}>{translations.salesManager}:</Typography>
                <CRMInput
                    onChange={handleOnChange('sales')}
                    value={values.sales}
                    name='sales'
                    error={touched.sales && translations.errorSales}
                    disabled
                />
            </Grid>
            <CRMFormControlCheckboxLabel
                checkboxProps={{
                    checked: !!values.isSigned,
                    onChange: handleChangeSigned,
                    value: values.isSigned,
                }}
                label={`${translations.isSigned}:`}
                labelPlacement='start'
                labelClasses={{
                    label: classes.checkboxLabel,
                    root: cn(classes.checkboxControl, classes.inputContainerGroup),
                }}
            />
        </>
    );

    const renderRightForm = () => (
        <>
            <CRMAutocompleteSelect
                options={users}
                value={values.mainRM}
                onChange={handleSelectChange('mainRM')}
                controlled
                label='Delivery Director'
                error={touched.mainRM && translations.errorMainRM}
                classes={{ container: classes.inputContainer }}
                name='roles'
            />
            <CRMAutocompleteSelect
                options={users}
                value={values.subMainRM}
                onChange={handleSelectChange('subMainRM')}
                controlled
                label='Delivery Manager'
                error={touched.subMainRM && translations.errorSubMainRM}
                classes={{ container: classes.inputContainer }}
                name='roles'
            />
            <CRMAutocompleteSelect
                options={sources}
                value={values.source}
                onChange={handleSelectChange('source')}
                controlled
                label={`${translations.leadSource}`}
                error={touched.source && translations.errorSource}
                classes={{ container: classes.inputContainer }}
                name='source'
                maxMenuHeight={260}
            />
            <CRMDatePicker
                date={values.startDate}
                onChange={handleChangeDate}
                error={touched.startDate && translations.errorStartDate}
                label={translations.startDateSelect}
                fullWidth
                withIcon
                InputProps={{
                    classes: { input: classes.dateInput },
                }}
            />
        </>
    );

    return (
        <form onSubmit={handleSubmit}>
            <Grid container>
                {(isLoading || (status && !status.success)) && <CRMLoader /> }
                <Grid
                    item
                    xs={6}
                    className={classes.gridLeftForm}
                >
                    {renderLeftForm()}
                </Grid>
                <Grid
                    item
                    xs={6}
                    className={classes.gridRightForm}
                >
                    {renderRightForm()}
                </Grid>
            </Grid>
            <DialogActions className={classes.formButtons}>
                <CRMButton
                    onClick={onHandleConfirmationOpen}
                    className={classes.button}
                    size='large'
                >
                    {translations.cancel}
                </CRMButton>
                <CRMButton
                    primary
                    className={classes.button}
                    type='submit'
                    size='large'
                >
                    {translations.createProject}
                </CRMButton>
            </DialogActions>
        </form>
    );
};

const mapStateToProps = state => ({
    company: state.CompanyCard.companyCard,
    saleCard: state.SaleCard,
    userData: state.session.userData,
    contactUserList: state.ContactsList.contacts,
});

const styledForm = withStyles(styles)(AddSaleForm);

export default connect(mapStateToProps)(withFormik({
    mapPropsToValues: () => ({
        title: '',
        mainRM: '',
        subMainRM: '',
        country: '',
        startDate: '',
        url: '',
        projectType: '',
        sales: '',
        firstContactDate: '',
        source: '',
        isSigned: '',
    }),
    handleSubmit: (
        values,
        {
            props: {
                userData,
                saleCard,
                notificationSuccess,
                switchExported,
                onHandleOnClose,
            },
            setStatus,
        }) => {
        const { id } = userData;
        const sale = saleCard.sale.id;
        const data = transformDataForRequest(values, sale, id);

        setStatus({ success: false });

        exportSale(data)
            .then(() => {
                Notification.showMessage({
                    message: notificationSuccess,
                    type: 'success',
                    closeTimeout: 7000,
                });
                setStatus({ success: true });
                switchExported();
            })
            .then(() => onHandleOnClose())
            .catch(error => {
                Notification.showMessage({
                    message: pathOr(null, ['data', 'errorMessage'], error.response),
                    closeTimeout: 15000,
                });
                setStatus({ success: true });
            });
    },
    validationSchema,
})(styledForm));
