'use strict';

module.change_code = 1;
var _ = require('lodash');


var promptsObj = require('./prompts');
// var prompts = promptsObj.getPrompts();



// function applyTemplate(step, messageKey, action, cardType, cardNumber, zipCode, fromDate, toDate) {
//
//     return _.template(prompts[step][messageKey])({
//         action: action || '',
//         cardType: cardType || '',
//         cardNumber: cardNumber || '',
//         zipCode: zipCode || '',
//         fromDate: fromDate || '',
//         toDate: toDate || ''
//     });
// }

function logsession() {
    // console.log('Session Info: ', this.cardServicesSession);
}

/**
 * Define a function for BBT Card Services helper  object
 * @param cardServicesSession
 * @constructor
 */
function BbtCardServicesHelper(cardServicesSession) {

    this.cardServicesSession = cardServicesSession;

}

/**
 * Store the request
 * @param response
 * @param cardServicesSession
 * @returns {*}
 */
function storeActualIntent(response, cardServicesSession)  {

    cardServicesSession.lastResponse = response.verbiage;
    if (!_.isEmpty(cardServicesSession.action)) {
        cardServicesSession.lastAction = cardServicesSession.action;
    }
    cardServicesSession.lastStep = response.step;
    response.step = 0;
    cardServicesSession.step = response.step;
    response.verbiage = promptsObj.applyTemplate(response.step, 'launch');
    return response;

}

/**
 * Restore Actual Intent
 * @param cardServicesSession
 * @returns {{}}
 */
function restoreActualIntent(cardServicesSession)  {
    var response = {};

    cardServicesSession.step = cardServicesSession.lastStep || 0;
    cardServicesSession.action = cardServicesSession.lastAction || 'launch';

    response.step = cardServicesSession.step;
    response.verbiage = cardServicesSession.lastResponse ||  promptsObj.applyTemplate(
            cardServicesSession.step,
            'welcome',
            cardServicesSession.action
        );

    delete cardServicesSession.lastStep;
    delete cardServicesSession.lastResponse;
    delete cardServicesSession.lastAction;

    return response;
}

/**
 * Return prompts
 * @param step
 * @returns {*}
 */
BbtCardServicesHelper.prototype.getPrompts = function (step) {
    if (_.isNumber(step) && step <= promptsObj.getPrompts().length) {
        // Return specific prompt
        return promptsObj.getPrompts()[step];
    } else {
        // Return all prompts
        return promptsObj.getPrompts();
    }
};

/**
 * Return the Launch Prompt String
 * @returns {string}
 */
BbtCardServicesHelper.prototype.getLaunchPrompt = function (continueNext) {
    var response = {};
    response.step = 0;

    this.cardServicesSession.step = response.step;

    if (continueNext === undefined) {
        response.verbiage = promptsObj.applyTemplate(response.step, 'launch');
    } else {
        response.verbiage = promptsObj.applyTemplate(response.step, 'launchContinue');
    }
    return response;
};


/**
 * Authenticate the user using the pin
 * @param pin
 */
BbtCardServicesHelper.prototype.intentPinAuth = function(pin) {
    var response = {};
    response.step = 0;
    if (!_.isEmpty(pin) && /^[0-9]{4}$/.test(pin) && pin === '1872') {
        // Good Pin
        this.cardServicesSession.isAuth = true;
        response = restoreActualIntent(this.cardServicesSession);
    } else {
        // Bad pin
        response.verbiage = promptsObj.applyTemplate(response.step, 'invalidPin');
    }
    return response;
}

/**
 * Intent with Action, moving to Step 1
 * whether to block or cancel a credit or debit card
 * @param action
 */
