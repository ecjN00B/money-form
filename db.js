const config = require('./app/config/index');
const mongoClient = require("mongodb").MongoClient;

mongoClient.connect(config.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(conn => global.conn = conn.db(config.mongodb.db))
    .catch(err => console.log(err));

exports.saveAnswer = (id, answerObj, callback) => {
    global.conn.collection(config.mongodb.form_collection).update({
        form_id: id
    }, {
        $push: { answers: answerObj }
    }, {
        upsert: true
    }, callback);
}

exports.insertUpdateForm = (id, formObj, callback) => {
    global.conn.collection(config.mongodb.form_collection).update({
        form_id: id
    }, {
        $set: { form: formObj }
    }, {
        upsert: true
    }, callback);
}

exports.getForm = (callback) => {
    global.conn.collection(config.mongodb.form_collection).find({}).toArray(callback)
}