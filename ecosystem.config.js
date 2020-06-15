module.exports = {
    apps: [
        {
            name: "nome-cliente",
            script: "./server.js",
            env: {
                "PORT": 3000,
                "WATSON_URL": "watson-url",
                "ASSISTANT_ID": "assistant-id",
                "WATSON_APIKEY": "apikey",
                "WATSON_VERSION": "2020-04-01",
                "MONGODB_URI": "mongodb-url",
                "MONGODB_DB": "mongodb-name",
                "MONGODB_DIALOGS_COLLECTION": "dialogs",
                "MONGODB_WELCOME_COLLECTION": "welcome"
            }
        },
        {
            name: "dev-nome-cliente",
            script: "./server.js",
            env: {
                "PORT": 3001,
                "WATSON_URL": "watson-url",
                "ASSISTANT_ID": "assistant-id",
                "WATSON_APIKEY": "apikey",
                "WATSON_VERSION": "2020-04-01",
                "MONGODB_URI": "mongodb-url",
                "MONGODB_DB": "mongodb-name",
                "MONGODB_DIALOGS_COLLECTION": "dialogs",
                "MONGODB_WELCOME_COLLECTION": "welcome"
            }
        }
    ]
};