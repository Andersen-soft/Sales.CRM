// @flow

import React, { useState } from 'react';
import {
    Grid, Tooltip, IconButton,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ArrowDropDown } from '@material-ui/icons';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: [
        string,
        Array<string>,
        ({ status: string }) => void,
    ],
} & StyledComponentProps;

const StatusCell = ({
    values: [value, statuses, onSave],
    classes,
}: Props) => {
    const [inEditMode, setInEditMode] = useState(false);

    const translations = {
        edit: useTranslation('common.edit'),
    };

    const handleEdit = () => setInEditMode(!inEditMode);

    const handleSave = ({ label: status }) => {
        onSave({ status });
        handleEdit();
    };

    const statusSuggestions = statuses.map((status, index) => (
        { label: status, value: index }
    ));

    const renderSelect = () => (
        <CRMAutocompleteSelect
            value={value}
            options={statusSuggestions}
            onChange={handleSave}
            onBlur={handleEdit}
            autoFocus
            menuIsOpen
            menuPosition={'fixed'}
            menuShouldBlockScroll
        />
    );

    return (
        <Grid className={classes.editableCell}>
            {inEditMode
                ? renderSelect()
                : <Grid
                    item
                    container
                    direction='row'
                    justify='flex-start'
                    alignItems='center'
                >
                    <Grid>
                        {value}
                    </Grid>
                    <Tooltip title={translations.edit}>
                        <IconButton onClick={handleEdit}>
                            <ArrowDropDown />
                        </IconButton>
                    </Tooltip>
                </Grid>
            }
        </Grid>
    );
};

export default withStyles(styles)(StatusCell);
