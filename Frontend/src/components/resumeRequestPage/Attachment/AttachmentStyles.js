// @flow
import { grey } from '@material-ui/core/colors';
import {
    FONT_COLOR,
    ICON_COLOR,
    ACTIVE_BORDER_COLOR,
    HEADER_CELL,
} from 'crm-constants/jss/colors';

const MAX_HEIGHT_CONTAINER = 60;

const AttachmentStyles = ({
    spacing,
    typography: {
        fontSize,
        fontWeightLight,
        fontWeightRegular,
        h5: { fontSize: fontSizeh24 },
        caption: { fontSize: fontSize12 },
    },
}: Object) => ({
    paperRoot: {
        padding: 0,
        height: '100%',
        overflow: 'hidden',
    },
    cardWrap: {
        position: 'relative',
        paddingBottom: 1,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    attachment: {
        height: '100%',
        overflowY: 'auto',
        overflowX: 'auto',
    },
    titleCell: {
        fontSize: fontSize12,
        fontWeight: fontWeightRegular,
    },
    labelFile: {
        textAlign: 'right',
    },
    icons: {
        'padding': 0,
        'width': spacing(3),
        'height': spacing(3),
        'margin': spacing(1.5, 0.625),
        'color': ICON_COLOR,
        'opacity': 0.5,
        '&:hover': {
            opacity: 1,
            background: 'none',
        },
    },
    buttonWrapper: {
        minHeight: spacing(11),
        paddingLeft: spacing(2),
        paddingRight: spacing(4),
        paddingBottom: spacing(2),
        paddingTop: spacing(2),
        flexBasis: 'auto',
        flexGrow: 1,
        flexShrink: 0,
    },
    container: {
        height: '100%',
        maxHeight: spacing(MAX_HEIGHT_CONTAINER),
    },
    divider: {
        height: 1,
        color: ACTIVE_BORDER_COLOR,
        opacity: 0.5,
        marginBottom: spacing(2),
    },
    fileLink: {
        display: 'block',
        overflow: 'hidden',
        maxWidth: spacing(50),
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        fontSize,
        fontWeight: fontWeightLight,
        color: FONT_COLOR,
        paddingLeft: 0,
        textTransform: 'uppercase',
    },
    date: {
        fontSize,
    },
    actionsCell: {
        width: spacing(12.5),
    },
    title: {
        marginRight: spacing(2),
        fontSize,
        color: HEADER_CELL,
    },
    dropZoneContainer: {
        height: '100%',
        outline: 'none',
        textAlign: 'center',
        paddingTop: spacing(),
    },
    dropZone: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: grey[400],
        borderStyle: 'dashed',
        backgroundColor: grey[50],
        color: grey[400],
        fontSize: fontSizeh24,
    },
});

export default AttachmentStyles;
