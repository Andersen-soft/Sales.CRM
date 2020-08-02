// @flow

import React from 'react';
import { pathOr } from 'ramda';
import { Tooltip, Grid } from '@material-ui/core';
// $FlowFixMe
import { components } from 'react-select';

const Option = (props: Object) => {
    const title = pathOr(null, ['data', 'title'], props);

    return title
        ? <Tooltip
            title={title}
            placement='right'
            arrow
        >
            <Grid>
                <components.Option {...props} />
            </Grid>
        </Tooltip>
        : <components.Option {...props} />;
};

export default Option;
