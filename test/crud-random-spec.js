var config = require('../config.js').config;
var chakram = require('chakram');
var expect = chakram.expect;
var Chance = require('chance');
var logUtils = require('../utils/logging.js').LogUtils;
var logging = new logUtils();

//Create chance generators to generate random values
var chance_new = new Chance('new');
var chance_update = new Chance('update');

/* The test suite with static data just to be sure that confirm/unconfirm methods on the track */
describe('Create/Confirm/Unconfirm transaction.', function() {
    after(function(){
        //Clean transaction id after all tests in current describe
        global.confirm_transaction_id = undefined;
    });

    it('Create new transaction.', function () {
        return chakram.post(config.host + config.endpoints.createTransaction,
            {
                transaction: {
                    transaction_lines: [{
                        custom_id: 'line1',
                        amount: 100
                    }],
                    currency_code: 'EUR',
                    billing_country_code: 'BE',
                    buyer_credit_card_prefix: '424242424'
                }
            },
            config.headers)
            .then(function(res){
                logging.write(res);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('transaction');
                expect(res.body.transaction).to.have.deep.property('status').eql('N');

                //Write transaction ID to global namespace
                global.confirm_transaction_id = res.body.transaction.key
            });
    });
    it('Confirm transaction.', function () {
        return chakram.post(config.host + config.endpoints.confirmTransaction.replace(':key', global.confirm_transaction_id),
            {},
            config.headers)
            .then(function(res){
                logging.write(res);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('transaction');
                expect(res.body.transaction).to.have.deep.property('status').eql('C');
            });
    });
    it('Unconfirm transaction.', function () {
        return chakram.post(config.host + config.endpoints.unconfirmTransaction.replace(':key', global.confirm_transaction_id),
            {},
            config.headers)
            .then(function(res){
                logging.write(res);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('transaction');
                expect(res.body.transaction).to.have.deep.property('status').eql('N');
            });
    });

});

/* The test suite with generated data to test transactions CRUD */
for (var i=0;i<config.crud_attempt;i++){
    describe('Create/Read/Update/Delete transaction with random values #' + i, function() {
        var new_payload = {
            transaction: {
                buyer_credit_card_prefix: '424242424',
                tax_deducted: chance_new.bool(),
                billing_country_code: 'BE',
                buyer_ip: chance_new.ip(),
                status: chance_new.character({pool: 'NC'}),
                currency_code: chance_new.pickone(['EUR', 'GBP','USD']),
                transaction_lines:[
                    {
                        custom_id: chance_new.string(),
                        amount: chance_new.floating({min: 0, max: 1000})
                    }
                ]
            }
        };
        var update_payload = {
            "transaction": {
                "custom_id": chance_update.string(),
                "order_date": "2013-11-14",
                "currency_code": chance_update.pickone(['EUR', 'GBP','USD']),
                "billing_country_code": "IE",
                "buyer_credit_card_prefix": "424242424",
                "buyer_tax_number": "IE5251981413X",
                "tax_deducted": chance_update.bool(),
                "tax_country_code": "IE",
                "buyer_ip": chance_update.ip(),
                "invoice_date": "2014-11-15",
                "invoice_place": chance_update.country({ full: true }),
                "invoice_number": chance_update.string(),
                "invoice_address": {
                    "street_name": chance_update.address(),
                    "building_number": chance_update.natural({min:1, max:100}).toString(),
                    "city": chance_update.city(),
                    "region": chance_update.state({ territories: true, full: true })
                }
            }
        };

        after(function(){
            //Clean transaction id after all tests in current loop
            global.crud_transaction_id = undefined;
        });

        it('Create new transaction.', function () {
            return chakram.post(config.host + config.endpoints.createTransaction,
                    new_payload,
                    config.headers)
                .then(function(res){
                    logging.write(res);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('transaction');

                    //Write transaction ID to global namespace
                    global.crud_transaction_id = res.body.transaction.key
                })
        });

        it('Read transaction by id.',function(){
            return chakram.get(config.host + config.endpoints.getTransactionById.replace(':key', global.crud_transaction_id),
                    config.headers)
                .then(function(res){
                    logging.write(res);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('transaction');
                    expect(res.body.transaction).to.have.deep.property('buyer_credit_card_prefix').eql(new_payload.transaction.buyer_credit_card_prefix);
                    expect(res.body.transaction).to.have.deep.property('tax_deducted').eql(new_payload.transaction.tax_deducted);
                    expect(res.body.transaction).to.have.deep.property('billing_country_code').eql(new_payload.transaction.billing_country_code);
                    expect(res.body.transaction).to.have.deep.property('buyer_ip').eql(new_payload.transaction.buyer_ip);
                    expect(res.body.transaction).to.have.deep.property('status').eql(new_payload.transaction.status);
                    expect(res.body.transaction).to.have.deep.property('currency_code').eql(new_payload.transaction.currency_code);
                    expect(res.body.transaction).to.have.property('transaction_lines');
                    expect(res.body.transaction.transaction_lines[0]).to.have.deep.property('custom_id').eql(new_payload.transaction.transaction_lines[0].custom_id);
                    //NOTE: server side returns rounded value
                    expect(res.body.transaction.transaction_lines[0]).to.have.deep.property('amount').eql(new_payload.transaction.transaction_lines[0].amount);
                });
        });

        it('Update transaction by id.',function(){
            return chakram.put(config.host + config.endpoints.updateTransaction.replace(':key', global.crud_transaction_id),
                    update_payload,
                    config.headers)
                .then(function(res){
                    logging.write(res);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('transaction');
                    for (var property in update_payload.transaction){
                        if (update_payload.hasOwnProperty(property)) {
                            expect(res.body.transaction).to.have.deep.property(property).eql(update_payload.transaction[property]);
                        }
                    }
                });
        });

        it('Delete transaction by id.',function(){
            return chakram.delete(config.host + config.endpoints.deleteTransaction.replace(':key', global.crud_transaction_id),
                    config.headers)
                .then(function(res){
                    logging.write(res);
                    expect(res.body).to.deep.equal({"success": true});
                });
        });

    });
}