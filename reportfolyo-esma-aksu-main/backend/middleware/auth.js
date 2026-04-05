const jwt = require('jsonwebtoken');

// JWT Token doğrulama middleware'i
module.exports = (req, res, next) => {
  try {
    // Token'ı header'dan al
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Erişim reddedildi. Token bulunamadı.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rafarasi_secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz veya süresi dolmuş token.'
    });
  }
};
