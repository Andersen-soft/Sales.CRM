// @flow

import React, { useState, useEffect } from 'react';
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
import { CYRILLIC_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';

import styles from 'crm-components/common/UserInformationPopover/UserInformationPopoverStyles';

type Props = {
    classes: Object,
    value: string,
    handleEdit: (string) => void,
    editable: boolean,
    requiredField?: boolean,
};

const TelegramField = ({
    classes,
    value,
    handleEdit,
    editable,
    requiredField,
}: Props) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [telegramName, setTelegramName] = useState('');

    const translations = {
        edit: useTranslation('common.edit'),
    };

    useEffect(() => {
        if ((value !== telegramName) && !isEditMode) {
            setTelegramName(value);
        }
    }, [value]);

    const handleChange = ({ target: { value: newValue } }: SyntheticInputEvent<HTMLInputElement>) => {
        const nameWithoutAt = newValue.slice(1);

        if (!CYRILLIC_REGEXP.test(nameWithoutAt)) {
            setTelegramName(nameWithoutAt);
        }
    };

    const handleSave = ({ target: { value: newValue } }: SyntheticInputEvent<HTMLInputElement>) => {
        const nameWithoutAt = newValue.slice(1);

        if ((nameWithoutAt.length || !requiredField) && nameWithoutAt !== value) {
            handleEdit(nameWithoutAt);
            setTelegramName(nameWithoutAt);
        } else {
            setTelegramName(value);
        }

        setIsEditMode(editMode => !editMode);
    };

    return isEditMode
        ? <FormControl className={classes.fullWidth}>
            <TextField
                InputProps={{ className: classes.inputField }}
                value={`@${telegramName || ''}`}
                type='text'
                fullWidth
                autoFocus
                onChange={handleChange}
                onBlur={handleSave}
            />
        </FormControl>
        : <Grid className={classes.valueItem}>
            {telegramName
                ? (<Typography>{`@${telegramName}`}</Typography>)
                : <EmptyBlock />}
            {editable && <Tooltip
                title={translations.edit}
                className={classes.paddingFix}
            >
                <IconButton
                    aria-label={translations.edit}
                    onClick={() => setIsEditMode(editMode => !editMode)}
                >
                    <Edit className={classes.editIcon} />
                </IconButton>
            </Tooltip>}
        </Grid>;
};

export default withStyles(styles)(TelegramField);
