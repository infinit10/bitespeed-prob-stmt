const express = require('express');
const router = express.Router();
const contactService = require('../services/contacts.service');

router.post('/create', async (req, res) => {
  const { body } = req;

  try {
    const { success, statusCode } = await contactService.createContact(body);
    res.status(statusCode).send({
      success,
      message: 'Contact saved successfully',
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/identify', async (req, res) => {
  const { body } = req;

  try {
    const { success, statusCode, data } = await contactService.contactDetails(body);
    const respBody = { success, ...data };
    res.status(statusCode).send(respBody);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = {
  router,
  prefix: '/contact',
}
