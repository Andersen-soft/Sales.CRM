// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Add, AddCircleOutlineOutlined } from '@material-ui/icons';
import { Grid, Typography } from '@material-ui/core';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';
import CRMIcon from 'crm-icons';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './CustomButtonsStyles';

type Props = {
    isUseInSalePage: boolean,
    openDialog: () => void,
} & StyledComponentProps;

const CustomButtons = ({ isUseInSalePage, openDialog, classes }: Props) => {
    const isMobile = useMobile();

    const translations = {
        add: useTranslation('common.add'),
        addActivity: useTranslation('desktop.addActivity.addActivity'),
        activity: useTranslation('desktop.addActivity.activity'),
    };

    switch (true) {
        case (isUseInSalePage):
            return (
                <CRMButton
                    grey
                    component='span'
                    onClick={openDialog}
                >
                    {translations.add}
                    <Add fontSize='small' />
                </CRMButton>
            );
        case (!isMobile):
            return (<CRMIcon
                IconComponent={AddCircleOutlineOutlined}
                className={classes.addNextActivityIcon}
                onClick={openDialog}
            />);
        case (!isUseInSalePage && isMobile):
            return (<Grid
                container
                alignItems='center'
                className={classes.menuItem}
                onClick={openDialog}
            >
                <Grid
                    container
                    alignItems='center'
                    className={classes.separator}
                >
                    <CRMIcon
                        IconComponent={Add}
                        className={classes.icon}
                    />
                    <Typography
                        variant='body2'
                        className={classes.typography}
                    >
                        {translations.addActivity}
                    </Typography>
                </Grid>
            </Grid>);
        default: return null;
    }
};

export default withStyles(styles)(CustomButtons);
