// @flow

/*
 * Синглтон, который отвечает за
 * 1. Управление компонентом Notification
 * 2. Созданием дом-элемента, в который этот Notification будет вставить
 * 3. Открытие/закрытие уведомления
 * 4. Отвечает за то, что уведомление на странице может быть только 1 (синглтон)
 */

import React from 'react';
import ReactDOM from 'react-dom';
import type { Node } from 'react';
import Notification from './Notification';

type Params = {
    type?: 'success' | 'warning' | 'error' | 'info' | 'notification',
    message: string | Node,
    closeTimeout?: number,
    anchorOrigin?: {
        vertical: string,
        horizontal: string,
    },
    isTimerDisabled?: boolean,
    isHidenIcon?: boolean,
};

const DEFAULT_TIMEOUT = 3000;

class NotificationSingleton {
    el: ?HTMLElement = null;
    timeout: TimeoutID;
    timeoutDisabled: boolean = false;

    showMessage({
        message, type, anchorOrigin, closeTimeout, isTimerDisabled, isHidenIcon,
    }: Params): void {
        if (typeof document === 'undefined') {
            return;
        }

        this.closeMessage();

        // Lazy constructor
        if (!(this.el instanceof HTMLElement)) {
            this.el = document.createElement('div');
        }

        if (document.body instanceof HTMLElement) {
            document.body.appendChild(this.el);
        }

        if (this.el instanceof HTMLElement) {
            ReactDOM.render(
                <Notification
                    open
                    type={type}
                    message={message}
                    anchorOrigin={anchorOrigin}
                    handleClose={this.closeMessage}
                    isHidenIcon={isHidenIcon}
                />,
                this.el
            );

            if (!isTimerDisabled) {
                this.timeout = setTimeout(this.closeMessage, closeTimeout || DEFAULT_TIMEOUT);
            } else {
                this.timeoutDisabled = true;
            }
        }
    }

    closeMessage = (): void => {
        const { el } = this;

        if (el instanceof HTMLElement) {
            ReactDOM.unmountComponentAtNode(el);
            if (el.remove) {
                el.remove();
                // в IE нет поддерживается метод remove, по этому исспользуем его аналог
            } else if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }

        if (this.timeoutDisabled) {
            clearTimeout(this.timeout);
        }
    }
}

export default new NotificationSingleton();
