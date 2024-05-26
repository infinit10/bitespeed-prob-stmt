const { Op, QueryTypes } = require('sequelize');
const { getModel } = require('../db/models');
const { getSequelizeInstance } = require('../db');

const modelName = 'contacts';

module.exports.createContact = async function createContact(body) {
  const { email, phoneNumber } = body;

  if (!email && !phoneNumber) {
    return {
      success: false,
      statusCode: 400,
      message: 'Pass atleast one of email or phoneNumber',
    };
  }

  const contactModel = getModel(modelName);
  const existingContact = await contactModel.findAll({
    where: {
      [Op.or]: [{ email }, { phoneNumber }],
    },
    order: [
      ['createdAt', 'ASC'],
    ],
    raw: true,
  });

  const newContact = {
    ...(body.phoneNumber && { phoneNumber: body.phoneNumber }),
    ...(body.email && { email: body.email }),
  };

  // New contact to be added
  if (existingContact && existingContact.length < 1) {
    newContact.linkPrecedence = "primary";
    await contactModel.create(newContact);
    return { success: true, statusCode: 201 };
  }

  // Only primary contact exists
  if (existingContact.length === 1 && existingContact[0].linkPrecedence === "primary") {
    newContact.linkPrecedence = "secondary";
    newContact.linkedId = existingContact.pop().id;
    await contactModel.create(newContact);
  } else {
    if (existingContact.some((contact) => contact.linkPrecedence === "secondary")) { // there are some secondary contacts already available
      const primaryContact = existingContact.shift(); // existingContact arr is sorted by time. oldest is primary contact
      await contactModel.create({
        ...newContact,
        linkPrecedence: "secondary",
        linkedId: primaryContact.id,
      });
    } else { // all primary contacts, all others except the oldest to be made secondary
      const primaryContact = existingContact.shift();
      const contactIdsArr = existingContact.map((contact) => contact.id);
      await contactModel.update(
        {
          linkPrecedence: "secondary",
          linkedId: primaryContact.id,
        }, {
          where: {
            id: {
              [Op.in]: contactIdsArr,
            }
          },
        }
      );
    }
  }

  return {
    success: true,
    statusCode: 201,
    message: 'Contact saved successfully',
  };
};

module.exports.contactDetails = async function contactDetails(payload) {
  const { email, phoneNumber } = payload;

  if (!email && !phoneNumber) return { success: false, statusCode: 400 };

  const contactList = await getSequelizeInstance().query(
    `WITH InitialQuery AS (
      SELECT *
      FROM contacts
      WHERE email = :email OR phoneNumber = :phoneNumber
    ),
    LinkedContacts AS (
      SELECT c.*
      FROM contacts c
      WHERE c.linkedId IN (SELECT id FROM InitialQuery)
    ),
    PrimaryContacts AS (
      SELECT c.*
      FROM contacts c
      WHERE c.id IN (SELECT linkedId FROM InitialQuery WHERE linkedId IS NOT NULL)
    )
    SELECT *
    FROM InitialQuery
    UNION
    SELECT *
    FROM LinkedContacts
    UNION
    SELECT *
    FROM PrimaryContacts;`, {
      type: QueryTypes.SELECT,
      replacements: { email, phoneNumber },
    },
  );

  const data = {
    contact: {},
  };

  if (contactList && contactList.length > 0) {
    const primaryContact = []; const secondaryContacts = [];
    
    contactList.forEach((c) => {
      if (c.linkPrecedence === "primary") {
        primaryContact.push(c);
      } else {
        secondaryContacts.push(c);
      }
    });

    data.contact.primaryContactId = primaryContact[0].id;
    const emails = [primaryContact[0].email];
    const phoneNums = [primaryContact[0].phoneNumber];
    const secContactIds = [];
    
    secondaryContacts.forEach((sC) => {
      if (sC.email) emails.push(sC.email);
      if (sC.phoneNumber) phoneNums.push(sC.phoneNumber);

      secContactIds.push(sC.id);
    });
    
    data.contact.emails = [... new Set(emails)];
    data.contact.phoneNumbers = [...new Set(phoneNums)];
    data.contact.secondaryContactIds = secContactIds;
  }

  return {
    success: true,
    statusCode: 200,
    data,
  };
};