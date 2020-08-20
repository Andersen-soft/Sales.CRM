// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { pages } from 'crm-constants/navigation';

import styles from '../AttributesDesktopStyles';

type Props = {
    classes: Object,
    saleId: number,
    translateSale: string,
}

const ResumeSaleDesktop = ({
    classes,
    saleId,
    translateSale,
}: Props) => (
    <Grid
        item
        container
        direction='row'
        justify='space-between'
        alignItems='center'
        xs={12}
        wrap='nowrap'
    >
        <Grid className={classes.label}>
            {`${translateSale}:`}
        </Grid>
        <Grid className={classes.withoutEdit}>
            {saleId
                ? <Link
                    to={`${pages.SALES_FUNNEL}/${saleId}`}
                    className={classes.saleId}
                    color='primary'
                >
                    {saleId}
                </Link>
                : <CRMEmptyBlock className={classes.label} />
            }
        </Grid>
    </Grid>
);

export default withStyles(styles)(ResumeSaleDesktop);
