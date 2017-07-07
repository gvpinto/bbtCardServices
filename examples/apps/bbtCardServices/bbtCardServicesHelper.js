'use strict';

module.change_code = 1;
var _ = require('lodash');


var prompts = [
    // Step 0 responses
    {
        // launch: 'Welcome to b b and t\'s credit and debit card services. What would you like to do today?',
        launch: 'Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.',

        // launchReprompt: 'How would like to proceed? Here are few samples, I would like to unblock my credit card; my debit card was stolen; or I\'ll be travelling out of the country',

        launchReprompt: 'Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.',

        launchContinue: 'What else would you like to do today? To block a card, say, I would like to block my card, or for lost or stolen card say, I have lost my credit card, and for international travel say, I will be travelling out of the country.',

        welcome: 'What would you like to do today. To block a card, say, I would like to block my card, or for lost or stolen card say, I have lost my credit card, and for international travel say, I will be travelling out of the country.',

        invalidPin: 'The pin number you gave me does not match. Please say your four digit pin to proceed.'
    },

    // Step 1 responses
    {
        askForCardType: 'Is it a credit or debit card',
        askForTravelDates: 'What dates will you be travelling'
    },


    // Step 2 responses
    {
        askForCardNumber: 'What\'s the last four digit of the ${cardType} card',
        askForCardNumberForTravel: 'What\'s the last four digit of the ${cardType} card you would like to use internationally',
    },

    // Step 3 responses
    {
        askForZipCode: 'What\'s the Zip Code associated with the ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>',

        invalidZipCodeAskAgain: 'The Zip Code <say-as interpret-as="digits">${zipCode}</say-as> doesn\'t match with the given ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>. Please restate the Zip Code'
    },

    // Step 4 responses
    {
        confirmGeneral: 'Would you like to continue to ${action} your ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>, please say yes to confirm, or no to cancel the transaction',

        confirmReissue: 'Would you like a new card reissued in place of the ${action} ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>, please say yes to confirm, or no to cancel the transaction',

        confirmTravel: 'Would you like to go ahead and notify bb and t that you\'ll be travelling internationally from <say-as interpret-as="date" format="ymd">${fromDate}</say-as> to <say-as interpret-as="date" format="ymd">${toDate}</say-as> for you card ending in <say-as interpret-as="digits">${cardNumber}</say-as>'

    },

    // Step 5 responses
    {
        generalConfirmation: 'Your request to ${action} your ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as> has been successfully completed. Is there anything else I can do for you today?',

        reissueConfirmation: 'Your request to reissue your ${action} ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>. has been successfully completed. Is there anything else I can do for you today?',

        // travelConfirmation: 'OK, I\'ve notified bb and t that you\'ll be travelling internationally from <say-as interpret-as="date" format="ymd">${fromDate}</say-as> to <say-as interpret-as="date" format="ymd">${toDate}</say-as> for you card ending in <say-as interpret-as="digits">${cardNumber}</say-as>. Thank you for using bb and t card services. Goodbye!'

        travelConfirmation: 'OK, I\'ve notified bb and t that you\'ll be travelling internationally on the given dates for your card ending in <say-as interpret-as="digits">${cardNumber}</say-as>. Is there anything else I can do for you today?'

    },

    // Step 6 - Sign off
    {
        signOff: 'Thank you for banking with b b and t. Have a nice day!'
    }

];

function applyTemplate(step, messageKey, action, cardType, cardNumber, zipCode, fromDate, toDate) {

    return _.template(prompts[step][messageKey])({
        action: action || '',
        cardType: cardType || '',
        cardNumber: cardNumber || '',
        zipCode: zipCode || '',
        fromDate: fromDate || '',
        toDate: toDate || ''
    });
}

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
    response.verbiage = applyTemplate(response.step, 'launch');
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
    response.verbiage = cardServicesSession.lastResponse ||  applyTemplate(
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
    if (_.isNumber(step) && step <= prompts.length) {
        // Return specific prompt
        return prompts[step];
    } else {
        // Return all prompts
        return prompts;
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
        response.verbiage = prompts[response.step].launch
    } else {
        response.verbiage = prompts[response.step].launchContinue;
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
        response.verbiage = applyTemplate(response.step, 'invalidPin');
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
            response.verbiage = applyTemplate(response.step, 'askForCardNumber', action, cardType);
        } else {
            response.step = 1;
            response.verbiage = applyTemplate(response.step, 'askForCardType', action);
        }

        this.cardServicesSession.action = action;

    } else {
        // Re prompt the use for action
        response.step = 0; // Previous was 0
        response.verbiage = applyTemplate(response.step, 'launchReprompt', action);

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
    response.verbiage = applyTemplate(response.step, 'askForTravelDates');
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
        response.verbiage = applyTemplate(response.step, 'askForCardNumberForTravel', this.cardServicesSession.action, this.cardServicesSession.cardType);
    } else {
        // bad
        response.step = 1;
        response.verbiage = applyTemplate(response.step, 'askForTravelDates');

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
        response.verbiage = applyTemplate(response.step, 'askForCardNumber', this.cardServicesSession.action, this.cardServicesSession.cardType);

    } else {
        response.step = 1;
        response.verbiage = applyTemplate(response.step, 'askForCardType', this.cardServicesSession.action);
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
        response.verbiage = applyTemplate(response.step, 'askForZipCode', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber);
    } else {
        response.step = 2;
        response.verbiage = applyTemplate(response.step, 'askForCardNumber', this.cardServicesSession.action, this.cardServicesSession.cardType);

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
                response.verbiage = applyTemplate(response.step, 'confirmReissue', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);
            } else if (['block', 'unblock'].indexOf(this.cardServicesSession.action) != -1) {
                // Block and Unblock
                response.verbiage = applyTemplate(response.step, 'confirmGeneral', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);
            } else {
                // Travel
                response.verbiage = applyTemplate(response.step, 'confirmTravel', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode, this.cardServicesSession.fromDate, this.cardServicesSession.toDate);
            }

        } else {
            // Invalid Zip Code
            response.step = 3;
            response.verbiage = applyTemplate(response.step, 'invalidZipCodeAskAgain', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);

        }

    } else {

        response.step = 3;
        response.verbiage = applyTemplate(response.step, 'askForZipCode', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber);
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
        response.verbiage = applyTemplate(response.step, 'reissueConfirmation', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);
    } else if (['block', 'unblock'].indexOf(this.cardServicesSession.action) != -1) {
        // block or unblock card
        response.verbiage = applyTemplate(response.step, 'generalConfirmation', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);
    } else {
        response.verbiage = applyTemplate(response.step, 'travelConfirmation', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode, this.cardServicesSession.fromDate, this.cardServicesSession.toDate);

    }

    this.cardServicesSession.step = response.step;

    // logsession.call(this);
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
    response.verbiage = prompts[response.step].signOff;
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