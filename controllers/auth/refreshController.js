import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import RefreshToken from "../../models/refreshToken";
import User from "../../models/user";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";

const refreshController = {
  async refresh(req, res, next) {
    //validation
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    let refreshtoken;
    try {
      refreshtoken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });
      if (!refreshtoken) {
        return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
      }

      let userID;
      try {
        const { _id } = JwtService.verify(refreshtoken.token, REFRESH_SECRET);
        console.log(_id);
        userID = _id;
      } catch (err) {
        return next(err);
      }

      const result = await User.findOne({ _id: userID });
      if (!result) {
        return next(CustomErrorHandler.unAuthorized("No user found!"));
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
};

export default refreshController;
