// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import Angel from 'crm-static/customIcons/angel.svg';
import { CalendarTodayTwoTone } from '@material-ui/icons';

import CRMIcon from 'crm-icons';

storiesOf('Molecules/Icons', module)
    .add('Description1', () => (
        <CRMIcon IconComponent={CalendarTodayTwoTone} />
    ))
    .add('Description2', () => (
        <CRMIcon IconComponent={Angel} />
    ));

