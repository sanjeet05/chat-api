const passport = require("passport");

const handleJWT = (req, res, next) => async (err, result, info) => {
  const error = err || info;
  const logIn = Promise.promisify(req.logIn);
  const { user, payload } = result;
  try {
    if (error || !user) {
      console.error("jwt-info", info.message);
      return res.status(401).json({ error: "Unauthorised user" });
    }
    await logIn(user, { session: false });
  } catch (e) {
    return res.status(401).json({ error: "Unauthorised user" });
  }

  req.user = user;
  req.payload = payload;

  return next();
};

exports.authorize = () => (req, res, next) =>
  passport.authenticate("jwt", { session: false }, handleJWT(req, res, next))(req, res, next);
