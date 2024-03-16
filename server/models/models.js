const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const SalesUsers = sequelize.define("sales_users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
});

const CompanyBusiness = sequelize.define("company_business", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  info: { type: DataTypes.TEXT },
});

const Meetings = sequelize.define("meetings", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  details: { type: DataTypes.TEXT },
  date: { type: DataTypes.DATE },
  location: { type: DataTypes.STRING },
  business_name: { type: DataTypes.STRING },
  summary: { type: DataTypes.TEXT },
});

const TokenTable = sequelize.define("token", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  refreshToken: { type: DataTypes.STRING },
});

SalesUsers.hasMany(CompanyBusiness, { onDelete: "CASCADE" });
CompanyBusiness.belongsTo(SalesUsers);

SalesUsers.hasOne(TokenTable, { onDelete: "CASCADE" });
TokenTable.belongsTo(SalesUsers);

CompanyBusiness.hasMany(Meetings, { onDelete: "CASCADE" });
Meetings.belongsTo(CompanyBusiness);

SalesUsers.hasMany(Meetings, { onDelete: "CASCADE" });
Meetings.belongsTo(SalesUsers);

module.exports = {
  SalesUsers,
  CompanyBusiness,
  Meetings,
  TokenTable,
};
