// @flow

import React, { type ComponentType } from 'react';
import { Grid, Input, FormLabel } from '@material-ui/core';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { withStyles } from '@material-ui/core/styles';
import CRMIcon from 'crm-icons';
import EventEmitter from 'crm-helpers/eventEmitter';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './UploadFileStyles';

type Props = {
    icon: ComponentType<SvgIconProps>,
    text: string,
    onFileChange: () => void,
    availableFileTypes?: string,
} & StyledComponentProps

const UploadFile = ({
    icon,
    text,
    onFileChange,
    availableFileTypes = '',
    classes,
}: Props) => {
    const onFileChangeHandler = event => {
        onFileChange(event);
        EventEmitter.emit('closeDotMenu');
    };

    return <FormLabel htmlFor='inputFile' className={classes.pointer}>
        <Grid
            container
            alignItems='center'
            className={classes.menuItem}
        >
            <Grid
                container
                alignItems='center'
                className={classes.separator}
            >
                <CRMIcon
                    IconComponent={icon}
                    className={classes.icon}
                />
                <span className={classes.labelFile}>{text}</span>
            </Grid>
            <Grid className={classes.hidden}>
                <Input
                    type='file'
                    id='inputFile'
                    onChange={onFileChangeHandler}
                    inputProps={{
                        accept: availableFileTypes,
                        multiple: true,
                    }}
                />
            </Grid>
        </Grid>
    </FormLabel>;
};

export default withStyles(styles)(UploadFile);
