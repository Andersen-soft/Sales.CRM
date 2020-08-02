// @flow
import { FONT_COLOR, HEADER_CELL } from 'crm-constants/jss/colors';

const CRMPaginationStyles = ({ typography: { fontSize, h6: { fontSize: currentFontSize } }, spacing }: Object) => ({
    textPrimary: {
        '&:hover': {
            backgroundColor: 'inherit',
        },
    },
    textSecondary: {
        '&:hover': {
            backgroundColor: 'unset',
        },
    },
    text: {
        fontSize,
        color: HEADER_CELL,
        padding: spacing(),
    },
    current: {
        fontSize,
        fontWeight: 'bold',
        lineHeight: `${spacing(2.5)}px`,
        color: FONT_COLOR,
        paddingLeft: spacing(1.5),
        paddingRight: spacing(1.5),
    },
});

export default CRMPaginationStyles;
