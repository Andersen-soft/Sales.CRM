// @flow

import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import debounce from 'lodash.debounce';
import * as Yup from 'yup';
import { path, sortBy, uniqBy, pathOr } from 'ramda';
import { INPUT_CHANGE_ACTION } from 'crm-components/crmUI/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { createSale, getSources } from 'crm-api/saleService';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';
import {
    getCompaniesSearch,
    getContacts,
    checkExistCompany,
    getIndustries,
} from 'crm-api/companyCardService/companyCardService';
import getValueOrNull from 'crm-utils/getValueOrNull';
import { pages } from 'crm-constants/navigation';
import { PHONE_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';
import Notification from 'crm-components/notification/NotificationSingleton';
import { getAuthUserSocialContacts, getCountry } from 'crm-api/contactsCard/contactsCardService';
import { useTranslation } from 'crm-hooks/useTranslation';
import { MALE_KEY } from 'crm-constants/gender';
import getDeliveryDirector from 'crm-utils/sales/getDeliveryDirector';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { crmTrim } from 'crm-utils/trimValue';
import transformOptionsForGroup from 'crm-utils/dataTransformers/transformOptionsForGroup';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import {
    RECOMENDATION_FIELD,
    SOURCE_FIELD,
    NEW_COMPANY_ID,
    NEW_CONTACT,
    EXISTING_CONTACT,
    EXISTING_COMPANY,
    NEW_COMPANY,
} from 'crm-constants/addSaleModal/addSaleModalConstatnts';
import DesktopForm from './DesktopForm/DesktopForm';
import MobileForm from './MobileForm/MobileForm';

import type { FormikProps } from 'crm-types/formik';
import type { Contact } from 'crm-types/resourceDataTypes';

type IndustryType = {
    id: number, name: string, common: boolean
}

type CompanyType = {
    id: number,
    name: string,
    responsibleRm: Object,
    industryDtos: Array<IndustryType>
}

export type IndustryOptions = Array<{ label: string, options: IndustryType }>

export type Suggestion = {
    id: number,
    name: string,
}

export type SourceSuggestion = {
    label: string,
    value: number,
}

type Props = FormikProps & {
    handleChange: (e: SyntheticEvent<EventTarget> | string) => void,
    history: Object,
    currentUser: { username: string },
    open: boolean,
    onClose: () => void,
    resetForm: (nextProps?: any) => void,
}

const validateWithContact = values => {
    const errors = {};

    if (!values.firstName) {
        errors.firstName = 'forms.errorInputRequired';
    }

    if (!values.countryId) {
        errors.countryId = 'forms.errorInputRequired';
    }

    if (path(['contactPhone', 'length'], values) && !PHONE_REGEXP.test(values.contactPhone)) {
        errors.contactPhone = 'forms.errorPhoneValidation';
    }

    return errors;
};

const newCompanyValidate = values => {
    const errors = {};

    if (!values.newCompany.name) {
        errors.newCompany = 'forms.errorInputRequired';
    }

    if (path(['companyPhone', 'length'], values) && !PHONE_REGEXP.test(values.companyPhone)) {
        errors.companyPhone = 'forms.errorPhoneValidation';
    }

    return errors;
};

const validate = values => {
    let errors = {};

    if (values.createNewCompany === EXISTING_COMPANY && !values.company) {
        errors.company = 'forms.errorInputRequired';
    }

    if (!values.source) {
        errors.source = 'forms.errorInputRequired';
    }

    if (values.createNewCompany === NEW_COMPANY) {
        const newCompanyErrors = newCompanyValidate(values);

        errors = { ...errors, ...newCompanyErrors };
    }

    if (values.createNewContact === NEW_CONTACT) {
        const errorsWithContact = validateWithContact(values);

        errors = { ...errors, ...errorsWithContact };
    }

    return errors;
};

const validationSchema = Yup.object().shape({
    email: Yup.string().email('forms.errorEmailValidation'),
    personalEmail: Yup.string().email('forms.errorEmailValidation'),
    socialNetwork: Yup.string().url('forms.errorUrlValidation'),
    link: Yup.string().url('forms.errorUrlValidation'),
});

const handleCreateCompany = async (values, history: Object) => {
    const {
        newCompany,
        company,
        comment,
        companyPhone,
        link,
        firstName,
        contactPhone,
        countryId,
        email,
        lastName,
        personalEmail,
        position,
        sex,
        skype,
        socialNetwork,
        socialNetworkUserId,
        source,
        createNewContact,
        selectedContact,
        createNewCompany,
        recomendation,
        dateOfBirth,
        industry,
    } = values;
    let contact = null;
    let contactId = null;

    if (createNewContact === EXISTING_CONTACT) {
        contactId = selectedContact.id;
    } else {
        contact = firstName ? {
            contactPhone: getValueOrNull(contactPhone),
            countryId: getValueOrNull(countryId),
            email: getValueOrNull(email),
            firstName,
            socialNetwork: getValueOrNull(socialNetwork),
            lastName: getValueOrNull(lastName),
            personalEmail: getValueOrNull(personalEmail),
            position: getValueOrNull(position),
            sex,
            skype: getValueOrNull(skype),
            socialNetworkUserId: getValueOrNull(socialNetworkUserId),
            dateOfBirth: getDate(dateOfBirth, FULL_DATE_DS) || '',
        } : null;
    }

    const responsibleRm = getDeliveryDirector(values);
    const newSale = await createSale({
        company: {
            name: createNewCompany === EXISTING_COMPANY ? company.name : newCompany.name,
            description: getValueOrNull(comment),
            phone: getValueOrNull(companyPhone),
            url: getValueOrNull(link),
            contact,
            contactId,
            responsibleRmId: pathOr(null, ['value'], responsibleRm),
            industryCreateRequestList: industry ? industry.map(({ value }) => ({ id: value })) : null,
        },
        sourceId: pathOr(null, ['value'], source),
        recommendationId: pathOr(null, ['id'], recomendation),
    });

    history.push(`${pages.SALES_FUNNEL}/${newSale}`);
};

const initialContactValues = {
    firstName: '',
    lastName: '',
    countryId: '',
    position: '',
    contactPhone: '',
    personalEmail: '',
    email: '',
    skype: '',
    socialNetwork: '',
    socialNetworkUserId: '',
};

const AddSaleModal = ({
    handleSubmit,
    handleChange,
    setValues,
    values,
    errors,
    touched,
    status,
    setStatus,
    history,
    currentUser: { username },
    setFieldTouched,
    open,
    onClose,
}: Props) => {
    const [contactsList, setContactsList] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [contactFetchValues, setContactFetchValues] = useState({});
    const [sourcesSuggestions, setSourcesSuggestions] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [loadingSourceList, setLoadingSourceList] = useState(false);
    const [loadingIndustryList, setLoadingIndustryList] = useState(false);
    const [industrySuggestions, setIndustrySuggestions] = useState([]);

    const translations = {
        addSale: useTranslation('header.add.addSale'),
        requiredContact: useTranslation('header.reportAddSale.requiredContact'),
        common: useTranslation('common.common'),
        other: useTranslation('common.other'),
    };

    const isMobile = useMobile();

    useEffect(() => {
        document.title = translations.addSale;

        setLoadingSourceList(true);
        setLoadingIndustryList(true);

        getSources()
            .then(({ content }) => {
                setSourcesSuggestions(
                    content.map(({ name, id, tooltip }) => ({ label: name, value: id, title: tooltip }))
                );
            })
            .finally(() => setLoadingSourceList(false));

        getIndustries()
            .then(industries => {
                const { common, other } = transformOptionsForGroup(industries);

                setIndustrySuggestions([{ label: translations.common, options: common }, { label: translations.other, options: other }]);
            })
            .finally(() => setLoadingIndustryList(false));

        setValues({
            ...values,
            requiredContactMessage: translations.requiredContact,
        });
    }, []);

    const handleSearch = (company: string, callback: (Array<{id: number, name: string}>) => void) => {
        getCompaniesSearch(company, 150, CANCELED_REQUEST).then(({ content }) => callback(content));
    };

    const searchCompany = useCallback(debounce((
        searchCompanyValue: string,
        callback: (Array<{id: number, name: string}>) => void,
    ) => handleSearch(searchCompanyValue, callback), 300), []);

    const handleChangeCompanyCheckbox = ({ target: { value } }) => {
        if (value === EXISTING_COMPANY) {
            setValues({
                ...values,
                company: null,
                createNewCompany: EXISTING_COMPANY,
                selectedContact: null,
                newCompany: '',
                link: '',
                companyPhone: '',
                comment: '',
                industry: null,
            });
            setFieldTouched('newCompany', false);
        } else {
            setValues({
                ...values,
                createNewCompany: NEW_COMPANY,
                createNewContact: NEW_CONTACT,
                selectedContact: null,
                company: '',
                industry: null,
            });
            setFieldTouched('company', false);
        }
        setContactsList([]);
    };

    const handleExistsCompanyDialogClose = () => setStatus({ showExistsCompanyDialog: false });

    const handleExistsCompanyDialogContinue = async () => {
        handleExistsCompanyDialogClose();
        await handleCreateCompany(values, history);
        onClose();
    };

    const handleNewCompanyChange = async (newValue: CompanyType | null) => {
        if (newValue) {
            setValues({
                ...values,
                createNewCompany: EXISTING_COMPANY,
                company: newValue,
                industry: newValue.industryDtos
                    ? newValue.industryDtos.map(({ id, name, common }) => ({ label: name, value: id, group: common }))
                    : null,
            });
            setLoadingContacts(true);
            const { content } = await getContacts(newValue.id);

            setLoadingContacts(false);
            setContactsList(content);
        } else {
            const changeNewCompany = handleChange('newCompany');

            setContactsList([]);
            setSelectedContact(null);
            setValues({ ...values, selectedContact: null });
            changeNewCompany(newValue);
        }
    };

    const newCompanyInputChange = (inputValue, { action }) => {
        if (action === INPUT_CHANGE_ACTION) {
            const changeNewCompany = handleChange('newCompany');

            if (!changeNewCompany) {
                return;
            }

            changeNewCompany({ id: NEW_COMPANY_ID, name: inputValue });
        }
    };

    const handlePhoneChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        if (PHONE_REGEXP.test(event.target.value) || !event.target.value) {
            handleChange(event);
        }
    };

    const handleCommentChange = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        const changeComment = handleChange('comment');

        if (!changeComment) {
            return;
        }

        if (value.length <= 600) {
            changeComment(value);
            setCommentError('');
        } else {
            changeComment(value.slice(0, 600));
            setCommentError('forms.errorMaxCommentNumOfChars');
        }
    };

    const handleCompanyChange = async (company: CompanyType | null) => {
        setSelectedContact(null);
        setValues({
            ...values,
            selectedContact: null,
            company,
            industry: (company && company.industryDtos)
                ? company.industryDtos.map(({ id, name, common }) => ({ label: name, value: id, group: common }))
                : null,
        });

        if (company) {
            setLoadingContacts(true);

            const { content } = await getContacts(company.id);

            setLoadingContacts(false);
            setContactsList(content);
        } else {
            setContactsList([]);
        }
    };

    const handleChangeContactCheckbox = ({ target: { value } }) => {
        if (value === EXISTING_CONTACT) {
            setValues({
                ...values,
                ...initialContactValues,
                createNewContact: EXISTING_CONTACT,
                firstName: '',
                countryId: '',
            });
            setFieldTouched('firstName', false);
            setFieldTouched('countryId', false);
        } else {
            setValues({
                ...values,
                createNewContact: NEW_CONTACT,
                selectedContact: null,
            });
            setSelectedContact(null);
        }
    };

    const selectContact = (contact: Contact) => () => {
        if (!selectedContact || (selectedContact.id !== contact.id)) {
            setSelectedContact(contact);

            setValues({
                ...values,
                selectedContact: contact,
            });
        } else {
            setSelectedContact(null);

            setValues({
                ...values,
                selectedContact: null,
            });
        }
    };

    const isCheckedContacts = id => !!selectedContact && selectedContact.id === id;

    const fetchContactValues = async () => {
        const countriesPromise = getCountry();
        const socialContactsPromise = getAuthUserSocialContacts({ username });

        const [countries, socialContacts] = await Promise.all([
            countriesPromise,
            socialContactsPromise,
        ]);

        const sortedCountries = sortBy(({ name }) => name, countries);
        const countriesSuggestions = sortedCountries.map(({ name, id }) => ({ label: name, value: id })) || [];

        const socialContactsSuggestions = socialContacts.content.map(
            ({ socialNetworkUser: { name, id }, source: { name: sourceName } }) => (
                { label: `${name} - ${sourceName}`, value: id }
            ));
        const socialContactsUnique = uniqBy(({ label }) => label, socialContactsSuggestions);

        const countryId = countriesSuggestions.find(({ value }) => value === values.countryId) || '';

        setContactFetchValues({
            countriesSuggestions,
            countryId,
            socialContactsSuggestions: socialContactsUnique,
        });
    };

    const handleConfirmationDialogOpen = () => setShowConfirmationDialog(true);

    const handleChangeContactFields = (fieldName, value) => {
        const changeField = handleChange(fieldName);

        changeField && changeField({ target: { value } });
    };

    const handleRecomendationChange = (recomendationCompany: CompanyType | null) => {
        const changeRecomendation = handleChange(RECOMENDATION_FIELD);

        changeRecomendation && changeRecomendation(recomendationCompany);
    };

    const handleSourceChange = (option: {label: string, value: number} | null) => {
        const changeSource = handleChange(SOURCE_FIELD);
        const changeRecomendation = handleChange(RECOMENDATION_FIELD);

        changeSource && changeSource(option || '');
        values[RECOMENDATION_FIELD] && changeRecomendation && changeRecomendation(null);
    };

    const trimValue = (event: SyntheticInputEvent<HTMLInputElement>) => {
        event.target.value = crmTrim(event.target.value);
        handleChange(event);
    };

    const handleBlur = (name: string) => (event: SyntheticInputEvent<HTMLInputElement>) => {
        trimValue(event);
        setFieldTouched(name, true);
    };

    const handleBlurExistsCompany = async ({ target: { value } }) => {
        value && setValues({
            ...values,
            newCompany: { id: NEW_COMPANY_ID, name: value },
            createNewCompany: NEW_COMPANY,
            createNewContact: NEW_CONTACT,
            selectedContact: null,
            company: '',
        });
        setFieldTouched('company', !value);
    };

    const handleIndustryChange = (suggestions: Array<Object>) => {
        const changeIndustry = handleChange('industry');

        changeIndustry && changeIndustry(suggestions);
    };

    const Form = isMobile ? MobileForm : DesktopForm;

    return <Form
        open={open}
        onClose={onClose}
        handleSubmit={handleSubmit}
        handleConfirmationDialogOpen={handleConfirmationDialogOpen}
        showConfirmationDialog={showConfirmationDialog}
        setShowConfirmationDialog={setShowConfirmationDialog}
        values={values}
        errors={errors}
        touched={touched}
        status={status}
        handleChangeCompanyCheckbox={handleChangeCompanyCheckbox}
        searchCompany={searchCompany}
        handleCompanyChange={handleCompanyChange}
        handleBlurExistsCompany={handleBlurExistsCompany}
        handleExistsCompanyDialogClose={handleExistsCompanyDialogClose}
        handleExistsCompanyDialogContinue={handleExistsCompanyDialogContinue}
        handleNewCompanyChange={handleNewCompanyChange}
        handleBlur={handleBlur}
        newCompanyInputChange={newCompanyInputChange}
        handleChange={handleChange}
        handlePhoneChange={handlePhoneChange}
        trimValue={trimValue}
        handleCommentChange={handleCommentChange}
        sourcesSuggestions={sourcesSuggestions}
        handleSourceChange={handleSourceChange}
        loadingSourceList={loadingSourceList}
        handleRecomendationChange={handleRecomendationChange}
        handleChangeContactCheckbox={handleChangeContactCheckbox}
        contactFetchValues={contactFetchValues}
        fetchContactValues={fetchContactValues}
        handleChangeContactFields={handleChangeContactFields}
        contactsList={contactsList}
        selectContact={selectContact}
        isCheckedContacts={isCheckedContacts}
        loadingContacts={loadingContacts}
        commentError={commentError}
        industrySuggestions={industrySuggestions}
        handleIndustryChange={handleIndustryChange}
        loadingIndustryList={loadingIndustryList}
    />;
};
const mapStateToProps = state => ({
    currentUser: state.session.userData,
});

