// @flow

import React, { useState, useEffect } from 'react';
import { pathOr } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import CRMLoader from 'crm-ui/CRMLoader/CRMLoader';
import CRMIcon from 'crm-icons';
import CRMButton from 'crm-ui/CRMButton/CRMButton';
import CRMAutocompleteSelect from 'crm-ui/CRMAutocompleteSelect/CRMAutocompleteSelect';
import { useTranslation } from 'crm-hooks/useTranslation';
import Notification from 'crm-components/notification/NotificationSingleton';
import {
    updateContact,
    addContact,
    createNewSocialNetworkUser,
    createNewSocialNetwork,
    getSocUser,
    getSources,
    getSales,
    getNetworkCoordinator,
} from 'crm-api/socialNetworkContacts/socialNetworkContactsService';
import AddNewInfoUser from './addNewInfoUser';

import styles from './TableSocialNetworkStyles';

const NEW_ID_SOCIAL_NETWORK_USER = 'newIdSocialNetworkUser';
const NEW_ID_SOURCE = 'newIdSource';

type EditRow = {
    id: number,
    salesAssistant: {
        id: number,
        firstName: string,
        lastName: string,
    },
    sales: {
        id: number,
        firstName: string,
        lastName: string,
    },
    socialNetworkUser: {
        id: number,
        name: string,
    },
    source: {
        id: number,
        name: string,
    },
};

type User = {
    id: number,
    name: string,
    firstName: string,
    lastName: string,
};

type Props = {
    isShowDialog: Boolean,
    closeDialog: (show: boolean) => void,
    tableReload: () => void,
    isEditMode: Boolean,
    classes: Object,
    rowEdit: EditRow,
};

