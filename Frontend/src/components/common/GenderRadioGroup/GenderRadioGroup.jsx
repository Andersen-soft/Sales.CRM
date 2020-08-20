// @flow

import React, { memo } from 'react';
import { useTranslation } from 'crm-hooks/useTranslation';
import { withStyles } from '@material-ui/core/styles';

import {
    Grid,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
} from '@material-ui/core';

import type { StyledComponentProps } from '@material-ui/core/es';
import { MALE_KEY, FEMALE_KEY } from 'crm-constants/gender';
import styles from 'crm-components/common/GenderRadioGroup/GenderRadioGroupStyles';

type Props = {
    onChange: (event: SyntheticInputEvent<HTMLInputElement>) => void;
    value: string;
    name: string;
    fullWidth: boolean;
    label?: boolean;
} & StyledComponentProps;

const GenderRadioGroup = ({
    onChange,
    value,
    name,
    fullWidth,
    label,
    classes,
    ...rest
}: Props) => {
    const translations = {
        gender: useTranslation('gender.gender'),
        male: useTranslation('gender.male'),
        female: useTranslation('gender.female'),
    };

    return (
        <FormControl component='fieldset' fullWidth={fullWidth}>
            <Grid container wrap='nowrap'>
                {label && <Grid item className={classes.rowLabel}>
                    <span className={classes.label}>{ translations.gender }</span>
                </Grid>}
                <Grid item className={classes.radioGroup}>
                    <RadioGroup
                        {...rest}
                        aria-label='Gender'
                        name={name}
                        value={value}
                        onChange={onChange}
                        classes={{ root: classes.radioGroupRoot }}
                    >
                        <FormControlLabel
                            className={classes.control}
                            classes={{ label: classes.controlLabel }}
                            value={MALE_KEY} control={<Radio color='default' className={classes.root} />}
                            label={translations.male}
                        />
                        <FormControlLabel
                            className={classes.control}
                            classes={{ label: classes.controlLabel }}
                            value={FEMALE_KEY} control={<Radio color='default' className={classes.root} />}
                            label={translations.female}
                        />
                    </RadioGroup>
                </Grid>
            </Grid>
        </FormControl>
    );
};

export default memo < Props > (withStyles(styles)(GenderRadioGroup));
