// @flow

import {
    FONT_COLOR,
    ACTION_LABEL,
} from 'crm-constants/jss/colors';

const cellStyles = ({
    spacing,
    typography: {
        htmlFontSize: fontSize,
        caption: {
            fontSize: smallFont,
        },
    },
} : Object) => ({
    informationIcon: {
        marginLeft: spacing(),
    },
    infoPopover: {
        width: spacing(35.5),
        padding: spacing(1.5),
        borderRadius: spacing(),
        overflow: 'auto',
    },
    infoTitle: {
        fontSize,
    },
    infoSubTitle: {
        fontSize: smallFont,
        color: ACTION_LABEL,
        marginBottom: spacing(),
        marginTop: spacing(2),
    },
    infoSubValue: {
        fontSize: smallFont,
        color: FONT_COLOR,
    },
});

export default cellStyles;
