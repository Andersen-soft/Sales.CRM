// @flow

import React from 'react';

import { Grid, MenuItem, Typography } from '@material-ui/core';

import CRMIcon from 'crm-icons';
import IconLogOut from 'crm-static/customIcons/log_out.svg';

import RefreshTokenSingleton from 'crm-helpers/api/RefreshTokenSingleton';
import { useTranslation } from 'crm-hooks/useTranslation';

import { withStyles } from '@material-ui/core/styles';
import styles from '../HeaderControlsStyles';

type Props = {
    classes: Object,
    logout: () => void,
    clearEstimationRequest: () => void,
    clearResumeRequest: () => void,
}

const LogOut = ({
    classes,
    logout,
    clearEstimationRequest,
    clearResumeRequest,
}: Props) => {
    const handleLogout = async () => {
        await logout();
        clearInterval(RefreshTokenSingleton.getInterval());
        RefreshTokenSingleton.setIntervalStarted();
        clearEstimationRequest();
        clearResumeRequest();
    };

    const translations = {
        logOut: useTranslation('header.menu.logOut'),
    };

    return (
        <Grid key='logout'>
            <MenuItem
                onClick={handleLogout}
                classes={{ root: classes.popupMenuItem }}
            >
                <CRMIcon IconComponent={IconLogOut} />
                <Typography className={classes.popupMenuText}>
                    {translations.logOut}
                </Typography>
            </MenuItem>
        </Grid>
    );
};

export default withStyles(styles)(LogOut);
