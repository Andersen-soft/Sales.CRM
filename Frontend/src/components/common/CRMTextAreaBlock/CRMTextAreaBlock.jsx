// @flow

import React from 'react';
import cn from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import { type BaseTextFieldProps } from '@material-ui/core/TextField';
import { FormControl, type FormControlProps } from '@material-ui/core';
import { type StyledComponentProps } from '@material-ui/core/es';
import CRMFormLabel, { type Props as CRMFormLabelProps } from 'crm-ui/CRMFormLabel/CRMFormLabel';

import CRMTextArea from 'crm-ui/CRMTextArea/CRMTextArea';

import styles from './CRMTextAreaBlockStyles';

type CRMTextAreaBlockClassKey = 'textArea' | 'headerText' ;

type Props = {
    error?: string;
    headerText?: string;
    formLabelProps?: $Shape<CRMFormLabelProps>;
    textAreaProps?: $Shape<BaseTextFieldProps>;
} & StyledComponentProps<CRMTextAreaBlockClassKey> & $Shape<FormControlProps>;

const CRMTextAreaBlock = ({
    className, fullWidth, classes, error, headerText, formLabelProps = {}, textAreaProps = {}, ...formControlProps
}:Props) => (
    <FormControl
        fullWidth={fullWidth}
        error={!!error}
        className={cn(className, classes.formControl)}
        {...formControlProps}
    >
        {headerText && <CRMFormLabel error={error} className={classes.headerText} {...formLabelProps}>{headerText}</CRMFormLabel>}
        <CRMTextArea
            className={classes.textArea}
            fullWidth={fullWidth}
            error={false}
            {...textAreaProps}
        />
    </FormControl>);

export default withStyles(styles)(CRMTextAreaBlock);
