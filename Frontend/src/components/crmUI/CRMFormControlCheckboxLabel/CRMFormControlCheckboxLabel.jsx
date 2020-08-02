// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import {
    FormControlLabel,
    type FormControlLabelProps,
    FormControlLabelClassKey,
} from '@material-ui/core';

import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import CRMCheckBox, {
    type Props as CRMCheckBoxProps,
} from 'crm-ui/CRMCheckbox/CRMCheckbox';
import styles from './CRMFormControlCheckboxLabelStyles';

export type CRMFormControlCheckboxLabelProps = {
    labelClasses?: $Shape<ClassNameMap<FormControlLabelClassKey>>,
    checkboxProps?: $Shape<CRMCheckBoxProps>,
} & FormControlLabelProps;

const CRMFormControlCheckboxLabel = ({
    classes,
    checkboxProps = {},
    labelClasses = {},
    ...props
}: CRMFormControlCheckboxLabelProps) => (
    <FormControlLabel
        classes={{
            ...labelClasses,
            root: cn(classes.root, labelClasses.root),
        }}
        control={<CRMCheckBox {...checkboxProps} />}
        {...props}
    />
);

export default withStyles(styles)(CRMFormControlCheckboxLabel);
