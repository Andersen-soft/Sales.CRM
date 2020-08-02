// @flow

const HeaderActionsStyles = ({ spacing }: Object) => ({
    container: {
        width: spacing(12.75),
    },
    tooltip: {
        padding: spacing(0.75),
    },
    icon: {
        width: '20px',
        height: '20px',
    },
    button: {
        '&:hover': {
            backgroundColor: 'unset',
        },
    },
});

export default HeaderActionsStyles;
