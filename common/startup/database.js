const mongoose = require('mongoose');
const winston = require('winston');

/**
 * Setup database connection
 */
module.exports = async function () {
    const databaseUri = process.env.DATABASE_URI;
    const database_connection = await mongoose.connect(databaseUri,  {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        bufferMaxEntries: 0,
        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity

    }).catch(err => {
        console.error(err);
    });

    //Set some Mongo settings to avoid DeprecationWarnings
    mongoose.set('useFindAndModify', false);
    return database_connection;
};
