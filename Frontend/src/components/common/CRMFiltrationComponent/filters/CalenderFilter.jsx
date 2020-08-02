// @flow

import React from 'react';
import type { StyledComponentProps } from '@material-ui/core/es';
import CRMDateRangeInput from 'crm-components/common/CRMDateRangeInput/CRMDateRangeInput';
import pathOr from 'ramda/src/pathOr';
import { withStyles } from '@material-ui/core/styles/index';
import { Grid } from '@material-ui/core';

import styles from './filterStyles';

type Props = {
    onSetFilters: () => void,
    filters: Object,
    filterName: string,
    customProps: Object,
    onClose: () => void,
} & StyledComponentProps;

const CalenderFilter = ({
    onSetFilters,
    filters,
    filterName,
    classes,
    customProps,
    onClose,
}: Props) => {
    const startDate = pathOr(null, [filterName, 'startDate'], filters);
    const endDate = pathOr(null, [filterName, 'endDate'], filters);

    const handleChangeRange = (startDateRange, endDateRange) => {
        if (!startDateRange) {
            onSetFilters(filterName, null);
            onClose();
            return;
        }

        onSetFilters(filterName, {
            startDate: startDateRange,
            endDate: endDateRange,
        });
        onClose();
    };

    return (
        <Grid classes={{ root: classes.inputCalenderFilter }}>
            <CRMDateRangeInput
                {...customProps}
                onSelectRange={handleChangeRange}
                startDate={startDate}
                endDate={endDate}
                clearable
            />
        </Grid>
    );
};

export default withStyles(styles)(CalenderFilter);
