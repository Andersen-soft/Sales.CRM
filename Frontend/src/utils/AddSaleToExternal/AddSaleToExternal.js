// @flow
import { uniqBy } from 'ramda';
import { FULL_DATE_DS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';

type OPTIONS = {
    type: string,
    name: string
}

type USER_TYPE = {
    firstName: string,
    lastName: string,
    id: number
}

type DATA_EXPORT = {
    label: string,
    value: number,
}

export const getUniqSources = (sources: Array<OPTIONS>) => uniqBy(
    ({ value }) => value,
    sources.reduce((acc: Array<Object>, item: Object): Array<Object> => {
        acc.push(item.type === 'Социальная сеть'
            ? {
                label: 'Social network',
                value: 'Соцсеть',
                title: item.tooltip,
            }
            : {
                label: item.name,
                value: item.name,
                title: item.tooltip,
            });
        return acc;
    }, [])
);

export const createUsers = (users: Array<USER_TYPE>): Array<DATA_EXPORT> => users.map((user: Object) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id,
}));

export const createCountries = (countries: Array<Object>): Array<DATA_EXPORT> => countries.map(item => ({
    label: item.name,
    value: item.id,
}));

export const transformDataForRequest = (values: Object, sale: number, id: number) => {
    const data = Object.keys(values).reduce((acc: Object, item: string): Object => {
        let value = values[item];

        if (item === 'country' || item === 'mainRM' || item === 'subMainRM') {
            value = values[item].value;
        }
        if (item === 'projectType' || item === 'source') {
            value = values[item].value;
        }
        if (item === 'firstContactDate') {
            value = getDate(values[item], FULL_DATE_DS);
        }
        if (item === 'sales') {
            value = id;
        }
        if (item === 'startDate') {
            value = getDate(values[item], FULL_DATE_DS);
        }
        return ({
            ...acc,
            [item]: value,
        });
    }, {});

    data.sale = sale;
    return data;
};
