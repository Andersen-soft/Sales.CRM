// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Typography } from '@material-ui/core';

import CRMInformationDialog from './CRMInformationDialog';

const open = true;

const renderInformationContent = () => (
    <Typography>
        Example content
    </Typography>
);

storiesOf('Molecules/InformationDialog', module)
    .add('InformationDialog', () => (
        <CRMInformationDialog
            open={open}
            onClose={action('close modal')}
            renderContent={renderInformationContent}
        />
    ));

