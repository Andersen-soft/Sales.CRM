// @flow

import React from 'react';
import CRMCheckbox from 'crm-ui/CRMCheckbox/CRMCheckbox';
import { withStyles } from '@material-ui/core/styles';

import styles from './CheckboxIndeterminateStyles';

type Props = {
    classes: Object,
    onHandleChecked: () => void,
    checkedRows: number,
    maxRows: number,
};

const CheckboxIndeterminate = ({
    classes,
    onHandleChecked,
    checkedRows,
    maxRows,
}: Props) => {
    if (!checkedRows) {
        return (
            <CRMCheckbox
                onChange={onHandleChecked}
                checked={false}
                classes={{ root: classes.checkbox }}
            />
        );
    }
    if (checkedRows === maxRows) {
        return (
            <CRMCheckbox
                onChange={onHandleChecked}
                checked
                classes={{ root: classes.checkbox }}
            />
        );
    }
    return (
        <CRMCheckbox
            onChange={onHandleChecked}
            checked
            isIndeterminate
            classes={{ root: classes.checkbox }}
        />
    );
};

export default withStyles(styles)(CheckboxIndeterminate);
