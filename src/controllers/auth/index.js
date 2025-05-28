const authService = require('../../services/auth');

const login = async (req, res, next) => {

  const { email, password } = req.body;
  const result = await authService.login(email, password);

  if (!result.success) {
    return res.status(401).json({ message: result.message });
  }

  res.json({ token: result.token });
};


module.exports = login