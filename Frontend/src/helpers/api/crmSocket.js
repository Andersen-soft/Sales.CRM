// @flow

import SockJS from 'sockjs-client';
import { isNil } from 'ramda';
import { Client } from '@stomp/stompjs';
import auth from 'crm-helpers/auth';
import EventEmitter from 'crm-helpers/eventEmitter';

export const SUBSCRIPTIONS_PAGE_KEYS = {
    Basis: 'Basis',
    Sale: 'Sale',
    Resume: 'Resume',
    ResumeRequestComment: 'resume_request',
    EstimationRequestComment: 'estimation_request',
};

const baseURL = process.env.API_URL || '';

type subscriptionType = {
    topick: string,
    cb: () => subscriptionType,
    unsubscribe: null | () => void,
};

type subscriptionsType = {
    [string]: Array<subscriptionType> | null,
};

class CRMSocketSingleton {
    socket: Object;

    subscriptions: subscriptionsType;

    socketWasDeactivated: boolean;

    constructor() {
        this.socket = new Client();
        this.subscriptions = {};
        this.socketWasDeactivated = false;

        this.socket.webSocketFactory = () => new SockJS(`${baseURL}/crm`);

        this.socket.beforeConnect = () => {
            this.socket.connectHeaders = { Authorization: auth.getAccessToken() };
        };

        this.socket.onConnect = () => this.onConnect();

        EventEmitter.on('refreshToken', () => {
            if (this.socket.connected) {
                this.unsubscribeAll();
                this.socket.deactivate();
                this.socketWasDeactivated = true;
            }
        });

        EventEmitter.on('refreshTokenSuссsess', () => {
            if (this.socketWasDeactivated) {
                this.socket.activate();
                this.socketWasDeactivated = false;
            }
        });
    }

    unsubscribeAll() {
        Object.keys(this.subscriptions)
            .forEach(subscriptionPageKey => {
                const pageSubscriptions = this.subscriptions[subscriptionPageKey];

                pageSubscriptions && pageSubscriptions.forEach(pageSubscription => {
                    pageSubscription.unsubscribe && pageSubscription.unsubscribe();
                    pageSubscription.unsubscribe = null;
                });
            });
    }

    activate() {
        const { socket } = this;

        !socket.connected
            ? !socket.active && socket.activate()
            : this.onConnect();
    }

    onConnect() {
        Object.keys(this.subscriptions)
            .forEach(subscriptionPageKey => {
                const pageSubscriptions = this.subscriptions[subscriptionPageKey];

                pageSubscriptions && pageSubscriptions.forEach(pageSubscription => {
                    const { topick, cb, unsubscribe } = pageSubscription;

                    if (!unsubscribe) {
                        const { unsubscribe: unsubscribeFunc } = this.socket.subscribe(topick, cb);

                        pageSubscription.unsubscribe = unsubscribeFunc;
                    }
                });
            });
    }

    deactivate(subscriptionPageKey: string) {
        const { socket } = this;

        if (socket.connected) {
            this.subscriptions[subscriptionPageKey] && this.subscriptions[subscriptionPageKey]
                .forEach(({ unsubscribe }: subscriptionType) => unsubscribe && unsubscribe());

            this.subscriptions[subscriptionPageKey] = null;

            Object.values(this.subscriptions).every(isNil) && socket.deactivate();
        }
    }

    subscribe(topick: string, cb: Function, subscriptionPageKey: string) {
        if (this.subscriptions[subscriptionPageKey]) {
            this.subscriptions[subscriptionPageKey].push({ topick, cb, unsubscribe: null });
        } else {
            this.subscriptions[subscriptionPageKey] = [{ topick, cb, unsubscribe: null }];
        }
    }
}

const crmSocket = new CRMSocketSingleton();

export default crmSocket;
