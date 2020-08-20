// @flow

import {
    FONT_COLOR,
    UNDERLINE,
    LINK_COLOR,
    HEADER_CELL,
    ICON_COLOR,
} from 'crm-constants/jss/colors';

const cellsStyles = ({
    spacing,
    typography: {
        fontSize,
        htmlFontSize,
        fontWeightRegular,
        subtitle1: {
            lineHeight,
        },
        caption: {
            fontSize: fontSizeLight,
        },
    },
}: Object) => ({
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
    fio: {
        fontWeight: fontWeightRegular,
        marginRight: spacing(),
        fontSize,
        lineHeight: `${spacing(3)}px`,
    },
    userInformation: {
        borderBottom: `1px dashed ${UNDERLINE}`,
        color: FONT_COLOR,
        display: 'inline-block',
        fontSize,
        width: 'max-content',
        marginRight: spacing(),
    },
    ellipsis: {
        display: 'inline-block',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
    fileWrapper: {
        'maxWidth': spacing(50),
        'height': spacing(3),
        'display': 'flex',
        'marginLeft': spacing(-6),
        'marginBottom': spacing(),
        '& a': {
            fontSize,
            margin: 'auto 0',
            lineHeight,
            color: LINK_COLOR,
        },
        '& button': {
            'padding': 0,
            'opacity': 0,
            '&:hover': {
                background: 'none',
                opacity: 1,
            },
        },
        '&:hover button': {
            background: 'none',
            opacity: 0.5,
        },
    },
    inputFile: {
        display: 'none',
    },
    labelFile: {
        'fontSize': fontSizeLight,
        'lineHeight': spacing(0.25),
        'fontWeight': fontWeightRegular,
        'color': HEADER_CELL,
        'cursor': 'pointer',
        'display': 'flex',

        '& svg': {
            fontSize: htmlFontSize,
            color: ICON_COLOR,
            margin: 'auto 0',
            opacity: 0.5,
        },
    },
    fileDate: {
        fontSize,
        lineHeight,
        fontWeight: fontWeightRegular,
        height: spacing(3),
        marginBottom: spacing(),
    },
    icons: {
        'display': 'flex',
        'justifyContent': 'flex-end',
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
});

export default cellsStyles;
