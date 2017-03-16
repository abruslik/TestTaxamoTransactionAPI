var util = require('util');

var LogUtil = function(){
    this.write = function(data){
        console.log(
            '======================================================================\n',
            '[',(new Date()).toLocaleString(),']:',
            '[',data.response.request.method,'] => ',
            data.response.request.href,
            '\nRQUEST HEADERS :------------------------------------------------------\n',
            data.response.request.headers
        );
        if (data.response.request.body){
            console.log(
                '\nRQUEST BODY :---------------------------------------------------------\n',
                util.inspect(JSON.parse(data.response.request.body), { depth: null })
            );
        }
        console.log(
            '\nRESPONSE BODY :-------------------------------------------------------\n',
            util.inspect(data.body, { depth: null }),
            '\n=====================================================================\n'
        );
    };
};
exports.LogUtils = LogUtil;