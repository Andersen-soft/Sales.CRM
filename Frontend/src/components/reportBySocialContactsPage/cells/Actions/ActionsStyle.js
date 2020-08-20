// @flow

const ActionsStyle = ({ spacing }: Object) => ({
    container: {
        width: spacing(12.75),
    },
    checkbox: {
        marginLeft: 'auto',
        padding: spacing(0.75),
    },
    dotMenu: {
        padding: spacing(0.75),
        '&:hover': {
            backgroundColor: 'unset',
        },
    },
});

export default ActionsStyle;
