// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { InfoOutlined, PermIdentity, Add } from '@material-ui/icons';
import List from 'crm-static/customIcons/list.svg';

import CRMDotMenu from './CRMDotMenu';

const config = [
    { icon: Add, text: 'Добавить активность', handler: action('add activity'), itemClass: 'separator' },
    { icon: List, text: 'Посл. активность', handler: action('show Last Acivity') },
    { icon: InfoOutlined, text: 'Инф. о компании', handler: action('show company info') },
    { icon: PermIdentity, text: 'Осн. контакт', handler: action('show main contact') },
];

storiesOf('Molecules/CRMDotMenu', module)
    .add('CRM Dot Menu', () => (
        <CRMDotMenu
            id={123}
            config={config}
        />
    ));
