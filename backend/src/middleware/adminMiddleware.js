module.exports = (req, res, next) => {
  // authenticateToken muss vorher gelaufen sein, daher kennen wir req.user
  if (req.user && req.user.role === 'admin') {
    next(); // Darf passieren
  } else {
    res.status(403).json({ message: 'Zugriff verweigert: Nur für Administratoren.' });
  }
};

module.exports = (req, res, next) => {
  console.log("Prüfe Admin-Status für User:", req.user); // <--- Hinzufügen zum Debuggen

  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.log("Zugriff verweigert. Rolle ist:", req.user?.role); // <--- Hinzufügen
    res.status(403).json({ message: 'Zugriff verweigert: Nur für Administratoren.' });
  }
};