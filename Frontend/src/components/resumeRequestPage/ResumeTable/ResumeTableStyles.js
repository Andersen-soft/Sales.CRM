// @flow

import { ICON_COLOR } from 'crm-constants/jss/colors';

const ResumeTableStyles = ({
    spacing,
    typography: {
        fontWeightRegular,
        h5: { lineHeight },
    },
}: Object) => ({
    cardWrap: {
        width: '100%',
        position: 'relative',
        borderRadius: spacing(),
        outline: 'none',
    },
    root: {
        overflow: 'visible',
    },
    headerWrapper: {
        height: spacing(7),
        padding: spacing(3, 3, 1, 3),
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: spacing(2.25),
        lineHeight,
    },
    addApplicant: {
        '& button': {
            'padding': 0,
            'marginRight': spacing(),
            'color': ICON_COLOR,
            'opacity': 0.5,
            'background': 'none',

            '&:hover': {
                background: 'none',
                opacity: 1,
            },
        },
    },
    cell: {
        position: 'relative',
        padding: spacing(2, 0, 2, 3),
        verticalAlign: 'top',
    },
    title: {
        fontWeight: fontWeightRegular,
        paddingLeft: spacing(1),
    },
    status: {
        width: '15%',
    },
    responsibleHR: {
        width: '15%',
    },
    files: {
        width: '25%',
        paddingLeft: spacing(5),
    },
    createDate: {
        width: spacing(20.5),
        paddingRight: 0,
    },
    actions: {
        width: spacing(13),
    },
    dialogContainer: {
        borderRadius: spacing(),
    },
});

export default ResumeTableStyles;