BbtCardServicesHelper.prototype.intentWithAction = function (action, cardType) {

    // console.log('Action: ', action);
    // console.log('Card Type: ', cardType);
    var response = {};

    if (!_.isEmpty(action) && ['lost', 'stolen', 'find', 'block', 'unblock'].indexOf(action) != -1) {

        if (action === 'find') {
            action = 'missing';
        }
        if (!_.isEmpty(cardType) && ['credit', 'debit',].indexOf(cardType) != -1) {
            response.step = 2;
            this.cardServicesSession.cardType = cardType;
            response.verbiage = promptsObj.applyTemplate(response.step, 'askForCardNumber', action, cardType);
        } else {
            response.step = 1;
            response.verbiage = promptsObj.applyTemplate(response.step, 'askForCardType', action);
        }

        this.cardServicesSession.action = action;

    } else {
        // Re prompt the use for action
        response.step = 0; // Previous was 0
        response.verbiage = promptsObj.applyTemplate(response.step, 'launchReprompt', action);

    }

    this.cardServicesSession.step = response.step;

    // Check for Authentication
    if (!this.cardServicesSession.isAuth) {
        response = storeActualIntent(response, this.cardServicesSession);
    }

    // logsession.call(this);
    return response;
};


BbtCardServicesHelper.prototype.intentWithTravel = function (action) {
    var response = {};
    response.step = 1;
    this.cardServicesSession.action = action;
    response.verbiage = promptsObj.applyTemplate(response.step, 'askForTravelDates');
    this.cardServicesSession.step = response.step;

    // Check for Authentication
    if (!this.cardServicesSession.isAuth) {
        response = storeActualIntent(response, this.cardServicesSession);
    }

    return response;
};
/**
 * Intent with Travel
 * @param fromDate
 * @param toDate
 * @returns {{}}
 */
BbtCardServicesHelper.prototype.intentWithTravelDates = function (action, fromDate, toDate) {
    var response = {};

    this.cardServicesSession.action = action;

    if (!_.isEmpty(fromDate) && !_.isEmpty(toDate) && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(fromDate) && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(toDate)) {
        // Good
        response.step = 2;
        this.cardServicesSession.fromDate = fromDate;
        this.cardServicesSession.toDate = toDate;
        this.cardServicesSession.cardType = 'credit';
        response.verbiage = promptsObj.applyTemplate(response.step, 'askForCardNumberForTravel', this.cardServicesSession.action, this.cardServicesSession.cardType);
    } else {
        // bad
        response.step = 1;
        response.verbiage = promptsObj.applyTemplate(response.step, 'askForTravelDates');

    }

    this.cardServicesSession.step = response.step;

    // Check for Authentication
    if (!this.cardServicesSession.isAuth) {
        response = storeActualIntent(response, this.cardServicesSession);
    }

    return response;

};


/**
 * Intent with card type, moving to step 2
 * @param cardType
 * @returns {{}}
 */
BbtCardServicesHelper.prototype.intentWithCardType = function (cardType) {
    var response = {};

    if (!_.isEmpty(cardType) && ['credit', 'debit',].indexOf(cardType) != -1) {
        response.step = 2;
        this.cardServicesSession.cardType = cardType;
        response.verbiage = promptsObj.applyTemplate(response.step, 'askForCardNumber', this.cardServicesSession.action, this.cardServicesSession.cardType);

    } else {
        response.step = 1;
        response.verbiage = promptsObj.applyTemplate(response.step, 'askForCardType', this.cardServicesSession.action);
    }

    this.cardServicesSession.step = response.step;

    return response;
};

/**
 * Intent with Card Number, moving to Step 3
 * @param cardNumber
 * @returns {{}} response
 */
BbtCardServicesHelper.prototype.intentWithCardNumber = function (cardNumber) {
    var response = {};
    if (!_.isEmpty(cardNumber) && /^[0-9]{4}$/.test(cardNumber)) {
        this.cardServicesSession.cardNumber = cardNumber;
        response.step = 3;
        response.verbiage = promptsObj.applyTemplate(response.step, 'askForZipCode', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber);
    } else {
        response.step = 2;
        response.verbiage = promptsObj.applyTemplate(response.step, 'askForCardNumber', this.cardServicesSession.action, this.cardServicesSession.cardType);

    }
    this.cardServicesSession.step = response.step;

    return response;
};

