// @flow

import { compose, join, juxt, toUpper, head, tail } from 'ramda';

export const capitalize = compose(
    join(''),
    juxt([
        compose(
            toUpper,
            head,
        ),
        tail,
    ]),
);
