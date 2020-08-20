// @flow
import {
    WHITE,
    FONT_COLOR,
    SHADOW,
    HEADER_CELL,
} from 'crm-constants/jss/colors';

const ChangePasswordFormStyles = ({
    spacing,
    typography: { htmlFontSize, fontSize, caption: { fontSize: smallSize }, fontWeightRegular },
}: Object) => ({
    paper: {
        padding: spacing(6.5, 6),
        textAlign: 'center',
        backgroundColor: WHITE,
        color: FONT_COLOR,
        borderRadius: spacing(),
        width: spacing(61.5),
        boxShadow: `0 ${spacing(1.5)}px ${spacing(2)}px ${SHADOW}`,
    },
    title: {
        fontSize: spacing(2.5),
        marginBottom: spacing(4),
        fontWeight: fontWeightRegular,
    },
    inputLabel: {
        color: HEADER_CELL,
        textAlign: 'left',
        marginBottom: spacing(0.5),
        fontSize: smallSize,
    },
    inputWrapper: {
        height: spacing(8),
    },
    buttonWrapper: {
        marginTop: spacing(3),
    },
    login: {
        fontSize,
        color: HEADER_CELL,
        textAlign: 'left',
        marginBottom: spacing(2),
    },
    name: {
        marginLeft: spacing(2),
        color: FONT_COLOR,
    },
    error: {
        fontSize: htmlFontSize,
    },
});

export default ChangePasswordFormStyles;
