// @flow

import React, { useState, useEffect } from 'react';
import { pathOr, sortBy } from 'ramda';
import {
    Paper,
    Grid,
    Typography,
    RadioGroup,
    FormControlLabel,
} from '@material-ui/core';
import { setYear } from 'date-fns';
import { withStyles } from '@material-ui/core/styles';
import CRMRadio from 'crm-ui/CRMRadio/CRMRadio';
import { useTranslation } from 'crm-hooks/useTranslation';
import { SEARCH_BY_COMPANY, SEARCH_BY_CONTACTS } from 'crm-constants/globalSearch/globalSearchConstants';
import getEmployees from 'crm-api/saleCard/employeeServiceForSale';
import { RM_ID } from 'crm-roles';
import { getDate } from 'crm-utils/dates';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getCompanies, getContacts, getIndustries } from 'crm-api/globalSearchService/globalSearchService';
import { getCountry } from 'crm-api/contactsCard/contactsCardService';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';
import { crmTrim } from 'crm-utils/trimValue';
import transformOptionsForGroup from 'crm-utils/dataTransformers/transformOptionsForGroup';
import CompanySearchForm from './CompanySearchForm/CompanySearchForm';
import ContactSearchForm from './ContactSearchForm/ContactsSearchForm';
import CompanyTable from './CompanyTable';
import ContactTable from './ContactTable';

import styles from './SearchStyles';

type Props = {
    classes: Object,
}

