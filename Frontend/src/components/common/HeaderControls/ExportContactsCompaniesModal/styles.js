// @flow
const styles = ({ spacing }: Object) => ({
    container: {
        maxWidth: spacing(53),
        overflowY: 'auto',
    },

    exitButton: {
        position: 'absolute',
        right: 0,
        top: 0,
    },

    hint: {
        marginTop: spacing(5),
    },

    wrapper: {
        overflowY: 'auto',
        paddingTop: 0,
        paddingRight: spacing(3),
        paddingLeft: spacing(3),
        paddingBottom: spacing(4),
    },

    header: {
        marginTop: spacing(3),
        marginBottom: 0,
        padding: 0,

    },

    title: {
        fontSize: spacing(2),
    },

    datePickers: {
        marginTop: spacing(3),
    },

    dateItem: {
        'width': '100%',
        '& > div': {
            display: 'block',
        },
    },

    dateHint: {
        marginRight: spacing(),
    },

    actions: {
        marginTop: spacing(5),
        alignItems: 'center',
    },

    buttonCancel: {
        marginRight: spacing(2),
    },
});

export default styles;
