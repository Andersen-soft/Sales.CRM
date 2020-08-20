import { BLACK, PRIMARY_COLOR, STATUS_BORDER_COLOR } from 'crm-constants/jss/colors';

export const CRMTabsStyles = ({
    spacing,
    typography: {
        caption: { fontSize },
        fontWeightRegular,
    },
}) => ({
    label: {
        '&:focus, &:hover, &:visited, &:link, &:active': {
            textDecoration: 'none',
        },
        'textTransform': 'none',
    },
    badge: {
        fontSize,
        color: BLACK,
        height: spacing(2.125),
        width: spacing(2.125),
        minWidth: spacing(2.125),
        backgroundColor: PRIMARY_COLOR,
        right: spacing(-1.25),
        top: spacing(0.5),
    },
    tabRoot: {
        'padding': spacing(0, 1.5),
        'height': spacing(7),
        '& > span': {
            fontSize: spacing(2.25),
            fontWeight: fontWeightRegular,
        },
        'opacity': 1,
    },
});

export const TabsContainersStyles = {
    root: {
        borderBottom: `1px solid ${STATUS_BORDER_COLOR}`,
    },
    indicator: {
        'backgroundColor': 'transparent',
        'display': 'flex',
        'justifyContent': 'center',
        '& > div': {
            maxWidth: '75%',
            width: '100%',
            backgroundColor: PRIMARY_COLOR,
        },
    },
};
