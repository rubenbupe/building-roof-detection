const dotenv = require('dotenv-override');
const path = require('path');


module.exports = function(){
    switch(process.env.NODE_ENV?.toLowerCase()){
        case 'production':
            return dotenv.config({ path: path.join(__dirname, 'production.env'), override: true });

        default:
            return dotenv.config({ path: path.join(__dirname, 'production.env'), override: true });
    }
};
// SECRET GENERATOR  ==>  require('crypto').randomBytes(64).toString('hex')
