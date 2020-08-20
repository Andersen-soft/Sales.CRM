// @flow

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { pathOr } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import CRMSocialNetworkIconLink from 'crm-ui/CRMSocialNetworkIconLink/CRMSocialNetworkIconLink';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import { SITE_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { getAuthUserSocialContacts } from 'crm-api/contactsCard/contactsCardService';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: [string, { name: string, id: number }, string],
    isEdit: boolean,
    updateEditRowState: () => void,
} & StyledComponentProps;

const SocialNetworkAndSocialNetworlUserCell = ({
    values: [socialNetwork, socialNetworkUser, currentUserName],
    isEdit,
    updateEditRowState,
    classes,
}: Props) => {
    const socialUser = socialNetworkUser
        && { value: pathOr(null, ['id'], socialNetworkUser), label: pathOr(null, ['name'], socialNetworkUser) };

    const [localSocialNetwork, setLocalSocialNetwork] = useState(socialNetwork);
    const [socialNetworkError, setSocialNetworkError] = useState(null);
    const [localSocialNetworkUser, setLocalSocialNetworkUser] = useState(socialUser);
    const [socialNetworkUserList, setSocialNetworkUserList] = useState([]);

    const translations = {
        errorUrlValidation: useTranslation('forms.errorUrlValidation'),
    };

    useEffect(() => {
        if (isEdit) {
            (async () => {
                const socialContacts = await getAuthUserSocialContacts({ username: currentUserName });
                const socialContactsSuggestions = socialContacts.content.map(
                    ({ socialNetworkUser: { name, id }, source: { name: sourceName } }) => (
                        { label: `${name} - ${sourceName}`, value: id })
                );

                setSocialNetworkUserList(socialContactsSuggestions);
            })();

            setLocalSocialNetwork(socialNetwork);
            setSocialNetworkError(null);
            setLocalSocialNetworkUser(socialUser);
        }
    }, [isEdit]);

    const changeSocialNetwork = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        socialNetworkError && setSocialNetworkError(null);
        setLocalSocialNetwork(value);
    };

    const socialNetworkBlur = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        if (value.length && !SITE_REGEXP.test(value)) {
            setSocialNetworkError(translations.errorUrlValidation);
            updateEditRowState('socialNetwork', Error(translations.errorUrlValidation));
        } else {
            setSocialNetworkError(null);
            updateEditRowState('socialNetwork', value);
        }
    };

    const changeLocalSocialNetworkUserName = user => {
        setLocalSocialNetworkUser(user);
        updateEditRowState('socialNetworkUserId', user.value);
    };

    return (
        <Grid
            container
            direction='column'
        >
            { isEdit
                ? <>
                    <Grid
                        item
                        className={cn(classes.cell, classes.topCell)}
                    >
                        <CRMInput
                            value={localSocialNetwork}
                            onChange={changeSocialNetwork}
                            onBlur={socialNetworkBlur}
                            error={socialNetworkError}
                            fullWidth
                        />
                    </Grid>
                    <Grid
                        item
                        className={cn(classes.cell, classes.fioCell)}
                    >
                        <CRMAutocompleteSelect
                            value={localSocialNetworkUser}
                            options={socialNetworkUserList}
                            onChange={changeLocalSocialNetworkUserName}
                            menuPosition={'fixed'}
                            menuShouldBlockScroll
                        />
                    </Grid>
                </>
                : <>
                    <Grid
                        item
                        className={cn(classes.cell, classes.topCell)}
                    >
                        {socialNetwork
                            ? <CRMSocialNetworkIconLink
                                className={classes.socialIcon}
                                link={socialNetwork}
                            />
                            : <CRMEmptyBlock className={classes.emptyBlock} />
                        }
                    </Grid>
                    <Grid
                        item
                        className={cn(classes.cell, classes.fioCell)}
                    >
                        {(socialUser && socialUser.label) || <CRMEmptyBlock className={classes.emptyBlock} />}
                    </Grid>
                </>
            }
        </Grid>
    );
};

export default withStyles(styles)(SocialNetworkAndSocialNetworlUserCell);
