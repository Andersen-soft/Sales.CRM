// @flow

import React, { memo } from 'react';
import { parseISO } from 'date-fns';
import { DatePicker as BaseDatePicker } from '@material-ui/pickers';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { CRM_DATE_FORMAT_CAPITAL_MONTH } from 'crm-constants/dateFormat';
import { CHOOSE_DATE } from 'crm-constants/forms';

type Props = {
    value: Date | string,
    onChange: (event: SyntheticEvent<*>) => void,
    format: string,
    variant?: string,
};

const DatePicker = ({ format, variant, value, ...rest }: Props) => (
    <BaseDatePicker
        {...rest}
        value={typeof value === 'string' ? parseISO(value) : value}
        variant={variant || 'inline'}
        format={format || CRM_DATE_FORMAT_CAPITAL_MONTH}
        leftArrowIcon={<KeyboardArrowLeft />}
        rightArrowIcon={<KeyboardArrowRight />}
        emptyLabel={CHOOSE_DATE}
    />
);

export default memo < Props > (DatePicker);
