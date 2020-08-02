// @flow

import React, { useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import { PAGE_SIZE } from 'crm-constants/globalSearch/globalSearchConstants';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { useTranslation } from 'crm-hooks/useTranslation';
import { CollapsedCell, UserCell, OuterLinkCell } from 'crm-components/common/TableCells';
import SalesCell from '../Cells/SalesCell';

import styles from './CompanyTableStyles';

type Industry = {
    id: number,
    name: string,
    common?: boolean,
}

type Company = {
    description: ?string,
    id: number,
    linkedSales: Array<number>,
    name: string,
    phone: ?string,
    responsibleRm: ?{
        id: number,
        firstName: string,
        lastName: string,
    },
    url: ?string,
    industryDtos: Array<Industry>,
}

type Props = {
    companies: Array<Company>,
    loading: boolean,
    setPage: (page: number) => void,
    page: number,
    count: number,
    reloadTable: () => void,
    classes: Object,
}

const CompanyTable = ({
    companies,
    loading,
    setPage,
    page,
    count,
    reloadTable,
    classes,
}: Props) => {
    const translations = {
        company: useTranslation('globalSearch.company'),
        companyUrl: useTranslation('globalSearch.companyUrl'),
        companyPhone: useTranslation('globalSearch.companyPhone'),
        comment: useTranslation('globalSearch.comment'),
        companyDD: useTranslation('globalSearch.companyDD'),
        sale: useTranslation('globalSearch.sale'),
        industry: useTranslation('globalSearch.industry'),
    };

    const getConfig = () => ([
        {
            title: translations.company,
            key: 'name',
        },
        {
            title: translations.companyUrl,
            key: 'url',
            RenderCell: OuterLinkCell,
        },
        {
            title: translations.companyPhone,
            key: 'phone',
        },
        {
            title: translations.comment,
            key: 'description',
            RenderCell: CollapsedCell,
        },
        {
            title: translations.companyDD,
            key: 'deliveryDirector',
            RenderCell: UserCell,
        },
        {
            title: translations.industry,
            key: 'industry',
            RenderCell: CollapsedCell,
        },
        {
            title: translations.sale,
            key: 'linkedSales',
            RenderCell: SalesCell,
        },
    ]);

    const prepareData = content => content.map(({
        id,
        name,
        url,
        phone,
        description,
        responsibleRm,
        linkedSales,
        industryDtos,
    }) => ({
        id,
        name,
        url,
        phone: phone || <CRMEmptyBlock />,
        description,
        deliveryDirector: {
            name: responsibleRm ? `${responsibleRm.firstName} ${responsibleRm.lastName}` : null,
            id: responsibleRm ? responsibleRm.id : null,
            reloadParent: reloadTable,
        },
        industry: industryDtos && industryDtos.map(({ name: industryName }) => industryName).join(', '),
        linkedSales,
    }));

    const useMemoWrapper = (Component, dependencies) => useMemo(() => Component, dependencies);

    return useMemoWrapper(<CRMTable
        data={prepareData(companies)}
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
        cellClasses={{
            name: classes.name,
            url: classes.url,
            phone: classes.phone,
            description: classes.description,
            deliveryDirector: classes.deliveryDirector,
            linkedSales: classes.linkedSales,
            industry: classes.industry,
        }}
        isLoading={loading}
        loaderPosition='fixed'
    />, [companies, page, loading]);
};

export default withStyles(styles)(CompanyTable);
