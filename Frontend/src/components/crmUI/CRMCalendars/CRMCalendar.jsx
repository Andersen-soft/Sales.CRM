// @flow

import React, { type ElementType } from 'react';
import cn from 'classnames';

import { Calendar, type CalendarProps } from 'react-date-range';
import en from 'react-date-range/dist/locale/en-GB';
import ru from 'react-date-range/dist/locale/ru';
import { withStyles } from '@material-ui/core/styles';
import { PRIMARY_COLOR } from 'crm-constants/jss/colors';
import getCurrentLanguage from 'crm-utils/getCurrentLanguage';
import { LOCALE_RU } from 'crm-constants/locale';
// import react-date-range styles, it shouldn't have any hash postfixes at the end of css class names!!!!
// main style file
import 'react-date-range/dist/styles.css';
// theme css file
import 'react-date-range/dist/theme/default.css';

import { type StyledComponentProps } from '@material-ui/core/es';

// override react-date-range css
import './react-date-range-theme-classes.css';
import { getMinMaxBoundariesProps } from './utils';

import styles from './CRMDataRangeStyles.js';

const SELECTION_COLOR = PRIMARY_COLOR;

export type Props = {
    date?: Date | Object,
    minDate?: Date,
    maxDate?: Date,
    onChange: (date: ?Date) => void,
    calendarRef?: ElementType => *,
} & StyledComponentProps &
    $Shape<CalendarProps>;

const CRMCalendar = ({
    classes,
    date,
    minDate,
    maxDate,
    onChange,
    calendarRef,
    className,
    ...props
}: Props) => (
    <Calendar
        locale={getCurrentLanguage() === LOCALE_RU ? ru : en}
        color={SELECTION_COLOR}
        date={date || new Date()}
        showMonthAndYearPickers={false}
        showDateDisplay={false}
        className={cn(classes.wrapper, className)}
        displayMode={date ? 'date' : 'dateRange'}
        ranges={[]}
        onChange={onChange}
        ref={calendarRef}
        {...getMinMaxBoundariesProps(minDate, maxDate)}
        {...props}
    />
);

CRMCalendar.defaultProps = {
    minDate: null,
    maxDate: null,
    date: null,
};

export default withStyles(styles)(CRMCalendar);
