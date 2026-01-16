import { useState, useEffect } from 'react';
import client from '../api/client';

const SwapModal = ({ targetVehicle, onClose }) => {
  const [myVehicles, setMyVehicles] = useState([]);
  const [selectedMyVehicleId, setSelectedMyVehicleId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Eigene Autos laden, sobald das Modal öffnet
  useEffect(() => {
    client.get('/vehicles/my-vehicles')
      .then(res => {
        setMyVehicles(res.data);
      })
      .catch(err => console.error("Fehler beim Laden deiner Autos", err));
  }, []);

  const handleConfirmSwap = async () => {
    if (!selectedMyVehicleId) return alert("Bitte wähle eines deiner Autos aus!");

    setLoading(true);
    try {
      // Hier senden wir die Anfrage an deinen (noch zu erstellenden) Trade-Controller
      await client.post('/trades', {
        offered_vehicle_id: selectedMyVehicleId,
        requested_vehicle_id: targetVehicle.vehicle_id,
        message: message
      });

      alert("Tauschanfrage wurde erfolgreich gesendet!");
      onClose(); // Modal schließen
    } catch (err) {
      alert("Fehler beim Senden der Anfrage: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Tausch vorschlagen</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-2xl">&times;</button>
        </div>

        {/* Info über das Wunsch-Auto */}
        <div className="bg-blue-50 p-3 rounded-lg mb-6 flex items-center gap-3">
          <img src={targetVehicle.thumbnail_url || 'https://placehold.co/100'} className="w-16 h-16 object-cover rounded" alt="Target" />
          <div>
            <p className="text-xs text-blue-600 font-bold uppercase">Dein Wunschwagen</p>
            <p className="font-semibold">{targetVehicle.manufacturer} {targetVehicle.model}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Auswahl der eigenen Autos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Welches deiner Autos bietest du an?
            </label>
            <select 
              className="w-full border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedMyVehicleId}
              onChange={(e) => setSelectedMyVehicleId(e.target.value)}
            >
              <option value="">-- Bitte wählen --</option>
              {myVehicles.map(v => (
                <option key={v.vehicle_id} value={v.vehicle_id}>
                  {v.manufacturer_name} {v.model_name}
                </option>
              ))}
            </select>
            {myVehicles.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Du hast noch keine Autos inseriert!</p>
            )}
          </div>

          {/* Optionale Nachricht */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nachricht an den Besitzer (optional)
            </label>
            <textarea 
              className="w-full border rounded-lg p-2 text-sm h-20"
              placeholder="Hi, hättest du Interesse an einem Tausch gegen meinen..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button 
            onClick={handleConfirmSwap}
            disabled={loading || myVehicles.length === 0}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              loading || myVehicles.length === 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Sende Anfrage...' : 'Anfrage abschicken'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;