// @flow

import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import {
    Grid,
    IconButton,
    Tooltip,
    TextField,
    InputAdornment,
    Paper,
    MenuItem,
    MenuList,
    LinearProgress,
    Fade,
} from '@material-ui/core';
import {
    Edit, Clear, Search, Done,
} from '@material-ui/icons';
import { pathOr, isNil } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import Notification from 'crm-components/notification/NotificationSingleton';
import { getCompaniesGlobalSearch } from 'crm-api/companyCardService/companyCardService';
import type { EstimationRequest } from 'crm-constants/estimationRequestPage/estimationRequestPageConstants';
import { CANCELED_REQUEST } from 'crm-constants/common/constants';

import styles from '../EstimationStyles';

type CompaniesListType = {
    name: string,
    id: number,
}

type State = {
    isEdit: boolean,
    value: ?string,
    autoCompleteOpen: boolean,
    companies: Array<CompaniesListType>,
    isLoading: boolean,
}

type Props = {
    estimationId: string,
    classes: Object,
    company: string,
    updateEstimation: (estimationId: string, fieldName: string, updateData: string | number) => Promise<EstimationRequest>,
}

class CompanySelect extends PureComponent<Props, State> {
    state = {
        isEdit: false,
        value: null,
        autoCompleteOpen: false,
        companies: [{ name: '', id: 0 }],
        isLoading: false,
    };

    constructor(props) {
        super(props);
        this.handleSearch = debounce(this.handleSearch, 300);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.company && isNil(prevState.value)) {
            return {
                value: nextProps.company,
            };
        }

        return null;
    }

    handleIsEdit = () => {
        const { isEdit, value } = this.state;
        const { company } = this.props;

        this.setState({ isEdit: !isEdit, value: value || company });
    };

    handleSearch = async (searchCompanyValue: string) => {
        const searchCompanyList = await getCompaniesGlobalSearch(searchCompanyValue, 150, CANCELED_REQUEST);

        this.setState({
            companies: searchCompanyList.content,
            isLoading: false,
        });
    };

    handleCompanyChange = ({ target: { value } }: SyntheticInputEvent<HTMLInputElement>) => {
        this.handleSearch(value);
        this.setState({
            value,
            autoCompleteOpen: true,
            isLoading: true,
        });
    };

    handleClearSearchValue = () => {
        this.setState({
            value: '',
            autoCompleteOpen: false,
            isLoading: false,
        });
    };

    handleMenuItemClick = (name: string, id: number) => {
        const { updateEstimation, estimationId } = this.props;

        updateEstimation(estimationId, 'companyId', id)
            .then(() => {
                this.setState({
                    autoCompleteOpen: false,
                    isEdit: false,
                    value: name,
                    isLoading: true,
                });
            })
            .catch(error => {
                Notification.showMessage({
                    message: pathOr('Error', ['response', 'data', 'errorMessage'], error),
                    closeTimeout: 15000,
                });
            });
    };

    renderValue = () => {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <Grid
                item
                container
                direction='row'
                justify='space-between'
                alignItems='center'
                xs={12}
            >
                <Tooltip
                    title={value || ''}
                    interactive
                    placement='bottom-start'
                >
                    <Grid
                        item
                        xs={10} sm={10}
                        lg={10} xl={10}
                        className={classes.cellEllipsis}
                    >
                        {value || <span className={classes.emptyBlock}>Unfilled</span> }
                    </Grid>
                </Tooltip>
                <Grid
                    item
                    container
                    direction='row'
                    justify='flex-start'
                    alignItems='center'
                    xs={2}
                >
                    <Tooltip
                        title='Edit'
                        className={classes.paddingFix}
                    >
                        <IconButton
                            aria-label='Edit'
                            onClick={this.handleIsEdit}
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    };

    renderEditMode = () => {
        const { classes } = this.props;
        const {
            value, autoCompleteOpen, companies, isLoading,
        } = this.state;

        return (
            <Grid
                item
                container
                direction='row'
                justify='space-between'
                alignItems='center'
                xs={12}
            >
                <Grid
                    item
                    xs={10}
                >
                    <Grid classes={{ root: classes.editCompany }}>
                        <TextField
                            placeholder='Select company'
                            onChange={this.handleCompanyChange}
                            value={value}
                            autoFocus
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='start'>
                                        { value
                                            ? <Clear
                                                className={classes.clearSearch}
                                                onClick={this.handleClearSearchValue}
                                            />
                                            : <Search />
                                        }
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Fade
                            in={isLoading}
                            unmountOnExit
                        >
                            <LinearProgress
                                value={100}
                                valueBuffer={5}
                                classes={{
                                    root: classes.loader,
                                }}
                            />
                        </Fade>
                    </Grid>
                    {autoCompleteOpen && (
                        <Paper className={classes.searchValuesWrapper}>
                            <MenuList>
                                {companies.map(({ id, name }) => (
                                    <MenuItem
                                        key={id}
                                        value={name}
                                        onClick={() => this.handleMenuItemClick(name, id)}
                                    >
                                        {name}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Paper>
                    )}
                </Grid>
                <Grid
                    item
                    xs={2}
                >
                    <Tooltip
                        title='Close'
                        className={classes.paddingFix}
                    >
                        <IconButton onClick={this.handleIsEdit}>
                            <Done />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    };

    render() {
        const { classes } = this.props;
        const { isEdit } = this.state;

        return (
            <Grid
                item
                container
                direction='row'
                justify='space-between'
                alignItems='center'
                xs={12}
            >
                <Grid
                    className={classes.label}
                    xs={6}
                    item
                    container
                    justify='flex-start'
                    alignItems='center'
                >
                    Company
                </Grid>
                <Grid
                    xs={6}
                    item
                    container
                    justify='flex-start'
                    alignItems='center'
                >
                    { isEdit ? this.renderEditMode() : this.renderValue() }
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(CompanySelect);
