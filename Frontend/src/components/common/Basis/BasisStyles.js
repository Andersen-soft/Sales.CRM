// @flow

import { WHITE } from 'crm-constants/jss/colors';

const BasisStyles = ({
    spacing,
    zIndex,
    mixins: { mobile },
}: Object) => ({
    root: {
        boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
    },
    container: {
        width: '100%',
        minWidth: spacing(40),
        height: '100%',
    },
    content: {
        height: `calc(100vh - ${spacing(10)}px)`,
    },
    mobileContent: {
        height: '100%',
        overflow: 'hidden',
        backgroundColor: WHITE,
        padding: spacing(7, 0, 5, 0),
    },
    wrapper: {
        minHeight: spacing(7),
        height: spacing(7),
        ...mobile({
            paddingRight: 0,
        }),
    },
    icon: {
        width: spacing(4),
        height: spacing(4),
    },
    mobileAppBar: {
        position: 'fixed',
        top: 0,
        zIndex: zIndex.modal + 1,
        boxShadow: 'unset',
    },
});

export default BasisStyles;
