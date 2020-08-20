// @flow

import React from 'react';
import { parseISO } from 'date-fns';
import { omit } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { DateTimePicker, DatePicker } from '@material-ui/pickers';
import cn from 'classnames';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { CRM_DATETIME_FORMAT_CAPITAL_MONTH, FULL_DATE_CS } from 'crm-constants/dateFormat';
import { CHOOSE_DATE } from 'crm-constants/forms';
import pikerType from 'crm-constants/pickersType';
import { CRMDateTimeTheme, CRMInputStyles } from './MaterialUiPickerStyles';
import CalendarIcon from 'crm-static/customIcons/calendar.svg';

type Props = {
    format: string,
    value: Date | string,
    classes: Object,
    withIcon?: boolean,
    InputProps: Object,
    inputVariant?: string,
    disableToolbar?: boolean,
    type: string,
};

const MaterialUiPicker = ({
    value,
    format,
    classes,
    withIcon,
    InputProps = { classes: {} },
    inputVariant,
    disableToolbar = true,
    type,
    ...rest
}: Props) => {
    const { classes: inputClasses } = InputProps;
    const inputProps = {
        classes: {
            ...InputProps.classes,
            root: cn(classes.cssOutlinedInput, inputClasses.root),
            focused: cn(classes.cssFocused, inputClasses.cssFocused),
            disabled: cn(classes.disabled, inputClasses.disabled),
            error: cn(classes.error, inputClasses.error),
            input: cn(
                { [classes.inputField]: inputVariant !== 'standard' },
                { [classes.inlineInputField]: inputVariant === 'standard' },
                inputClasses.input
            ),
            ...(inputVariant === 'standard'
                ? { underline: cn(classes.underline, inputClasses.underline) }
                : { notchedOutline: cn(classes.notchedOutline, inputClasses.notchedOutline) }),
        },
        ...(withIcon
            ? { endAdornment: <CalendarIcon /> }
            : {}),
        ...omit(['classes'], InputProps),
    };

    const Picker = type === pikerType.datePiker ? DatePicker : DateTimePicker;
    const pickerFormat = type === pikerType.datePiker ? FULL_DATE_CS : CRM_DATETIME_FORMAT_CAPITAL_MONTH;

    return (
        <ThemeProvider theme={CRMDateTimeTheme}>
            <Picker
                {...rest}
                autoOk
                value={typeof value === 'string' ? parseISO(value) : value}
                variant='inline'
                inputVariant={inputVariant || 'outlined'}
                ampm={false}
                hideTabs
                disableToolbar={disableToolbar}
                format={format || pickerFormat}
                leftArrowIcon={<KeyboardArrowLeft />}
                rightArrowIcon={<KeyboardArrowRight />}
                emptyLabel={CHOOSE_DATE}
                PopoverProps={{
                    classes: { paper: classes.popoverRoot },
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    transformOrigin: { vertical: 'bottom', horizontal: 'center' },
                }}
                InputProps={{ ...inputProps }}
            />
        </ThemeProvider>
    );
};

export default withStyles(CRMInputStyles)(MaterialUiPicker);
