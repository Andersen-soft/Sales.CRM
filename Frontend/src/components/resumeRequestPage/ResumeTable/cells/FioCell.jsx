// @flow

import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CRMEditableField from 'crm-ui/CRMEditableField/CRMEditableField';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: [string, ({ fio: string }) => void],
} & StyledComponentProps;

const FioCell = ({
    values: [value, onSave],
    classes,
}: Props) => {
    const [localValue, setLocalValue] = useState(value);

    const handleChange = ({ target: { value: fio } }: SyntheticInputEvent<HTMLInputElement>) => {
        setLocalValue(fio.trim());
    };

    const handleSave = () => {
        (value !== localValue && localValue) && onSave({ fio: localValue });
    };

    const renderCustomLabel = () => (value
        ? <Typography className={classes.fio}>
            {value}
        </Typography>
        : <CRMEmptyBlock />
    );

    return <CRMEditableField
        component={CRMInput}
        componentType='input'
        onCloseEditMode={handleSave}
        renderCustomLabel={renderCustomLabel}
        justify='flex-start'
        showEditOnHover
        componentProps={{
            value: localValue,
            onChange: handleChange,
            fullWidth: true,
        }}
    />;
};

export default withStyles(styles)(FioCell);
