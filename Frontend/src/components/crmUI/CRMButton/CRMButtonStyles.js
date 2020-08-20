// @flow

import {
    PRIMARY_COLOR,
    ACTIVE_COLOR,
    DISABLED_COLOR,
    LIGHTGRAY,
    FONT_COLOR,
    DISABLED_FONT_COLOR,
    HOVER_PRIMARY_COLOR,
    ICON_COLOR,
    GREY_LIGHT,
    WHITE,
    GREY,
} from 'crm-constants/jss/colors';
import { FONT_SIZE_NORMAL } from 'crm-constants/jss/fonts';

const borderSize = '1px';

const CRMButtonStyles = ({ typography: { fontSize, htmlFontSize }, spacing }: Object) => ({
    touchRipple: {},
    button: {
        'border': `${borderSize} solid ${LIGHTGRAY}`,
        'borderRadius': spacing(6.5),
        'width': spacing(17.5),
        'height': spacing(4),
        'fontSize': FONT_SIZE_NORMAL,
        'fontWeight': 'normal',
        'color': FONT_COLOR,
        'textTransform': 'none',
        'lineHeight': `${spacing(2)}px`,
        '&:hover': {
            borderColor: PRIMARY_COLOR,
            backgroundColor: PRIMARY_COLOR,
        },
        '&:active': {
            'backgroundColor': ACTIVE_COLOR,
            'borderColor': ACTIVE_COLOR,
            '& $touchRipple': {
                height: `calc(100% + 2 * ${borderSize})`,
                width: `calc(100% + 2 * ${borderSize})`,
                left: `-${borderSize}`,
                top: `-${borderSize}`,
            },
        },
    },
    action: {
        'backgroundColor': PRIMARY_COLOR,
        'borderColor': PRIMARY_COLOR,
        '&:hover': {
            backgroundColor: HOVER_PRIMARY_COLOR,
            borderColor: HOVER_PRIMARY_COLOR,
        },
    },
    primary: {
        backgroundColor: PRIMARY_COLOR,
        borderColor: 'transparent',
        fontSize: FONT_SIZE_NORMAL,
    },
    grey: {
        'border': 'none',
        'color': ICON_COLOR,
        'backgroundColor': GREY_LIGHT,
        '& svg': {
            marginLeft: spacing(),
        },
        '&:hover': {
            color: WHITE,
            backgroundColor: GREY,
        },
    },
    largeButton: {
        width: spacing(22.5),
        height: spacing(4.5),
        lineHeight: `${spacing(2.5)}px`,
        fontSize: htmlFontSize,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        color: DISABLED_FONT_COLOR,
        borderColor: DISABLED_COLOR,
        backgroundColor: DISABLED_COLOR,
    },
    mobile: {
        width: spacing(17),
        height: spacing(4),
        lineHeight: `${spacing(2)}px`,
        fontSize,
    },
});

export default CRMButtonStyles;
