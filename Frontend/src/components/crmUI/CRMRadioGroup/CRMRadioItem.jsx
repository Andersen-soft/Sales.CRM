// @flow

import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { Grid, Radio, FormControlLabel } from '@material-ui/core';

import FireSVG from 'crm-static/customIcons/Fire.svg';
import FireActiveSVG from 'crm-static/customIcons/Fire_active.svg';

import styles from './CRMRadioGroupStyles';

type Props = {
    classes: Object,
    content: Array<any>,
    index: number,
};

const CRMRadioItem = ({
    classes,
    content,
    index,
}: Props) => {
    const { value, label, icon } = content[index];
    const [active, setActive] = useState(false);

    const handleActive = element => element && setActive(element.checked);

    return (
        <Grid
            item
            container
            xs
            alignItems='center'
        >
            <FormControlLabel
                className={
                    cn(classes.containerLabel, active && classes.containerLabelActive)
                }
                value={value}
                control={
                    <Radio
                        className={classes.radio}
                        inputRef={handleActive}
                    />
                }
                label={
                    <Grid
                        container
                        alignItems='center'
                    >
                        {icon && <Grid item className={classes.icon}>
                            {active ? <FireActiveSVG /> : <FireSVG />}
                        </Grid>}
                        <Grid item className={classes.label} >
                            {label}
                        </Grid>
                    </Grid>
                }
            />
            {content.length - 1 !== index && <Grid
                item
                className={classes.splitter}
            />}
        </Grid>
    );
};

export default withStyles(styles)(CRMRadioItem);
