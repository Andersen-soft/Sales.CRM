// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'crm-hooks/useTranslation';
import { Grid } from '@material-ui/core';
import CRMDotMenu from 'crm-ui/CRMDotMenu/CRMDotMenu';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import CRMCheckbox from 'crm-ui/CRMCheckbox/CRMCheckbox';
import CRMIcon from 'crm-icons';
import CheckIcon from 'crm-static/customIcons/check.svg';

import styles from './ActionsStyle';

type Props = {
    classes: Object,
    values: [
        number,
        (id: number) => void,
        (id: number) => void,
        () => void,
        () => void,
        (id: number) => void,
        Array<any>,
        (id: number) => void,
    ],
    isEdit: boolean,
};

const Actions = ({
    classes,
    values: [
        id,
        handleDeleteRow,
        handleEditRow,
        closeEditMode,
        saveRow,
        handleCheckedRow,
        checkedRowsIds,
        handleSaveAllRows,
    ],
    isEdit,
}: Props) => {
    const translations = {
        edit: useTranslation('common.edit'),
        saveWithLead: useTranslation('socialNetworksReplies.common.saveWithLead'),
        reject: useTranslation('socialNetworksReplies.common.reject'),
    };

    const dotMenuConfig = [
        {
            icon: EditIcon,
            text: translations.edit,
            handler: () => handleEditRow(id),
            disable: false,
        },
        {
            icon: SaveIcon,
            text: translations.saveWithLead,
            handler: () => { handleSaveAllRows(id); },
            disabled: false,
        },
        {
            icon: CloseIcon,
            text: translations.reject,
            handler: () => { handleDeleteRow(id); },
            disabled: false,
        },
    ];

    return isEdit
        ? <Grid
            container
            direction='column'
            alignItems='center'
        >
            <CRMIcon
                onClick={closeEditMode}
                IconComponent={CloseIcon}
            />
            <CRMIcon
                onClick={saveRow}
                IconComponent={CheckIcon}
            />
        </Grid>
        : <Grid
            container
            wrap='nowrap'
            className={classes.container}
        >
            {!checkedRowsIds.includes(id) && (
                <CRMDotMenu
                    config={dotMenuConfig}
                    className={classes.dotMenu}
                />
            )}
            <CRMCheckbox
                onChange={() => handleCheckedRow(id)}
                value={id}
                checked={checkedRowsIds.includes(id)}
                classes={{ root: classes.checkbox }}
            />
        </Grid>;
};

export default withStyles(styles)(Actions);
