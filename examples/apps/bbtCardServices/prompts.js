// 'use strict';

var _ = require('lodash');

function allPrompts() {

    return [
        // Step 0 responses
        {
            // launch: 'Welcome to b b and t\'s credit and debit card services. What would you like to do today?',
            launch: 'Welcome to b b and t card services. Please be aware, that sensitive account information may be spoken while using this service, and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.',

            // launchReprompt: 'How would like to proceed? Here are few samples, I would like to unblock my credit card; my debit card was stolen; or I\'ll be travelling out of the country',

            launchReprompt: 'Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.',

            launchContinue: 'What else would you like to do today? To block a card, say, I would like to block my card, or for lost or stolen card say, I have lost my credit card, and for international travel say, I will be travelling out of the country.',

            welcome: 'What would you like to do today. To block a card, say, I would like to block my card, or for lost or stolen card say, I have lost my credit card, and for international travel say, I will be travelling out of the country.',

            invalidPin: 'The given pin number does not match our records. Please say your four digit pin to proceed.'
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

            travelConfirmation: 'OK, I\'ve notified bb and t that you\'ll be travelling internationally on the given dates for your card ending in <say-as interpret-as="digits">${cardNumber}</say-as>. Is there anything else I can do for you today?',
            bbtpce: 'Is there anything else, I can help you with?',

        },

        // Step 6 - Sign off
        {
            signOff: 'Thank you for banking with b b and t. Have a nice day!',
            cancel: 'Your request has been cancelled. Thank you for banking with B B and T. Have a nice day!'
        }

    ];
}


var Prompts = {

    applyTemplate: function (step, messageKey, action, cardType, cardNumber, zipCode, fromDate, toDate) {
        return _.template(this.getPrompts()[step][messageKey])({
            action: action || '',
            cardType: cardType || '',
            cardNumber: cardNumber || '',
            zipCode: zipCode || '',
            fromDate: fromDate || '',
            toDate: toDate || ''
        });
    },

    applyTemplateOnObj: function (step, messageKey, cardServicesSession) {

        return this.applyTemplate(
            step,
            messageKey,
            cardServicesSession.action,
            cardServicesSession.cardType,
            cardServicesSession.cardNumber,
            cardServicesSession.zipCode,
            cardServicesSession.fromDate,
            cardServicesSession.toDate
        );
    }

};


Prompts.getPrompts = allPrompts;

module.exports = Prompts;




