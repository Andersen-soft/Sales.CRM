// @flow

import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import styles from 'crm-components/common/UserInformationPopover/UserInformationPopoverStyles';

type Props = {
    classes: Object,
    value: string,
    handleEdit: (string) => void,
    editable: boolean,
    requiredField?: boolean,
};

const EditableTextArea = ({
    classes,
    value,
    handleEdit,
    editable,
    requiredField,
}: Props) => {
    const [fieldValue, setFieldValue] = useState('');

    useEffect(() => {
        if ((value || !requiredField) && (value !== fieldValue)) {
            setFieldValue(value);
        }
    }, [value, requiredField]);

    const handleChange = ({ target: { value: newValue } }: SyntheticInputEvent<HTMLInputElement>) => {
        setFieldValue(newValue);
    };

    const handleSave = ({ target: { value: newValue } }: SyntheticInputEvent<HTMLInputElement>) => {
        if ((newValue.length || !requiredField) && newValue !== value) {
            handleEdit(newValue);
            setFieldValue(newValue);
        }
    };

    return (
        <Grid
            item
            className={classes.fullWidth}
        >
            <TextField
                fullWidth
                multiline
                variant='outlined'
                InputProps={{ className: classes.commentField }}
                value={fieldValue || ''}
                onChange={handleChange}
                onBlur={handleSave}
                rows={3}
                disabled={!editable}
            />
        </Grid>
    );
};

export default withStyles(styles)(EditableTextArea);
