// @flow

import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Grid, Button } from '@material-ui/core';
import CRMInput from 'crm-ui/CRMInput/CRMInput';
import Notification from './Notification';
import NotificationSingleton from './NotificationSingleton';
import { withStyles } from '@material-ui/core/styles';
import styles from './NotificationStoriesStyles';

storiesOf('Molecules/Notification', module)
    .add('Error message', () => (
        <Notification open handleClose={action('onClose')} />
    ))
    .add('Success message', () => (
        <Notification
            open
            type='success'
            message='Success'
            handleClose={action('onClose')}
        />
    ))
    .add('Warning message', () => (
        <Notification
            open
            type='warning'
            message='Warning'
            handleClose={action('onClose')}
        />
    ))
    .add('Info message', () => (
        <Notification
            open
            type='info'
            message='Info'
            handleClose={action('onClose')}
        />
    ));

const defaultProps = {
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
    },
    closeTimeout: 5000,
};

type Props = {
    classes: Object;
};

const NotificationSingletonComponent = ({ classes }: Props) => {
    const [valueInput, setValueInput] = useState('Some message');

    const handleClick = params => {
        NotificationSingleton.showMessage({
            ...defaultProps,
            ...params,
            message: valueInput,
        });
    };

    const handleInputChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        setValueInput(event.target.value);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <CRMInput
                    onChange={handleInputChange}
                    value={valueInput}
                    className={classes.input}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant='contained'
                    onClick={() => handleClick({ type: 'success' })}
                    className={classes.success}
                >
                    Вызов уведомления об успешной операции
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant='contained'
                    onClick={() => handleClick({ type: 'warning' })}
                    className={classes.warning}
                >
                    Вызов уведомления с предупреждением
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant='contained'
                    onClick={() => handleClick({ type: 'error' })}
                    className={classes.error}
                >
                    Вызов уведомления с ошибкой
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant='contained'
                    onClick={() => handleClick({ type: 'info' })}
                    className={classes.info}
                >
                    Вызов информационного уведомления
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant='contained'
                    onClick={() => handleClick({ type: 'info', isTimerDisabled: true })}
                    className={classes.info}
                >
                    Вызов нотификации без таймера
                </Button>
            </Grid>
        </Grid>
    );
};

const StyledNotificationSingletonComponent = withStyles(styles)(NotificationSingletonComponent);

storiesOf('Molecules/NotificationSingleton', module)
    .add('Notification with wimple form', () => <StyledNotificationSingletonComponent />);
