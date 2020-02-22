'use strict';

const express = require('express');
const twilio = require('twilio');
const cfg = require('../config');

const client = twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);

/* eslint-disable new-cap */
const router = express.Router();

// GET: /
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Template App', scripts: ['js/send-sms.js'] });
});

// GET: /example
router.get('/example', (req, res, next) => {
  res.send({
    example: true,
  });
});

// POST: /send-sms
router.post('/send-sms', async (req, res, next) => {
  const { to, body } = req.body;
  try {
    const { sid } = await client.messages.create({
      from: cfg.twilioPhoneNumber,
      to,
      body,
    });

    res.send({
      status: 'success',
      message: `SMS sent to ${req.body.to}. Message SID: ${sid}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: 'error',
      message: 'Failed to send SMS. Check server logs for more details.',
    });
  }
});

module.exports = router;
