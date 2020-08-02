// @flow

import format from 'date-fns/format';
import { startOfMonth } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { CRM_DAY_MONTH_FORMAT } from 'crm-constants/dateFormat';

// utils for MuiPickersUtilsProvider (date&time pickers)
export default class LocalizedUtils extends DateFnsUtils {
    getDateTimePickerHeaderText(date: Date) {
        return format(date, CRM_DAY_MONTH_FORMAT, {
            locale: this.locale,
            awareOfUnicodeTokens: true,
        });
    }

    format(date: Date, formatString: string): string {
        return format(date, formatString, {
            locale: this.locale,
            awareOfUnicodeTokens: true,
        });
    }

    startOfMonth = startOfMonth;
}
