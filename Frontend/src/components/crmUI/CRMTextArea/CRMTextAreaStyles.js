// @flow

import {
    DEFAULT_BORDER_COLOR, ACTIVE_BORDER_COLOR, GREY,
} from 'crm-constants/jss/colors';
import { FONT_SIZE_SMALL } from 'crm-constants/jss/fonts';

const CRMTextAreaStyles = ({ spacing }: Object) => ({
    inputElementRoot: {
        borderRadius: spacing(0.5),
        paddingTop: spacing(),
        paddingBottom: spacing(),
        paddingRight: spacing(),
        fontSize: FONT_SIZE_SMALL,
    },
    focused: {
        '& $inputElementFocused': {
            borderColor: `${ACTIVE_BORDER_COLOR} !important`,
            borderWidth: '1px !important',
        },
    },
    inputElementFocused: { border: `1px solid ${DEFAULT_BORDER_COLOR}` },
    input: {
        'fontSize': 'inherit',
        'padding': 0,
        'transform': 'translateZ(0)',
        '&::-webkit-input-placeholder': {
            color: `${GREY} !important`,
        },
        '&::-moz-placeholder': {
            color: `${GREY} !important`,
        },
    },
    label: {
        'color': GREY,
        // focused on InputLabelProps classes doesn't work
        '&.Mui-focused': {
            color: ACTIVE_BORDER_COLOR,
        },
        '&.Mui-error': {
            color: GREY,
        },
    },
});

export default CRMTextAreaStyles;
