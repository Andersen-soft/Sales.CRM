// @flow

import pageBg from 'crm-static/loginBg.png';
import loginBottomBg from 'crm-static/login-bottom-bg.png';
import loginTopBg from 'crm-static/login-top-bg.png';
import { FONT_COLOR, SHADOW, WHITE } from 'crm-constants/jss/colors';
import { FONT_SIZE_H3, FONT_SIZE_H1, FONT_SIZE_H2 } from 'crm-constants/jss/fonts';

const ExpressSaleFormStyles = ({
    spacing,
    mixins: { mobile },
    typography: {
        caption: { fontSize },
        fontWeightRegular,
        fontSize: FONT_SIZE_NORMAL,
    },
}: Object) => ({
    wrapper: {
        height: '100%',
        position: 'relative',
        backgroundImage: `url(${pageBg})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundColor: 'white',
        flexWrap: 'nowrap',
        ...mobile({
            'backgroundImage': 'none',
            '&:after, &:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                backgroundSize: 'cover',
                width: '100%',
            },
            '&:after': {
                backgroundImage: `url(${loginTopBg})`,
                top: spacing(-8.125),
                left: spacing(-8.125),
                minWidth: spacing(41.75),
                height: spacing(18.5),
                transform: 'rotate(-30deg)',
            },
            '&:before': {
                backgroundImage: `url(${loginBottomBg})`,
                bottom: 0,
                left: spacing(-6.25),
                minWidth: spacing(50),
                height: spacing(32),
                transform: 'rotate(-15deg)',
            },
        }),
    },
    logo: {
        width: spacing(17.5),
        height: 43,
        ...mobile({
            width: spacing(9),
            height: 21.5,
        }),
    },
    logoBlock: {
        flexGrow: 1,
        paddingTop: spacing(),
        paddingBottom: spacing(),
    },
    formBlock: {
        flexGrow: 9,
        ...mobile({
            paddingTop: spacing(2),
            alignItems: 'flex-start',
        }),
    },
    paper: {
        padding: spacing(5),
        backgroundColor: WHITE,
        color: FONT_COLOR,
        borderRadius: spacing(),
        width: spacing(57),
        boxShadow: `0 ${spacing(1.5)}px ${spacing(2)}px ${SHADOW}`,
        ...mobile({
            width: '100%',
            padding: spacing(),
            boxShadow: 'none',
        }),
    },
    title: {
        textAlign: 'center',
        fontSize: FONT_SIZE_H1,
        marginBottom: spacing(4),
        fontWeight: fontWeightRegular,
        ...mobile({
            fontSize: FONT_SIZE_H3,
            marginBottom: spacing(3.5),
        }),
    },
    commentField: {
        '& label': {
            transform: 'translate(8px, 8px) scale(1)',
            fontSize: FONT_SIZE_NORMAL,
        },
        '& div': {
            padding: spacing(),
            fontSize: FONT_SIZE_NORMAL,
            height: spacing(13),
        },
    },
    row: {
        marginBottom: spacing(3),
        ...mobile({
            width: spacing(34),
        }),
    },
    button: {
        margin: '0 auto',
    },
    dialogContainer: {
        borderRadius: spacing(),
        padding: spacing(5, 7),
        textAlign: 'center',
    },
    message: {
        fontSize: FONT_SIZE_H2,
        marginBottom: spacing(4),
    },
    link: {
        fontSize: FONT_SIZE_H2,
    },
});

export default ExpressSaleFormStyles;
