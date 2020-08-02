// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { SITE_ID } from 'crm-constants/roles';

import styles from './CheckboxFilterStyles';

type List = {
    id: number,
    value: string,
    checked?: boolean,
};

type Props = {
    columnKey: string | null | void,
    classes: Object,
    onSetFilters: (filterName: string | null | void, filterValue: Object | Array<boolean | number>) => void;
    onClose: () => void;
    requestDataForFilters: Function,
    filters: Object
};

type State = {
    list: Array<List>,
};

class CheckboxFilter extends Component<Props, State> {
    state = { list: [] };

    async componentDidMount() {
        const { requestDataForFilters, columnKey } = this.props;
        let statuses: Array<Object> = columnKey === 'isActive'
            ? [{ name: 'Активный', id: 1 }, { name: 'Неактивный', id: 0 }]
            : await requestDataForFilters();

        const filter = this.props.filters[columnKey];
        const checkedForStatuses = filter && columnKey === 'isActive'
            && [{ value: 'Активный', id: 1, checked: filter[0] },
                { value: 'Неактивный', id: 0, checked: !filter[0] },
            ];

        let checkedForRoles;

        if (columnKey === 'role') {
            statuses = statuses.filter(({ id }) => SITE_ID !== id);
        }

        if (filter && columnKey === 'role') {
            checkedForRoles = statuses.map(({ id, name }) => ({ id, value: name, checked: filter.indexOf(id) !== -1 }));
        }

        checkedForStatuses || checkedForRoles ? this.setState({ list: checkedForStatuses || checkedForRoles }) : this.setState({
            list: statuses.map(({ id, name }) => ({ id, value: name, checked: false })),
        });
    }

    handleChange = ({ target: { value } }) => {
        const list = [...this.state.list];

        const current: List | void = list.find(item => item.id === +value);

        if (current) {
            current.checked = !current.checked;
            this.setState({ list });
        }
    };

    handleApplyFilters = () => {
        const { onSetFilters, columnKey, onClose } = this.props;
        const { list } = this.state;

        onSetFilters(
            columnKey,
            list.filter((item: List) => item.checked).map(({ id }: List) => ((columnKey === 'isActive') ? !!id : id))
        );

        onClose();
    };

    render() {
        const { list } = this.state;
        const { classes } = this.props;

        return (
            <FormControl className={classes.formControl}>
                <FormGroup>
                    {list.map(listItem => (
                        <FormControlLabel
                            key={listItem.id}
                            control={
                                <Checkbox
                                    checked={listItem.checked}
                                    onChange={this.handleChange}
                                    value={String(listItem.id)}
                                    color='primary'
                                />
                            }
                            label={listItem.value}
                        />
                    ))}
                </FormGroup>
                <Button
                    className={classes.applyButton}
                    onClick={this.handleApplyFilters}
                >
                    Применить
                </Button>
            </FormControl>
        );
    }
}
const mapStateToProps = state => ({
    filters: state.AdminUsers.filters,
});

export default connect(mapStateToProps)(withStyles(styles)(CheckboxFilter));
