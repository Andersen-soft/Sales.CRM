// @flow

import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withRouter, Link } from 'react-router-dom';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import { pages } from 'crm-constants/navigation';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './AttributesStyles';

type Props = {
    classes: Object,
    saleId: number,
}

const Sale = ({
    classes,
    saleId,
}: Props) => {
    const translations = {
        sale: useTranslation('requestForEstimation.requestSection.sale'),
    };

    return (
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
                {`${translations.sale}:`}
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
                    : <CRMEmptyBlock />
                }
            </Grid>
        </Grid>
    );
};

export default withRouter(withStyles(styles)(Sale));
