// @flow

import React from 'react';
import MaterialUiPiker from 'crm-components/common/MaterialUiPiker/MaterialUiPicker';
import pikerType from 'crm-constants/pickersType';

type Props = {
    format?: string,
    value: Date | string | null,
    withIcon?: boolean,
    InputProps?: Object,
    inputVariant?: string,
    disableToolbar?: boolean,
};

const CRMDateTimePicker = (props: Props) => <MaterialUiPiker
    {...props}
    type={pikerType.dateTimePiker}
/>;

export const CRMDatePicker = (props: Props) => <MaterialUiPiker
    {...props}
    type={pikerType.datePiker}
/>;

export default CRMDateTimePicker;
