// @flow

import React from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, RadioGroup, FormControlLabel } from '@material-ui/core';
import CRMRadio from 'crm-ui/CRMRadio/CRMRadio';

import styles from '../AttributesDesktopStyles';

type Props = {
    classes: Object,
    translatePriority: string,
    priority: string,
    handleChange: () => void,
    priorities: Array<Object>,
}

const ResumePriorityDesktop = ({
    classes,
    translatePriority,
    priority,
    handleChange,
    priorities,
}: Props) => (
    <Grid
        item
        container
        direction='row'
        justify='space-between'
        alignItems='center'
        wrap='nowrap'
        xs={12}
        className={classes.priorityRow}
    >
        <Grid className={classes.label}>
            {`${translatePriority}:`}
        </Grid>
        <Grid className={classes.withoutEdit}>
            <RadioGroup
                className={classes.statusGroup}
                value={priority || ''}
                onChange={handleChange}
            >
                {priorities.map(({ title, value }) => (
                    <FormControlLabel
                        classes={{
                            root: classes.radioRoot,
                            label: classes.radioLabel,
                        }}
                        key={value}
                        value={value}
                        control={<CRMRadio />}
                        label={value}
                        className={cn({ [classes.selectedValue]: value === priority })}
                    />))
                }
            </RadioGroup>
        </Grid>
    </Grid>
);

export default withStyles(styles)(ResumePriorityDesktop);
