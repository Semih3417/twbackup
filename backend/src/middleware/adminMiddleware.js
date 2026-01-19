module.exports = (req, res, next) => {
  // authenticateToken muss vorher gelaufen sein, daher kennen wir req.user
  if (req.user && req.user.role === 'admin') {
    next(); // Darf passieren
  } else {
    res.status(403).json({ message: 'Zugriff verweigert: Nur für Administratoren.' });
  }
};