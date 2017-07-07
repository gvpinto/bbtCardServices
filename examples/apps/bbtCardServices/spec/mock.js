'use strict';

function Mock() {

};

Mock.prototype.getRequest = function () {

    return {
        session: {
            values: {},
            clear: function () {
                this.values = {};
            },
            set: function (key, value) {
                this.values[key] = value;
                return value;
            },
            get: function (key) {
                return this.values[key];
            }
        },

        getSession: function () {
            return this.session;
        },
        slot: function (key) {
            if (key === 'cardType') {
                return 'credit'
            } else {
                return null;
            }

        }
    };
};


Mock.prototype.getResponse = function () {
    return {
        text: undefined,
        isSessionEnded: false,
        sent: false,
        say: function (text) {
            this.text = text;
            return this;
        },
        shouldEndSession: function (isSessionEnded) {
            this.isSessionEnded = isSessionEnded;
            return this;
        },
        send: function () {
            this.sent = true;
            return this;
        }
    };
};

module.exports = new Mock();