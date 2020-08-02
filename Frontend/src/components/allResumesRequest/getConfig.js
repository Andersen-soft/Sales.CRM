// @flow

import React from 'react';
import {
    InputFilter,
    AutocompleteFilter,
    CheckboxFilter,
} from 'crm-components/common/CRMFiltrationComponent';
import { getResumeStatuses } from 'crm-api/allResumeRequestsService/allResumeRequestsService';
import {
    getCompanySuggestionList,
    getRsponsibleRmSuggestionList,
    getResponsibleForSaleSuggestionList,
} from 'crm-utils/dataTransformers/suggestionTransform/suggestionTransform';
import { LinkCell, UserCell } from 'crm-components/common/TableCells';

const getConfig = (
    filters: Object,
    sort: string,
    handleSetFilters: (fieldName: string, filterValue: number | string | Array<string> | Array<number>) => void,
    setSort: string => void,
) => [
    {
        title: 'allRequestForCv.tableColumnTitle.requestName',
        key: 'name',
        RenderCell: LinkCell,
        filterParams: {
            component: InputFilter,
            onSetFilters: handleSetFilters,
            filters,
        },
    },
    {
        title: 'allRequestForCv.tableColumnTitle.company',
        key: 'companyName',
        RenderCell: LinkCell,
        filterParams: {
            component: AutocompleteFilter,
            filterName: 'companyId',
            onSetFilters: handleSetFilters,
            getFilterParams: getCompanySuggestionList,
            filters,
        },
    },
    {
        title: 'allRequestForCv.tableColumnTitle.status',
        key: 'status',
        filterParams: {
            component: CheckboxFilter,
            onSetFilters: handleSetFilters,
            getFilterParams: getResumeStatuses,
            filters,
        },
    },
    {
        title: 'allRequestForCv.tableColumnTitle.deadline',
        key: 'deadline',
        sortingParams: {
            changeSorting: setSort,
            sort,
        },
    },
    {
        title: 'allRequestForCv.tableColumnTitle.responsibleRm',
        key: 'responsible',
        RenderCell: UserCell,
        filterParams: {
            component: AutocompleteFilter,
            filterName: 'responsibleId',
            onSetFilters: handleSetFilters,
            getFilterParams: getRsponsibleRmSuggestionList,
            filters,
        },
    },
    {
        title: 'allRequestForCv.tableColumnTitle.created',
        key: 'createDate',
        sortingParams: {
            changeSorting: setSort,
            sort,
        },
    },
    {
        title: 'allRequestForCv.tableColumnTitle.responsible',
        key: 'responsibleForSaleRequestName',
        RenderCell: UserCell,
        filterParams: {
            component: AutocompleteFilter,
            filterName: 'responsibleForSaleRequestId',
            onSetFilters: handleSetFilters,
            getFilterParams: getResponsibleForSaleSuggestionList,
            filters,
        },
    },
    {
        title: 'allRequestForCv.tableColumnTitle.countResume',
        key: 'countResume',
        sortingParams: {
            changeSorting: setSort,
            sort,
        },
    },
    {
        title: 'allRequestForCv.tableColumnTitle.returnResumeCount',
        key: 'returnsResumeCount',
        sortingParams: {
            changeSorting: setSort,
            sort,
        },
    },
];

export default getConfig;