const addOrEditForm = ({
    isShowDialog,
    closeDialog,
    tableReload,
    isEditMode,
    rowEdit,
    classes,
}: Props) => {
    const [rowEditForm, setRowEditForm]: [ EditRow | null, Function] = useState(rowEdit);
    const [socialNetworkUserList, setSocialNetworkUserList] = useState([]);
    const [salesAssistantList, setSalesAssistantList] = useState([]);
    const [salesList, setSalesList] = useState([]);
    const [sourceList, setSourceList] = useState([]);
    const [newInfo, setNewInfo] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [showNewInfo, setShowNewInfo] = useState(false);
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [modalConfig, setModalConfig] = useState({ placeholder: '', onAdd: (info: string) => {} });

    const translations = {
        title: useTranslation('tableSocialNetwork.common.title'),
        virtualProfile: useTranslation('tableSocialNetwork.common.virtualProfile'),
        socialNetwork: useTranslation('tableSocialNetwork.common.socialNetwork'),
        sales: useTranslation('tableSocialNetwork.common.sales'),
        networkCoordinator: useTranslation('tableSocialNetwork.common.networkCoordinator'),
        cancel: useTranslation('common.cancel'),
        confirm: useTranslation('common.confirm'),
        save: useTranslation('common.save'),
        addRecord: useTranslation('tableSocialNetwork.common.addRecord'),
        recordEdit: useTranslation('tableSocialNetwork.common.recordEdit'),
        addVirtiual: useTranslation('tableSocialNetwork.common.addVirtiual'),
        deleteForm: useTranslation('tableSocialNetwork.common.deleteForm'),
        infoError: useTranslation('tableSocialNetwork.common.infoError'),
        infoErrorAdd: useTranslation('tableSocialNetwork.common.infoErrorAdd'),
        addSocialNetwork: useTranslation('tableSocialNetwork.common.addSocialNetwork'),
        duplicate: useTranslation('tableSocialNetwork.common.duplicate'),
    };

    useEffect(() => {
        isShowDialog && setRowEditForm(rowEdit);
    }, [isShowDialog]);

    useEffect(() => {
        getSocUser()
            .then(
                ({ content }) => setSocialNetworkUserList([
                    {
                        id: NEW_ID_SOCIAL_NETWORK_USER,
                        name: translations.addVirtiual,
                    }, ...content,
                ])
            );
        getSources()
            .then(item => setSourceList([{ id: NEW_ID_SOURCE, name: translations.addSocialNetwork }, ...item]));
        getSales()
            .then(({ content }) => setSalesList(content));
        getNetworkCoordinator()
            .then(({ content }) => setSalesAssistantList(content));
    }, []);

    const updateUser = () => {
        setIsLoadingForm(true);
        if (rowEditForm && rowEditForm.id) {
            updateContact({
                idContact: rowEditForm.id,
                assistantId: pathOr(null, ['salesAssistant', 'id'], rowEditForm),
                saleId: pathOr(null, ['sales', 'id'], rowEditForm),
                socUserId: pathOr(null, ['socialNetworkUser', 'id'], rowEditForm),
                socUserName: pathOr(null, ['socialNetworkUser', 'name'], rowEditForm),
                sourceId: pathOr(null, ['source', 'id'], rowEditForm),
                sourceName: pathOr(null, ['source', 'name'], rowEditForm),
            }).then(() => tableReload())
                .catch(() => Notification.showMessage({
                    message: translations.infoError,
                }))
                .finally(() => {
                    closeDialog(false);
                    setIsLoadingForm(false);
                });
        }
    };

    const addNewUser = async () => {
        setIsLoadingForm(true);
        try {
            await addContact({
                assistantId: pathOr(null, ['salesAssistant', 'id'], rowEditForm),
                saleId: pathOr(null, ['sales', 'id'], rowEditForm),
                socUserId: pathOr(null, ['socialNetworkUser', 'id'], rowEditForm),
                socUserName: pathOr(null, ['socialNetworkUser', 'name'], rowEditForm),
                sourceId: pathOr(null, ['source', 'id'], rowEditForm),
                sourceName: pathOr(null, ['source', 'name'], rowEditForm),
            });

            tableReload();
        } catch {
            Notification.showMessage({ message: `${translations.duplicate}.` });
        }

        closeDialog(false);
        setIsLoadingForm(false);
    };

    const newSocNetUser = item => {
        if (item && item.id === NEW_ID_SOCIAL_NETWORK_USER) {
            setModalConfig({ placeholder: translations.addVirtiual, onAdd: createNewSocNetUser });
            setShowNewInfo(true);
        } else {
            setRowEditForm({ ...rowEditForm, socialNetworkUser: item });
        }
    };

    const newSource = item => {
        if (item && item.id === NEW_ID_SOURCE) {
            setModalConfig({ placeholder: translations.addSocialNetwork, onAdd: createSource });
            setShowNewInfo(true);
        } else {
            setRowEditForm({ ...rowEditForm, source: item });
        }
    };

    const createNewSocNetUser = async info => {
        try {
            const { detail } = await createNewSocialNetworkUser(info);
            const { content } = await getSocUser();

            setNewInfo('');
            setRowEditForm({ ...rowEditForm, socialNetworkUser: detail });
            setSocialNetworkUserList([{ id: NEW_ID_SOCIAL_NETWORK_USER, name: translations.addVirtiual }, ...content]);
            setShowNewInfo(false);
            setErrorMessage(null);
        } catch {
            setErrorMessage(translations.duplicate);
        }
    };

    const createSource = async info => {
        try {
            const detail = await createNewSocialNetwork(info);
            const content = await getSources();

            setNewInfo('');
            setRowEditForm({ ...rowEditForm, source: detail });
            setSourceList([{ id: NEW_ID_SOURCE, name: translations.addSocialNetwork }, ...content]);
            setShowNewInfo(false);
            setErrorMessage(null);
        } catch {
            setErrorMessage(translations.duplicate);
        }
    };

    const cancelForm = () => {
        closeDialog(false);
        setRowEditForm(null);
    };

    return (
        <Dialog
            open={isShowDialog}
            onClose={() => closeDialog(false)}
            classes={{ paper: classes.dialogContent }}
        >
            {isLoadingForm && <CRMLoader /> }
            <DialogTitle>
                <Grid
                    container
                    justify='space-between'
                >
                    {isEditMode ? translations.recordEdit : translations.addRecord}
                    <IconButton
                        className={classes.exitButton}
                        onClick={() => closeDialog(false)}
                    >
                        <CRMIcon IconComponent={Close} />
                    </IconButton>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Grid
                    item
                    className={classes.field}
                >
                    <CRMAutocompleteSelect
                        options={socialNetworkUserList}
                        label={translations.virtualProfile}
                        value={pathOr(null, ['socialNetworkUser'], rowEditForm)}
                        controlled
                        onChange={newSocNetUser}
                        getOptionLabel={({ name }: User) => name}
                        getOptionValue={({ id }: User) => id}
                        menuPosition='fixed'
                    />
                </Grid>
                <Grid
                    item
                    className={classes.field}
                >
                    <CRMAutocompleteSelect
                        options={sourceList}
                        label={translations.socialNetwork}
                        value={pathOr(null, ['source'], rowEditForm)}
                        controlled
                        onChange={newSource}
                        getOptionLabel={({ name }: User) => name}
                        getOptionValue={({ id }: User) => id}
                        menuPosition='fixed'
                    />
                </Grid>
                <Grid
                    item
                    className={classes.field}
                >
                    <CRMAutocompleteSelect
                        options={salesList}
                        label={translations.sales}
                        value={pathOr(null, ['sales'], rowEditForm)}
                        onChange={item => setRowEditForm({ ...rowEditForm, sales: item })}
                        getOptionLabel={({ firstName, lastName }: User) => `${firstName} ${lastName}`}
                        getOptionValue={({ id }: User) => id}
                        menuPosition='fixed'
                    />
                </Grid>
                <Grid
                    item
                    className={classes.field}
                >
                    <CRMAutocompleteSelect
                        options={salesAssistantList}
                        label={translations.networkCoordinator}
                        value={pathOr(null, ['salesAssistant'], rowEditForm)}
                        onChange={item => setRowEditForm({ ...rowEditForm, salesAssistant: item })}
                        getOptionLabel={({ firstName, lastName }: User) => `${firstName} ${lastName}`}
                        getOptionValue={({ id }: User) => id}
                        menuPosition='fixed'
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid
                    container
                    justify='center'
                >
                    <Grid item className={classes.dialogActions}>
                        <CRMButton
                            onClick={cancelForm}
                            size='large'
                        >
                            {translations.cancel}
                        </CRMButton>
                    </Grid>
                    <Grid item className={classes.dialogActions}>
                        <CRMButton
                            primary
                            size='large'
                            onClick={isEditMode ? updateUser : addNewUser}
                        >
                            {translations.save}
                        </CRMButton>
                    </Grid>
                </Grid>
            </DialogActions>
            <AddNewInfoUser
                openNewInfo={showNewInfo}
                closeNewInfo={setShowNewInfo}
                config={modalConfig}
                newInfo={newInfo}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
            />
        </Dialog>
    );
};

export default withStyles(styles)(addOrEditForm);
