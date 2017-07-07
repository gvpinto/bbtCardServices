'use strict';

module.change_code = 1;

var alexa = require('alexa-app');

var _ = require('lodash');

var bbtCardServicesApp = new alexa.app('bbtCardServices');
var BbtCardServicesHelper = require('./bbtCardServicesHelper.js');

var SESSION_KEY = "cardServiceSessionKey";

var defaultCardServicesSession = function () {
    return {
        step: 0,
        isAuth: false,
        action: 'launch'
    };
};

/**
 * Get Session Information
 * @param request
 * @returns {*|{new, sessionId, attributes, application, user}}
 */
var getCardServicesSession = function (request) {

    var session = request.getSession();

    var cardServicesSession = session.get(SESSION_KEY);

    if (_.isEmpty(cardServicesSession)) {
        cardServicesSession = defaultCardServicesSession();
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
    console.log('[setCardServicesSession]');
    var session = request.getSession();
    if (_.isEmpty(cardServicesSession)) {
        cardServicesSession = defaultCardServicesSession();
    }
    console.log('[setCardServicesSession] - cardServicesSession: ', cardServicesSession);
    session.set(SESSION_KEY, cardServicesSession);
    return cardServicesSession;
};

/**
 * Clear Session
 * @param request
 */
var clearSession = function (request, keepAuth) {
    console.log('[clearSession]');
    var session = request.getSession();
    if (!_.isEmpty(session)) {
        session.clear();
        // Set a default card Services Session
        var cardServicesSession = setCardServicesSession(request);
        console.log('[clearSession] - keepAuth: ', keepAuth);
        if (keepAuth) {
            console.log('[clearSession] - setting the isAuth to true');
            cardServicesSession.isAuth = true;
        }
        console.log('[clearSession] - Session Cleared');
    } else {
        console.log('[clearSession] - No Session Exists');
    }
};

var getbbtCardServicesHelper = function (request) {
    var bbtCardServicesHelper;
    if (_.isEmpty(request)) {
        throw ('Request is Empty');
        // bbtCardServicesHelper = new BbtCardServicesHelper();
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
    var respObj =  bbtCardServicesHelper.getLaunchPrompt();
    // Update Session Information
    setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());
    response.say(respObj.verbiage).shouldEndSession(false);
});

// bbtCardServicesApp.intent('intentPinAuth', {
//     'slots': {
//         'action': 'ACTION',
//         'cardType': 'CARD_TYPE'
//     },
//     'utterances': [
//         'I\'ve have {-|action} my {-|cardType} card',
//         'My {-|cardType} was {-|action}',
//         'I can\'t {-|action} my {-|cardType} card'
//     ]
// } ,function(request, response) {
//     console.log('[intentPinAuth]');
//     var bbtCardServicesHelper = getbbtCardServicesHelper(request);
//
//
//     var action = request.slot('action');
//     console.log('[intentLostOrStolen] - action: ', action);
//
//     var cardType = request.slot('cardType');
//     console.log('[intentLostOrStolen] - cardType: ', cardType);
//
//     // Action default to lost when the card is lost or stolen
//     var respobj = bbtCardServicesHelper.intentPinAuth(action, cardType);
//
//     console.log('[intentLostOrStolen] - response: ', respobj.verbiage);
//
//     // Update Session Information
//     setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());
//
//     // Return true if Synchronous call if not return false
//     response.say(respobj.verbiage).shouldEndSession(false);
//     return true;
// });

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
    response.say(respobj.verbiage).shouldEndSession(false);
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
        '{|I would like|I\'ll like} {to} block my {-|cardType} card'
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
    response.say(respobj.verbiage).shouldEndSession(false);
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
        '{|I would like|I\'ll like} {to} unblock my {-|cardType} card'
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
    response.say(respobj.verbiage).shouldEndSession(false);
    return true;
});

/**
 * Intent: Action whether to block or cancel a credit or debit card
 */
bbtCardServicesApp.intent('intentTravel', {
    'slots': {
        'country': 'AMAZON.Country'
    },
    'utterances': [
        '{I\'m|I\'ll be} going out of the country',
        'I\'ll be travelling {out of the country|internationally}',
        '{I\'m|I\'ll be} going to {Europe|Australia|Asia}',
        '{I\'m|I\'ll be} going to {-|country}'
    ]
}, function(request, response) {
    console.log('[intentTravel]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);


    var respobj = bbtCardServicesHelper.intentWithTravel('travel');
    console.log('[intentTravel] - response: ', respobj.verbiage);

    // Update Session Information
    setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());

    // Return true if Synchronous call if not return false
    response.say(respobj.verbiage).shouldEndSession(false);
    return true;
});

/**
 * Intent: Action whether to block or cancel a credit or debit card
 */
