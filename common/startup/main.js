const path = require('path');

module.exports = function (init_db=true) {
    require('../config/config')();

    return init_db ? require('./database')() : true;  //Connects to database
}

