// @flow

import React, { useState, useEffect } from 'react';
import { FormGroup } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import { equals } from 'ramda';
import CRMFormControlCheckboxLabel from 'crm-components/crmUI/CRMFormControlCheckboxLabel/CRMFormControlCheckboxLabel';
import CRMButton from 'crm-ui/CRMButton/CRMButton';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './filterStyles';

type ListType = {
    id: number,
    value: string,
    checked: boolean,
};

type Props = {
    filters: Object,
    filterName: string,
    onSetFilters: (filterName: string | null | void, filterValue: number | Array<string> | string) => void;
    getFilterParams: () => Promise<Array<String>>,
    onClose: () => void;
} & StyledComponentProps;

const CheckboxStatusFilter = ({
    filters,
    filterName,
    onSetFilters,
    getFilterParams,
    onClose,
    classes,
}: Props) => {
    const [list, setList] = useState([]);

    useEffect(() => {
        (async () => {
            const statusValues = filters[filterName];
            const actualValues = filters.actual;
            const items: Array<string> = await getFilterParams(filters, filterName);

            const itemValue = statusValues || actualValues;
            const newList = items.map((value, index) => ({
                id: index,
                value,
                checked: !!itemValue && itemValue.includes(value),
            }));

            setList(newList);
        })();
    }, []);

    const selectItem = (id: number) => () => {
        const newList = list.map(item => {
            if (item.id === id) {
                item.checked = !item.checked;
            }

            return item;
        });

        setList([...newList]);
    };

    const handleConfirm = () => {
        const checkedList = list
            .filter(({ checked }: ListType) => checked)
            .map(({ value }: ListType) => value);

        equals(filters.actual, checkedList)
            ? onSetFilters(filterName, null)
            : onSetFilters(filterName, checkedList);
        onClose();
    };

    return (
        <FormGroup
            className={classes.checkboxContainer}
            classes={{ root: classes.checkboxFilterRoot }}
        >
            {list.map(({ id, checked, value }) => <CRMFormControlCheckboxLabel
                key={id}
                checkboxProps={{
                    checked,
                    onChange: selectItem(id),
                    value,
                }}
                label={value}
                labelClasses={{
                    label: classes.checkboxLabel,
                    root: classes.checkboxLabelRoot,
                }}
            />)}
            <CRMButton
                fullWidth
                onClick={handleConfirm}
            >
                <FormattedMessage id='common.apply' />
            </CRMButton>
        </FormGroup>
    );
};

export default withStyles(styles)(CheckboxStatusFilter);
