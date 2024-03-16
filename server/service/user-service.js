const ApiError = require("../error/ApiError");
const { SalesUsers } = require("../models/models");
const tokenService = require("./token-service");
const bcrypt = require("bcrypt");

class UserService {
  async signup(email, password) {
    const condidate = await SalesUsers.findOne({ where: { email: email } });
    if (condidate) {
      return next(
        ApiError.badRequest(
          "You already have such a username , come up with a new one"
        )
      );
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    const user = await SalesUsers.create({
      email: email,
      password: hashedPassword,
    });
    const payload = { id: user.id, email: email };
    const tokens = tokenService.generateTokens(payload);
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, iserId: user.id };
  }

  async signin(email, password) {
    const user = await SalesUsers.findOne({ where: { email: email } });
    if (!user) {
      return next(ApiError.internal("The user was not found"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Invalid password"));
    }
    const payload = { id: user.id, email: email };
    const tokens = tokenService.generateTokens(payload);
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, iserId: user.id };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await SalesUsers.findOne({ where: { id: userData.id } });
    const payload = { id: user.dataValues.id, email: user.dataValues.email };
    const tokens = tokenService.generateTokens(payload);
    await tokenService.saveToken(user.dataValues.id, tokens.refreshToken);

    return { ...tokens, iserId: user.dataValues.id };
  }
}

module.exports = new UserService();
