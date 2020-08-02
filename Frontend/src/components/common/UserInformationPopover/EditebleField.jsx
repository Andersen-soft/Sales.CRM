// @flow

import React, { useState } from 'react';
import {
    Grid,
    Typography,
    Tooltip,
    IconButton,
    FormControl,
    TextField,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import EmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from 'crm-components/common/UserInformationPopover/UserInformationPopoverStyles';

type Props = {
    classes: Object,
    value: string,
    handleEdit: (string) => void,
    editable: boolean,
    requiredField?: boolean,
};

const EditebleField = ({
    classes,
    value,
    handleEdit,
    editable,
    requiredField,
}: Props) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [fieldValue, setFieldValue] = useState('');

    const translations = {
        edit: useTranslation('common.edit'),
    };

    if ((value || !requiredField) && (value !== fieldValue) && !isEditMode) {
        setFieldValue(value);
    }

    const handleSwitchMode = () => {
        setIsEditMode(!isEditMode);
    };

    const handleChange = ({ target: { value: newValue } }: SyntheticInputEvent<HTMLInputElement>) => {
        setFieldValue(newValue);
    };

    const handleSave = ({ target: { value: newValue } }: SyntheticInputEvent<HTMLInputElement>) => {
        if ((newValue.length || !requiredField) && newValue !== value) {
            handleEdit(newValue);
            setFieldValue(newValue);
        }

        handleSwitchMode();
    };

    return (
        <>
            {
                isEditMode ? (
                    <>
                        <FormControl className={classes.fullWidth}>
                            <TextField
                                InputProps={{ className: classes.inputField }}
                                value={fieldValue}
                                type='text'
                                fullWidth
                                autoFocus
                                onChange={handleChange}
                                onBlur={handleSave}
                            />
                        </FormControl>
                    </>
                ) : (
                        <>
                            <Grid className={classes.valueItem}>
                                {
                                    fieldValue
                                        ? (<Typography>{fieldValue}</Typography>)
                                        : <EmptyBlock />
                                }
                                {editable
                                    && <Tooltip
                                        title={translations.edit}
                                        className={classes.paddingFix}
                                    >
                                        <IconButton
                                            aria-label={translations.edit}
                                            onClick={() => handleSwitchMode()}

                                        >
                                            <Edit className={classes.editIcon} />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </Grid>
                        </>
                )
            }
        </>
    );
};

export default withStyles(styles)(EditebleField);
