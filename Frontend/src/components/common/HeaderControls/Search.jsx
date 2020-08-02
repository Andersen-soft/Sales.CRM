// @flow
import * as React from 'react';
import classnames from 'classnames';
import { IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { pages } from 'crm-constants/navigation';
import { Link } from 'react-router-dom';
import CRMIcon from 'crm-icons';
import { useMobile } from 'crm-components/common/MobileContextProvider/MobileContextProvider';

type Props = {
    classes: Object,
}

const Search = ({ classes }: Props) => (
    <Link
        to={`${pages.GLOBAL_SEARCH}`}
        key='sale'
    >
        <IconButton
            className={classnames(classes.iconButton, { [classes.mobileIconButton]: useMobile() })}
            disableTouchRipple
        >
            <CRMIcon IconComponent={SearchIcon} />
        </IconButton>
    </Link>
);

export default Search;
