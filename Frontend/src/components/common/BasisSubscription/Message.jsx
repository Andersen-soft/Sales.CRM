// @flow

import React from 'react';
import { Grid, Link } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { pages } from 'crm-constants/navigation';

import styles from './BasisSubscriptionStyles';

type Props = {
    sales: Array<{id: number, name: string}>,
    classes: Object,
    textBefore: string,
    textAfter: string,
}

const Message = ({
    sales,
    classes,
    textBefore,
    textAfter,
}: Props) => {
    return <Grid>
        <span>{textBefore}</span>
        {sales.map(({ id, name }, index, arr) => <Link
            key={id}
            href={`${pages.SALES_FUNNEL}/${id}`}
            className={classes.link}
        >
            {name}
            {index + 1 !== arr.length ? ', ' : '. '}
        </Link>)}
        {textAfter}
    </Grid>;
};

export default withStyles(styles)(Message);
