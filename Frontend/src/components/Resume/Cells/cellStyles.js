// @flow

import { FONT_COLOR, LINK_COLOR, UNDERLINE } from 'crm-constants/jss/colors';

const cellStyles = ({
    spacing,
    typography: {
        fontSize,
        fontWeightRegular: fontWeight,
    },
}: Object) => ({
    link: {
        fontWeight,
        color: LINK_COLOR,
    },
    underlineName: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: spacing(2),
        fontSize,
        height: spacing(2.5),
        whiteSpace: 'pre',
    },
    editableCell: {
        fontSize,
        '& button': {
            opacity: 0,
            padding: 0,
            paddingLeft: spacing(),
        },
        '&:hover': {
            '& button': {
                'opacity': 0.5,
                '&:hover': {
                    cursor: 'pointer',
                    background: 'none',
                    opacity: 1,
                },
            },
        },
    },
    statusValue: {
        whiteSpace: 'nowrap',
    },
    fireIcon: {
        opacity: 1,
        cursor: 'pointer',
        marginRight: spacing(),
    },
});

export default cellStyles;


