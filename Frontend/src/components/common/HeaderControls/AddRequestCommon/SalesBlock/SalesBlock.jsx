// @flow

import React, { useState, useEffect } from 'react';
import {
    Grid,
    FormHelperText,
    Typography,
    FormControlLabel,
    RadioGroup,
    Link,
} from '@material-ui/core';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { pages } from 'crm-constants/navigation/index';
import CRMRadio from 'crm-ui/CRMRadio/CRMRadio';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './SalesBlockStyles';

type Props = {
    classes: Object,
    salesList: Array<string>,
    salesMessage: string,
    salesValue: string,
    errors: string,
    isCompany: boolean,
    handleChangeSale: (SyntheticInputEvent<HTMLInputElement>) => void,
}

const SalesBlock = ({
    classes,
    salesList,
    salesMessage,
    salesValue,
    errors,
    isCompany,
    handleChangeSale,
}: Props) => {
    const translations = {
        sale: useTranslation('header.modals.addRequest.sale'),
        noSalesAvailable: useTranslation('header.modals.addRequest.noSalesAvailable'),
    };

    const [showSales, setShowSales] = useState(false);

    useEffect(() => {
        isCompany
            ? !showSales && setShowSales(true)
            : showSales && setShowSales(false);
    }, [isCompany]);

    const renderSalesItems = () => {
        if (salesList.length && !salesMessage) {
            return <RadioGroup
                name='sales'
                value={salesValue}
                onChange={handleChangeSale}
            >
                <Grid
                    container
                    item
                    direction='row'
                    className={classes.salesGroup}
                >
                    {salesList.map(sale =>
                        <FormControlLabel
                            className={classes.checkboxLabel}
                            key={sale}
                            label={
                                <Link
                                    className={classes.label}
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    href={`${pages.SALES_FUNNEL}/${sale}`}
                                >
                                    {sale}
                                </Link>}
                            value={`${sale}`}
                            control={<CRMRadio checked={salesValue === sale} />}
                        />
                    )}
                </Grid>
            </RadioGroup>;
        }

        return (
            <Typography className={classes.message}>
                {translations.noSalesAvailable}
            </Typography>
        );
    };

    return (
        <Grid
            item
            className={classes.sales}
        >
            <Typography
                className={classes.saleLabel}
                onClick={() => setShowSales(!showSales)}
            >
                {translations.sale}
                <ArrowDropDown className={cn(classes.dropDownIcon, { [classes.closeIcon]: showSales })}/>
            </Typography>
            {showSales && renderSalesItems()}
            {errors && (<FormHelperText className={classes.radioError}>
                {errors}
            </FormHelperText>)
            }
        </Grid>
    );
};

export default withStyles(styles)(SalesBlock);
