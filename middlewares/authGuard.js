const jwt = require("jsonwebtoken");

const authGuard = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    const token = authorization.split(' ')[1];
    console.log('token', token);
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

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
