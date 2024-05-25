module.exports = function loadSchema(sequelize, DataTypes) {
  return sequelize.define(
    'contacts',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      linkedId: {
        type: DataTypes.INTEGER,
      },
      linkPrecedence: {
        type: DataTypes.ENUM,
        values: ["primary", "secondary"],
      },
    },
    {
      paranoid: true, // This sets an deletedAt key to perform soft-delete
    }
  )
}