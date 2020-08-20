// @flow

import { grey, blue } from '@material-ui/core/colors/';

const styles = ({ spacing }: Object) => (
    {
        root: {
            width: '100%',
            marginTop: spacing(3),
            overflowX: 'auto',
            boxShadow: 'none',
            background: grey[100],
        },
        table: {
            minWidth: spacing(87),
        },
        tableHeader: {
            border: `1px solid ${grey[300]}`,
        },
        tableDate: {
            width: '12%',
        },
        tableTitle: {
            marginTop: spacing(),
            marginBottom: spacing(),
            display: 'flex',
            alignItems: 'center',
            verticalAlign: 'middle',
        },
        tableCell: {
            paddingRight: 0,
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
            margin: 0,
        },
        activities: {
            color: grey[600],
            padding: 0,
            margin: 0,
        },
        link: {
            color: 'inherit',
        },
        comment: {
            position: 'relative',
            paddingRight: `${spacing(8)}px !important`,
            height: spacing(2),
            width: spacing(72),
            wordBreak: 'break-word',
            whiteSpace: 'pre-line',
        },
        smallDescription: {
            height: spacing(2.5),
            overflowY: 'hidden',
        },
        commentOpen: {
            height: 'auto',
            wordBreak: 'break-word',
            whiteSpace: 'pre-line',
        },
        showMoreButtons: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: spacing(2),
            minWidth: spacing(4),
            minHeight: spacing(),
            height: spacing(2),
            padding: 0,
            fontSize: spacing(2),
            fontWeight: 'bold',
            marginLeft: spacing(0.5),
            borderBottom: `1px solid ${blue[700]}`,
            borderRadius: 0,
            background: grey[100],
        },
        salesLink: {
            cursor: 'pointer',
            color: blue[800],
        },
    });

export default styles;
