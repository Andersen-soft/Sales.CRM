// @flow

import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './EmptyBlockStyles';

type Props = {
    classes: Object,
    variant: string,
};

const EmptyBlock = ({ classes, variant = 'body2' }: Props) => {
    const translations = {
        emptyBlock: useTranslation('components.emptyBlock'),
    };

    return (
        <Typography
            variant={variant}
            classes={{ root: classes.emptyBlock }}
        >
            {translations.emptyBlock}
        </Typography>
    );
};

export default withStyles(styles)(EmptyBlock);
