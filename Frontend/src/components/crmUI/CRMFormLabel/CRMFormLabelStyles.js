// @flow

import commonStyles from 'crm-styles/common';
import { BLACK, ERROR_COLOR } from 'crm-constants/jss/colors';
import { FONT_SIZE_H4, FONT_FAMILY_PRIMARY, FONT_SIZE_SMALL } from 'crm-constants/jss/fonts';

const CRMFormLabelStyles = ({
    typography: { fontSize, fontWeightLight },
    spacing,
    mixins: { mobile },
}: Object) => ({
    root: {
        color: BLACK,
        fontSize: FONT_SIZE_H4,
        fontFamily: FONT_FAMILY_PRIMARY,
        minHeight: spacing(3),
        lineHeight: `${spacing(3) - 2}px`,
    },
    errorIcon: {
        color: ERROR_COLOR,
        verticalAlign: 'middle',
        position: 'relative',
        marginLeft: spacing(),
        bottom: 2,
    },
    focused: {
        color: `${BLACK} !important`,
    },
    errorPopover: {
        padding: spacing(1, 2),
        ...mobile({
            padding: spacing(),
        }),
    },
    popover: {
        pointerEvents: 'none',
        fontSize: FONT_SIZE_SMALL,
        fontWeight: fontWeightLight,
    },
    ...commonStyles,
});

export default CRMFormLabelStyles;
