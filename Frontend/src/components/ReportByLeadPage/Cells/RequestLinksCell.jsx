// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {
    ESTIMATION,
    ESTIMATION_EN,
    RESUME,
    RESUME_EN,
} from 'crm-constants/reportsByLead/reportsConstants';
import { pages } from 'crm-constants/navigation';
import CRMEmptyBlock from 'crm-ui/CRMEmptyBlock/CRMEmptyBlock';

import styles from './cellStyles';

type Props = {
    values: Array<{
        id: string,
        name: string,
        type: string,
    }>;
    classes: Object,
};

const RequestLinksCell = ({
    values: requests,
    classes,
}: Props) => {
    const getRequestPage = (type: string) => {
        switch (true) {
            case (type === ESTIMATION):
            case (type === ESTIMATION_EN):
                return pages.ESTIMATION_REQUESTS;
            case (type === RESUME):
            case (type === RESUME_EN):
                return pages.RESUME_REQUESTS;
            default:
                return '/';
        }
    };

    return requests.length
        ? requests.map(({ id, name, type }, index) => (
            <Link
                key={id}
                to={`${getRequestPage(type)}/${id}`}
                className={classes.linkCell}
            >
                {`${name}${(requests.length - 1) === index ? '' : ', '}`}
            </Link>
        ))
        : <CRMEmptyBlock />;
};

export default withStyles(styles)(RequestLinksCell);
