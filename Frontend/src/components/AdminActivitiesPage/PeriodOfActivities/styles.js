// @flow

const styles = ({ spacing }: Object) => ({
    PeriodOfCreationWrapper: {
        'display': 'flex',
        'justifyContent': 'flex-start',
        'alignItems': 'baseline',
        'flexWrap': 'wrap',
        'marginBottom': spacing(),
        '&>div': {
            margin: spacing(),
        },
    },
    SearchingPanelWrapper: {
        'display': 'flex',
        'justifyContent': 'center',
        'alignItems': 'baseline',
        'marginTop': spacing(2),
        'marginBottom': spacing(2),
        '& div': {
            margin: 0,
        },
    },
});

export default styles;
