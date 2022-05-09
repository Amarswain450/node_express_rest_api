import bcrypt from "bcryptjs";
import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import RefreshToken from "../../models/refreshToken";
import User from "../../models/user";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";

const loginController = {
  async login(req, res, next) {
    const registerSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      const result = await User.findOne({ email: req.body.email });
      if (!result) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      //compare password
      const match = await bcrypt.compare(req.body.password, result.password);
      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      let access_token = JwtService.sign({
        _id: result._id,
        role: result.role,
      });

      let refresh_token = JwtService.sign(
        { _id: result._id, role: result.role },
        "1y",
        REFRESH_SECRET
      );

      await RefreshToken.create({ token: refresh_token });

      return res.status(200).json({ access_token, refresh_token });
    } catch (err) {
      return next(err);
    }
  },

  async logout(req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token });
    } catch (err) {
      return next(new Error("Something went wrong in the database"));
    }

    return res.status(200).json({ message: "Deleted successfully" });
  },
};

export default loginController;