bbtCardServicesApp.intent('intentTravelDates', {
    'slots': {
        'fromDate': 'AMAZON.DATE',
        'toDate': 'AMAZON.DATE',
        'country': 'AMAZON.Country'
    },
    'utterances': [
        '{I will be travelling} {out of the country|internationally} {from} {-|fromDate} {to|and will be back on} {-|toDate}',
        '{I\'m|I\'ll be} going out of the country {from} {-|fromDate} {to|and will be back on} {-|toDate}',
        '{I\'ll be travelling out of the country} {from} {-|fromDate} {to|and will be back on} {-|toDate}',
        '{I\'m|I\'ll be} going to {Europe|Australia|Asia} {from} {-|fromDate} {to|and will be back on} {-|toDate}',,
        '{I\'m|I\'ll be} going to {-|country} {from} {-|fromDate} {to|and will be back on} {-|toDate}',
        '{|from} {-|fromDate} {to|and will be back on} {-|toDate}'
    ]
}, function(request, response) {
    console.log('[intentTravelDates]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);

    var fromDate = request.slot('fromDate');
    console.log('[intentTravelDates] - fromDate: ', fromDate);
    var toDate = request.slot('toDate');
    console.log('[intentTravelDates] - toDate: ', toDate);

    var respobj = bbtCardServicesHelper.intentWithTravelDates('travel', fromDate, toDate);
    console.log('[intentTravelDates] - response: ', respobj.verbiage);

    // Update Session Information
    setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());

    // Return true if Synchronous call if not return false
    response.say(respobj.verbiage).shouldEndSession(false);
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
    response.say(respobj.verbiage).shouldEndSession(false);
    return true;
});

/**
 * Intent: Function for Blocking a Card
 */
bbtCardServicesApp.intent('intentWithCardNumberOrZipCodeOrPin', {
    'slots': {
        'numberSlot': 'AMAZON.NUMBER'
    },
    'utterances': [
        '{-|numberSlot}'
    ]
}, function (request, response) {
    console.log('[intentWithCardNumberOrZipCodeOrPin]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);
    var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();

    var numberSlot = request.slot('numberSlot');
    console.log('[intentWithCardNumberOrZipCodeOrPin] - numberSlot: ', numberSlot);

    var respobj;
    if (cardServicesSession.step === 0) {
        respobj = bbtCardServicesHelper.intentPinAuth(numberSlot);
    } else if (cardServicesSession.step === 2) {
        respobj = bbtCardServicesHelper.intentWithCardNumber(numberSlot);
    } else {
        respobj = bbtCardServicesHelper.intentWithZipCode(numberSlot);
    }

    console.log('[intentWithCardNumberOrZipCodeOrPin] - response: ', respobj.verbiage);

    // Update Session Information
    setCardServicesSession(request, bbtCardServicesHelper.getCardServicesSession());

    // Return true if Synchronous call if not return false
    response.say(respobj.verbiage).shouldEndSession(false);

    return true;
});


/**
 * Intent: Default Amazon YES intent function for confirming before blocking a card
 */
bbtCardServicesApp.intent('AMAZON.YesIntent', {}, function (request, response) {
    console.log('[AMAZON.YesIntent]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);
    var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
    var respobj;
    console.log('[AMAZON.YesIntent] - In Step: ', cardServicesSession.step);
    if (cardServicesSession.step === 4) {
        console.log('[AMAZON.YesIntent] - Intent Confirmed');
        respobj = bbtCardServicesHelper.intentConfirmed();
        console.log('[AMAZON.YesIntent] - response: ', respobj.verbiage);
        // response.say(respobj.verbiage).shouldEndSession(false);
    } else {
        console.log('[AMAZON.YesIntent] - Intent Launch Again');
        respobj = bbtCardServicesHelper.getLaunchPrompt('Y'); // Continue
        console.log('[AMAZON.YesIntent] - response: ', respobj.verbiage);
    }


    // Clear Session Information
    clearSession(request, true);
    response.say(respobj.verbiage).shouldEndSession(false);

    // Return true if Synchronous call if not return false
    return true;
});

bbtCardServicesApp.intent('AMAZON.NoIntent', {}, function (request, response) {

    console.log('[AMAZON.NoIntent]');
    var bbtCardServicesHelper = getbbtCardServicesHelper(request);
    var respObj = bbtCardServicesHelper.getSignOff();
    clearSession(request);
    response.say(respObj.verbiage).shouldEndSession(true);
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
    var respText = 'Your request has been cancelled. Thank you for banking with B B and T. Have a nice day!';
    console.log('[AMAZON.CancelIntent/AMAZON.StopIntent] - response: ', respText);
    clearSession(request);
    response.say(respText).shouldEndSession(true);
};


bbtCardServicesApp.intent('AMAZON.CancelIntent', {}, cancelIntentFunction);
bbtCardServicesApp.intent('AMAZON.StopIntent', {}, cancelIntentFunction);
// bbtCardServicesApp.intent('AMAZON.NoIntent', {}, cancelIntentFunction);


module.exports = bbtCardServicesApp;
// exports.handler = bbtCardServicesApp.lambda();