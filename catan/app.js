#!/usr/bin/env node
const WebSocketServer = require('websocket').server;
const http = require('http');
const express = require('express');
const app = express();

// IPアドレスによるアクセス制限
const ipfilter = require('express-ipfilter').IpFilter;
const ips = ['131.206.77.23/16'];

app.use(ipfilter(ips, {mode: 'allow'}))
module.exports = app;

app.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

