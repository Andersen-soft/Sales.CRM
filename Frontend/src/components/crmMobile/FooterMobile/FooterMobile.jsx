// @flow
import React from 'react';
import { AppBar, Toolbar, Grid } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import HeaderControls from 'crm-components/common/HeaderControls';
import styles from './FooterMobileStyles';

type Props = {
    userRole: Array<string>,
    classes: Object,
};

const FooterMobile = ({ classes, userRole }: Props) => (
    <div className={classes.container}>
        <AppBar
            className={classes.content}
            position='static'
            color='inherit'
        >
            <Toolbar className={classes.wrapper}>
                <Grid
                    container
                    justify='space-between'
                    alignItems='center'
                >
                    <HeaderControls userRole={userRole} />
                </Grid>
            </Toolbar>
        </AppBar>
    </div>
);

export default withStyles(styles)(FooterMobile);

