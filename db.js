const config = require('./app/config/index');
const mongoClient = require("mongodb").MongoClient;

mongoClient.connect(config.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(conn => global.conn = conn.db(config.mongodb.db))
    .catch(err => console.log(err));

exports.insertUpdateMsgDialogs = (dialogObj, callback) => {
    global.conn.collection(config.mongodb.dialogs_collection).update({
        conversation_id: dialogObj.convId
    }, {
        $push: { dialogs: dialogObj.dialog }
    }, {
        upsert: true
    }, callback);
}

exports.insertUpdateWelcomeNode = (id, welcomeObj, callback) => {
    global.conn.collection(config.mongodb.welcome_collection).update({
        welcome_id: id
    }, {
        $set: { welcome: welcomeObj }
    }, {
        upsert: true
    }, callback);
}

exports.getWelcomeNode = (callback) => {
    global.conn.collection(config.mongodb.welcome_collection).find({}).toArray(callback)
}