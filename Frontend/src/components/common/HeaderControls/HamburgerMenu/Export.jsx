// @flow

import React from 'react';
import { MenuItem, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import IconExport from '@material-ui/icons/GetApp';
import CRMIcon from 'crm-icons';
import { useTranslation } from 'crm-hooks/useTranslation';

import styles from '../HeaderControlsStyles';

export const EXPORT_CONTACTS = 'contact';
export const EXPORT_COMPANIES = 'company';
export const EXPORT_CV_STATISTICS = 'resume';

type Props = {
    classes: Object,
    toggleOpenModal: (string) => Function,
}

const Export = ({
    classes,
    toggleOpenModal,
}: Props) => {
    const translations = {
        downloadContacts: useTranslation('header.menu.downloadContacts'),
        downloadCompanies: useTranslation('header.menu.downloadCompanies'),
        downloadResumeReport: useTranslation('header.menu.downloadResumeReport'),
    };

    return (
        <>
            <MenuItem
                onClick={toggleOpenModal(EXPORT_CONTACTS)}
                classes={{ root: classes.popupMenuItem }}
            >
                <CRMIcon IconComponent={IconExport} />
                <Typography className={classes.popupMenuText}>
                    {translations.downloadContacts}
                </Typography>
            </MenuItem>
            <MenuItem
                onClick={toggleOpenModal(EXPORT_COMPANIES)}
                classes={{ root: classes.popupMenuItem }}
            >
                <CRMIcon IconComponent={IconExport} />
                <Typography className={classes.popupMenuText}>
                    {translations.downloadCompanies}
                </Typography>
            </MenuItem>
            <MenuItem
                onClick={toggleOpenModal(EXPORT_CV_STATISTICS)}
                classes={{ root: classes.popupMenuItem }}
            >
                <CRMIcon IconComponent={IconExport} />
                <Typography className={classes.popupMenuText}>
                    {translations.downloadResumeReport}
                </Typography>
            </MenuItem>
        </>
    );
};

export default withStyles(styles)(Export);
