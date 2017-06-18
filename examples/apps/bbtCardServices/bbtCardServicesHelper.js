'use strict';

module.change_code = 1;
var _ = require('lodash');

var prompts = {
    // launch: 'Welcome to b b and t\'s credit and debit Card Services. For usage say, Block my credit or debit card.',
    launch: 'Welcome to b b and t\'s credit and debit card services. For usage say, block my card or cancel my card.',

    askForAction: 'Would you like to block or cancel a card.',

    askForCardType: 'Would you like to block your credit or debit card.',

    askForCardNumber: 'What\'s the last four digit of the ${cardType} card.',

    askForZipCode: 'What\'s the zip code associated with the ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>.',

    invalidZipCode: 'Zip code doesn\'t match with the provided ${cardType} card.',

    confirm: 'Would you like to continue to ${action} your ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>. Say yes to confirm, or say no to cancel the transaction.',

    confirmation: 'Your request to ${action} your ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as> has been successfully completed. Thank you for using bb and t card services. Goodbye!'


// askForZipCode: 'What\'s the zip code associated with this card?'
//
//     cardNumberPresent: 'Do you want to block your ${cardType} card ending in <say-as interpret-as="digits">${cardNumber}</say-as>.'
};

/**
 * Define a function for BBT Card Services helper  object
 * @param cardServicesSession
 * @constructor
 */
function BbtCardServicesHelper(cardServicesSession) {

    this.cardServicesSession = cardServicesSession;

    this.currentStep = 0;

}

/**
 * get Card Services Session Info Object.
 * @returns {*}
 */
BbtCardServicesHelper.prototype.getCardServicesSession = function () {
    return this.cardServicesSession
};

/**
 * Return the Launch Prompt String
 * @returns {string}
 */
BbtCardServicesHelper.prototype.getLaunchPrompt = function () {
    return prompts.launch;
};

// BbtCardServicesHelper.prototype.blockCard = function (cardType, cardNumber, zipCode) {
//     var response = {};
//     if (_.isEmpty(cardType)) {
//         response.verbiage = prompts.askForCardType;
//         response.step = 1;
//     } else if (_.isEmpty(cardNumber)) {
//         response.verbiage = _.template(prompts.askForCardNumber)({
//             cardType: cardType
//         });
//         response.step = 2;
//     } else if (_.isEmpty(zipCode)) {
//         response.verbiage = _.template(prompts.askForZipCode)({
//             cardType: cardType,
//             cardNumber: cardNumber
//         });
//         response.step = 3;
//     } else {
//         // Verify if the data is accurate
//         if (zipCode === '27604') {
//             // continue
//             response.step = 4;
//         } else {
//             // re-prompt
//             response.verbiage = _.template(prompts.invalidZipCode)({
//                     cardType: cardType
//                 }) + _.template(prompts.askForZipCode)({
//                     cardType: cardType,
//                     cardNumber: cardNumber
//                 });
//
//             response.step = 3;
//         }
//     }
//
//
//     this.cardServicesSession.step = response.step;
//     return response;
// }

/**
 * Intent with Action whether to block or cancel a credit or debit card
 * @param action
 */
BbtCardServicesHelper.prototype.intentWithAction = function (action) {
    var response = {};
    if (_.isEmpty(action) || (action !== 'block' && action !== 'cancel')) {
        response.verbiage = prompts.askForAction;
        response.step = 1;
    } else {
        this.cardServicesSession.action = action;
        response.verbiage = prompts.askForCardType;
        response.step = 2;
    }
    this.cardServicesSession.step = response.step;
    return response;
};

/**
 * Intent with card type
 * @param cardType
 * @returns {{}}
 */
BbtCardServicesHelper.prototype.intentWithCardType = function (cardType) {
    var response = {};
    if (_.isEmpty(cardType) || (cardType !== 'credit' && cardType !== 'debit')) {
        response.verbiage = prompts.askForCardType;
        response.step = 2;
    } else {
        this.cardServicesSession.cardType = cardType;
        response.verbiage = _.template(prompts.askForCardNumber)({
            cardType: this.cardServicesSession.cardType
        });
        response.step = 3;
    }
    this.cardServicesSession.step = response.step;
    return response;
};

/**
 * Intent with Card Number
 * @param cardNumber
 * @returns {{}}
 */
BbtCardServicesHelper.prototype.intentWithCardNumber = function (cardNumber) {
    var response = {};
    if (_.isEmpty(cardNumber)) {
        response.verbiage = _.template(prompts.askForCardNumber)({
            cardType: this.cardServicesSession.cardType
        });
        response.step = 3;
    } else {
        this.cardServicesSession.cardNumber = cardNumber;
        response.verbiage = _.template(prompts.askForZipCode)({
            cardType: this.cardServicesSession.cardType,
            cardNumber: this.cardServicesSession.cardNumber
        });
        response.step = 4;
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
    if (_.isEmpty(zipCode)) {
        response.verbiage = _.template(prompts.askForZipCode)({
            cardType: this.cardServicesSession.cardType,
            cardNumber: this.cardServicesSession.cardNumber
        });
        response.step = 4;
    } else {
        if (zipCode === '27604') {
            // continue
            this.cardServicesSession.zipCode = zipCode;
            response.verbiage = _.template(prompts.confirm)({
                action: this.cardServicesSession.action,
                cardType: this.cardServicesSession.cardType,
                cardNumber: this.cardServicesSession.cardNumber
            });
            response.step = 5;
        } else {
            // re-prompt
            response.verbiage = _.template(prompts.invalidZipCode)({
                    cardType: this.cardServicesSession.cardType
                }) + ' ' + _.template(prompts.askForZipCode)({
                    cardType: this.cardServicesSession.cardType,
                    cardNumber: this.cardServicesSession.cardNumber
                });

            response.step = 4;
        }
    }
    this.cardServicesSession.step = response.step;
    return response;
};

/**
 * Confirm the transaction
 */
BbtCardServicesHelper.prototype.intentConfirmed = function () {
    var response = {};
    response.verbiage = _.template(prompts.confirmation)({
        action: this.cardServicesSession.action,
        cardType: this.cardServicesSession.cardType,
        cardNumber: this.cardServicesSession.cardNumber
    });
    response.step = 6;
    this.cardServicesSession.step = response.step;
    return response;
};
module.exports = BbtCardServicesHelper;