const jwt = require("jsonwebtoken");
const User = require("./path_to_your_user_model");

// module.exports = function (req, res, next) {
//   const token = req.header("x-auth-token");

//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }

//   try {
//     const decoded = jwt.verify(token, "yourSecretKey");
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     res.status(401).json({ msg: "Token is not valid" });
//   }
// };

const isAuthenticated = async (req, res, next) => {
  const token = req.header("x-auth-token"); // Assuming the token is sent in the header with the name 'x-auth-token'

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user and attach to req object
    req.user = await User.findById(decoded.userId);

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Token is not valid, user not found." });
    }

    next();
  } catch (error) {
    console.error("Something went wrong with authentication middleware", error);
    return res.status(500).json({ message: "Token is not valid." });
  }
};

module.exports = isAuthenticated;