export default connect(mapStateToProps)(withRouter(withFormik({
    mapPropsToValues: () => ({
        newCompany: '',
        company: '',
        link: '',
        comment: '',
        companyPhone: '',
        contactPhone: '',
        countryId: '',
        email: '',
        firstName: '',
        lastName: '',
        personalEmail: '',
        position: '',
        skype: '',
        socialNetworkUserId: '',
        socialNetwork: '',
        source: '',
        sex: MALE_KEY,
        recomendation: null,
        createNewCompany: NEW_COMPANY,
        createNewContact: NEW_CONTACT,
        selectedContact: null,
        dateOfBirth: null,
        industry: null,
    }),
    mapPropsToStatus: () => ({
        showExistsCompanyDialog: false,
    }),
    isInitialValid: false,
    handleSubmit: async (values, { props, setStatus, setFieldValue }) => {
        if (values.createNewContact === EXISTING_CONTACT && !values.selectedContact) {
            Notification.showMessage({
                message: values.requiredContactMessage,
                closeTimeout: 15000,
            });
            return;
        }

        if (values.createNewCompany === NEW_COMPANY) {
            const checkCompanyExistence = await checkExistCompany(values.newCompany.name);
            const companyId = path(['id'], checkCompanyExistence);

            if (companyId) {
                setFieldValue('company', checkCompanyExistence);
                setStatus({ showExistsCompanyDialog: true });
                return;
            }
        }

        await handleCreateCompany(values, props.history);
        props.onClose();
    },
    validate,
    validationSchema,
})(AddSaleModal)));
