// @flow

import commonStyles from 'crm-styles/common';
import { GREY } from 'crm-constants/jss/colors';

const CRMCheckboxStyles = ({ spacing }: Object) => ({
    root: {
        color: GREY,
        '&:hover': {
            backgroundColor: 'unset',
        },
        '&.Mui-checked': {
            color: GREY,
        },
        '&.Mui-checked:hover': {
            backgroundColor: 'unset',
        },
    },
    iconWrapper: {
        position: 'relative',
    },
    base: {
        display: 'block',
    },
    arrow: {
        width: spacing(2),
        height: spacing(2),
    },
    ...commonStyles,
});

export default CRMCheckboxStyles;
