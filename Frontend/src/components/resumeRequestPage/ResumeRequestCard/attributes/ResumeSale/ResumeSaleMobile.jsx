// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { pages } from 'crm-constants/navigation';

import styles from '../AttributesMobileStyles';

type Props = {
    classes: Object,
    saleId: number,
    translateSale: string,
}

const ResumeSaleMobile = ({
    classes,
    saleId,
    translateSale,
}: Props) => (
    <Grid
        container
        justify='space-between'
        alignItems='center'
        className={classes.filedContainer}
    >
        <Typography className={classes.inputLabel}>
            {`${translateSale}:`}
        </Typography>
        {saleId
            ? <Link
                to={`${pages.SALES_FUNNEL}/${saleId}`}
                className={classes.fieldLink}
                color='primary'
            >
                {saleId}
            </Link>
            : <CRMEmptyBlock className={classes.inputEditable} />
        }
    </Grid>
);

export default withStyles(styles)(ResumeSaleMobile);
