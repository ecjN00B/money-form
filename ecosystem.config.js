module.exports = {
    apps: [
        {
            name: "nasa",
            script: "./server.js",
            env: {
                "PORT": 443,
                "MONGODB_URI": "mongodb+srv://berith:CTcqNyTUrVXy1XdB@nasa.tou4f.mongodb.net/nasa?retryWrites=true&w=majority",
                "MONGODB_DB": "nasa",
                "MONGODB_FORM_COLLECTION": "form"
            }
        },
        {
            name: "dev-nasa",
            script: "./server.js",
            env: {
                "PORT": 80,
                "MONGODB_URI": "mongodb+srv://berith:CTcqNyTUrVXy1XdB@nasa.tou4f.mongodb.net/nasa?retryWrites=true&w=majority",
                "MONGODB_DB": "nasa",
                "MONGODB_FORM_COLLECTION": "form"
            }
        }
    ]
};