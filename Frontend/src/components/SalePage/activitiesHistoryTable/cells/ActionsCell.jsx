// @flow

import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close, Delete, Edit } from '@material-ui/icons';
import CRMIcon from 'crm-icons';
import CheckIcon from 'crm-static/customIcons/check.svg';
import CRMDotMenu from 'crm-ui/CRMDotMenu/CRMDotMenu';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './cellsStyles';

type Props = {
    classes: Object,
    values: [
        number,
        (Object) => void,
        (number) => void,
        () => void,
        (number) => void,
        boolean,
    ],
    isEdit: boolean,
}

const ActionsCell = ({
    classes,
    values: [
        activityId,
        setEditActivity,
        onEditActivity,
        saveActiveChange,
        setDeleteActivityId,
        disabled,
    ],
    isEdit,
}: Props) => {
    const translations = {
        edit: useTranslation('common.edit'),
        delete: useTranslation('common.delete'),
    };

    const dotMenuConfig = [
        { icon: Edit, text: translations.edit, handler: onEditActivity(activityId), disabled },
        { icon: Delete, text: translations.delete, handler: () => setDeleteActivityId(activityId), disabled }];

    return (
        <Grid
            container
            justify='center'
            className={classes.actionsCell}
        >
            {isEdit
                ? <Grid
                    container
                    direction='column'
                >
                    <CRMIcon
                        IconComponent={Close}
                        onClick={() => setEditActivity({})}
                    />
                    <CRMIcon
                        IconComponent={CheckIcon}
                        onClick={saveActiveChange}
                    />
                </Grid>
                : <CRMDotMenu
                    className={classes.menuButton}
                    config={dotMenuConfig}
                />}
        </Grid>
    );
};

export default withStyles(styles)(ActionsCell);
