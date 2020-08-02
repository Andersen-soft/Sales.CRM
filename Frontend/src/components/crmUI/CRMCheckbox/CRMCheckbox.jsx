// @flow

import React, { useMemo } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Checkbox, type CheckboxProps } from '@material-ui/core';
import type { StyledComponentProps } from '@material-ui/core/es';
import CRMIcon from 'crm-icons';

import IconCheckboxBase from 'crm-static/customIcons/checkbox.svg';
import IconCheckboxChecked from 'crm-static/customIcons/check_16px.svg';
import IconCheckboxIndeterminate from 'crm-static/customIcons/minus.svg';

import styles from './CRMCheckboxStyles';

export type Props = CheckboxProps & StyledComponentProps;

const CRMCheckBox = ({
    classes,
    checkedIcon,
    color,
    isIndeterminate = false,
    ...cbProps
}: Props) => {
    const CheckBoxBaseIcon = useMemo(
        () => <CRMIcon
            className={classes.base} noOpacity
            classes={{ root: classes.icon }}
            IconComponent={IconCheckboxBase}
        />,
        [classes],
    );

    const CheckedIcon = useMemo(
        () => checkedIcon || (
            <span className={classes.iconWrapper}>
                <CRMIcon
                    className={cn(classes.arrow, classes.centerVerticalHorizontal)}
                    noOpacity
                    IconComponent={isIndeterminate ? IconCheckboxIndeterminate : IconCheckboxChecked}
                />
                {CheckBoxBaseIcon}
            </span>
        ),
        [checkedIcon, classes, isIndeterminate],
    );

    return (
        <Checkbox
            icon={CheckBoxBaseIcon}
            checkedIcon={CheckedIcon}
            className={classes.root}
            {...cbProps}
        />
    );
};

export default withStyles(styles)(CRMCheckBox);
