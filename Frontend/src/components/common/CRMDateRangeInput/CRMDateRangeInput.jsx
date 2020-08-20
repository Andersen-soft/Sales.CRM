// @flow

import CRMDateInput from 'crm-components/common/CRMDateInput/CRMDateInput';
import React, { useState, useEffect } from 'react';

import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import { useTranslation } from 'crm-hooks/useTranslation';

import CRMDataRange, {
    type Props as CRMDataRangeProps,
} from 'crm-ui/CRMCalendars/CRMDataRange';
import { StyledComponentProps } from '@material-ui/core/es';

const DATE_SEPARATOR = '-';
const DEFAULT_RANGE_ID = 0;
const FIRST_CLICK = 1;
const SECOND_CLICK = 2;

const getInitialFocusRange = (
    startDate: ?Date,
    endDate: ?Date,
    rangeId = DEFAULT_RANGE_ID,
) => {
    if (!endDate) {
        return [rangeId, 1];
    }

    return [rangeId, 0];
};

type Props = {
    clearable?: boolean,
    fullWidth?: boolean,
    controlled?: boolean,
    inputClasses?: Object,
    label?: string,
    inputDateFormat?: string,
    hideYear?: boolean,
} & $Shape<CRMDataRangeProps> & StyledComponentProps;

const CRMDateRangeInput = ({
    startDate: initStartDate,
    endDate: initEndDate,
    minDate,
    maxDate,
    clearable = true,
    fullWidth = true,
    controlled = false,
    onSelectRange,
    inputClasses = {},
    label,
    inputDateFormat,
    hideYear = false,
}: Props) => {
    const [startDate, setStartDate]: [?Date, Function] = useState(initStartDate);
    const [endDate, setEndDate]: [?Date, Function] = useState(initEndDate);
    const [focusedRange, setFocusedRange] = useState(
        getInitialFocusRange(initStartDate, initEndDate),
    );
    const [clickCount, setClickCount] = useState(0);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (clickCount === SECOND_CLICK) {
            onSelectRange(startDate, endDate);
            setClickCount(0);
            setOpen(false);
        }
    }, [clickCount]);

    useEffect(() => {
        if (controlled
            && (startDate !== initStartDate || endDate !== initEndDate)) {
            setStartDate(initStartDate);
            setEndDate(initEndDate);
            setFocusedRange(getInitialFocusRange(initStartDate, initEndDate));
        }
        setClickCount(initStartDate ? 0 : 1);
    }, [initStartDate, initEndDate]);

    const NO_DATE_PLACEHOLDER = useTranslation('components.dateRange');

    const getFormattedDateRange = () => {
        const dateFormat = inputDateFormat || FULL_DATE_CS;

        const formattedStartDate = startDate
            ? getDate(startDate, dateFormat)
            : NO_DATE_PLACEHOLDER;
        const formattedEndDate = endDate
            ? getDate(endDate, dateFormat)
            : NO_DATE_PLACEHOLDER;

        if (!startDate && !endDate) {
            return NO_DATE_PLACEHOLDER;
        }

        if (!startDate || !endDate) {
            return startDate ? formattedStartDate : formattedEndDate;
        }

        if ((formattedStartDate === formattedEndDate) && clickCount === FIRST_CLICK) {
            return `${formattedStartDate} ${DATE_SEPARATOR}`;
        }

        return `${formattedStartDate} ${DATE_SEPARATOR} ${formattedEndDate}`;
    };

    const handleSelectRange = (newStartDate: Date, newEndDate: Date) => {
        setStartDate(newStartDate || startDate);
        setEndDate(newEndDate || endDate);
        setClickCount(count => count + 1);
    };

    const handleRangeFocusChange = (value: Array<number>) => setFocusedRange(value);

    const handleClear = () => {
        setStartDate(null);
        setEndDate(null);
        setFocusedRange([DEFAULT_RANGE_ID, 1]);
        onSelectRange(null, null);
        setClickCount(1);
    };

    return (
        <CRMDateInput
            onClear={handleClear}
            inputValue={getFormattedDateRange()}
            clearable={clearable}
            inputHint={getFormattedDateRange() === NO_DATE_PLACEHOLDER}
            fullWidth={fullWidth}
            InputProps={{ classes: inputClasses }}
            label={label}
            isOpen={open}
            setIsOpen={setOpen}
        >
            <CRMDataRange
                startDate={startDate}
                endDate={endDate}
                focusedRange={focusedRange}
                minDate={minDate}
                maxDate={maxDate}
                onRangeFocusChange={handleRangeFocusChange}
                onSelectRange={handleSelectRange}
                hideYear={hideYear}
            />
        </CRMDateInput>
    );
};

export default CRMDateRangeInput;
