// @flow

import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './CRMEmptyBlockStyles';

type Props = {
    classes: Object,
    text?: string,
};

const EmptyBlock = ({ classes, text = useTranslation('components.emptyBlock'), ...rest }: Props) => (
    <Typography
        {...rest}
        classes={{ root: classes.emptyBlock }}
    >
        {text}
    </Typography>);

export default withStyles(styles)(EmptyBlock);
