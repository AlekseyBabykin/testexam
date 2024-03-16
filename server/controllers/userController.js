const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const userService = require("../service/user-service");

class UserController {
  async signup(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest("Validation error", errors.array()));
      }
      const { email, password } = req.body;
      const userData = await userService.signup(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData.accessToken);
    } catch (e) {
      next(ApiError.badRequest(e.massage));
    }
  }
  async signin(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.signin(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData.accessToken);
    } catch (e) {
      next(ApiError.badRequest(e.massage));
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const token = await userService.logout(refreshToken);

      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(ApiError.badRequest(e.massage));
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData.accessToken);
    } catch (e) {
      next(ApiError.badRequest(e.massage));
    }
  }
}

module.exports = new UserController();
