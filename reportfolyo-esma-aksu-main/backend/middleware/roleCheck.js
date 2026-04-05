// Rol kontrolü middleware'i
// Kullanım: roleCheck('admin', 'satici')
module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Önce giriş yapmalısınız.'
      });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmuyor.'
      });
    }

    next();
  };
};
