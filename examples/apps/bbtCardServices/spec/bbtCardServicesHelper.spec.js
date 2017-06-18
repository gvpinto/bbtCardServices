var BbtCardSevicesHelper = require('../bbtCardServicesHelper');


describe("Test Block Card Function", function () {

    it("Step 0: Launch", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        expect(bbtCardServicesHelper.getLaunchPrompt()).toBe('Welcome to b b and t\'s credit and debit card services. For usage say, block my card or cancel my card.');
    });

    it("Step 2. Ask for Action, invalid action", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction('nothing');
        expect(response.verbiage).toBe('Would you like to block or cancel a card.');
        expect(response.step).toBe(1);
    });

    it("Step 2. Ask for Action, empty action", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction();
        expect(response.verbiage).toBe('Would you like to block or cancel a card.');
        expect(response.step).toBe(1);
    });

    it("Step 2. Ask for Action, valid action", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithAction('block');
        expect(response.verbiage).toBe('Would you like to block your credit or debit card.');
        expect(response.step).toBe(2);
    });

    it("Step 2. Ask for Card Type, invalid card type - empty", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithCardType();
        expect(response.verbiage).toBe('Would you like to block your credit or debit card.');
        expect(response.step).toBe(2);
    });

    it("Step 2. Ask for Card Type, invalid card type - invalid value", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithCardType('something');
        expect(response.verbiage).toBe('Would you like to block your credit or debit card.');
        expect(response.step).toBe(2);
    });


    it("Step 3. Ask for Card Number, valid card type", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({});
        var response = bbtCardServicesHelper.intentWithCardType('credit');
        expect(response.verbiage).toBe('What\'s the last four digit of the credit card.');
        expect(response.step).toBe(3);
    });

    it("Step 3. Ask for Card Number, invalid card number", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({cardType: 'credit'});
        var response = bbtCardServicesHelper.intentWithCardNumber();
        expect(response.verbiage).toBe('What\'s the last four digit of the credit card.');
        expect(response.step).toBe(3);
    });

    it("Step 4. Ask for Card Number, valid card number", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({cardType: 'credit'});
        var response = bbtCardServicesHelper.intentWithCardNumber('2345');
        expect(response.verbiage).toBe('What\'s the zip code associated with the credit card ending in <say-as interpret-as="digits">2345</say-as>.');
        expect(response.step).toBe(4);
    });

    it("Step 4. Ask for Zip Code, invalid zip code - empty", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({cardType: 'credit', cardNumber: '2345'});
        var response = bbtCardServicesHelper.intentWithZipCode();
        expect(response.verbiage).toBe('What\'s the zip code associated with the credit card ending in <say-as interpret-as="digits">2345</say-as>.');
        expect(response.step).toBe(4);
    });

    it("Step 4. Ask for Zip Code, invalid zip code - not tied to the card", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({cardType: 'credit'});
        var response = bbtCardServicesHelper.intentWithZipCode('27613');
        expect(response.verbiage).toBe('Zip code doesn\'t match with the provided credit card. What\'s the zip code associated with the credit card ending in <say-as interpret-as="digits"></say-as>.');
        expect(response.step).toBe(4);
    });

    it("Step 5. Confirm the transaction, valid zip code", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block', cardType: 'credit', cardNumber: '2345', zipCode: '27604'});
        var response = bbtCardServicesHelper.intentWithZipCode('27604');
        expect(response.verbiage).toBe('Would you like to continue to block your credit card ending in <say-as interpret-as="digits">2345</say-as>. Say yes to confirm, or say no to cancel the transaction.');
        expect(response.step).toBe(5);
    });

    it("Step 6. Confirmation of the transaction", function () {
        var bbtCardServicesHelper = new BbtCardSevicesHelper({action: 'block', cardType: 'credit', cardNumber: '2345', zipCode: '27604'});
        var response = bbtCardServicesHelper.intentConfirmed();
        expect(response.verbiage).toBe('Your request to block your credit card ending in <say-as interpret-as="digits">2345</say-as> has been successfully completed. Thank you for using bb and t card services. Goodbye!');
        expect(response.step).toBe(6);
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