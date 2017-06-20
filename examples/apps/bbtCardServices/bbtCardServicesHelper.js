'use strict';

module.change_code = 1;
var _ = require('lodash');

var prompts = [
    // Step 0 responses
    {
        launch: 'Welcome to b b and t\'s credit and debit card services. For usage say, I would like to block my credit card, or I\'ve have lost my debit card',
        launchReprompt: 'How would like to proceed? Say, I would like to unblock my credit card, or my debit card was stolen'
    },

    // Step 1 responses
    {
        askForCardType: 'Is it a credit or debit card'
    },

    // Step 2 responses
    {
        askForCardNumber: 'What\'s the last four digit of the ${cardType} card'
    },

    // Step 3 responses
    {
        askForZipCode: 'What\'s the Zip Code associated with the ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>',

        invalidZipCodeAskAgain: 'The Zip Code <say-as interpret-as="digits">${zipCode}</say-as> doesn\'t match with the provided ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>. Please restate the Zip Code'
    },

    // Step 4 responses
    {
        confirmGeneral: 'Would you like to continue to ${action} your ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>. Please say yes to confirm, or no to cancel the transaction',

        confirmReissue: 'Would you like a new card reissued in place of the ${action} ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>. Please say yes to confirm, or no to cancel the transaction'

    },

    // Step 5 responses
    {
        generalConfirmation: 'Your request to ${action} your ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as> has been successfully completed. Thank you for using bb and t card services. Goodbye!',

        reissueConfirmation: 'Your request to reissue your ${action} ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>. has been successfully completed. Thank you for using bb and t card services. Goodbye!'
    }

];

function applyTemplate(step, messageKey, action, cardType, cardNumber, zipCode) {

    return _.template(prompts[step][messageKey])({
        action: action || '',
        cardType: cardType || '',
        cardNumber: cardNumber || '',
        zipCode: zipCode || ''
    });
}

/**
 * Return the Launch Prompt String
 * @returns {string}
 */
BbtCardServicesHelper.prototype.getLaunchPrompt = function () {
    this.cardServicesSession.step = 0;
    this.cardServicesSession.launch = 'launch';
    return prompts[0].launch;
};


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
        if (!_.isEmpty(cardType)) {
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
        response.step = 0;
        response.verbiage = applyTemplate(response.step, 'launchReprompt', action);
    }

    this.cardServicesSession.step = response.step;

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
                response.verbiage = applyTemplate(response.step, 'confirmReissue', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);
            } else {
                response.verbiage = applyTemplate(response.step, 'confirmGeneral', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);
            }

        } else {

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
    } else {
        // block or unblock card
        response.verbiage = applyTemplate(response.step, 'generalConfirmation', this.cardServicesSession.action, this.cardServicesSession.cardType, this.cardServicesSession.cardNumber, this.cardServicesSession.zipCode);
    }

    this.cardServicesSession.step = response.step;
    return response;
};

/**
 * Define a function for BBT Card Services helper  object
 * @param cardServicesSession
 * @constructor
 */
function BbtCardServicesHelper(cardServicesSession) {

    this.cardServicesSession = cardServicesSession;

}

/**
 * get Card Services Session Info Object.
 * @returns {*}
 */
BbtCardServicesHelper.prototype.getCardServicesSession = function () {
    return this.cardServicesSession
};
module.exports = BbtCardServicesHelper;