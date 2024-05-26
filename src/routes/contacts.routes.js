const express = require('express');
const router = express.Router();
const contactService = require('../services/contacts.service');
const { writeResponse } = require('../utils/responseHandler');

router.post('/create', async (req, res) => {
  const { body } = req;

  try {
    const { success, statusCode, message } = await contactService.createContact(body);
    writeResponse(res, { success, statusCode, message })
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/identify', async (req, res) => {
  const { body } = req;

  try {
    const { success, statusCode, data } = await contactService.contactDetails(body);
    writeResponse(res, { success, statusCode, data });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = {
  router,
  prefix: '/contact',
}
