// @flow

import React from 'react';
import { DateRange } from 'react-date-range';
import en from 'react-date-range/dist/locale/en-GB';
import ru from 'react-date-range/dist/locale/ru';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { PRIMARY_COLOR } from 'crm-constants/jss/colors';
import getCurrentLanguage from 'crm-utils/getCurrentLanguage';
import { LOCALE_RU } from 'crm-constants/locale';
// import react-date-range styles, it shouldn't have any hash postfixes at the end of css class names!!!!
// main style file
import 'react-date-range/dist/styles.css';
// theme css file
import 'react-date-range/dist/theme/default.css';

// override react-date-range css
import './react-date-range-theme-classes.css';

import styles from './CRMCalendarStyles';
import { getMinMaxBoundariesProps } from './utils';
import { StyledComponentProps } from '@material-ui/core/es';

const RANGE_COLOR = PRIMARY_COLOR;

const DEFAULT_RANGE_KEY = 'selection';

export type Props = {
    startDate?: Date,
    endDate?: Date,
    minDate?: Date,
    maxDate?: Date,
    focusedRange: Array<number>,
    onSelectRange: (startDate: Date, endDate: Date) => void;
    onRangeFocusChange: (value: Array<number>) => void,
    hideYear?: boolean,
} & StyledComponentProps;

const CRMDataRange = ({
    classes,
    startDate,
    endDate,
    minDate,
    maxDate,
    focusedRange,
    onSelectRange,
    onRangeFocusChange,
    hideYear = false,
}: Props) => {
    const handleSelect = ({ selection }) => {
        const { startDate: newStartDate, endDate: newEndDate } = selection;

        onSelectRange(newStartDate, newEndDate);
    };

    const rangesProps = !startDate && !endDate ? {
        ranges: [{
            startDate: new Date(),
            endDate: new Date(),
            key: DEFAULT_RANGE_KEY,
            color: RANGE_COLOR,
        }],
    } : {
        ranges: [{
            startDate: startDate || endDate,
            endDate: endDate || startDate,
            key: DEFAULT_RANGE_KEY,
            color: RANGE_COLOR,
        }],
    };

    return (
        <DateRange
            locale={getCurrentLanguage() === LOCALE_RU ? ru : en}
            showMonthAndYearPickers={false}
            showDateDisplay={false}
            focusedRange={focusedRange}
            {...rangesProps}
            {...getMinMaxBoundariesProps(minDate, maxDate)}
            onRangeFocusChange={onRangeFocusChange}
            onChange={handleSelect}
            classNames={{
                monthAndYearPickers: cn({ [classes.hideYear]: hideYear }),
            }}
        />
    );
};

CRMDataRange.defaultProps = {
    startDate: null,
    endDate: null,
    minDate: null,
    maxDate: null,
};

export default withStyles(styles)(CRMDataRange);
