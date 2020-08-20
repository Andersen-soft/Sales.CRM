// @flow

import React from 'react';
import { useTranslation } from 'crm-hooks/useTranslation';
import { Grid, MenuItem, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CRMIcon from 'crm-icons/CRMIcon';
import { PhoneAndroid, DesktopWindows } from '@material-ui/icons';
import { useSetIsMobile, useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

import styles from '../HeaderControlsStyles';

type Props = {
    classes: Object,
};

const DeviceViewToggle = ({
    classes,
}: Props) => {
    const translations = {
        mobileVersion: useTranslation('header.menu.mobileVersion'),
        desktopVersion: useTranslation('header.menu.desktopVersion'),
    };

    const isMobile = useMobile();
    const setIsMobile = useSetIsMobile();

    return (
        <Grid key='deviceViewToggle'>
            <MenuItem
                onClick={() => setIsMobile(state => !state)}
                classes={{ root: classes.popupMenuItem }}
            >
                <CRMIcon IconComponent={isMobile ? DesktopWindows : PhoneAndroid} />
                <Typography className={classes.popupMenuText}>
                    {isMobile ? translations.desktopVersion : translations.mobileVersion}
                </Typography>
            </MenuItem>
        </Grid>
    );
};

export default withStyles(styles)(DeviceViewToggle);
