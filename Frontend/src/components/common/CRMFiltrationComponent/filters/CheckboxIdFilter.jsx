// @flow

import React, { useState, useEffect } from 'react';
import { FormGroup, Tooltip, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import CRMFormControlCheckboxLabel from 'crm-components/crmUI/CRMFormControlCheckboxLabel/CRMFormControlCheckboxLabel';
import CRMButton from 'crm-ui/CRMButton/CRMButton';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './filterStyles';

type ListType = {
    id: number,
    name: string,
    checked: boolean,
    tooltip?: string,
};

type Item = {
    id: number,
    name: string,
    tooltip?: string,
}

type Props = {
    filters: Object,
    filterName: string,
    onSetFilters: (filterName: string, filterValue: Array<number>) => void;
    getFilterParams: () => Promise<Array<String>>,
    onClose: () => void;
} & StyledComponentProps;

const CheckboxIdFilter = ({
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
            const itemValue = filters[filterName];
            const items: Array<Item> = await getFilterParams(filters, filterName);

            const newList = items.map(({ id, name, tooltip }) => ({
                id,
                name,
                checked: !!itemValue && itemValue.includes(id),
                tooltip,
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
        onSetFilters(
            filterName,
            list.filter(({ checked }: ListType) => checked).map(({ id }: ListType) => id)
        );

        onClose();
    };

    return (
        <FormGroup
            className={classes.checkboxContainer}
            classes={{ root: classes.checkboxFilterRoot }}
        >
            {list.map(({ id, checked, name, tooltip }) => <CRMFormControlCheckboxLabel
                key={id}
                checkboxProps={{
                    checked,
                    onChange: selectItem(id),
                    value: name,
                }}
                label={tooltip
                    ? <Tooltip
                        title={tooltip}
                        arrow
                        placement='right'
                    >
                        <Grid>{name}</Grid>
                    </Tooltip>
                    : name}
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

export default withStyles(styles)(CheckboxIdFilter);
