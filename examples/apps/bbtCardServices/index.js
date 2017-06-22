'use strict';

module.change_code = 1;

var alexa = require('alexa-app');

var _ = require('lodash');

var bbtCardServicesApp = new alexa.app('bbtCardServices');
var BbtCardServicesHelper = require('./bbtCardServicesHelper.js');

var SESSION_KEY = "cardServiceSessionKey";

/**
 * Get Session Information
 * @param request
 * @returns {*|{new, sessionId, attributes, application, user}}
 */
var getCardServicesSession = function (request) {

    var session = request.getSession();

    var cardServicesSession = session.get(SESSION_KEY);

    if (_.isEmpty(cardServicesSession)) {
        cardServicesSession = {};
        session.set(SESSION_KEY, cardServicesSession);
    }

    return cardServicesSession;

};

/**
 * Set the updated Card Services Info back into the session
 * @param request
 * @param cardServicesSession
 */
var setCardServicesSession = function (request, cardServicesSession) {
    var session = request.getSession();
    session.set(SESSION_KEY, cardServicesSession);
};

var getbbtCardServicesHelper = function (request) {
    var bbtCardServicesHelper;
    if (_.isEmpty(request)) {
        bbtCardServicesHelper = new BbtCardServicesHelper();
    } else {
        bbtCardServicesHelper = new BbtCardServicesHelper(getCardServicesSession(request));
    }
    return bbtCardServicesHelper;
};

/**
 * Set Card Number in the Session
 * @param request
 * @param cardNumber
 */
var setCardNumber = function (request, cardNumber) {
    var cardServicesSession = getCardServicesSession(request);
    cardServicesSession.cardNumber = cardNumber;
    setCardServicesSession(request, cardServicesSession);
};

/**
 * Set Card Type in the Session
 * @param request
 * @param cardType
 */
var setCardCardType = function (request, cardType) {
    var sessionInfo = getCardServicesSession(SESSION_KEY);
    sessionInfo.cardType = cardType;
    setCardServicesSession(request, sessionInfo);
};

/**
 * Set Process Step in the Session
 * @param request
 * @param step
 */
var setStep = function (request, step) {
    var sessionInfo = getCardServicesSession(request);
    sessionInfo.step = step;
    setCardServicesSession(request, sessionInfo);
};
// var incrementStep = function(request) {
//     var sessionInfo = getSessionInfo(SESSION_INFO);
//     var step = sessionInfo.step;
//     if (step === undefined) {
//         sessionInfo.step = 0;
//     } else {
//         sessionInfo.step++
//     }
//     var session = request.session();
//     session.set(SESSION_INFO, sessionInfo);
// }

/**
 * Get Current Step
 * @param request
 * @returns {number}
 */
var getCurrentStep = function (request) {
    var sessionInfo = getCardServicesSession(request);
    if (_.isEmpty(sessionInfo.step)) {
        sessionInfo.step = 0;
    }
    return sessionInfo.step;
};

/**
 * Launch: Start BB&T Card Services
 */
bbtCardServicesApp.launch(function (request, response) {
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);
    var prompt =  bbtCardServicesHelper.getLaunchPrompt();
    response.say(prompt).shouldEndSession(false);
});

bbtCardServicesApp.intent('intentLostOrStolen', {
    'slots': {
        'action': 'ACTION',
        'cardType': 'CARD_TYPE'
    },
    'utterances': [
        'I\'ve have {-|action} my {-|cardType} card',
        'My {-|cardType} was {-|action}',
        'I can\'t {-|action} my {-|cardType} card'
    ]
} ,function(request, response) {
    console.log('[intentLostOrStolen]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);


    var action = request.slot('action');
    console.log('[intentLostOrStolen] - action: ', action);

    var cardType = request.slot('cardType');
    console.log('[intentLostOrStolen] - cardType: ', cardType);

    // Action default to lost when the card is lost or stolen
    var respobj = bbtCardServicesHelper.intentWithAction(action, cardType);

    console.log('[intentLostOrStolen] - response: ', respobj.verbiage);

    // Update Session Information
    setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());

    // Return true if Synchronous call if not return false
    response.say(respobj.verbiage).shouldEndSession(false).send();
    return true;
});

