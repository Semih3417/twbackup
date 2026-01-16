const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_dev_key';

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Format: "Bearer <TOKEN>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Zugriff verweigert (Kein Token)' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token ungültig oder abgelaufen' });
    
    // Wir hängen den User an das Request-Objekt
    req.user = user; 
    next();
  });
};