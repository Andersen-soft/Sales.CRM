// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import CRMIcon from 'crm-ui/CRMIcons';
import { statusConfig } from 'crm-constants/reportBySocialContactsSalesHead/reportBySocialContactsSalesHead';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './cellStyles';

type Props = {
    classes: Object,
    values: string,
};

const StatusCell = ({
    values: status,
    classes,
}: Props) => <Grid
    container
    alignItems='center'
>
    <CRMIcon
        IconComponent={statusConfig[status].icon}
        className={classes.statusIcon}
    />
    {useTranslation(statusConfig[status].title)}
</Grid>;

export default withStyles(styles)(StatusCell);
