// @flow

import React from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, RadioGroup, FormControlLabel } from '@material-ui/core';
import CRMRadio from 'crm-ui/CRMRadio/CRMRadio';

import styles from '../AttributesMobileStyles';

type Props = {
    classes: Object,
    translatePriority: string,
    priority: string,
    handleChange: () => void,
    priorities: Array<Object>,
}

const ResumePriorityMobile = ({
    classes,
    translatePriority,
    priority,
    handleChange,
    priorities,
}: Props) => (
    <Grid className={classes.filedContainer}>
        <Typography className={classes.inputLabel}>
            {`${translatePriority}:`}
        </Typography>
        <RadioGroup
            className={classes.statusRadioGroup}
            value={priority || ''}
            onChange={handleChange}
        >
            <Grid container>
                {priorities.map(({ title, value }) => (
                    <Grid
                        key={value}
                        item
                        xs={6}
                        className={classes.statusRadioItem}
                    >
                        <FormControlLabel
                            classes={{
                                root: classes.statusRadioRoot,
                                label: classes.statusRadioLabel,
                            }}
                            value={value}
                            control={<CRMRadio />}
                            label={value}
                            className={cn({ [classes.statusSelectedValue]: value === priority })}
                        />
                    </Grid>))
                }
            </Grid>
        </RadioGroup>
    </Grid>
);

export default withStyles(styles)(ResumePriorityMobile);
