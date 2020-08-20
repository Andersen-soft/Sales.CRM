// @flow

import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'crm-hooks/useTranslation';

const AccessDenied = () => <Grid
    container
    justify='center'
>
    <Typography variant='h4'>{useTranslation('common.accessDenied')}</Typography>
</Grid>;

export default AccessDenied;
