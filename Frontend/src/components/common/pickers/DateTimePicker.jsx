// @flow

import React, { PureComponent } from 'react';
import { parseISO } from 'date-fns';
import { DateTimePicker as InlineDateTimePicker } from '@material-ui/pickers';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { CRM_DATETIME_FORMAT_CAPITAL_MONTH } from 'crm-constants/dateFormat';
import { CHOOSE_DATE } from 'crm-constants/forms';

type Props = {
    onChange: (event: SyntheticEvent<*>) => void,
    format: string,
    value: Date | string,
};

export default class DateTimePicker extends PureComponent<Props> {
    render() {
        const { format, value, ...rest } = this.props;

        return (
            <InlineDateTimePicker
                {...rest}
                value={typeof value === 'string' ? parseISO(value) : value}
                variant='inline'
                ampm={false}
                showTabs={false}
                format={format || CRM_DATETIME_FORMAT_CAPITAL_MONTH}
                leftArrowIcon={<KeyboardArrowLeft />}
                rightArrowIcon={<KeyboardArrowRight />}
                emptyLabel={CHOOSE_DATE}
            />
        );
    }
}
