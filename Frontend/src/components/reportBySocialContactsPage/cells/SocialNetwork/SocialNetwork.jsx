// @flow

import React, { useState, useEffect, memo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    IconButton,
    Popover,
    Grid,
} from '@material-ui/core';
import CRMSocialNetworkIconLink from 'crm-ui/CRMSocialNetworkIconLink/CRMSocialNetworkIconLink';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import CRMIcon from 'crm-ui/CRMIcons';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import { useTranslation } from 'crm-hooks/useTranslation';
import { SITE_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';

import styles from './SocialNetworkStyles';

type Props = {
    classes: Object,
    values: string,
    isEdit: boolean,
    updateEditRowState: (key: string, value: string) => void,
};

const EMPTY_LINK = '/';

const areEqualProps = (prevProps, nextProps) => (prevProps.values === nextProps.values)
    && (prevProps.isEdit === nextProps.isEdit);

const SocialNetwork = memo < Props > (({
    classes,
    values: linkLead,
    isEdit,
    updateEditRowState,
}: Props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [localLink, setLocalLink] = useState(linkLead);
    const [linkError, setLinkError] = useState(null);

    useEffect(() => {
        setLocalLink(linkLead);
    }, [isEdit]);

    useEffect(() => {
        if (linkLead !== localLink) {
            setLocalLink(linkLead);
        }
    }, [linkLead]);

    const translations = {
        errorRequiredField: useTranslation('forms.errorRequiredField'),
        errorUrlValidation: useTranslation('forms.errorUrlValidation'),
        enterLink: useTranslation('socialNetworksReplies.common.enterLink'),
    };

    const getErrorMessage = () => {
        switch (true) {
            case (!localLink.trim().length):
                return translations.errorRequiredField;
            case (localLink.search(SITE_REGEXP) === -1):
                return translations.errorUrlValidation;
            default:
                return null;
        }
    };

    const validation = () => {
        const error = getErrorMessage();

        setLinkError(error);
        return !!error;
    };

    const onClosePopover = () => {
        setAnchorEl(null);
        setLinkError(null);
    };

    const onChangeLink = ({
        target: { value },
    }: SyntheticInputEvent<HTMLInputElement>) => setLocalLink(value);

    const onSave = () => {
        if (!validation()) {
            setLinkError(null);
            updateEditRowState('linkLead', localLink.trim());
            setAnchorEl(null);
            setLinkError(null);
        }
    };

    const open = Boolean(anchorEl);

    return <Grid container>
        <CRMSocialNetworkIconLink link={localLink || EMPTY_LINK} />
        {isEdit && <>
            <IconButton
                onClick={event => setAnchorEl(event.currentTarget)}
                className={classes.openListIcon}
            >
                <CRMIcon IconComponent={ArrowDropDown} />
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={onClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Grid
                    container
                    className={classes.inputFilterRoot}
                    alignItems='center'
                >
                    <CRMInput
                        value={localLink}
                        onChange={onChangeLink}
                        classes={{ inputField: classes.inputField }}
                        InputProps={{ classes: { root: classes.inputRoot } }}
                        error={linkError}
                        placeholder={translations.enterLink}
                    />
                    <Grid className={classes.inputControls}>
                        <CRMIcon
                            IconComponent={Check}
                            className={classes.icon}
                            onClick={onSave}
                        />
                        <CRMIcon
                            IconComponent={Clear}
                            className={classes.icon}
                            onClick={onClosePopover}
                        />
                    </Grid>
                </Grid>
            </Popover>
        </>}
    </Grid>;
}, areEqualProps); // NOSONAR

export default withStyles(styles)(SocialNetwork);

