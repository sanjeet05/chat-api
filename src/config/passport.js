const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;

const { jwtSecret } = require("./vars");

const User = require("../api/models/user.model");

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
};

const register = async (phoneNumber, password, done) => {
  try {
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (user) {
      return done(null, false, { message: "user already exist" });
    }
    const reqBody = {
      phoneNumber: phoneNumber,
    };
    const newUser = await new User(reqBody).save();

    return done(null, newUser, { message: "user created successfully" });
  } catch (error) {
    return done(error, false);
  }
};

const local = async (phoneNumber, password, done) => {
  try {
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      return done(null, false, { message: "user does not exist" });
    }
    // check, password is correct or not
    // const isPassword = await user.passwordMatches(password, user.password);
    // if (!isPassword) {
    //   return done(null, false, { message: "incorrect phone number or password" });
    // }

    return done(null, user, { message: "logged-in successfully" });
  } catch (error) {
    return done(error, false);
  }
};

const jwt = async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload.sub });
    if (user) {
      const result = {
        user,
        payload,
      };
      return done(null, result);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

exports.register = new LocalStrategy(
  {
    usernameField: "phoneNumber",
    passwordField: "otp",
  },
  register
);

exports.local = new LocalStrategy(
  {
    usernameField: "phoneNumber",
    passwordField: "otp",
  },
  local
);

exports.jwt = new JwtStrategy(jwtOptions, jwt);