/**
 * Intent: Action whether to block or cancel a credit or debit card
 */
bbtCardServicesApp.intent('intentBlock', {
    'slots': {
        'cardType': 'CARD_TYPE'
    },
    'utterances': [
        '{I would like to} block my {-|cardType} card'
    ]
}, function(request, response) {
    console.log('[intentBlock]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);


    var cardType = request.slot('cardType');
    console.log('[intentBlock] - cardType: ', cardType);

    var respobj = bbtCardServicesHelper.intentWithAction('block', cardType);
    console.log('[intentBlock] - response: ', respobj.verbiage);

    // Update Session Information
    setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());

    // Return true if Synchronous call if not return false
    response.say(respobj.verbiage).shouldEndSession(false).send();
    return true;
});

/**
 * Intent: Action whether to block or cancel a credit or debit card
 */
bbtCardServicesApp.intent('intentUnblock', {
    'slots': {
        'cardType': 'CARD_TYPE'
    },
    'utterances': [
        '{I would like to} unblock my {-|cardType} card'
    ]
}, function(request, response) {
    console.log('[intentUnblock]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);

    var cardType = request.slot('cardType');
    console.log('[intentUnblock] - cardType: ', cardType);

    var respobj = bbtCardServicesHelper.intentWithAction('unblock', cardType);
    console.log('[intentUnblock] - response: ', respobj.verbiage);

    // Update Session Information
    setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());

    // Return true if Synchronous call if not return false
    response.say(respobj.verbiage).shouldEndSession(false).send();
    return true;
});

/**
 * Intent: Action whether to block or cancel a credit or debit card
 */
bbtCardServicesApp.intent('intentTravel', {
    'slots': {

    },
    'utterances': [
        'I\'m going out of the country',
        'I\'ll be travelling out of the country',
        'I\'m going to Europe',
        'I\'m going to Australia',
    ]
}, function(request, response) {
    console.log('[intentTravel]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);


    var respobj = bbtCardServicesHelper.intentWithTravel('travel');
    console.log('[intentTravel] - response: ', respobj.verbiage);

    // Update Session Information
    setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());

    // Return true if Synchronous call if not return false
    response.say(respobj.verbiage).shouldEndSession(false).send();
    return true;
});

/**
 * Intent: Action whether to block or cancel a credit or debit card
 */
bbtCardServicesApp.intent('intentTravelDates', {
    'slots': {
        'fromDate': 'AMAZON.DATE',
        'toDate': 'AMAZON.DATE'
    },
    'utterances': [
        '{|I will be travelling} {|from} {-|fromDate} {|to|and will be back on} {-|toDate}'
    ]
}, function(request, response) {
    console.log('[intentForTravelDates]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);

    var fromDate = request.slot('fromDate');
    console.log('[intentForTravelDates] - fromDate: ', fromDate);
    var toDate = request.slot('toDate');
    console.log('[intentForTravelDates] - toDate: ', toDate);

    var respobj = bbtCardServicesHelper.intentWithTravelDates(fromDate, toDate);
    console.log('[intentForTravelDates] - response: ', respobj.verbiage);

    // Update Session Information
    setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());

    // Return true if Synchronous call if not return false
    response.say(respobj.verbiage).shouldEndSession(false).send();
    return true;
});

/**
 * Intent: Ask for Card Type
 */
bbtCardServicesApp.intent('intentWithCardType', {
    'slots': {
        'cardType': 'CARD_TYPE'
    },
    'utterances': [
        '{-|cardType} {|card}'
    ]
}, function (request, response) {
    console.log('[intentWithCardType]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);


    var cardType = request.slot('cardType');
    console.log('[intentWithCardType] - cardType: ', cardType);

    var respobj = bbtCardServicesHelper.intentWithCardType(cardType);
    console.log('[intentWithCardType] - response: ', respobj.verbiage);

    // Update Session Information
    setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());

    // Return true if Synchronous call if not return false
    response.say(respobj.verbiage).shouldEndSession(false).send();
    return true;
});

