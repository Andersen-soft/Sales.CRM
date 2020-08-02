// @flow

import React, { useState, useEffect, useRef } from 'react';
import {
    Tooltip,
    Paper,
    Grid,
    Popover,
    Typography,
} from '@material-ui/core';
import { withFormik } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import RootRef from '@material-ui/core/RootRef';
import Link from '@material-ui/core/Link';
import { isEmpty, pathOr } from 'ramda';
import * as Yup from 'yup';
import cn from 'classnames';
import {
    ArrowDropDown,
    Check,
    Close,
} from '@material-ui/icons';
import { getIndustries } from 'crm-api/companyCardService/companyCardService';
import applyForUsers from 'crm-utils/sales/applyForUsers';
import CRMEditabeleLabledTextField from 'crm-components/common/CRMEditabeleLabledField/CRMEditabeleLabledTextField';
import { TinyIconButton } from 'crm-components/common/cardAttributeWrappers';
import UserInformationPopover from 'crm-components/common/UserInformationPopover/UserInformationPopover';
import { HEAD_SALES, RM_ID } from 'crm-constants/roles';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { removeProtocol } from 'crm-utils/urls';
import CRMLabeledField from 'crm-ui/CRMLabeledField/CRMLabeledField';
import CRMIcon from 'crm-ui/CRMIcons';
import EmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import {
    PHONE_REGEXP,
    SITE_REGEXP,
} from 'crm-constants/validationRegexps/validationRegexps';
import getEmployees from 'crm-api/saleCard/employeeServiceForSale';
import { LINK_WIDTH } from 'crm-constants/desktop/salesConstants';
import useOutsideClick from 'crm-utils/useOutsideClick';
import { useTranslation } from 'crm-hooks/useTranslation';
import validatePhone from 'crm-utils/validatePhone';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import transformOptionsForGroup from 'crm-utils/dataTransformers/transformOptionsForGroup';
import type { SingleActivity } from 'crm-containers/SalePage/SaleCard';
import type { FormikProps } from 'crm-types/formik';
import CompanyComment from './attributes/CompanyComment';
import CompanyInfo from '../../common/CompanyInfo/CompanyInfo';
import CRMIndustryList from 'crm-ui/CRMIndustryList/CRMIndustryList';
import HeaderWithModal from './attributes/HeaderWithModal';

import LinksBlock, { type LinkType } from '../../desktop/LinksBlock/LinksBlock';
import type { AttributeProps, Company } from './attributes/AttributeProps.flow';

import styles from './attributes/CompanyCardStyles';

export type Props = {
    ...AttributeProps,
    company: Company,
    classes: Object,
    searchCompanyList: Company[],
    fetchCompanyCard: number => void,
    updateCompanyCard: (number, Company) => void,
    fetchSearchCompanyList: string => void,
    updateCompanyForSale: (id: number, saleId: number) => void,
    saleId: number,
    saleStatus: string,
    fetchSale: (id: number) => void,
    fetchActivities: (saleId: number, size: number, page: number) => void,
    fetchContacts: (companyId: number) => void,
    userData: { roles: Array<string>, id: number },
    responsibleId: boolean,
    resumes: Array<?Object>,
    estimations: Array<?Object>,
    deleteSaleCard: number => void,
    activities: Array<SingleActivity>,
    isSaleExported: boolean,
    handleSubmit: () => void,
    moreButtonHint? : string,
    isEditingDisabled?: boolean,
} & FormikProps;

export type State = {
    companyInfo: Company,
    statuses: Array<string>,
    attrInEditMode: string,
};

const getLinksForContainer = (containerWidth: number, links: Array<LinkType>) => {
    const linksForContainer = links.slice(0, Math.floor(containerWidth / LINK_WIDTH));

    if (linksForContainer.length !== links) {
        return links.slice(0, Math.floor((containerWidth - 20) / LINK_WIDTH));
    }

    return linksForContainer;
};

const relatedSalesToLinks = (sales: Array<number> = [], currentSaleId: number): Array<LinkType> => sales
    .map((sale: number) => ({
        name: `${sale}`,
        to: sale === currentSaleId ? undefined : `${sale}`,
        highlighted: sale === currentSaleId,
    }));

const sortLinks = (a, b) => b - a;

