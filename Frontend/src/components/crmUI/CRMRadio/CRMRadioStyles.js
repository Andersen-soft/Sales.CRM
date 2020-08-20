// @flow

import commonStyles from 'crm-styles/common';

import {
    DEFAULT_RADIO_COLOR,
    HEADER_CELL,
} from 'crm-constants/jss/colors';

const CRMRadioStyles = () => ({
    radio: {
        'color': DEFAULT_RADIO_COLOR,
        '&.Mui-checked': {
            color: HEADER_CELL,
        },
    },
    ...commonStyles,
});

export default CRMRadioStyles;