/**
 * Intent: Function for Blocking a Card
 */
bbtCardServicesApp.intent('intentWithCardNumberOrZipCode', {
    'slots': {
        'numberSlot': 'AMAZON.NUMBER'
    },
    'utterances': [
        '{-|numberSlot}'
    ]
}, function (request, response) {
    console.log('[intentWithCardNumberOrZipCode]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);
    var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();

    var numberSlot = request.slot('numberSlot');
    console.log('[intentWithCardNumberOrZipCode] - numberSlot: ', numberSlot);

    var respobj;
    if (cardServicesSession.step === 2) {
        respobj = bbtCardServicesHelper.intentWithCardNumber(numberSlot);
    } else {
        respobj = bbtCardServicesHelper.intentWithZipCode(numberSlot);
    }

    console.log('[intentWithCardNumber] - response: ', respobj.verbiage);

    // Update Session Information
    setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());

    // Return true if Synchronous call if not return false
    response.say(respobj.verbiage).shouldEndSession(false).send();

    return true;
});

// /**
//  * Intent: Function for Blocking a Card
//  */
// bbtCardServicesApp.intent('intentWithZipCode', {
//     'slots': {
//         'zipCode': 'ZIP_CODE'
//     },
//     'utterances': [
//         '{|it\'s} {-|zipCode}'
//     ]
// }, function (request, response) {
//     console.log('[intentWithZipCode');
//     var bbtCardServicesHelper = getbbtCardServicesHelper(request);
//
//     var zipCode = request.slot('zipCode');
//     console.log('[intentWithZipCode] - zipCode: ', zipCode);
//
//     var respobj = bbtCardServicesHelper.intentWithZipCode(zipCode);
//     console.log('[intentWithZipCode] - response: ', respobj.verbiage);
//
//     setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());
//
//     // Return true if Synchronous call if not return false
//     // Update Session Information
//     response.say(respobj.verbiage).shouldEndSession(false).send();
//     return true;
// });

/**
 * Intent: Default Amazon YES intent function for confirming before blocking a card
 */
bbtCardServicesApp.intent('AMAZON.YesIntent', {}, function (request, response) {
    console.log('[AMAZON.YesIntent]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);
    var respobj = bbtCardServicesHelper.intentConfirmed();
    console.log('[AMAZON.YesIntent] - response: ', respobj.verbiage);
    // Update Session Information
    setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());
    // Return true if Synchronous call if not return false
    response.say(respobj.verbiage).shouldEndSession(true).send();
    return true;
});


/**
 * Intent: Overall default Amazon HELP Intent to ask for help anytime
 */
bbtCardServicesApp.intent('AMAZON.HelpIntent', {}, function (request, response) {
    console.log('[AMAZON.HelpIntent]');
    var help = 'Welcome to b b and t\'s Credit and Debit Card Services. For usage say, Block my card ending in the last four digits of the card number or ' +
        'You could also say stop or cancel to exit.';
    response.say(help).shouldEndSession(false);

});


/**
 * Intent: Default Amazon Cancel Intent to cancel the transaction anytime
 */
var cancelIntentFunction = function (request, response) {
    console.log('[AMAZON.CancelIntent/AMAZON.StopIntent]');
    response.say('Your transaction has been cancelled. Thank you for using bb and t card services. Goodbye!').shouldEndSession(true);
};


bbtCardServicesApp.intent('AMAZON.CancelIntent', {}, cancelIntentFunction);
bbtCardServicesApp.intent('AMAZON.StopIntent', {}, cancelIntentFunction);
bbtCardServicesApp.intent('AMAZON.NoIntent', {}, cancelIntentFunction);


module.exports = bbtCardServicesApp;
// exports.handler = bbtCardServicesApp.lambda();