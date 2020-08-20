// @flow

import React, { PureComponent } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { CalendarTodayTwoTone } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { DatePicker } from 'crm-components/common/pickers';
import styles from './styles';

type Props = {
    classes: Object,
    dateRange: {
        from: string,
        to: string,
    },
    onHandleFromDateChange: (type: string) => (date: Date) => void,
};

const DATE_RANGE_TYPE = {
    from: 'from',
    to: 'to',
};

const getInputProps = icon => ({
    endAdornment: <CalendarTodayTwoTone className={icon} />,
});

class PeriodOfActivities extends PureComponent<Props> {
    render() {
        const { classes, dateRange, onHandleFromDateChange } = this.props;

        return (
            <Grid item>
                <Grid className={classes.PeriodOfCreationWrapper}>
                    <Typography variant='h6'>
                        Показать все активности с
                    </Typography>
                    <DatePicker
                        autoOk
                        value={dateRange.from}
                        inputVariant='outlined'
                        maxDate={dateRange.to}
                        InputProps={getInputProps(classes.calendarIcon)}
                        className={classes.datePicker}
                        onChange={onHandleFromDateChange(DATE_RANGE_TYPE.from)}
                    />
                    <Typography variant='h6'>
                        по
                    </Typography>
                    <DatePicker
                        autoOk
                        value={dateRange.to}
                        inputVariant='outlined'
                        minDate={dateRange.from}
                        InputProps={getInputProps(classes.calendarIcon)}
                        className={classes.datePicker}
                        onChange={onHandleFromDateChange(DATE_RANGE_TYPE.to)}
                    />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(PeriodOfActivities);
