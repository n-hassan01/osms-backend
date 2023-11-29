const jwt = require("jsonwebtoken");

const authGuard = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  const value = req.getValue();
  console.log("auth..", value);

  try {
    // const token = authorization.split(' ')[1];
    const decodedToken = jwt.verify(value, process.env.SECRET_KEY);
    console.log(decodedToken);

    if (!decodedToken) {
      res.status(403).send("Forbidden!");
    }

    const { id, role } = decodedToken;
    req.id = id;
    req.role = role;
    next();
  } catch (err) {
    console.log(err.message);

    next({ message: "Authorization failed!" });
  }
};

module.exports = authGuard;