const CompanyCard = ({
    company,
    fetchSearchCompanyList,
    updateCompanyForSale,
    searchCompanyList,
    classes,
    saleId,
    saleStatus,
    fetchSale,
    fetchActivities,
    fetchContacts,
    fetchCompanyCard,
    userData: { roles, id },
    responsibleId,
    resumes,
    estimations,
    activities,
    deleteSaleCard,
    isSaleExported,
    handleSubmit,
    values,
    resetForm,
    setFieldValue,
    isValid,
    errors = {},
    dirty,
    isEditingDisabled = false,
    ...props
}: Props) => {
    const translations = {
        company: useTranslation('sale.companySection.company'),
        website: useTranslation('sale.companySection.website'),
        phoneNumber: useTranslation('sale.companySection.phoneNumber'),
        sales: useTranslation('sale.companySection.sales'),
        errorInputRequired: useTranslation('forms.errorInputRequired'),
        errorUrlValidation: useTranslation('forms.errorUrlValidation'),
        errorPhoneValidation: useTranslation('forms.errorPhoneValidation'),
        showAll: useTranslation('common.showAll'),
        industry: useTranslation('sale.companySection.industry'),
        common: useTranslation('common.common'),
        other: useTranslation('common.other'),
    };

    const [isEdit, setEdit] = useState(false);
    const [isShowingAllLinks, setIsEdit] = useState(false);
    const [sortedLinks, setSortedLinks] = useState([]);
    const [linksForContainer, setLinksForContainer] = useState([]);
    const [rmList, setRmList] = useState([]);
    const [industryList, setIndustryList] = useState([]);

    const arrowDropDownAnchor = useRef(null);
    const linksContainer = useRef(null);
    const companyFieldRef = useRef(null);
    const urlFieldRef = useRef(null);
    const phoneFieldRef = useRef(null);
    const responsibleRmFieldRef = useRef(null);
    const cancelButtonRef = useRef(null);
    const industryRef = useRef(null);

    useOutsideClick(
        {
            onClick: () => {
                dirty && handleSubmit();
                isValid && setEdit(false);
            },
            elementRefs: [
                companyFieldRef,
                urlFieldRef,
                phoneFieldRef,
                cancelButtonRef,
                industryRef,
                ...roles.includes(HEAD_SALES) ? [responsibleRmFieldRef] : [],
            ],
        },
        [isValid, isEdit],
    );

    const applyId = responsibleId === id;

    useEffect(() => {
        getEmployees({ role: [RM_ID], responsibleRM: true }).then(({ content }) => {
            setRmList(content.map(({ id: userId, firstName, lastName }) => ({ value: userId, label: `${firstName} ${lastName}` })));
        });

        getIndustries().then(industries => {
            const { common, other } = transformOptionsForGroup(industries);

            setIndustryList([{ label: translations.common, options: common }, { label: translations.other, options: other }]);
        });
    }, []);

    const prepareLinks = (links: Array<number>) => {
        const sortedIds = [
            saleId,
            ...[...links].sort(sortLinks).filter(relatedSalesId => relatedSalesId !== saleId),
        ];

        return relatedSalesToLinks(sortedIds, saleId);
    };

    useEffect(() => {
        const links = prepareLinks(company.linkedSales);

        setSortedLinks(links);

        if (linksContainer.current && links) {
            let salesLinks = getLinksForContainer(linksContainer.current.clientWidth, links);

            if (salesLinks.length < links.length) {
                salesLinks = [...salesLinks, { name: '...', to: null, highlighted: false }];
            }

            setLinksForContainer(salesLinks);
        }
    }, [company.linkedSales]);

    const handlePhoneChange = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        if (validatePhone(value) || !value.length) {
            setFieldValue('phone', value);
        } else {
            setFieldValue('phone', values.phone || '');
        }
    };

    const handleResponsibleRmChange = userSuggestion => {
        setFieldValue('responsibleRm', userSuggestion);
    };

    const renderPhoneValue = () => (values.phone ? <Typography className={classes.phoneValue}>{values.phone}</Typography> : <EmptyBlock />);

    const renderResponsibleRM = () => {
        const { responsibleRm } = values;

        return responsibleRm
            ? <UserInformationPopover
                userName={responsibleRm.label}
                userNameStyle={classes.userInformation}
                userId={responsibleRm.value}
                reloadParent={() => fetchCompanyCard(company.id)}
            />
            : <EmptyBlock />;
    };

    const getPopoverWidth = () =>
        (Math.floor(pathOr(0, ['current', 'clientWidth'], linksContainer) / LINK_WIDTH) + 1) * LINK_WIDTH;

    return (
        <Paper
            elevation={0}
            classes={{ root: classes.root }}
        >
            <Grid
                item container
                xs={12}
            >
                <Grid
                    item
                    container
                    xs={12}
                    justify='space-between'
                >
                    {!isEdit && <Grid
                        item
                        container
                        justify='space-between'
                        wrap='nowrap'
                    >
                        <Grid className={classes.companyNameContainer} >
                            <CompanyInfo
                                companyName={values.name}
                                status={saleStatus}
                                linkDisabled
                                elipsisName
                            />
                        </Grid>
                        <Grid className={classes.menuWrapper} >
                            <HeaderWithModal
                                company={company}
                                fetchSale={fetchSale}
                                saleId={saleId}
                                classes={classes}
                                activities={activities}
                                searchCompanyHandler={
                                    fetchSearchCompanyList
                                }
                                updateCompanyHandler={updateCompanyForSale}
                                searchCompanyList={searchCompanyList}
                                status={saleStatus}
                                fetchActivities={fetchActivities}
                                fetchContacts={fetchContacts}
                                userRoles={roles}
                                applyId={applyId}
                                resumes={resumes}
                                estimations={estimations}
                                onChangeEdit={() => setEdit(true)}
                                deleteSaleCard={deleteSaleCard}
                                isSaleExported={isSaleExported}
                            />
                        </Grid>
                    </Grid>}
                    <Grid className={classes.fieldsContainer} item>
                        {isEdit && <Grid
                            container
                            justify='flex-start'
                            className={classes.companyNameContainer}

                        >
                            <Grid className={classes.editCompany}>
                                <CRMEditabeleLabledTextField
                                    name={translations.company}
                                    value={values.name}
                                    onChange={value => setFieldValue('name', value)}
                                    inputProps={{
                                        error: errors.name && translations.errorInputRequired,
                                    }}
                                    inputRef={companyFieldRef}
                                    isEdit
                                />
                            </Grid>
                        </Grid>}
                        <Grid
                            container
                            justify='center'
                            alignContent='center'
                            className={classes.fieldWrapper}
                        >
                            <CRMEditabeleLabledTextField
                                name={translations.website}
                                value={values.url}
                                isEdit={isEdit}
                                onChange={value => setFieldValue('url', value)}
                                inputProps={{
                                    error: errors.url && translations.errorUrlValidation,
                                }}
                                inputRef={urlFieldRef}
                                renderText={url => (url ? (
                                    <Link
                                        rel='noopener noreferrer'
                                        target='_blank'
                                        href={url}
                                        className={classes.ellipsisUrl}
                                    >
                                        {removeProtocol(url)}
                                    </Link>
                                ) : (
                                    <EmptyBlock />
                                ))
                                }
                            />
                        </Grid>
                        <Grid
                            container
                            justify='center'
                            alignContent='center'
                            className={classes.fieldWrapper}
                        >
                            <CRMLabeledField name={translations.phoneNumber}>
                                {isEdit
                                    ? (<CRMInput
                                        inputRef={phoneFieldRef}
                                        value={values.phone}
                                        onChange={handlePhoneChange}
                                        fullWidth
                                        InputProps={{ fullWidth: true, classes: {} }}
                                        error={errors.phone && translations.errorPhoneValidation}
                                    />)
                                    : renderPhoneValue()
                                }
                            </CRMLabeledField>
                        </Grid>
                        <Grid
                            container
                            justify='center'
                            alignContent='center'
                            className={classes.fieldWrapper}
                        >
                            <CRMLabeledField name='Delivery Director'>
                                {isEdit && roles.includes(HEAD_SALES)
                                    ? (<Grid className={classes.fullWidth}>
                                        <CRMAutocompleteSelect
                                            inputRef={responsibleRmFieldRef}
                                            controlled
                                            value={values.responsibleRm}
                                            options={rmList}
                                            onChange={handleResponsibleRmChange}
                                            isClearable={false}
                                        />
                                    </Grid>)
                                    : renderResponsibleRM()
                                }
                            </CRMLabeledField>
                        </Grid>
                        <Grid
                            container
                            justify='center'
                            alignContent='center'
                            className={classes.salesBlock}
                        >
                            <CRMLabeledField name={translations.sales}>
                                {isEmpty(company.linkedSales) ? (
                                    <EmptyBlock />
                                ) : (
                                    <Grid className={classes.salesLinks}>
                                        <Grid
                                            ref={linksContainer}
                                            className={classes.salesLinksBlock}
                                        >
                                            <LinksBlock
                                                justify='flex-start'
                                                wrap='nowrap'
                                                separator=','
                                                closingSeparator={false}
                                                links={linksForContainer}
                                                classes={{ links: classes.links, linkRight: classes.linkRight }}
                                            />
                                        </Grid>
                                        {
                                            (company.linkedSales.length > linksForContainer.length
                                                || linksForContainer[linksForContainer.length - 1].name === '...'
                                            ) && <Grid
                                                item
                                                xs={1}
                                                className={classes.icon}
                                            >
                                                <Tooltip
                                                    title={translations.showAll} placement='right'
                                                    className={classes.paddingFix}
                                                >
                                                    <TinyIconButton
                                                        aria-label='Add'
                                                        onClick={() => setIsEdit(!isShowingAllLinks)}
                                                        disabled={isEditingDisabled}
                                                        ref={arrowDropDownAnchor}
                                                    >
                                                        <ArrowDropDown fontSize='small' />
                                                    </TinyIconButton>
                                                </Tooltip>
                                                <Popover
                                                    open={isShowingAllLinks}
                                                    anchorEl={arrowDropDownAnchor.current}
                                                    anchorOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'left',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                    onClose={() => setIsEdit(!isShowingAllLinks)}
                                                    classes={{ paper: classes.wrapperTags }}
                                                >
                                                    <Grid
                                                        container
                                                        style={{ width: getPopoverWidth() }}
                                                    >
                                                        <LinksBlock
                                                            justify='flex-start'
                                                            separator=','
                                                            closingSeparator={false}
                                                            links={sortedLinks}
                                                        />
                                                    </Grid>
                                                </Popover>
                                            </Grid>
                                        }
                                    </Grid>
                                )}
                            </CRMLabeledField>
                        </Grid>
                    </Grid>
                    <Grid item xs={7}>
                        {isEdit && <Grid
                            item
                            container
                            justify='flex-end'
                            alignContent='flex-start'
                            className={classes.menuWrapper}
                        >
                            <CRMIcon
                                className={classes.acceptIcon}
                                onClick={() => {
                                    dirty && handleSubmit();
                                    isValid && setEdit(false);
                                }}
                                IconComponent={Check}
                            />
                            <RootRef rootRef={cancelButtonRef}>
                                <CRMIcon
                                    onClick={() => {
                                        resetForm();
                                        setEdit(false);
                                    }}
                                    IconComponent={Close}
                                />
                            </RootRef>
                        </Grid>}
                        <Grid item className={classes.commentContainer}>
                            <CompanyComment
                                {...props}
                                company={company}
                                saleId={saleId}
                                fetchCompanyCard={fetchCompanyCard}
                                searchCompanyList={searchCompanyList}
                                classes={classes}
                                status={saleStatus}
                                disabled={!applyForUsers(applyId, roles)}
                            />
                        </Grid>
                        <Grid
                            container
                            justify='center'
                            alignContent='center'
                            className={cn(classes.industryContainer, { [classes.editable]: isEdit })}
                            wrap='nowrap'
                        >
                            <Typography className={classes.label}>{translations.industry}:</Typography>
                            <Grid
                                item
                                container
                                justify='flex-end'
                                alignContent='center'
                            >
                                {isEdit
                                    ? <Grid className={classes.industryInput}>
                                        <CRMAutocompleteSelect
                                            controlled
                                            inputRef={industryRef}
                                            options={industryList}
                                            value={values.industry}
                                            isMulti
                                            onChange={suggestions => setFieldValue('industry', suggestions)}
                                        />
                                    </Grid>
                                    : <CRMIndustryList industry={pathOr([], ['industry'], values)} />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    phone: Yup.string()
        .nullable()
        .matches(PHONE_REGEXP, {
            message: '',
            excludeEmptyString: true,
        }),
    url: Yup.string()
        .nullable()
        .matches(SITE_REGEXP, {
            message: '',
            excludeEmptyString: true,
        }),
    responsibleRm: Yup.object()
        .nullable()
        .shape({
            value: Yup.number().required(),
        }),
});

export default withFormik({
    mapPropsToValues: ({
        company: {
            name, phone, url, responsibleRm, industryDtos,
        },
    }) => ({
        name,
        phone,
        url,
        responsibleRm: responsibleRm
            && { value: responsibleRm.id, label: `${responsibleRm.firstName} ${responsibleRm.lastName}` },
        industry: industryDtos && industryDtos.map(({ id, name: industryDtosName, common }) => ({ value: id, label: industryDtosName, group: common })),
    }),
    isInitialValid: true,
    enableReinitialize: true,
    handleSubmit: async (
        {
            name, phone, url, responsibleRm, industry,
        },
        { props: { updateCompanyCard, company }, resetForm },
    ) => {
        const isSuccess = await updateCompanyCard(company.id, {
            description: company.description,
            url,
            name,
            phone,
            responsibleRmId: pathOr(null, ['value'], responsibleRm),
            industryCreateRequestList: industry && industry.map(({ value }) => ({ id: value })),
        });

        if (!isSuccess) {
            resetForm();
        }
    },
    validationSchema,
})(withStyles(styles)(CompanyCard));
