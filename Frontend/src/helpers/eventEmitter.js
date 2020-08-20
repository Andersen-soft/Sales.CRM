
import { pathOr } from 'ramda';

export default {
    events: {},

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = { listeners: [] };
        }
        this.events[event].listeners.push(listener);
    },

    off(event) {
        delete this.events[event];
    },

    emit(name, ...payload) {
        const listeners = pathOr([], ['listeners'], this.events[name]);

        // eslint-disable-next-line no-restricted-syntax
        for (const listener of listeners) {
            listener.apply(this, payload);
        }
    },
};
