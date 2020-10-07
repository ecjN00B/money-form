module.exports = {
    apps: [
        {
            name: "nasa",
            script: "./server.js",
            env: {
                "PORT": 443,
                "WATSON_URL": "https://api.us-south.assistant.watson.cloud.ibm.com/instances/9a4da6d7-793a-4b26-9032-20c3e92118df",
                "ASSISTANT_ID": "1781c5a0-2ee9-4903-9b80-abf8f3523854",
                "WATSON_APIKEY": "sIA7V7rOVhEo1xv4oSWGNYChUT4QUrY79W02cCgYRwVr",
                "WATSON_VERSION": "2020-04-01",
                "MONGODB_URI": "mongodb+srv://berith:CTcqNyTUrVXy1XdB@nasa.tou4f.mongodb.net/nasa?retryWrites=true&w=majority",
                "MONGODB_DB": "nasa",
                "MONGODB_DIALOGS_COLLECTION": "dialogs",
                "MONGODB_WELCOME_COLLECTION": "welcome"
            }
        },
        {
            name: "dev-nasa",
            script: "./server.js",
            env: {
                "PORT": 80,
                "WATSON_URL": "https://api.us-south.assistant.watson.cloud.ibm.com/instances/9a4da6d7-793a-4b26-9032-20c3e92118df",
                "ASSISTANT_ID": "1781c5a0-2ee9-4903-9b80-abf8f3523854",
                "WATSON_APIKEY": "sIA7V7rOVhEo1xv4oSWGNYChUT4QUrY79W02cCgYRwVr",
                "WATSON_VERSION": "2020-04-01",
                "MONGODB_URI": "mongodb+srv://berith:CTcqNyTUrVXy1XdB@nasa.tou4f.mongodb.net/nasa?retryWrites=true&w=majority",
                "MONGODB_DB": "nasa",
                "MONGODB_DIALOGS_COLLECTION": "dialogs",
                "MONGODB_WELCOME_COLLECTION": "welcome"
            }
        }
    ]
};