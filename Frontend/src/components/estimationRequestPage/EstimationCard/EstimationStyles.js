// @flow

const EstimationStyles = ({ spacing }: Object) => ({
    root: {
        padding: spacing(3, 3, 1, 3),
        position: 'relative',
        borderRadius: spacing(),
        height: '100%',
    },
    list: {
        padding: 0,
    },
    listItem: {
        marginBottom: spacing(3),
        padding: 0,
    },
});

export default EstimationStyles;
