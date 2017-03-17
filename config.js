'use strict';

var config = {
    host: 'https://api.taxamo.com/',
    public_token: "SamplePublicTestKey1",
    private_token: "SamplePrivateTestKey1",
    crud_attempt: 7,
    endpoints: {
        getTransactions: '/api/v1/transactions',
        createTransaction: '/api/v1/transactions',
        getTransactionById: '/api/v1/transactions/:key',
        updateTransaction: '/api/v1/transactions/:key',
        confirmTransaction: '/api/v1/transactions/:key/confirm',
        unconfirmTransaction: '/api/v1/transactions/:key/unconfirm',
        deleteTransaction: '/api/v1/transactions/:key'
    }
};
config.headers = {
    headers: {
        'User-Agent': 'request',
        'Content-Type': 'application/json',
        'Private-Token': config.private_token
    }
};
exports.config = config;