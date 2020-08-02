// @flow

// Simple promise-like object with ability to unsubscribe

const infinityPromise = new Promise(() => {});

export interface ICancelable {
    +then: (success: Function, error?: Function) => Promise<*>,
    +catch: (error: Function) => Promise<*>,
    +cancel: () => void,
    +isCanceled: boolean,
    +promise: Promise<*>,
}

export default class Cancelable implements ICancelable {
    isCanceled: boolean;

    promise: Promise<*>;

    constructor(promise: Promise<*>) {
        this.isCanceled = false;
        this.promise = promise.then(value => {
            if (this.isCanceled) { return infinityPromise; }
            return value;
        }).catch(error => {
            if (this.isCanceled) { return infinityPromise; }
            throw error;
        });
    }

    cancel() {
        this.isCanceled = true;
    }

    then(success:Function, error:?Function) {
        return this.promise.then(success, error);
    }

    catch(error:Function) {
        return this.promise.catch(error);
    }
}


