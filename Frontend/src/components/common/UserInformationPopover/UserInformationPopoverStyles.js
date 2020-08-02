// @flow

import { grey } from '@material-ui/core/colors/index';
import {
    HEADER_CELL,
    FONT_COLOR,
    ICON_COLOR,
} from 'crm-constants/jss/colors';

export default ({ typography: { button: { fontSize, lineHeight } }, spacing, zIndex: { tooltip } }: Object) => ({
    root: {
        zIndex: `${tooltip} !important`,
    },
    infoIcon: {
        color: grey[400],
        marginLeft: spacing(0.5),
        verticalAlign: 'middle',
        '&:hover': {
            color: grey[700],
            cursor: 'pointer',
        },
    },
    popoverContentWrapper: {
        margin: spacing(2),
        maxWidth: spacing(50),
    },
    container: {
        marginBottom: spacing(1),
    },
    editable: {
        paddingRight: spacing(4),
        marginBottom: spacing(1),
        '& div': {
            '& button': {
                position: 'absolute',
                top: 0,
                right: -spacing(4),
                '&:hover': {
                    background: 'none',
                },
            },
        },
    },
    subtitle: {
        color: HEADER_CELL,
        fontWeight: 'normal',
        display: 'flex',
        alignItems: 'center',
        fontSize,
        lineHeight,
    },
    valueItem: {
        position: 'relative',
        flex: 1,
        textAlign: 'end',
        '& p': {
            fontSize,
            lineHeight,
        },
    },
    editIcon: {
        color: ICON_COLOR,
        opacity: 0.5,
        '&:hover': {
            opacity: 1,
        },
    },
    empty: {
        color: grey[500],
    },
    paddingFix: {
        padding: 0,
    },
    inputField: {
        minHeight: spacing(2),
        borderColor: grey[400],
        borderStyle: 'solid',
        borderWidth: spacing(0.1),
        borderRadius: spacing(0.5),
        color: grey[900],
        padding: spacing(0.5),
        fontWeight: 300,
        fontSize,
        maxHeight: spacing(15),
        overflowY: 'scroll',
    },
    fullWidth: {
        width: '100%',
    },
    commentField: {
        padding: spacing(1),
        '& textarea': {
            color: `${FONT_COLOR}!important`,
            fontSize,
            lineHeight,
            fontWeight: 300,
        },
    },
});
