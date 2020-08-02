// @flow

import React, { useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import { PAGE_SIZE } from 'crm-constants/globalSearch/globalSearchConstants';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { useTranslation } from 'crm-hooks/useTranslation';
import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { OuterLinkCell } from 'crm-components/common/TableCells';
import SalesCell from '../Cells/SalesCell';

import styles from './ContactTableStyles';

type Contact = {
    company: { id: number, name: string },
    companyRelatedSales: Array<number>,
    contactRelatedSales: Array<number>,
    country: { id: number, name: string } | null,
    email: string,
    firstName: string,
    id: number,
    isActive: boolean,
    lastName: string,
    personalEmail: string,
    phone: string,
    position: string,
    recommendationCompany: number | null,
    sex: string,
    skype: string,
    socialNetwork: string | null,
    socialNetworkUser: string | null,
    source: { id: number, name: string },
    dateOfBirth: ?string,
}

type Props = {
    contacts: Array<Contact>,
    loading: boolean,
    setPage: (page: number) => void,
    page: number,
    count: number,
    classes: Object,
}

const ContactTable = ({
    contacts,
    loading,
    setPage,
    page,
    count,
    classes,
}: Props) => {
    const translations = {
        fio: useTranslation('globalSearch.fio'),
        email: useTranslation('globalSearch.email'),
        socialNetworkLink: useTranslation('globalSearch.socialNetworkLink'),
        phone: useTranslation('globalSearch.phone'),
        emailPrivate: useTranslation('globalSearch.emailPrivate'),
        country: useTranslation('globalSearch.country'),
        sale: useTranslation('globalSearch.sale'),
        birthday: useTranslation('globalSearch.birthday'),
    };

    const prepareData = content => content.map(({
        id,
        firstName,
        lastName,
        email,
        skype,
        socialNetwork,
        phone,
        personalEmail,
        country,
        companyRelatedSales,
        contactRelatedSales,
        dateOfBirth,
    }) => ({
        id,
        fio: `${firstName} ${lastName}`,
        dateOfBirth: dateOfBirth ? getDate(dateOfBirth, FULL_DATE_CS) : <CRMEmptyBlock />,
        email: email || <CRMEmptyBlock />,
        skype: skype || <CRMEmptyBlock />,
        socialNetwork,
        phone: phone || <CRMEmptyBlock />,
        personalEmail: personalEmail || <CRMEmptyBlock />,
        country: country ? country.name : <CRMEmptyBlock />,
        sales: contactRelatedSales,
    }));

    const getConfig = () => ([
        {
            title: translations.fio,
            key: 'fio',
        },
        {
            title: translations.birthday,
            key: 'dateOfBirth',
        },
        {
            title: translations.email,
            key: 'email',
        },
        {
            title: 'Skype',
            key: 'skype',
        },
        {
            title: translations.socialNetworkLink,
            key: 'socialNetwork',
            RenderCell: OuterLinkCell,
        },
        {
            title: translations.phone,
            key: 'phone',
        },
        {
            title: translations.emailPrivate,
            key: 'personalEmail',
        },
        {
            title: translations.country,
            key: 'country',
        },
        {
            title: translations.sale,
            key: 'sales',
            RenderCell: SalesCell,
        },
    ]);

    const useMemoWrapper = (Component, dependencies) => useMemo(() => Component, dependencies);

    return useMemoWrapper(<CRMTable
        data={prepareData(contacts)}
        columnsConfig={getConfig()}
        classes={{
            root: classes.tableRoot,
            cell: classes.cell,
            head: classes.head,
            headerCell: classes.headerCell,
            title: classes.title,
        }}
        paginationParams={{
            rowsPerPage: PAGE_SIZE,
            count,
            page,
            onChangePage: setPage,
        }}
        isLoading={loading}
        loaderPosition='fixed'
    />, [contacts, page, loading]);
};

export default withStyles(styles)(ContactTable);
