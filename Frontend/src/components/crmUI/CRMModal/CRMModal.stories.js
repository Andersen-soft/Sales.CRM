// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import { Typography, Grid } from '@material-ui/core';

import CRMModal from './CRMModal';

const ContentComponent = (
    <Grid>
        <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
            qui officia deserunt mollit anim id est laborum.
        </Typography>
    </Grid>
);

storiesOf('CRMModal', module)
    .add('CRM Modal', () => (
        <CRMModal
            title='Добавить активность'
            ContentComponent={ContentComponent}
            onHandleSubmit={() => {}}
            actions
            isDialogOpened
        />
    ))
    .add('CRM Modal without actions', () => (
        <CRMModal
            title='Добавить активность'
            ContentComponent={ContentComponent}
            onHandleSubmit={() => {}}
            isDialogOpened
        />
    ))
    .add('CRM Modal large', () => (
        <CRMModal
            title='Добавить активность'
            size='large'
            ContentComponent={ContentComponent}
            onHandleSubmit={() => {}}
            isDialogOpened
        />
    ))
    .add('CRM Modal medium', () => (
        <CRMModal
            title='Добавить активность'
            size='medium'
            ContentComponent={ContentComponent}
            onHandleSubmit={() => {}}
            isDialogOpened
        />
    ))
    .add('CRM Modal small', () => (
        <CRMModal
            title='Добавить активность'
            size='small'
            ContentComponent={ContentComponent}
            onHandleSubmit={() => {}}
            isDialogOpened
        />
    ));


