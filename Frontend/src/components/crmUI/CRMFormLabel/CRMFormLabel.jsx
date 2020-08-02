// @flow

import React, { useRef, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { omit } from 'ramda';

import type { StyledComponentProps } from '@material-ui/core/es';
import FormLabel, {
    type FormLabelProps,
    type FormLabelClassKey,
} from '@material-ui/core/FormLabel';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import styles from './CRMFormLabelStyles';
import { Popover } from '@material-ui/core';
import CRMIcon from 'crm-icons';
import { InfoOutlined } from '@material-ui/icons';
import RootRef from '@material-ui/core/RootRef';

export type Props = {
    formLabelClasses?: $Shape<ClassNameMap<FormLabelClassKey>>,
    error?: string,
} & FormLabelProps &
    StyledComponentProps;

const CRMFormLabel = ({
    children,
    classes,
    className,
    error,
    formLabelClasses = {},
    ...formLabelProps
}: Props) => {
    const errorIconRef = useRef(null);
    const [showErrorPopover, setShowErrorPopover] = useState(false);

    const handlePopoverOpen = () => {
        setShowErrorPopover(true);
    };
    const handlePopoverClose = () => {
        setShowErrorPopover(false);
    };

    return (
        <FormLabel
            classes={{
                ...formLabelClasses,
                asterisk: cn(classes.hide, formLabelClasses.asterisk),
                root: cn(classes.root, className, formLabelClasses.root),
                focused: cn(classes.focused, formLabelClasses.focused),
            }}
            error={false}
            {...omit(['classes'], formLabelProps)}
        >
            <>
                {children}
                {error && (
                    <>
                        <RootRef rootRef={errorIconRef}>
                            <CRMIcon
                                onMouseEnter={handlePopoverOpen}
                                onMouseLeave={handlePopoverClose}
                                IconComponent={InfoOutlined}
                                className={classes.errorIcon}
                            />
                        </RootRef>
                        <Popover
                            open={showErrorPopover}
                            transition
                            disablePortal
                            className={classes.popover}
                            anchorEl={errorIconRef.current}
                            PaperProps={{
                                classes: {
                                    root: classes.errorPopover,
                                },
                            }}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            disableRestoreFocus
                        >
                            {error}
                        </Popover>
                    </>
                )}
            </>
        </FormLabel>
    );
};

export default withStyles(styles)(CRMFormLabel);