const SearchPage = ({
    classes,
}: Props) => {
    const [searchBy, setSearchBy] = useState(SEARCH_BY_COMPANY);
    const [DDListSuggestions, setDDListSuggestions] = useState([]);
    const [loadingDD, setLoadingDD] = useState(false);
    const [companySearchParams, setCompanySearchParams] = useState({});
    const [companies, setCompanies] = useState([]);
    const [companiesPage, setCompaniesPage] = useState(0);
    const [companiesLoading, setCompaniesLoading] = useState(true);
    const [totalCompanyCount, setTotalCompanyCount] = useState(0);

    const [contactSearchParams, setContactSearchParams] = useState({});
    const [countryListSuggestions, setCountryListSuggestions] = useState([]);
    const [loadingCountry, setLoadingCountry] = useState([]);
    const [contactsPage, setContactsPage] = useState(0);
    const [contacts, setContacts] = useState([]);
    const [contactsLoading, setContactsLoading] = useState(false);
    const [totalContactCount, setTotalContactCount] = useState(0);
    const [loadingIndustry, setLoadingIndustry] = useState(false);
    const [industryList, setIndustryList] = useState([]);

    const translations = {
        search: useTranslation('globalSearch.search'),
        searchBy: useTranslation('globalSearch.searchBy'),
        companies: useTranslation('globalSearch.companies'),
        contacts: useTranslation('globalSearch.contacts'),
        common: useTranslation('common.common'),
        other: useTranslation('common.other'),
    };

    const searchCompany = async (page: number = companiesPage, searchParams = companySearchParams) => {
        let params = {};

        if (Object.keys(searchParams).length) {
            params = {
                page,
                companyName: crmTrim(pathOr('', ['companyName'], searchParams)),
                companyPhone: crmTrim(pathOr('', ['companyPhone'], searchParams)),
                companyUrl: crmTrim(pathOr('', ['companyUrl'], searchParams)),
                responsibleRmId: pathOr(null, ['companyDD', 'value'], searchParams),
                industry: pathOr([], ['industry'], searchParams).map(({ value }) => value),
                isFullCompanyInfo: true,
            };
        } else {
            params = { page };
        }

        try {
            setCompaniesLoading(true);
            const { content, totalElements } = await getCompanies(params, CANCELED_REQUEST);

            setCompanies(content);
            setTotalCompanyCount(totalElements);
            setCompaniesLoading(false);
        } catch {
            setCompaniesLoading(false);
        }
    };

    const searchContacts = async (page: number = contactsPage, searchParams = contactSearchParams) => {
        setContactsLoading(true);

        // set leap year for the backend to work properly
        const dateOfBirth = pathOr(null, ['birthday'], searchParams);

        if (dateOfBirth) {
            dateOfBirth.from = getDate(setYear(dateOfBirth.from, 2020), FULL_DATE_DS);
            dateOfBirth.to = getDate(setYear(dateOfBirth.to, 2020), FULL_DATE_DS);
        }

        try {
            const { content, totalElements } = await getContacts({
                page,
                email: pathOr('', ['email'], searchParams).trim(),
                fio: pathOr('', ['fio'], searchParams).trim(),
                phone: pathOr('', ['phone'], searchParams).trim(),
                skype: pathOr('', ['skype'], searchParams).trim(),
                socialNetworkLink: pathOr('', ['socialNetworkLink'], searchParams).trim(),
                countryId: pathOr(null, ['country', 'value'], searchParams),
                dateOfBirth: dateOfBirth ? [dateOfBirth.from, dateOfBirth.to] : null,
            });

            setContacts(content);
            setTotalContactCount(totalElements);
            setContactsLoading(false);
        } catch {
            setContactsLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Global search';

        setLoadingDD(true);
        setLoadingCountry(true);
        setLoadingIndustry(true);
        getEmployees({ role: [RM_ID], responsibleRM: true })
            .then(({ content }) => {
                const prepareData = content
                    .map(({ id: userId, firstName, lastName }) => ({
                        value: userId, label: `${firstName} ${lastName}`,
                    }));

                setDDListSuggestions(prepareData);
            })
            .finally(() => setLoadingDD(false));

        getCountry()
            .then(countries => {
                const sortedCountries = sortBy(({ name }) => name, countries);

                setCountryListSuggestions(sortedCountries.map(({ name, id }) => ({ label: name, value: id })));
            })
            .finally(() => setLoadingCountry(false));

        getIndustries()
            .then(industries => {
                const { common, other } = transformOptionsForGroup(industries);

                setIndustryList([{ label: translations.common, options: common }, { label: translations.other, options: other }]);
            })
            .finally(() => setLoadingIndustry(false));

        searchCompany(0);
        searchContacts(0);
    }, []);

    const changeSearchParams = (key: string, value: string) => {
        const changeSearchParamsFunc = searchBy === SEARCH_BY_COMPANY
            ? setCompanySearchParams
            : setContactSearchParams;

        changeSearchParamsFunc(params => ({ ...params, [key]: value }));
    };

    const updateItemsList = () => {
        if (searchBy === SEARCH_BY_COMPANY) {
            setCompaniesPage(0);
            searchCompany(0);
        } else {
            setContactsPage(0);
            searchContacts(0);
        }
    };

    const changePage = (newPage: number) => {
        if (searchBy === SEARCH_BY_COMPANY) {
            setCompaniesPage(newPage);
            searchCompany(newPage);
        } else {
            setContactsPage(newPage);
            searchContacts(newPage);
        }
    };

    const clearSearchParams = () => {
        if (searchBy === SEARCH_BY_COMPANY) {
            setCompanySearchParams({});
            searchCompany(0, {});
        } else {
            setContactSearchParams({});
            searchContacts(0, {});
        }
    };

    return (
        <Paper
            elevation={0}
            className={classes.container}
            classes={{ rounded: classes.rounded }}
        >
            <Grid
                container
                direction='column'
            >
                <Grid
                    item
                    className={classes.paddingRow}
                >
                    <Typography className={classes.headerTitle}>{translations.search}</Typography>
                </Grid>
                <Grid
                    item
                    container
                    className={classes.radioRow}
                >
                    <Grid item>
                        <Typography className={classes.radioGroupTitle}>
                            {`${translations.searchBy}:`}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <RadioGroup
                            onChange={({ target: { value } }) => setSearchBy(value)}
                            row
                        >
                            <FormControlLabel
                                label={<Typography className={classes.checkboxLabel}>
                                    {translations.companies}
                                </Typography>}
                                value={SEARCH_BY_COMPANY}
                                control={<CRMRadio checked={searchBy === SEARCH_BY_COMPANY} />}
                            />
                            <FormControlLabel
                                label={<Typography className={classes.checkboxLabel}>
                                    {translations.contacts}
                                </Typography>}
                                value={SEARCH_BY_CONTACTS}
                                control={<CRMRadio checked={searchBy === SEARCH_BY_CONTACTS} />}
                            />
                        </RadioGroup>
                    </Grid>
                </Grid>
                <Grid
                    item
                    className={classes.paddingRow}
                >
                    {searchBy === SEARCH_BY_COMPANY
                        ? <CompanySearchForm
                            searchParams={companySearchParams}
                            changeSearchParams={changeSearchParams}
                            DDListSuggestions={DDListSuggestions}
                            searchCompany={updateItemsList}
                            loadingDD={loadingDD}
                            clearSearchParams={clearSearchParams}
                            loadingIndustry={loadingIndustry}
                            industryList={industryList}
                        />
                        : <ContactSearchForm
                            searchParams={contactSearchParams}
                            changeSearchParams={changeSearchParams}
                            countryListSuggestions={countryListSuggestions}
                            searchContacts={updateItemsList}
                            loadingCountry={loadingCountry}
                            clearSearchParams={clearSearchParams}
                        />
                    }
                </Grid>
                <Grid item>
                    {searchBy === SEARCH_BY_COMPANY
                        ? <CompanyTable
                            companies={companies}
                            loading={companiesLoading}
                            setPage={changePage}
                            page={companiesPage}
                            count={totalCompanyCount}
                            reloadTable={searchCompany}
                        />
                        : <ContactTable
                            contacts={contacts}
                            loading={contactsLoading}
                            setPage={changePage}
                            page={contactsPage}
                            count={totalContactCount}
                        />
                    }
                </Grid>
            </Grid>
        </Paper>
    );
};

export default withStyles(styles)(SearchPage);
