// @flow

import CRMDateInput, {
    type CRMDateInputTheme,
    INPUT_THEME_DEFAULT,
} from 'crm-components/common/CRMDateInput/CRMDateInput';
import React, { useState } from 'react';

import { FULL_DATE_CS } from 'crm-constants/dateFormat';
import { getDate } from 'crm-utils/dates';
import CRMCalendar, { type Props as CRMCalendarProps } from 'crm-ui/CRMCalendars/CRMCalendar';
import type { BaseTextFieldProps } from '@material-ui/core/TextField';
import { useTranslation } from 'crm-hooks/useTranslation';

type Props = {
    onChange: (date: ?Date) => void,
    clearable: boolean,
    theme?: CRMDateInputTheme,
    InputProps?: BaseTextFieldProps,
    inlineClass?: string,
    fullWidth?: boolean,
    readOnly?: boolean,
    label?: string,
    withIcon?: boolean,
    error?: string,
} & CRMCalendarProps;

const CRMDatePicker = ({
    date,
    onChange,
    clearable,
    InputProps,
    theme = INPUT_THEME_DEFAULT,
    inlineClass,
    fullWidth,
    readOnly,
    label,
    withIcon,
    error,
    ...calendarProps
}: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClear = () => {
        onChange(null);
    };
    const handleChange = value => {
        setIsOpen(false);
        onChange(value);
    };

    const NO_DATE_PLACEHOLDER = useTranslation('components.dateSelect');
    const placeholder = label ? '' : NO_DATE_PLACEHOLDER;

    return (
        <CRMDateInput
            label={label}
            withIcon={withIcon}
            error={error}
            onClear={handleClear}
            inputValue={date ? getDate(date, FULL_DATE_CS) : placeholder}
            clearable={clearable}
            inputHint={!date}
            theme={theme}
            InputProps={InputProps}
            inlineClass={inlineClass}
            fullWidth={fullWidth}
            readOnly={readOnly}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <CRMCalendar
                date={date}
                onChange={handleChange}
                {...calendarProps}
            />
        </CRMDateInput>
    );
};

CRMDatePicker.defaultProps = {
    clearable: true,
};

export default CRMDatePicker;
