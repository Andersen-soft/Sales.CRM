// @flow

import React, { useState } from 'react';
import { Grid, Tooltip, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ArrowDropDown } from '@material-ui/icons';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { useTranslation } from 'crm-hooks/useTranslation';
import { changeResume } from 'crm-api/ResumeService/resumeService';

import styles from './cellStyles';

type Props = {
    values: [string, Array<string>, number, () => void, (boolean) => void],
    classes: Object,
};

const StatusCell = ({
    values: [value, statuses, id, reloadTable, setLoading],
    classes,
}: Props) => {
    const [inEditMode, setInEditMode] = useState(false);

    const translations = {
        edit: useTranslation('common.edit'),
    };

    const handleEdit = () => setInEditMode(edit => !edit);

    const handleSave = async ({ label: status }) => {
        setLoading(true);
        await changeResume({ resumeId: id, status });
        handleEdit();
        reloadTable();
    };

    const statusSuggestions = statuses.map((status, index) => (
        { label: status, value: index }
    ));

    return <Grid className={classes.editableCell}>
        {inEditMode
            ? <CRMAutocompleteSelect
                value={value}
                options={statusSuggestions}
                onChange={handleSave}
                onBlur={handleEdit}
                autoFocus
                menuIsOpen
                menuPosition='fixed'
                menuShouldBlockScroll
            />
            : <Grid
                item
                container
                direction='row'
                justify='flex-start'
                alignItems='center'
                wrap='nowrap'
            >
                <Grid className={classes.statusValue}>
                    {value}
                </Grid>
                <Tooltip title={translations.edit}>
                    <IconButton onClick={handleEdit}>
                        <ArrowDropDown />
                    </IconButton>
                </Tooltip>
            </Grid>
        }
    </Grid>;
};

export default withStyles(styles)(StatusCell);
