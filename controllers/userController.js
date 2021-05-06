const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Snippet = require('../models/Snippet')
const Folder = require('../models/Folder')
// const { auth } = require('./authController')


module.exports = router