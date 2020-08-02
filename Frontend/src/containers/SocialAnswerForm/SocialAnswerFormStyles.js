// @flow

import { GREY } from 'crm-constants/jss/colors';

const SocialAnswerFormStyles = ({
    spacing,
    typography: { fontWeightMedium },
}: Object) => ({
    wrapperScroll: {
        overflowY: 'auto',
        height: 'calc(100vh - 64px)',
    },
    wrapperForm: {
        width: '100%',
        padding: spacing(2, 1.25, 1.25, 1.25),
    },
    wrapperPaper: {
        padding: spacing(3),
    },
    wrapperInput: {
        width: spacing(38.75),
        marginRight: spacing(5),
    },
    typographyTitle: {
        fontSize: spacing(2.5),
        marginBottom: spacing(3),
    },
    typographyComment: {
        marginTop: spacing(),
        fontSize: spacing(1.25),
        lineHeight: `${spacing(2)}px`,
        textAlign: 'right',
        color: GREY,
        opacity: 0.8,
    },
    topComment: {
        marginTop: spacing(-2),
    },
    textareaLabel: {
        transform: 'translate(10px, 12px) scale(1)',
        fontSize: spacing(1.75),
    },
    textareaInput: {
        padding: spacing(0.5, 0),
        fontSize: spacing(1.75),
    },
    fieldSpacing: {
        marginTop: spacing(3),
    },
    button: {
        marginTop: spacing(6),
        marginBottom: spacing(3),
    },
    dialogTextBold: {
        fontWeight: fontWeightMedium,
    },
    dialogBody: {
        marginTop: spacing(3),
    },
    lastField: {
        marginBottom: spacing(4),
    },
});

export default SocialAnswerFormStyles;
