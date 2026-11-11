// Preload that makes every network call throw "network blocked: <api>".
// Use: node --require ./tools/reui_catalog/no-network.cjs <script>
/* global require */
/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("node:http");
const https = require("node:https");
const net = require("node:net");
const tls = require("node:tls");
const { syncBuiltinESMExports } = require("node:module");

const blocked = (api) =>
  function () {
    throw new Error(`network blocked: ${api}`);
  };

globalThis.fetch = blocked("fetch");
http.request = blocked("http.request");
http.get = blocked("http.get");
https.request = blocked("https.request");
https.get = blocked("https.get");
net.connect = blocked("net.connect");
net.createConnection = blocked("net.createConnection");
tls.connect = blocked("tls.connect");
// Named ESM imports (import { request } from "node:https") read these bindings too.
syncBuiltinESMExports();
