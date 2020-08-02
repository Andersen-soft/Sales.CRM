// @flow
import {
    WHITE,
    FONT_COLOR,
    SHADOW,
    HEADER_CELL,
} from 'crm-constants/jss/colors';
import { FONT_SIZE_H3 } from 'crm-constants/jss/fonts';

const LoginStyles = ({ spacing, mixins: { mobile }, typography: { caption: { fontSize }, fontWeightRegular } }: Object) => ({
    paper: {
        paddingTop: spacing(7.5),
        paddingRight: spacing(9),
        paddingBottom: spacing(7),
        paddingLeft: spacing(9),
        textAlign: 'center',
        backgroundColor: WHITE,
        color: FONT_COLOR,
        borderRadius: spacing(),
        width: spacing(61.5),
        boxShadow: `0 ${spacing(1.5)}px ${spacing(2)}px ${SHADOW}`,
        ...mobile({
            width: '100%',
            padding: spacing(),
            boxShadow: 'none',
        }),
    },
    title: {
        fontSize: spacing(3.5),
        marginBottom: spacing(4),
        fontWeight: fontWeightRegular,
        ...mobile({
            fontSize: FONT_SIZE_H3,
            marginBottom: spacing(3.5),
        }),
    },
    inputLabel: {
        textAlign: 'left',
        marginBottom: spacing(0.5),
        opacity: 0.6,
        fontSize,
        ...mobile({
            color: HEADER_CELL,
        }),
    },
    inputWrapper: {
        height: spacing(8),
    },
    buttonWrapper: {
        marginTop: spacing(3),
        ...mobile({
            maxWidth: spacing(17.5),
        }),
    },
});

export default LoginStyles;
