var _ = require('lodash');
var BbtCardServicesHelper = require('../bbtCardServicesHelper');


function applyTemplate(prompts, step, messageKey, cardServicesSession) {

    return _.template(prompts[step][messageKey])({
        action: cardServicesSession.action || '',
        cardType: cardServicesSession.cardType || '',
        cardNumber: cardServicesSession.cardNumber || '',
        zipCode: cardServicesSession.zipCode || '',
        fromDate: cardServicesSession.fromDate || '',
        toDate: cardServicesSession.toDate || ''
    });
}

describe("Test Card Services - With Authentication", function () {

    it('Test - Get Prompts with Step & without Step', function () {
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
        var prompt = bbtCardServicesHelper.getPrompts(0);
        expect(prompt.launch).toBeDefined();
        var prompts = bbtCardServicesHelper.getPrompts();
        expect(prompts.length).toBeGreaterThan(0);
    });

    it('Test  intentPinAuth - block credit card with invalid pin', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithAction('block', 'credit');
        expect(response.step).toEqual(0)
        expect(bbtCardServicesHelper.getPrompts(response.step).launch).toBeDefined();
        expect(response.verbiage).toBe(bbtCardServicesHelper.getPrompts(response.step).launch);

        // Authentication Intent
        response = bbtCardServicesHelper.intentPinAuth('2345');
        expect(bbtCardServicesHelper.getPrompts(response.step).invalidPin).toBeDefined();
        expect(response.verbiage).toBe(bbtCardServicesHelper.getPrompts(response.step).invalidPin);
        expect(response.step).toEqual(0);

    });

    it('Test  intentPinAuth - block credit card with valid pin 1872', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithAction('block', 'credit');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('block');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(response.step).toEqual(0);
        expect(bbtCardServicesHelper.getPrompts(response.step).launch).toBeDefined();
        expect(response.verbiage).toBe(bbtCardServicesHelper.getPrompts(response.step).launch);

        // Authentication Intent
        response = bbtCardServicesHelper.intentPinAuth('1872');
        expect(response.step).toEqual(2);
        expect(cardServicesSession.action).toBe('block');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(bbtCardServicesHelper.getPrompts(response.step).askForCardNumber).toBeDefined();
        expect(response.verbiage).toBe(applyTemplate(bbtCardServicesHelper.getPrompts(), response.step, 'askForCardNumber', cardServicesSession));

    });

    it('Test  intentPinAuth - unblock credit card with valid pin 1872', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithAction('unblock', 'credit');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('unblock');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(response.step).toEqual(0);
        expect(bbtCardServicesHelper.getPrompts(response.step).launch).toBeDefined();
        expect(response.verbiage).toBe(bbtCardServicesHelper.getPrompts(response.step).launch);

        // Authentication Intent
        response = bbtCardServicesHelper.intentPinAuth('1872');
        expect(response.step).toEqual(2);
        expect(cardServicesSession.action).toBe('unblock');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(bbtCardServicesHelper.getPrompts(response.step).askForCardNumber).toBeDefined();
        expect(response.verbiage).toBe(applyTemplate(bbtCardServicesHelper.getPrompts(), response.step, 'askForCardNumber', cardServicesSession));

    });

    it('Test  intentPinAuth - lost debit card with valid pin 1872', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithAction('lost', 'debit');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('lost');
        expect(cardServicesSession.cardType).toBe('debit');
        expect(response.step).toEqual(0);
        expect(bbtCardServicesHelper.getPrompts(response.step).launch).toBeDefined();
        expect(response.verbiage).toBe(bbtCardServicesHelper.getPrompts(response.step).launch);

        // Authentication Intent
        response = bbtCardServicesHelper.intentPinAuth('1872');
        expect(response.step).toEqual(2);
        expect(cardServicesSession.action).toBe('lost');
        expect(cardServicesSession.cardType).toBe('debit');
        expect(bbtCardServicesHelper.getPrompts(response.step).askForCardNumber).toBeDefined();
        expect(response.verbiage).toBe(applyTemplate(bbtCardServicesHelper.getPrompts(), response.step, 'askForCardNumber', cardServicesSession));

    });
















    // it("Test 1.1 - Step 0: Launch Intent or missing action or invalid action", function () {
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
    //     expect(bbtCardServicesHelper.getLaunchPrompt().verbiage).toEqual('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('launch');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual(undefined);
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardNumber).toEqual(undefined);
    //     expect(bbtCardServicesHelper.getCardServicesSession().zipCode).toEqual(undefined);
    // });
    //
    // it("Test 1.2 - Continue Session", function () {
    //
    //     // Valid for lost
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
    //     var response = bbtCardServicesHelper.getLaunchPrompt('Y');
    //     expect(response.verbiage).toEqual('What else would you like to do today? To block a card, say, I would like to block my card, or for lost or stolen card say, I have lost my credit card, and for international travel say, I will be travelling out of the country.');
    //     expect(response.step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('launch');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual(undefined);
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardNumber).toEqual(undefined);
    //     expect(bbtCardServicesHelper.getCardServicesSession().zipCode).toEqual(undefined);
    // });
    //
    //
    // it("Test 1 - Step 0: Launch Intent or missing action or invalid action", function () {
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
    //     expect(bbtCardServicesHelper.getLaunchPrompt().verbiage).toEqual('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('launch');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual(undefined);
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardNumber).toEqual(undefined);
    //     expect(bbtCardServicesHelper.getCardServicesSession().zipCode).toEqual(undefined);
    // });
    //
    // it("Test 2 - Step 0. Ask for Action Intent, empty or invalid action", function () {
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
    //     var response = bbtCardServicesHelper.intentWithAction();
    //     expect(response.verbiage).toBe('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(response.step).toBe(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('launch');
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithAction('something');
    //     expect(response.verbiage).toBe('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(response.step).toBe(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('launch');
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithAction('');
    //     expect(response.verbiage).toBe('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(response.step).toBe(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('launch');
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithAction(null);
    //     expect(response.verbiage).toBe('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(response.step).toBe(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('launch');
    //
    // });
    //
    //
    // it("Test 3 - Step 1. Ask for Action Intent, lost, stolen, block, unblock or find but empty card type", function () {
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithAction('lost');
    //     expect(response.verbiage).toEqual('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(response.step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('lost');
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithAction('stolen');
    //     expect(response.verbiage).toEqual('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(response.step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('stolen');
    //
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithAction('find');
    //     expect(response.verbiage).toEqual('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(response.step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('missing');
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithAction('block');
    //     expect(response.verbiage).toEqual('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(response.step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithAction('unblock');
    //     expect(response.verbiage).toEqual('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(response.step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('unblock');
    //
    // });
    //
    // it("Test 4 - Step 2. Ask for Action Intent, lost, stolen or find but valid card type", function () {
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithAction('lost', 'credit');
    //     expect(response.verbiage).toEqual('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(response.step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('lost');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithAction('stolen', 'debit');
    //     expect(response.verbiage).toEqual('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(response.step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('stolen');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('debit');
    //
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithAction('find', 'credit');
    //     expect(response.verbiage).toEqual('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
    //     expect(response.step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('missing');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    //
    // });
    //
    // it("Test 4.1 - Step 2. Ask for Travel Intent", function () {
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithTravel('travel');
    //     expect(response.verbiage).toEqual('What dates will you be travelling');
    //     expect(response.step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('travel');
    //
    // });
    //
    // it("Test 4.2 - Step 2. Ask for Travel Dates Intent - Valid Dates", function () {
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({cardType: 'credit'});
    //     var response = bbtCardServicesHelper.intentWithTravelDates('travel', '2017-09-01', '2017-10-15');
    //     expect(response.verbiage).toEqual('What\'s the last four digit of the credit card you would like to use internationally');
    //     expect(response.step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('travel');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //     expect(bbtCardServicesHelper.getCardServicesSession().fromDate).toEqual('2017-09-01');
    //     expect(bbtCardServicesHelper.getCardServicesSession().toDate).toEqual('2017-10-15');
    //
    // });
    //
    // it("Test 4.3 - Step 2. Ask for Travel Dates Intent - Invalid Dates", function () {
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithTravelDates(undefined, '2017-10-15');
    //     expect(response.verbiage).toEqual('What dates will you be travelling');
    //     expect(response.step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual(undefined);
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' });
    //     var response = bbtCardServicesHelper.intentWithTravelDates(undefined, undefined);
    //     expect(response.verbiage).toEqual('What dates will you be travelling');
    //     expect(response.step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual(undefined);
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'travel'});
    //     var response = bbtCardServicesHelper.intentWithTravelDates('travel', '2017-09', '2017-10-15');
    //     expect(response.verbiage).toEqual('What dates will you be travelling');
    //     expect(response.step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('travel');
    //
    // });
    //
    // it("Test 5 - Step 1. Ask for Card Type Intent all actions but missing card type", function () {
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block'});
    //     var response = bbtCardServicesHelper.intentWithCardType();
    //     expect(response.verbiage).toEqual('Is it a credit or debit card');
    //     expect(response.step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block'});
    //     var response = bbtCardServicesHelper.intentWithCardType('');
    //     expect(response.verbiage).toEqual('Is it a credit or debit card');
    //     expect(response.step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block'});
    //     var response = bbtCardServicesHelper.intentWithCardType('something');
    //     expect(response.verbiage).toEqual('Is it a credit or debit card');
    //     expect(response.step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block'});
    //     var response = bbtCardServicesHelper.intentWithCardType(null);
    //     expect(response.verbiage).toEqual('Is it a credit or debit card');
    //     expect(response.step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //
    // });
    //
    // it("Test 6 - Ask for Card Type Intent for all actions with valid card type", function () {
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block'});
    //     var response = bbtCardServicesHelper.intentWithCardType('credit');
    //     expect(response.verbiage).toEqual('What\'s the last four digit of the credit card');
    //     expect(response.step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block'});
    //     var response = bbtCardServicesHelper.intentWithCardType('debit');
    //     expect(response.verbiage).toEqual('What\'s the last four digit of the debit card');
    //     expect(response.step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('debit');
    //
    // });
    //
    // it("Test 7 - Ask for Card Number Intent for all actions with Invalid Card Number ", function () {
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block', cardType: 'credit'});
    //     var response = bbtCardServicesHelper.intentWithCardNumber();
    //     expect(response.verbiage).toEqual('What\'s the last four digit of the credit card');
    //     expect(response.step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block', cardType: 'debit'});
    //     var response = bbtCardServicesHelper.intentWithCardNumber('');
    //     expect(response.verbiage).toEqual('What\'s the last four digit of the debit card');
    //     expect(response.step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('debit');
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block', cardType: 'credit'});
    //     var response = bbtCardServicesHelper.intentWithCardNumber('some');
    //     expect(response.verbiage).toEqual('What\'s the last four digit of the credit card');
    //     expect(response.step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block', cardType: 'credit'});
    //     var response = bbtCardServicesHelper.intentWithCardNumber('12345');
    //     expect(response.verbiage).toEqual('What\'s the last four digit of the credit card');
    //     expect(response.step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    // });
    //
    // it("Test 8 - Ask for Card Number Intent for all actions with Valid Card Number ", function () {
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block', cardType: 'credit'});
    //     var response = bbtCardServicesHelper.intentWithCardNumber('2345');
    //     expect(response.verbiage).toEqual('What\'s the Zip Code associated with the credit card ending in <say-as interpret-as="digits">2345</say-as>');
    //     expect(response.step).toEqual(3);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(3);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    // });
    //
    // it("Test 9 - Ask for Zip Code Intent for all actions with Invalid Zip Code ", function () {
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block', cardType: 'credit', cardNumber: '2345'});
    //     var response = bbtCardServicesHelper.intentWithZipCode();
    //     expect(response.verbiage).toEqual('What\'s the Zip Code associated with the credit card ending in <say-as interpret-as="digits">2345</say-as>');
    //     expect(response.step).toEqual(3);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(3);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    //     // Invalid Zip Code
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block', cardType: 'credit', cardNumber: '2345'});
    //     var response = bbtCardServicesHelper.intentWithZipCode('27613');
    //     expect(response.verbiage).toEqual('The Zip Code <say-as interpret-as="digits">27613</say-as> doesn\'t match with the given credit card ending in <say-as interpret-as="digits">2345</say-as>. Please restate the Zip Code');
    //     expect(response.step).toEqual(3);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(3);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    // });
    //
    //
    // it("Test 9.1 - Ask for Zip Code Intent for travel with Invalid Zip Code ", function () {
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'travel', cardType: 'credit', cardNumber: '2345'});
    //     var response = bbtCardServicesHelper.intentWithZipCode();
    //     expect(response.verbiage).toEqual('What\'s the Zip Code associated with the credit card ending in <say-as interpret-as="digits">2345</say-as>');
    //     expect(response.step).toEqual(3);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(3);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('travel');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    //     // Invalid Zip Code
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'travel', cardType: 'credit', cardNumber: '2345'});
    //     var response = bbtCardServicesHelper.intentWithZipCode('27613');
    //     expect(response.verbiage).toEqual('The Zip Code <say-as interpret-as="digits">27613</say-as> doesn\'t match with the given credit card ending in <say-as interpret-as="digits">2345</say-as>. Please restate the Zip Code');
    //     expect(response.step).toEqual(3);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(3);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('travel');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    // });
    //
    // it("Test 10 - Ask for Zip Code Intent for lost, stolen and find with Valid Zip Code ", function () {
    //
    //     // Valid for lost
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'lost', cardType: 'credit', cardNumber: '2345'});
    //     var response = bbtCardServicesHelper.intentWithZipCode('27604');
    //     expect(response.verbiage).toEqual('Would you like a new card reissued in place of the lost credit card ending in <say-as interpret-as="digits">2345</say-as>, please say yes to confirm, or no to cancel the transaction');
    //     expect(response.step).toEqual(4);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(4);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('lost');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    //     // Valid for block
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block', cardType: 'credit', cardNumber: '2345'});
    //     var response = bbtCardServicesHelper.intentWithZipCode('27604');
    //     expect(response.verbiage).toEqual('Would you like to continue to block your credit card ending in <say-as interpret-as="digits">2345</say-as>, please say yes to confirm, or no to cancel the transaction');
    //     expect(response.step).toEqual(4);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(4);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    // });
    //
    // it("Test 10.1 - Ask for Zip Code Intent for Travel with Valid Zip Code ", function () {
    //
    //     // Valid for lost
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'travel', cardType: 'credit', cardNumber: '2345', fromDate: '2017-09-01', toDate: '2017-10-15'});
    //     var response = bbtCardServicesHelper.intentWithZipCode('27604');
    //     expect(response.verbiage).toEqual('Would you like to go ahead and notify bb and t that you\'ll be travelling internationally from <say-as interpret-as="date" format="ymd">2017-09-01</say-as> to <say-as interpret-as="date" format="ymd">2017-10-15</say-as> for you card ending in <say-as interpret-as="digits">2345</say-as>');
    //     expect(response.step).toEqual(4);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(4);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('travel');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //
    // });
    //
    // it("Test 10.2 - Confirmation", function () {
    //
    //     // Valid for lost
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'lost', cardType: 'credit', cardNumber: '2345', zipCode: '27604'});
    //     var response = bbtCardServicesHelper.intentConfirmed();
    //     expect(response.verbiage).toEqual('Your request to reissue your lost credit card ending in <say-as interpret-as="digits">2345</say-as>. has been successfully completed. Is there anything else I can do for you today?');
    //     expect(response.step).toEqual(5);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(5);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('lost');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardNumber).toEqual('2345');
    //     expect(bbtCardServicesHelper.getCardServicesSession().zipCode).toEqual('27604');
    //
    //     // Valid for block
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'block', cardType: 'credit', cardNumber: '2345', zipCode: '27604'});
    //     var response = bbtCardServicesHelper.intentConfirmed();
    //     expect(response.verbiage).toEqual('Your request to block your credit card ending in <say-as interpret-as="digits">2345</say-as> has been successfully completed. Is there anything else I can do for you today?');
    //     expect(response.step).toEqual(5);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(5);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardNumber).toEqual('2345');
    //     expect(bbtCardServicesHelper.getCardServicesSession().zipCode).toEqual('27604');
    //
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch' , action: 'travel', cardType: 'credit', cardNumber: '2345', zipCode: '27604', fromDate:'2017-09-01', toDate: '2017-10-15'});
    //     var response = bbtCardServicesHelper.intentConfirmed();
    //     expect(response.verbiage).toEqual('OK, I\'ve notified bb and t that you\'ll be travelling internationally on the given dates for your card ending in <say-as interpret-as="digits">2345</say-as>. Is there anything else I can do for you today?');
    //     expect(response.step).toEqual(5);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(5);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('travel');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //     expect(bbtCardServicesHelper.getCardServicesSession().fromDate).toEqual('2017-09-01');
    //     expect(bbtCardServicesHelper.getCardServicesSession().toDate).toEqual('2017-10-15');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardNumber).toEqual('2345');
    //     expect(bbtCardServicesHelper.getCardServicesSession().zipCode).toEqual('27604');
    //
    // });
    //
    //
    // it("Test 10.3 - Sign Off", function () {
    //
    //     // Valid for lost
    //     var bbtCardServicesHelper = new BbtCardServicesHelper({
    //         action: 'lost',
    //         cardType: 'credit',
    //         cardNumber: '2345',
    //         zipCode: '27604'
    //     });
    //     var response = bbtCardServicesHelper.getSignOff();
    //     expect(response.verbiage).toEqual('Thank you for banking with b b and t. Have a nice day!');
    //     expect(response.step).toEqual(6);
    //     expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(6);
    //     expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('lost');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
    //     expect(bbtCardServicesHelper.getCardServicesSession().cardNumber).toEqual('2345');
    //     expect(bbtCardServicesHelper.getCardServicesSession().zipCode).toEqual('27604');
    // });


});

// describe("Test Intents", function () {
//
//     var session;
//     var intents;
//     var request;
//     var response;
//
//     beforeEach(function () {
//
//         intents = {
//             'slots': {
//                 'cardType': 'CARD_TYPE',
//                 'cardNumber': 'AMAZON.FOUR_DIGIT_NUMBER',
//                 'zipCode': 'AMAZON.NUMBER'
//             }
//         };
//
//         session = {
//             setSession: function (key, value) {
//                 this.key = value;
//             }
//         };
//
//         request = {
//
//             getSession: function () {
//                 return session;
//             },
//             session: function (key) {
//                 return session['key'];
//             },
//
//             getSlot: function(slot) {
//                 if(slot === 'cardNumber') {
//                     return '2345';
//                 } else if (slot === 'cardType') {
//                     return 'credit';
//                 }
//
//             }
//         };
//
//         response = jasmine.createSpyObj('response', ['say', 'shouldEndSession', 'send']);
//
//     });
//
//     // it("Test Step 0", function () {
//     //     var bbtCardServices = require('../index');
//     //     expect(response.tellWithCard).toHaveBeenCalled();
//     // })
// });