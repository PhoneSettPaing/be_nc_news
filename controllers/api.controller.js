const endpoints = require("../endpoints.json");

exports.getApi = (req, res) => {
    res.status(200).send({ endpoints });
}

exports.badUrl = (req, res) => {
    res.status(404).send({ msg: "Not Found!"})
}