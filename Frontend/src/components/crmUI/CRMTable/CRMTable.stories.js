// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Filtration, CheckboxFilter } from 'crm-components/common/CRMFiltrationComponent';
import SortDirection from 'crm-components/common/CRMSortDirectionComponent/SortDirectionComponent';

import { getResumeStatuses } from 'crm-api/allResumeRequestsService/allResumeRequestsService';

import CRMTable from './CRMTable';

const RenderCell = ({ values }) => `custom render ${values}`;

const renderFilter = () => (<Filtration
    component={CheckboxFilter}
    columnKey={'company'}
    onSetFilters={action('onSetFilter')}
    onFilteredRequests={getResumeStatuses}
    requestDataForFilters={getResumeStatuses}
    filters={{}}
/>);

const renderSortDirection = () => (<SortDirection
    columnKey='id'
    initSort='desc'
    changeSorting={action('onChangeSorting')}
/>);

// example incoming data
const incomingData = [
    {
        company: {
            id: 1234,
            name: 'Test Company',
            url: null,
            linkedSales: [12, 123, 1234, 12345, 123456],
        },
        createDate: '2019-05-07T15:46:32',
        description: null,
        estimations: [
            {
                id: 1,
                name: 'test',
                oldId: null,
            },
            {
                id: 2,
                name: 'test new_deliv',
                oldId: null,
            },
        ],
        id: 12,
        lastActivityDate: '2019-06-20T13:08:00',
        mainContact: {
            email: 'ivan@gmail.com',
            firstName: 'Иван',
            id: 123,
            lastName: 'Иванов',
            skype: null,
            socialNetwork: null,
            socialNetworkUser: {
                id: 135,
                name: 'огонь',
            },
        },
        nextActivityDate: '2019-06-21T23:59:59',
        responsible: {
            additionalInfo: 'about sales_1',
            additionalPhone: null,
            email: 'testvit15@gmail.com',
            firstName: 'test_sales',
            id: 123,
            lastName: 'test',
            phone: '123465789',
            skype: '',
        },
        resumes: [
            {
                id: 23,
                name: 'test req+sale',
                oldId: null,
            },
            {
                id: 233,
                name: 'test',
                oldId: null,
            },
            {
                id: 2333,
                name: 'test',
                oldId: null,
            },
        ],
        status: 'Лид',
        weight: -1,
    },
    {
        company: {
            id: 123456,
            name: 'Test Company',
            url: null,
            linkedSales: [12, 123, 1234, 12345, 123456],
        },
        createDate: '2019-05-07T15:46:32',
        description: null,
        estimations: [
            {
                id: 12,
                name: 'test',
                oldId: null,
            },
            {
                id: 13,
                name: 'test new_deliv',
                oldId: null,
            },
        ],
        id: 104483,
        lastActivityDate: '2019-06-20T13:08:00',
        mainContact: {
            email: 'leonidborovoj@gmail.com',
            firstName: 'Петр',
            id: 333,
            lastName: 'Петров',
            skype: null,
            socialNetwork: null,
            socialNetworkUser: {
                id: 123,
                name: 'огонь',
            },
        },
        nextActivityDate: '2019-06-21T23:59:59',
        responsible: {
            additionalInfo: 'about sales_1',
            additionalPhone: null,
            email: 'testvit15@gmail.com',
            firstName: 'test_sales',
            id: 123,
            lastName: 'test',
            phone: '123465789',
            skype: '',
        },
        resumes: [
            {
                id: 234,
                name: 'test req+sale',
                oldId: null,
            },
            {
                id: 235,
                name: 'test',
                oldId: null,
            },
            {
                id: 236,
                name: 'test',
                oldId: null,
            },
        ],
        status: 'Лид',
        weight: -1,
    },
    {
        company: {
            id: 1234567,
            name: 'Test Company',
            url: null,
            linkedSales: [12, 123, 1234, 12345, 123456],
        },
        createDate: '2019-05-07T15:46:32',
        description: null,
        estimations: [
            {
                id: 237,
                name: 'test',
                oldId: null,
            },
            {
                id: 238,
                name: 'test new_deliv',
                oldId: null,
            },
        ],
        id: 104484,
        lastActivityDate: '2019-06-20T13:08:00',
        mainContact: {
            email: 'leonidborovoj@gmail.com',
            firstName: 'John',
            id: 123,
            lastName: 'Dou',
            skype: null,
            socialNetwork: null,
            socialNetworkUser: {
                id: 135,
                name: 'огонь',
            },
        },
        nextActivityDate: '2019-06-21T23:59:59',
        responsible: {
            additionalInfo: 'about sales_1',
            additionalPhone: null,
            email: 'testvit15@gmail.com',
            firstName: 'test_sales',
            id: 111,
            lastName: 'test',
            phone: '123465789',
            skype: '',
        },
        resumes: [
            {
                id: 1238,
                name: 'test req+sale',
                oldId: null,
            },
            {
                id: 1239,
                name: 'test',
                oldId: null,
            },
            {
                id: 124,
                name: 'test',
                oldId: null,
            },
        ],
        status: 'Лид',
        weight: -1,
    },
];

// обязательный ключ id, нужно для key в рендере строки
const prepareData = content => content.map(({ id, company, mainContact, nextActivityDate }) => ({
    id,
    company: company.name,
    mainContact: `${mainContact.firstName} ${mainContact.lastName}`,
    nextActivity: nextActivityDate,
    activity: 'activity Button',
}));

// поле key должно совпадать с ключем в обьекте prepareData
const getConfig = () => ([
    {
        title: 'ID продажи',
        key: 'id',
        visible: true,
        renderSortDirection,
    },
    {
        title: 'Компания',
        key: 'company',
        visible: true,
        renderFilter,
    },
    {
        title: 'Основной контакт',
        key: 'mainContact',
        visible: true,
    },
    {
        title: 'След. активность',
        key: 'nextActivity',
        visible: true,
        RenderCell,
    },
    {
        title: 'Активность',
        key: 'activity',
        visible: true,
        RenderCell: () => 'custom button',
    },
]);

storiesOf('CRMTable', module)
    .add('CRM Simple Table', () => (
        <CRMTable
            data={prepareData(incomingData)}
            columnsConfig={getConfig()}
            paginationParams={{
                rowsPerPage: 10,
                count: 140,
                onChangePage: action('onChangePage'),
            }}
            isLoading={false}
        />
    ))
    .add('CRM Simple Table with out pagination', () => (
        <CRMTable
            data={prepareData(incomingData)}
            columnsConfig={getConfig()}
            isLoading={false}
        />
    ))
    .add('CRM Simple Table with loader', () => (
        <CRMTable
            data={prepareData(incomingData)}
            columnsConfig={getConfig()}
            paginationParams={{
                rowsPerPage: 10,
                count: 140,
                onChangePage: action('onChangePage'),
            }}
            isLoading
        />
    ))
    .add('CRM Simple Table with out data', () => (
        <CRMTable
            data={[]}
            columnsConfig={getConfig()}
            isLoading={false}
        />
    ))
    .add('CRM Simple Table hide first column', () => (
        <CRMTable
            data={prepareData(incomingData)}
            columnsConfig={(() => {
                const config = getConfig();

                config[0].visible = false;
                return config;
            })()}
            isLoading={false}
        />
    ));
