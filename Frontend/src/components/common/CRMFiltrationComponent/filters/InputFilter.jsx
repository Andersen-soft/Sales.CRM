// @flow

import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMIcon from 'crm-ui/CRMIcons';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './filterStyles';

const ENTER_KEY_CODE = 13;

type Props = {
    filters: Object,
    filterName: string,
    onSetFilters: (filterName: string, filterValue: string | null) => void,
    onClose: () => void,
} & StyledComponentProps;

const InputFilter = ({
    onSetFilters,
    filterName,
    onClose,
    filters,
    classes,
}: Props) => {
    const [inputValue, setInputValue] = useState(filters[filterName]);

    const handleChange = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        setInputValue(value);
    };

    const handleClear = () => setInputValue('');

    const handleConfirm = () => {
        onSetFilters(filterName, inputValue);
        onClose();
    };

    const handleApplyFilters = ({ which }: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (which === ENTER_KEY_CODE) {
            onSetFilters(filterName, inputValue);
            onClose();
        }
    };

    return (
        <Grid
            container
            className={classes.inputFilterRoot}
            alignItems='center'
        >
            <CRMInput
                value={inputValue}
                onChange={handleChange}
                onKeyPress={handleApplyFilters}
                classes={{ inputField: classes.inputField }}
            />
            <Grid className={classes.inputControls}>
                <CRMIcon
                    IconComponent={Check}
                    className={classes.icon}
                    onClick={handleConfirm}
                />
                <CRMIcon
                    IconComponent={Clear}
                    className={classes.icon}
                    onClick={handleClear}
                />
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(InputFilter);
