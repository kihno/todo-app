export const pubsub = {
    pubsub: {},
    sub: function(subscription, fn) {
        this.pubsub[subscription] = this.pubsub[subscription] || [];
        this.pubsub[subscription].push(fn);
    },
    unsub: function(subscription, fn) {
        if (this.pubsub[subscription]) {
            for (var i = 0; i < this.pubsub[subscription].length; i++) {
            if (this.pubsub[subscription][i] === fn) {
                this.pubsub[subscription].splice(i, 1);
                break;
            }
            };
        }
    },
    pub: function (subscription, data) {
        if (this.pubsub[subscription]) {
            this.pubsub[subscription].forEach(function(fn) {
            fn(data);
            });
        }
    }
};