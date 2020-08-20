// @flow

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Tooltip } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import validatePhone from 'crm-utils/validatePhone';

import type { StyledComponentProps } from '@material-ui/core/es';

import styles from './cellsStyles';

type Props = {
    values: [string, string, number],
    editableRowId: number,
    isEdit: boolean,
    updateEditRowState: () => void,
} & StyledComponentProps;

const SkypeAndPhoneCell = ({
    values: [skype, phone],
    isEdit,
    updateEditRowState,
    classes,
}: Props) => {
    const [localSkype, setLocalSkype] = useState(skype);
    const [localPhone, setLocalPhone] = useState(phone);

    useEffect(() => {
        if (isEdit) {
            setLocalSkype(skype);
            setLocalPhone(phone);
        }
    }, [isEdit]);

    const changeSkype = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => setLocalSkype(value);

    const onBlurSkype = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => updateEditRowState('skype', value.trim());

    const changePhone = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        const newValue = (validatePhone(value) || !value.length) ? value : localPhone;

        setLocalPhone(newValue || '');
    };

    const onBlurPhone = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        updateEditRowState('phone', value.trim());
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
                        className={cn(classes.cell, classes.topCell, classes.skypeCell)}
                    >
                        <CRMInput
                            value={localSkype}
                            onChange={changeSkype}
                            onBlur={onBlurSkype}
                        />
                    </Grid>
                    <Grid
                        item
                        className={classes.cell}
                    >
                        <CRMInput
                            value={localPhone}
                            onChange={changePhone}
                            onBlur={onBlurPhone}
                        />
                    </Grid>
                </>
                : <>
                    <Grid
                        container
                        item
                        className={classes.topCell}
                    >
                        {skype
                            ? <Tooltip
                                title={skype}
                                interactive
                                placement='bottom-start'
                                classes={{ tooltip: classes.tooltip }}
                            >
                                <Link
                                    href={`skype:${skype}`}
                                    className={cn(classes.cell, classes.skypeCell, classes.cellEllipsis)}
                                >
                                    {skype}
                                </Link>
                            </Tooltip>
                            : <CRMEmptyBlock className={classes.emptyBlock} />
                        }
                    </Grid>
                    {phone
                        ? <Tooltip
                            title={phone}
                            interactive
                            placement='bottom-start'
                            classes={{ tooltip: classes.tooltip }}
                        >
                            <Grid
                                item
                                className={cn(classes.cell, classes.cellEllipsis)}
                            >
                                {phone}
                            </Grid>
                        </Tooltip>
                        : <CRMEmptyBlock className={classes.emptyBlock} />
                    }
                </>
            }
        </Grid>
    );
};

export default withStyles(styles)(SkypeAndPhoneCell);
