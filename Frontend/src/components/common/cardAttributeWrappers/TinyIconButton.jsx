// @flow

import React from 'react';
import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


const TinyIconButton = withStyles({
    root: { padding: '8px' },
})(IconButton);

export default TinyIconButton;
