// @flow

import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import {
    Grid,
    Typography,
    IconButton,
    Tooltip,
    RootRef,
} from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import CRMTable from 'crm-ui/CRMTable/CRMTable';
import CRMInputSearch from 'crm-ui/CRMInput/CRMInput';
import CancelConfirmation from 'crm-components/common/CancelConfirmation';
import CRMIcon from 'crm-icons';
import { PAGE_SIZE } from 'crm-constants/reportBySocialContactsPage/socialContactsConstants';
import {
    getContacts,
    deleteContact,
} from 'crm-api/socialNetworkContacts/socialNetworkContactsService';
import { useTranslation } from 'crm-hooks/useTranslation';
import { KEY_ENTER } from 'crm-constants/keyCodes';
import { crmTrim } from 'crm-utils/trimValue';
import { UserCell } from 'crm-components/common/TableCells';
import ActionCell from './attributes/ActionCell';
import AddOrEditForm from './attributes/addOrEditForm';

import styles from './attributes/TableSocialNetworkStyles';

type Props = {
    classes: Object,
}

const SocialNetworkContactsPage = ({
    classes,
}: Props) => {
    const [socialNetwork, setSocialNetwork] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalElement, setTotalElements] = useState(0);
    const [deletedId, setDeletedId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowEdit, setRowEdit] = useState(null);

    const translations = {
        title: useTranslation('tableSocialNetwork.common.title'),
        socialNetwork: useTranslation('tableSocialNetwork.common.socialNetwork'),
        sales: useTranslation('tableSocialNetwork.common.sales'),
        networkCoordinator: useTranslation('tableSocialNetwork.common.networkCoordinator'),
        search: useTranslation('common.search'),
        cancel: useTranslation('common.cancel'),
        confirm: useTranslation('common.confirm'),
        add: useTranslation('common.add'),
        addRecord: useTranslation('tableSocialNetwork.common.addRecord'),
        recordEdit: useTranslation('tableSocialNetwork.common.recordEdit'),
        deleteForm: useTranslation('tableSocialNetwork.common.deleteForm'),
        infoError: useTranslation('tableSocialNetwork.common.infoError'),
        addVirtiual: useTranslation('tableSocialNetwork.common.addVirtiual'),
        addSocialNetwork: useTranslation('tableSocialNetwork.common.addSocialNetwork'),
    };

    const tableRef = useRef(null);

    const useMemoWrapper = (Component, dependencies) => useMemo(() => Component, dependencies);

    const scrollTop = () => {
        const { current } = tableRef;

        if (current) {
            current.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        }
    };

    const fetchAll = (newPage: number = page) => {
        setLoading(true);
        getContacts(newPage).then(({ content, totalElements }) => {
            setTotalElements(totalElements);
            setSocialNetwork(content);
        }).finally(() => {
            setLoading(false);
            scrollTop();
        });
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
        fetchAll(newPage);
    };

    const onKeyPress = ({ key }) => {
        if (key === KEY_ENTER.key) {
            const trimmedSearchValue = crmTrim(searchValue);

            setSearchValue(trimmedSearchValue);
            setLoading(true);
            getContacts(0, trimmedSearchValue)
                .then(({ content, totalElements }) => {
                    setTotalElements(totalElements);
                    setSocialNetwork(content);
                })
                .finally(() => setLoading(false));
        }
    };

    const onBlurSearch = ({ target: { value } }) => {
        setSearchValue(crmTrim(value));
    };

    const changeSearchValue = ({ target: { value } }) => setSearchValue(value);

    const clearSearchField = () => {
        setSearchValue('');
        setPage(0);
        fetchAll(0);
    };

    useEffect(() => {
        setLoading(true);
        document.title = translations.title;

        fetchAll();
    }, []);

    const editForm = answerId => {
        const findRowEdit = socialNetwork.find(item => item.id === answerId);

        setIsEditMode(true);
        setRowEdit(findRowEdit);
        setOpenDialog(true);
    };

    const deleteForm = answerId => setDeletedId(answerId);

    const prepareData = rowData => rowData.map(({
        id,
        socialNetworkUser: { name },
        source,
        sales,
        salesAssistant,
    }) => ({
        id,
        socialNetworkUser: name,
        source: source.name,
        sales: {
            name: `${sales.firstName} ${sales.lastName}`,
            id: sales.id,
            reloadParent: fetchAll,
        },
        salesAssistant: {
            name: `${salesAssistant.firstName} ${salesAssistant.lastName}`,
            id: salesAssistant.id,
            reloadParent: fetchAll,
        },
        actions: [id, editForm, deleteForm],
    }));

    const getConfig = () => [
        {
            title: translations.title,
            key: 'socialNetworkUser',
        },
        {
            title: translations.socialNetwork,
            key: 'source',
        },
        {
            title: translations.sales,
            key: 'sales',
            RenderCell: UserCell,
        },
        {
            title: translations.networkCoordinator,
            key: 'salesAssistant',
            RenderCell: UserCell,
        },
        {
            title: '',
            key: 'actions',
            RenderCell: ActionCell,
        },
    ];

    const addNewRow = () => {
        setIsEditMode(false);
        setOpenDialog(true);
        setRowEdit(null);
    };

    const cancelConfirm = async () => {
        setLoading(true);
        deletedId && await deleteContact(deletedId);
        setDeletedId(null);
        fetchAll();
    };

    return (
        <Grid className={classes.container}>
            <Grid
                container
                className={classes.headerContainer}
                alignItems='center'
            >
                <Typography className={classes.headerTitle}>
                    {translations.title}
                </Typography>
                <Grid item className={classes.headerSearch}>
                    <CRMInputSearch
                        fullWidth
                        value={searchValue}
                        onKeyPress={onKeyPress}
                        onClear={clearSearchField}
                        onChange={changeSearchValue}
                        onBlur={onBlurSearch}
                        searchable
                        placeholder={translations.search}
                    />
                </Grid>
                <Grid item>
                    <Tooltip
                        title={translations.addRecord}
                        interactive
                        placement='bottom-start'
                    >
                        <IconButton onClick={addNewRow}>
                            <CRMIcon IconComponent={AddCircleOutline} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <RootRef rootRef={tableRef}>
                {useMemoWrapper(<CRMTable
                    data={prepareData(socialNetwork)}
                    columnsConfig={getConfig()}
                    isLoading={loading}
                    loaderPosition='fixed'
                    paginationParams={{
                        rowsPerPage: PAGE_SIZE,
                        count: totalElement,
                        onChangePage: handleChangePage,
                        page,
                    }}
                    classes={{ root: classes.tableContainer }}
                />, [socialNetwork, page, loading])}
            </RootRef>
            <CancelConfirmation
                showConfirmationDialog={Boolean(deletedId)}
                onConfirmationDialogClose={() => setDeletedId(null)}
                onConfirm={cancelConfirm}
                text={translations.deleteForm}
                textCancel={translations.cancel}
                textApply={translations.confirm}
                classes={{ textAlignCenter: classes.dialogText }}
            />
            <AddOrEditForm
                isShowDialog={openDialog}
                closeDialog={setOpenDialog}
                isEditMode={isEditMode}
                isEditChange={() => setIsEditMode(false)}
                rowEdit={rowEdit}
                tableReload={clearSearchField}
            />
        </Grid>
    );
};

export default withStyles(styles)(SocialNetworkContactsPage);