/**
 * Intent with Zip Code
 * @param zipCode
 * @returns {{}}
 */
BbtCardServicesHelper.prototype.intentWithZipCode = function (zipCode) {
    var response = {};
    if (!_.isEmpty(zipCode) && /^[0-9]{5}$/.test(zipCode)) {

        this.cardServicesSession.zipCode = zipCode;

        if (zipCode === '27604') {

            response.step = 4;
            if (['lost', 'stolen', 'missing'].indexOf(this.cardServicesSession.action) != -1) {
                // Lost, Stolen and Missing (find)
                response.verbiage = promptsObj.applyTemplate(response.step, 'confirmReissue', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);
            } else if (['block', 'unblock'].indexOf(this.cardServicesSession.action) != -1) {
                // Block and Unblock
                response.verbiage = promptsObj.applyTemplate(response.step, 'confirmGeneral', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);
            } else {
                // Travel
                response.verbiage = promptsObj.applyTemplate(response.step, 'confirmTravel', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode, this.cardServicesSession.fromDate, this.cardServicesSession.toDate);
            }

        } else {
            // Invalid Zip Code
            response.step = 3;
            response.verbiage = promptsObj.applyTemplate(response.step, 'invalidZipCodeAskAgain', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);

        }

    } else {

        response.step = 3;
        response.verbiage = promptsObj.applyTemplate(response.step, 'askForZipCode', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber);
    }
    this.cardServicesSession.step = response.step;

    return response;
};

/**
 * Confirm the transaction
 */
BbtCardServicesHelper.prototype.intentConfirmed = function () {
    var response = {};
    response.step = 5;
    if (['lost', 'stolen', 'missing'].indexOf(this.cardServicesSession.action) != -1) {
        // missing card
        response.verbiage = promptsObj.applyTemplate(response.step, 'reissueConfirmation', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);
    } else if (['block', 'unblock'].indexOf(this.cardServicesSession.action) != -1) {
        // block or unblock card
        response.verbiage = promptsObj.applyTemplate(response.step, 'generalConfirmation', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);
    } else {
        response.verbiage = promptsObj.applyTemplate(response.step, 'travelConfirmation', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode, this.cardServicesSession.fromDate, this.cardServicesSession.toDate);

    }
    this.cardServicesSession.step = response.step;
    this.cardServicesSession.action = 'exit'

    return response;
};

BbtCardServicesHelper.prototype.intentCancel = function () {
    var response = {};

    if(!_.isEmpty(this.cardServicesSession.action) && this.cardServicesSession.action !== 'exit' ) {
        this.cardServicesSession.step = response.step = 5;
        response.verbiage = promptsObj.applyTemplate(response.step , 'bbtpce', this.cardServicesSession.action);
        this.cardServicesSession.action = 'exit'
    } else {
        this.cardServicesSession.step = response.step = 6;
        response.verbiage = promptsObj.applyTemplate(response.step , 'signOff', this.cardServicesSession.action);
        this.cardServicesSession.action = ''
    }
    return response;
};

/**
 * Sign off
 * @returns {string}
 */
BbtCardServicesHelper.prototype.getSignOff = function() {
    var response = {};
    response.step = 6;
    this.cardServicesSession.step = response.step;
    response.verbiage = promptsObj.applyTemplate(response.step, 'signOff');
    // this.cardServicesSession.launch = 'signOff';

    // logsession.call(this);
    return response;
};



/**
 * get Card Services Session Info Object.
 * @returns {*}
 */
BbtCardServicesHelper.prototype.getCardServicesSession = function () {
    return this.cardServicesSession
};

/**
 * get Card Services Session Info Object.
 * @returns {*}
 */
BbtCardServicesHelper.prototype.setCardServicesSession = function (cardServicesSession) {
    this.cardServicesSession = cardServicesSession;
};



module.exports = BbtCardServicesHelper;