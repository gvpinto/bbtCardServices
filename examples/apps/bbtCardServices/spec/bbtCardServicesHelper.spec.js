var BbtCardSevicesHelper = require('../bbtCardServicesHelper');


describe("Test Block Card Function", function () {

    it("Test 1 - Step 0: Launch Intent or missing action or invalid action", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        expect(bbtCardServicesHelper.getLaunchPrompt()).toBe('Welcome to b b and t\'s credit and debit card services. For usage say, I would like to block my credit card, or I\'ve have lost my debit card');
    });

    it("Test 2 - Step 0. Ask for Action Intent, empty or invalid action", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction();
        expect(response.verbiage).toBe('How would like to proceed? Say, I would like to unblock my credit card, or my debit card was stolen');
        expect(response.step).toBe(0);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual(undefined);

        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction('something');
        expect(response.verbiage).toBe('How would like to proceed? Say, I would like to unblock my credit card, or my debit card was stolen');
        expect(response.step).toBe(0);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual(undefined);

        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction('');
        expect(response.verbiage).toBe('How would like to proceed? Say, I would like to unblock my credit card, or my debit card was stolen');
        expect(response.step).toBe(0);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual(undefined);

        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction(null);
        expect(response.verbiage).toBe('How would like to proceed? Say, I would like to unblock my credit card, or my debit card was stolen');
        expect(response.step).toBe(0);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(0);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual(undefined);

    });


    it("Test 3 - Step 1. Ask for Action Intent, lost, stolen, block, unblock or find but empty card type", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction('lost');
        expect(response.verbiage).toEqual('Is it a credit or debit card');
        expect(response.step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('lost');
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction('stolen');
        expect(response.verbiage).toEqual('Is it a credit or debit card');
        expect(response.step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('stolen');


        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction('find');
        expect(response.verbiage).toEqual('Is it a credit or debit card');
        expect(response.step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('missing');

        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction('block');
        expect(response.verbiage).toEqual('Is it a credit or debit card');
        expect(response.step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');

        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction('unblock');
        expect(response.verbiage).toEqual('Is it a credit or debit card');
        expect(response.step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('unblock');

    });

    it("Test 4 - Step 2. Ask for Action Intent, lost, stolen or find but valid card type", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction('lost', 'credit');
        expect(response.verbiage).toEqual('What\'s the last four digit of the credit card');
        expect(response.step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('lost');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction('stolen', 'debit');
        expect(response.verbiage).toEqual('What\'s the last four digit of the debit card');
        expect(response.step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('stolen');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('debit');


        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction('find', 'credit');
        expect(response.verbiage).toEqual('What\'s the last four digit of the credit card');
        expect(response.step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('missing');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');


    });

    it("Test 5 - Step 1. Ask for Card Type Intent all actions but missing card type", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block'});
        var response = bbtCardServicesHelper.intentWithCardType();
        expect(response.verbiage).toEqual('Is it a credit or debit card');
        expect(response.step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');

        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block'});
        var response = bbtCardServicesHelper.intentWithCardType('');
        expect(response.verbiage).toEqual('Is it a credit or debit card');
        expect(response.step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');

        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block'});
        var response = bbtCardServicesHelper.intentWithCardType('something');
        expect(response.verbiage).toEqual('Is it a credit or debit card');
        expect(response.step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');

        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block'});
        var response = bbtCardServicesHelper.intentWithCardType(null);
        expect(response.verbiage).toEqual('Is it a credit or debit card');
        expect(response.step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(1);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');

    });

    it("Test 6 - Ask for Card Type Intent for all actions with valid card type", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block'});
        var response = bbtCardServicesHelper.intentWithCardType('credit');
        expect(response.verbiage).toEqual('What\'s the last four digit of the credit card');
        expect(response.step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');

        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block'});
        var response = bbtCardServicesHelper.intentWithCardType('debit');
        expect(response.verbiage).toEqual('What\'s the last four digit of the debit card');
        expect(response.step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('debit');

    });

    it("Test 7 - Ask for Card Number Intent for all actions with Invalid Card Number ", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block', cardType: 'credit'});
        var response = bbtCardServicesHelper.intentWithCardNumber();
        expect(response.verbiage).toEqual('What\'s the last four digit of the credit card');
        expect(response.step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');

        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block', cardType: 'debit'});
        var response = bbtCardServicesHelper.intentWithCardNumber('');
        expect(response.verbiage).toEqual('What\'s the last four digit of the debit card');
        expect(response.step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('debit');

        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block', cardType: 'credit'});
        var response = bbtCardServicesHelper.intentWithCardNumber('some');
        expect(response.verbiage).toEqual('What\'s the last four digit of the credit card');
        expect(response.step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');

        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block', cardType: 'credit'});
        var response = bbtCardServicesHelper.intentWithCardNumber('12345');
        expect(response.verbiage).toEqual('What\'s the last four digit of the credit card');
        expect(response.step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(2);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');

    });

    it("Test 8 - Ask for Card Number Intent for all actions with Valid Card Number ", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block', cardType: 'credit'});
        var response = bbtCardServicesHelper.intentWithCardNumber('2345');
        expect(response.verbiage).toEqual('What\'s the Zip Code associated with the credit card ending in <say-as interpret-as="digits">2345</say-as>');
        expect(response.step).toEqual(3);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(3);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');

    });

    it("Test 9 - Ask for Zip Code Intent for all actions with Invalid Zip Code ", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block', cardType: 'credit', cardNumber: '2345'});
        var response = bbtCardServicesHelper.intentWithZipCode();
        expect(response.verbiage).toEqual('What\'s the Zip Code associated with the credit card ending in <say-as interpret-as="digits">2345</say-as>');
        expect(response.step).toEqual(3);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(3);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');

        // Invalid Zip Code
        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block', cardType: 'credit', cardNumber: '2345'});
        var response = bbtCardServicesHelper.intentWithZipCode('27613');
        expect(response.verbiage).toEqual('The Zip Code <say-as interpret-as="digits">27613</say-as> doesn\'t match with the provided credit card ending in <say-as interpret-as="digits">2345</say-as>. Please restate the Zip Code');
        expect(response.step).toEqual(3);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(3);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');

    });

    it("Test 10 - Ask for Zip Code Intent for lost, stolen and find with Valid Zip Code ", function () {

        // Valid for lost
        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'lost', cardType: 'credit', cardNumber: '2345'});
        var response = bbtCardServicesHelper.intentWithZipCode('27604');
        expect(response.verbiage).toEqual('Would you like a new card reissued in place of the lost credit card ending in <say-as interpret-as="digits">2345</say-as>. Please say yes to confirm, or no to cancel the transaction');
        expect(response.step).toEqual(4);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(4);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('lost');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');

        // Valid for block
        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block', cardType: 'credit', cardNumber: '2345'});
        var response = bbtCardServicesHelper.intentWithZipCode('27604');
        expect(response.verbiage).toEqual('Would you like to continue to block your credit card ending in <say-as interpret-as="digits">2345</say-as>. Please say yes to confirm, or no to cancel the transaction');
        expect(response.step).toEqual(4);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(4);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');

    });

    it("Test 10 - Confirmation", function () {

        // Valid for lost
        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'lost', cardType: 'credit', cardNumber: '2345', zipCode: '27604'});
        var response = bbtCardServicesHelper.intentConfirmed();
        expect(response.verbiage).toEqual('Your request to reissue your lost credit card ending in <say-as interpret-as="digits">2345</say-as>. has been successfully completed. Thank you for using bb and t card services. Goodbye!');
        expect(response.step).toEqual(5);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(5);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('lost');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');

        // Valid for block
        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block', cardType: 'credit', cardNumber: '2345', zipCode: '27604'});
        var response = bbtCardServicesHelper.intentConfirmed();
        expect(response.verbiage).toEqual('Your request to block your credit card ending in <say-as interpret-as="digits">2345</say-as> has been successfully completed. Thank you for using bb and t card services. Goodbye!');
        expect(response.step).toEqual(5);
        expect(bbtCardServicesHelper.getCardServicesSession().step).toEqual(5);
        expect(bbtCardServicesHelper.getCardServicesSession().action).toEqual('block');
        expect(bbtCardServicesHelper.getCardServicesSession().cardType).toEqual('credit');

    });
});


describe("Test Intents", function () {

    var session;
    var intents;
    var request;
    var response;

    beforeEach(function () {

        intents = {
            'slots': {
                'cardType': 'CARD_TYPE',
                'cardNumber': 'AMAZON.FOUR_DIGIT_NUMBER',
                'zipCode': 'AMAZON.NUMBER'
            }
        };

        session = {
            setSession: function (key, value) {
                this.key = value;
            }
        };

        request = {

            getSession: function () {
                return session;
            },
            session: function (key) {
                return session['key'];
            },

            getSlot: function(slot) {
                if(slot === 'cardNumber') {
                    return '2345';
                } else if (slot === 'cardType') {
                    return 'credit';
                }

            }
        };

        response = jasmine.createSpyObj('response', ['say', 'shouldEndSession', 'send']);

    });

    // it("Test Step 0", function () {
    //     var bbtCardServices = require('../index');
    //     expect(response.tellWithCard).toHaveBeenCalled();
    // })
});