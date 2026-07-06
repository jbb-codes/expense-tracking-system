/**
 * Author: Jarren Bess
 * Date: 7/6/26
 * File: app.js
 * Description: Express application setup — middleware only, no server startup.
 */

"use strict";

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

module.exports = app;
