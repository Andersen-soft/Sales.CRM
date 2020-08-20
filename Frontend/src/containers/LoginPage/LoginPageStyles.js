// @flow

import pageBg from 'crm-static/loginBg.png';
import loginBottomBg from 'crm-static/login-bottom-bg.png';
import loginTopBg from 'crm-static/login-top-bg.png';

const LoginPageStyles = ({ spacing, mixins: { mobile } }: Object) => ({
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
            'overflow': 'hidden',
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
            paddingTop: spacing(9),
            alignItems: 'flex-start',
        }),
    },
});

export default LoginPageStyles;
