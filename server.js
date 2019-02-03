const express = require("express");
const axios = require("axios");

const port = parseInt(process.env.PORT, 10) || 3000;
const server = express();

// get Holiday
server.get("/holidays", (req, res) => {
            axios.get('http://data.ntpc.gov.tw/api/v1/rest/datastore/382000000A-000077-002')
            .then(response => {
                res.header('Access-Control-Allow-Origin', '*');
                return res.send(response.data)
            })
            .catch(err => {
                console.log(err)
                res.send({ err }) // <= send error
            })
        });

server.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`> Ready Server on http://localhost:${port}`)
});