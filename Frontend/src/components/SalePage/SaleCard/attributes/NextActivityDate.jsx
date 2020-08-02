// @flow

import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { endOfDay } from 'date-fns';
import { getDate } from 'crm-utils/dates';
import CRMDatePicker from 'crm-components/common/CRMDatePicker/CRMDatePicker';
import { CRM_FULL_DATE_SERVER_FORMAT } from 'crm-constants/dateFormat';

import type { Sale } from 'crm-types/sales';
import type { StyledComponentProps } from '@material-ui/core/es';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from './AttributesStyles';

type Props = {
    sale: Sale,
    updateHandler: ({ nextActivityDate: string }) => void,
    disable: boolean
} & StyledComponentProps;

const NextActivityDate = ({
    sale,
    updateHandler,
    classes,
    disable,
}: Props) => {
    const translations = {
        nextActivity: useTranslation('sale.saleSection.nextActivity'),
    };

    const handleDateChange = value => {
        if (value) {
            updateHandler({
                nextActivityDate: getDate(endOfDay(value), CRM_FULL_DATE_SERVER_FORMAT),
            });
        }
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
                {`${translations.nextActivity}:`}
            </Grid>
            <Grid className={classes.withoutEdit}>
                <CRMDatePicker
                    date={sale.nextActivityDate}
                    onChange={handleDateChange}
                    theme='inline'
                    inlineClass={cn(classes.date, { [classes.inlineDisableDate]: disable })}
                    minDate={new Date()}
                    readOnly={disable}
                />
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(NextActivityDate);
