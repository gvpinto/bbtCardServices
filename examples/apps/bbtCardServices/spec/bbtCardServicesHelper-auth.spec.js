var _ = require('lodash');

var BbtCardServicesHelper = require('../bbtCardServicesHelper');
var promptsObj = require('../prompts');


describe("With Authentication: ", function () {

    it('Get Prompts with Step & without Step', function () {
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
        var prompt = bbtCardServicesHelper.getPrompts(0);
        expect(prompt.launch).toBeDefined();
        var prompts = bbtCardServicesHelper.getPrompts();
        expect(prompts.length).toBeGreaterThan(0);
    });

    it('block credit card without authentication and invalid pin. Should ask for authentication', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithAction('block', 'credit');
        expect(response.step).toEqual(0)
        expect(bbtCardServicesHelper.getPrompts(response.step).launch).toBeDefined();
        expect(response.verbiage).toBe(bbtCardServicesHelper.getPrompts(response.step).launch);


    });

    it('block credit card without authentication valid pin 1872. Should ask for Authentication.', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithAction('block', 'credit');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('block');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(response.step).toEqual(0);
        expect(bbtCardServicesHelper.getPrompts(response.step).launch).toBeDefined();
        expect(response.verbiage).toBe(bbtCardServicesHelper.getPrompts(response.step).launch);


    });

    it('block credit card authenticated, with a valid pin - 1872. Should ask for Card Number', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: true, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithAction('block', 'credit');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('block');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(response.step).toEqual(2);
        expect(bbtCardServicesHelper.getPrompts(response.step).askForCardNumber).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'askForCardNumber', cardServicesSession));

    });

    it('block Card authenticated, with a valid pin- 1872 but without Card Type', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: true, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithAction('block');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('block');
        expect(cardServicesSession.cardType).toBeUndefined();
        expect(response.step).toEqual(1);
        expect(bbtCardServicesHelper.getPrompts(response.step).askForCardType).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'askForCardType', cardServicesSession));

    });

    it('lost debit card with valid pin 1872 but unauthenticated', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithAction('lost', 'debit');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('lost');
        expect(cardServicesSession.cardType).toBe('debit');
        expect(response.step).toEqual(0);
        expect(bbtCardServicesHelper.getPrompts(response.step).launch).toBeDefined();
        expect(response.verbiage).toBe(bbtCardServicesHelper.getPrompts(response.step).launch);

    });

    it('lost Card authenticated, with a valid pin- 1872 but without Card Type', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: true, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithAction('lost');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('lost');
        expect(cardServicesSession.cardType).toBeUndefined();
        expect(response.step).toEqual(1);
        expect(bbtCardServicesHelper.getPrompts(response.step).askForCardType).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'askForCardType', cardServicesSession));
    });

    it('missing card with valid pin 1872 and authenticated', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: true, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithAction('find');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('missing');
        expect(cardServicesSession.cardType).toBeUndefined();
        expect(response.step).toEqual(1);
        expect(bbtCardServicesHelper.getPrompts(response.step).askForCardType).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'askForCardType', cardServicesSession));

    });


    it('travel with dates, but not authenticated - expect authentication prompt', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithTravelDates('travel', '2017-09-01', '2017-10-15');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        console.log('CardEssion: ', cardServicesSession);
        expect(cardServicesSession.action).toBe('travel');
        expect(cardServicesSession.cardType).toEqual('credit');
        expect(cardServicesSession.fromDate).toEqual('2017-09-01')
        expect(cardServicesSession.toDate).toEqual('2017-10-15');
        expect(response.step).toEqual(0);
        expect(bbtCardServicesHelper.getPrompts(response.step).launch).toBeDefined();
        expect(response.verbiage).toBe(bbtCardServicesHelper.getPrompts(response.step).launch);

    });

    it('travel with dates, but not authenticated - expect Card Number prompt', function () {

        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: true, action: 'launch'});
        var response = bbtCardServicesHelper.intentWithTravelDates('travel', '2017-09-01', '2017-10-15');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('travel');
        expect(cardServicesSession.cardType).toEqual('credit');
        expect(cardServicesSession.fromDate).toEqual('2017-09-01');
        expect(cardServicesSession.toDate).toEqual('2017-10-15');
        expect(response.step).toEqual(2);
        expect(bbtCardServicesHelper.getPrompts(response.step).askForCardNumberForTravel).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'askForCardNumberForTravel', cardServicesSession));

    });


    it('Travel with dates, authenticated and given dates and card number - expect zip code prompt', function () {

        // Authentication Intent and ask for Card Type
        var bbtCardServicesHelper = new BbtCardServicesHelper({
            isAuth: true,
            action: 'travel',
            fromDate: '2017-09-01',
            toDate: '2017-10-15',
            cardType: 'credit'
        });
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        response = bbtCardServicesHelper.intentWithCardNumber('4578');
        expect(response.step).toEqual(3);
        expect(cardServicesSession.action).toBe('travel');
        expect(cardServicesSession.cardType).toEqual('credit');
        expect(cardServicesSession.fromDate).toEqual('2017-09-01')
        expect(cardServicesSession.toDate).toEqual('2017-10-15');
        expect(bbtCardServicesHelper.getPrompts(response.step).askForZipCode).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'askForZipCode', cardServicesSession));

    });

    it('Travel without dates, authenticated - expect date prompt', function () {

        // Authentication Intent and ask for Card Type
        var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: true, action: 'launch'});
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        response = bbtCardServicesHelper.intentWithTravel('travel');
        expect(response.step).toEqual(1);
        expect(cardServicesSession.action).toBe('travel');
        expect(cardServicesSession.cardType).toBeUndefined()
        expect(cardServicesSession.fromDate).toBeUndefined();
        expect(cardServicesSession.toDate).toBeUndefined();
        expect(bbtCardServicesHelper.getPrompts(response.step).askForTravelDates).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'askForTravelDates', cardServicesSession));

    });

    it('block card and authenticated given all the information - expect confirmation prompt', function () {
        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({
            isAuth: true,
            action: 'block',
            cardType: 'credit',
            cardNumber: '4578'
        });
        var response = bbtCardServicesHelper.intentWithZipCode('27604');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('block');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(cardServicesSession.cardNumber).toBe('4578');
        expect(cardServicesSession.zipCode).toBe('27604');
        expect(response.step).toEqual(4);
        expect(bbtCardServicesHelper.getPrompts(response.step).confirmGeneral).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'confirmGeneral', cardServicesSession));

    });

    it('block card and authenticated given all the information - expect confirmed prompt', function () {
        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({
            isAuth: true,
            action: 'block',
            cardType: 'credit',
            cardNumber: '4578',
            zipCode: '27604'
        });
        var response = bbtCardServicesHelper.intentConfirmed();
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('exit');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(cardServicesSession.cardNumber).toBe('4578');
        expect(cardServicesSession.zipCode).toBe('27604');
        expect(response.step).toEqual(5);
        expect(bbtCardServicesHelper.getPrompts(response.step).generalConfirmation).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'generalConfirmation', cardServicesSession));

    });

    it('lost card and authenticated given all the information - expect confirmation prompt', function () {
        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({
            isAuth: true,
            action: 'lost',
            cardType: 'credit',
            cardNumber: '4578'
        });
        var response = bbtCardServicesHelper.intentWithZipCode('27604');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('lost');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(cardServicesSession.cardNumber).toBe('4578');
        expect(cardServicesSession.zipCode).toBe('27604');
        expect(response.step).toEqual(4);
        expect(bbtCardServicesHelper.getPrompts(response.step).confirmReissue).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'confirmReissue', cardServicesSession));

    });


    it('lost card and authenticated given all the information - expect confirmed prompt', function () {
        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({
            isAuth: true,
            action: 'lost',
            cardType: 'credit',
            cardNumber: '4578',
            zipCode: '27604'
        });
        var response = bbtCardServicesHelper.intentConfirmed();
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('lost');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(cardServicesSession.cardNumber).toBe('4578');
        expect(cardServicesSession.zipCode).toBe('27604');
        expect(response.step).toEqual(5);
        expect(bbtCardServicesHelper.getPrompts(response.step).reissueConfirmation).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'reissueConfirmation', cardServicesSession));

    });

    it('Travel and authenticated given all the information - expect confirmation prompt', function () {
        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({
            isAuth: true,
            action: 'travel',
            cardType: 'credit',
            fromDate: '2017-09-01',
            toDate: '2017-10-15',
            cardNumber: '4578'
        });
        var response = bbtCardServicesHelper.intentWithZipCode('27604');
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('travel');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(cardServicesSession.cardNumber).toBe('4578');
        expect(cardServicesSession.fromDate).toBe('2017-09-01');
        expect(cardServicesSession.toDate).toBe('2017-10-15');
        expect(cardServicesSession.zipCode).toBe('27604');
        expect(response.step).toEqual(4);
        expect(bbtCardServicesHelper.getPrompts(response.step).confirmTravel).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'confirmTravel', cardServicesSession));

    });

    it('Travel and authenticated given all the information - expect confirmed prompt', function () {
        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({
            isAuth: true,
            action: 'travel',
            cardType: 'credit',
            fromDate: '2017-09-01',
            toDate: '2017-10-15',
            cardNumber: '4578',
            zipCode: '27604'
        });
        var response = bbtCardServicesHelper.intentConfirmed();
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('travel');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(cardServicesSession.cardNumber).toBe('4578');
        expect(cardServicesSession.fromDate).toBe('2017-09-01');
        expect(cardServicesSession.toDate).toBe('2017-10-15');
        expect(cardServicesSession.zipCode).toBe('27604');
        expect(response.step).toEqual(5);
        expect(bbtCardServicesHelper.getPrompts(response.step).travelConfirmation).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'travelConfirmation', cardServicesSession));

    });


    it('Test Cancel Intent - expect bb&t pce', function () {
        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({
            isAuth: true,
            action: 'travel',
            cardType: 'credit',
            fromDate: '2017-09-01',
            toDate: '2017-10-15',
            cardNumber: '4578',
            zipCode: '27604'
        });
        var response = bbtCardServicesHelper.intentCancel();
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('exit');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(cardServicesSession.cardNumber).toBe('4578');
        expect(cardServicesSession.fromDate).toBe('2017-09-01');
        expect(cardServicesSession.toDate).toBe('2017-10-15');
        expect(cardServicesSession.zipCode).toBe('27604');
        expect(response.step).toEqual(5);
        expect(bbtCardServicesHelper.getPrompts(response.step).bbtpce).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'bbtpce', cardServicesSession));

    });

    it('Test Cancel Intent - expect exit', function () {
        // Block Card Intent
        var bbtCardServicesHelper = new BbtCardServicesHelper({
            isAuth: true,
            action: 'exit',
            cardType: 'credit',
            fromDate: '2017-09-01',
            toDate: '2017-10-15',
            cardNumber: '4578',
            zipCode: '27604'
        });
        var response = bbtCardServicesHelper.intentCancel();
        var cardServicesSession = bbtCardServicesHelper.getCardServicesSession();
        expect(cardServicesSession.action).toBe('');
        expect(cardServicesSession.cardType).toBe('credit');
        expect(cardServicesSession.cardNumber).toBe('4578');
        expect(cardServicesSession.fromDate).toBe('2017-09-01');
        expect(cardServicesSession.toDate).toBe('2017-10-15');
        expect(cardServicesSession.zipCode).toBe('27604');
        expect(response.step).toEqual(6);
        expect(bbtCardServicesHelper.getPrompts(response.step).signOff).toBeDefined();
        expect(response.verbiage).toBe(promptsObj.applyTemplateOnObj(response.step, 'signOff', cardServicesSession));

    });

});