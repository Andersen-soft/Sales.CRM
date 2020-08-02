// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { RESUME_REQUESTS } from 'crm-constants/navigation/pages';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellStyles';

type Props = {
    values: ?string,
} & StyledComponentProps;

const RequestName = ({
    values: [id, name],
    classes,
}: Props) => <Link
    to={`${RESUME_REQUESTS}/${id}`}
    className={classes.link}
>
    {`${id} - ${name}`}
</Link>;

export default withStyles(styles)(RequestName);
