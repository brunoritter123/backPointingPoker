const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const request = require("request");



const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/dist'))

app.all('/api/jira/*', (req, res) => {
    const requisicao = {
        method: req.method,
        url: req.url.replace('/api/jira', req.header('Base-Url')),
        headers:{ 'Authorization': req.header('Authorization') } 
    };

    request(requisicao, function (error, response, body) {
        if (error) throw new Error(error);

        res.status(response.statusCode).send(body);
      });
  });

app.get('/*', (req,res) => res.sendFile(path.join(__dirname)));

const server = http.createServer(app);

server.listen(port, () => console.log('Running...'));

module.exports = server