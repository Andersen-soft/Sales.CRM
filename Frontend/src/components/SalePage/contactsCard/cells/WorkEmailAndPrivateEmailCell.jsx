// @flow

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Tooltip } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import { EMAIL_REGEXP } from 'crm-constants/validationRegexps/validationRegexps';
import { useTranslation } from 'crm-hooks/useTranslation';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: [string, string],
    isEdit: boolean,
    updateEditRowState: () => void,
} & StyledComponentProps;

const WorkEmailAndPrivateEmailCell = ({
    values: [email, personalEmail],
    isEdit,
    updateEditRowState,
    classes,
}: Props) => {
    const [localEmail, setLocalEmail] = useState(email);
    const [emailError, setEmailError] = useState(null);
    const [localPersonalEmail, setLocalPersonalEmail] = useState(personalEmail);
    const [personalEmailError, setPersonalEmailError] = useState(null);

    const translations = {
        errorEmailValidation: useTranslation('forms.errorEmailValidation'),
    };

    useEffect(() => {
        if (isEdit) {
            setLocalEmail(email);
            setEmailError(null);
            setLocalPersonalEmail(personalEmail);
            setPersonalEmailError(null);
        }
    }, [isEdit]);

    const changeEmail = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        emailError && setEmailError(null);
        setLocalEmail(value);
    };

    const onBlurEmail = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        if (value.length && !EMAIL_REGEXP.test(value)) {
            setEmailError(translations.errorEmailValidation);
            updateEditRowState('email', Error(translations.errorEmailValidation));
        } else {
            setEmailError(null);
            updateEditRowState('email', value);
        }
    };

    const changePersonalEmail = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        personalEmailError && setPersonalEmailError(null);
        setLocalPersonalEmail(value);
    };

    const onBlurPersonalEmail = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        if (value.length && !EMAIL_REGEXP.test(value)) {
            setPersonalEmailError(translations.errorEmailValidation);
            updateEditRowState('personalEmail', Error(translations.errorEmailValidation));
        } else {
            setPersonalEmailError(null);
            updateEditRowState('personalEmail', value);
        }
    };

    return (
        <Grid
            container
            direction='column'
        >
            {
                isEdit
                    ? <>
                        <Grid
                            item
                            className={cn(classes.cell, classes.topCell)}
                        >
                            <CRMInput
                                value={localEmail}
                                onChange={changeEmail}
                                onBlur={onBlurEmail}
                                error={emailError}
                                fullWidth
                            />
                        </Grid>
                        <Grid
                            item
                            className={cn(classes.cell)}
                        >
                            <CRMInput
                                value={localPersonalEmail}
                                onChange={changePersonalEmail}
                                onBlur={onBlurPersonalEmail}
                                error={personalEmailError}
                                fullWidth
                            />
                        </Grid>
                    </>
                    : <>
                        <Grid
                            container
                            item
                            className={classes.topCell}
                        >
                            {email
                                ? <Tooltip
                                    title={email}
                                    interactive
                                    placement='bottom-start'
                                    classes={{ tooltip: classes.tooltip }}
                                >
                                    <Link
                                        href={`mailto:${email}`}
                                        className={cn(classes.cell, classes.emailCell, classes.cellEllipsis)}
                                    >
                                        {email}
                                    </Link>
                                </Tooltip>
                                : <CRMEmptyBlock className={classes.emptyBlock} />
                            }
                        </Grid>
                        {personalEmail
                            ? <Tooltip
                                title={personalEmail}
                                interactive
                                placement='bottom-start'
                                classes={{ tooltip: classes.tooltip }}
                            >
                                <Link
                                    href={`mailto:${personalEmail}`}
                                    className={cn(classes.cell, classes.emailCell, classes.cellEllipsis)}
                                >
                                    {personalEmail}
                                </Link>
                            </Tooltip>
                            : <CRMEmptyBlock className={classes.emptyBlock} />
                        }
                    </>
            }
        </Grid>
    );
};

export default withStyles(styles)(WorkEmailAndPrivateEmailCell);
