// @flow

import React, { useContext } from 'react';

import { Grid, MenuItem, Typography } from '@material-ui/core';
import CRMIcon from 'crm-icons';
import IconTranslate from '@material-ui/icons/Public';
import { IsLanguageContext } from 'crm-components/common/LanguageContextProvider/LanguageContextProvider';
import { useTranslation } from 'crm-hooks/useTranslation';

import { withStyles } from '@material-ui/core/styles';
import styles from '../HeaderControlsStyles';

type Props = {
    classes: Object,
}

const Translate = ({ classes }: Props) => {
    const { switchLanguage } = useContext(IsLanguageContext);

    const translations = {
        language: useTranslation('header.menu.language'),
    };

    return (
        <Grid key='translate'>
            <MenuItem
                onClick={switchLanguage}
                classes={{ root: classes.popupMenuItem }}
            >
                <CRMIcon IconComponent={IconTranslate} />
                <Typography className={classes.popupMenuText}>
                    {translations.language}
                </Typography>
            </MenuItem>
        </Grid>
    );
};

export default withStyles(styles)(Translate);
