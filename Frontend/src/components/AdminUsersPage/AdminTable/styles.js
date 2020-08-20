// @flow

import { grey } from '@material-ui/core/colors/';

const styles = ({ spacing }: Object) => (
    {
        root: {
            width: '100%',
            marginTop: spacing(3),
            boxShadow: 'none',
            background: grey[100],
        },
        table: {
            minWidth: 700,
        },
        tableHeader: {
            border: `1px solid ${grey[300]}`,
        },
        tableTitle: {
            marginTop: spacing(),
            marginBottom: spacing(),
            display: 'flex',
            alignItems: 'center',
            verticalAlign: 'middle',
        },
        pagination: {
            width: 'fit-content',
            margin: '0 auto',
            paddingRight: spacing(3),
        },
        spacer: {
            display: 'nosne',
        },
        loading: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: 3,
        },
        noData: {
            padding: spacing(2),
        },
        edit: {
            padding: 0,
        },
        activities: {
            color: grey[600],
            padding: 0,
        },
        link: {
            color: 'inherit',
            display: 'block',
        },
        resetHint: {
            marginTop: spacing(),
            fontSize: spacing(2),
        },
        popoverInfo: {
            paddingLeft: 0,
        },
    });

export default styles;
