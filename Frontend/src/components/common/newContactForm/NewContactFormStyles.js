// @flow

import { GREY, ICON_COLOR } from 'crm-constants/jss/colors';

const NewContactFormStyles = ({
    spacing,
    typography: { fontSize: FONT_SIZE_NORMAL },
}: Object) => ({
    rightColumnContainer: {
        marginTop: spacing(1.5),
        paddingLeft: spacing(1.5),
        paddingRight: spacing(2.5),
    },
    leftColumnContainer: {
        marginTop: spacing(1.5),
        paddingLeft: spacing(2.5),
        paddingRight: spacing(1.5),
    },
    field: {
        marginBottom: spacing(3),
        width: spacing(33.75),
        zIndex: 0,
    },
    lastField: {
        marginBottom: spacing(),
    },
    select: {
        marginBottom: spacing(3),
    },
    label: {
        fontSize: FONT_SIZE_NORMAL,
        color: `${GREY} !important`,
        transform: 'translate(8px, 14px) scale(1)',
    },
    exitButton: {
        color: ICON_COLOR,
        opacity: 0.5,
    },
});

export default NewContactFormStyles;
