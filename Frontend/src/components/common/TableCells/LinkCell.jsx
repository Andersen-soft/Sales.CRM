// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: {
        id: number,
        name: string,
        baseURL: string,
    },
} & StyledComponentProps;

const LinkCell = ({
    values: { id, name, baseURL },
    classes,
}: Props) => (
    name
        ? <Link
            to={`${baseURL}/${id}`}
            className={classes.link}
        >
            {name}
        </Link>
        : <CRMEmptyBlock />
);

export default withStyles(styles)(LinkCell);
