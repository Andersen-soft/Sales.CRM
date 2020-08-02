// @flow

import React from 'react';
import { Link } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: ?string,
} & StyledComponentProps;

const OuterLinkCell = ({
    values: site,
    classes,
}: Props) => (
    site
        ? <Link
            rel='noopener noreferrer'
            target='_blank'
            href={site}
            className={classes.link}
        >
            {site}
        </Link>
        : <CRMEmptyBlock />
);

export default withStyles(styles)(OuterLinkCell);
