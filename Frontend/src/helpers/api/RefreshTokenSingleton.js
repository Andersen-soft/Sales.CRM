let instance = null;

class RefreshTokenSingleton {
    constructor() {
        if (instance) {
            return instance;
        }

        this.isIntervalStarted = false;
        this.interval = null;

        instance = this;
        return new RefreshTokenSingleton();
    }

    getIntervalStarted() {
        return this.isIntervalStarted;
    }

    setIntervalStarted() {
        this.isIntervalStarted = !this.isIntervalStarted;
    }

    getInterval() {
        return this.interval;
    }

    setInterval(interval) {
        this.interval = interval;
    }
}

export default new RefreshTokenSingleton();
