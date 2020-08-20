// @flow

import { FONT_COLOR } from 'crm-constants/jss/colors';

const ExistsCompanyDialogStyles = ({
    spacing,
    typography: { fontWeightMedium },
    mixins: { mobile },
}: Object) => ({
    title: {
        fontWeight: 'normal',
        paddingTop: spacing(3),
    },
    bold: {
        fontWeight: fontWeightMedium,
    },
    paragraph: {
        fontSize: 16,
        color: FONT_COLOR,
        marginBottom: spacing(2.5),
        marginTop: spacing(),
    },
    buttonWrapper: {
        paddingBottom: spacing(4),
        paddingTop: spacing(4),
    },
    buttonContainer: {
        marginRight: spacing(2),
        ...mobile({
            marginRight: spacing(),
            marginBottom: spacing(),
        }),
    },
    dialogContainer: {
        borderRadius: spacing(),
    },
    exitButton: {
        position: 'absolute',
        right: spacing(0.5),
        top: spacing(0.5),
    },
});

export default ExistsCompanyDialogStyles;
