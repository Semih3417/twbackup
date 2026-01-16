import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client, { IMAGE_BASE_URL } from '../api/client';
import { getImageUrl } from '../utils/imageHelper';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Stammdaten
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [groupedFeatures, setGroupedFeatures] = useState({});

  // Existierende Bilder (vom Server)
  const [existingImages, setExistingImages] = useState([]);

  // Formular State
  const [formData, setFormData] = useState({
    manufacturer_id: '', model_id: '', fuel_type_id: '', 
    year_of_manufacture: '', mileage_km: '', description: '', swap_preference: '',
    condition_rating: '3', body_type: '', doors: '', seats: '', has_sliding_door: false,
    transmission: '', power_hp: '', engine_displacement: '', cylinders: '', weight_kg: '', drive_type: '',
    fuel_consumption: '', tank_volume: '', emission_class: '', emission_sticker: '', hu_valid_until: '',
    exterior_color: '', interior_color: '', interior_material: '', airbags: '', climate_control: '',
    feature_ids: []
  });

  // Neue Dateien (Upload)
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Statische Listen
  const bodyTypes = ["Limousine", "Kombi", "SUV / Geländewagen", "Cabrio / Roadster", "Coupé", "Kleinwagen", "Van / Minibus", "Transporter", "Andere"];
  const transmissions = ["Schaltgetriebe", "Automatik", "Halbautomatik"];
  const driveTypes = ["Frontantrieb", "Heckantrieb", "Allrad"];
  const colors = ["Schwarz", "Weiß", "Silber", "Grau", "Blau", "Rot", "Grün", "Gelb", "Braun", "Orange", "Beige", "Violett", "Gold", "Andere"];
  const interiorMaterials = ["Stoff", "Teilleder", "Vollleder", "Alcantara", "Velours", "Kunstleder", "Andere"];
  const emissions = ["Euro 6d", "Euro 6", "Euro 5", "Euro 4", "Euro 3", "Euro 2", "Euro 1"];
  const stickers = ["4 (Grün)", "3 (Gelb)", "2 (Rot)", "Keine"];
  const airbagsList = ["Fahrer-Airbag", "Front-Airbags", "Front- und Seiten-Airbags", "Vollausstattung (Front, Seite, Weitere)"];
  const climateList = ["Keine", "Klimaanlage", "Klimaautomatik", "2-Zonen-Klimaautomatik", "3-Zonen-Klimaautomatik", "4-Zonen-Klimaautomatik"];

  // 1. Stammdaten laden
  useEffect(() => {
    client.get('/form-data').then(res => {
      setManufacturers(res.data.manufacturers);
      setFuelTypes(res.data.fuelTypes);
      const groups = {};
      res.data.features.forEach(f => {
        const cat = f.category || 'Sonstiges';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(f);
      });
      setGroupedFeatures(groups);
    });
  }, []);

  // 2. Fahrzeugdaten laden & ins Formular füllen
  useEffect(() => {
    client.get(`/vehicles/${id}`).then(async res => {
      const v = res.data;
      
      // Modelle für diesen Hersteller laden
      if(v.manufacturer_id) {
          const modelRes = await client.get(`/models/${v.manufacturer_id}`);
          setModels(modelRes.data);
      }

      // Das Formular füllen
      setFormData({
        manufacturer_id: v.manufacturer_id,
        model_id: v.model_id,
        fuel_type_id: v.fuel_type_id,
        year_of_manufacture: v.year_of_manufacture,
        mileage_km: v.mileage_km,
        description: v.description || '',
        swap_preference: v.swap_preference || '',
        condition_rating: v.condition_rating,
        body_type: v.body_type || '',
        doors: v.doors || '',
        seats: v.seats || '',
        has_sliding_door: Boolean(v.has_sliding_door),
        transmission: v.transmission || '',
        power_hp: v.power_hp || '',
        engine_displacement: v.engine_displacement || '',
        cylinders: v.cylinders || '',
        weight_kg: v.weight_kg || '',
        drive_type: v.drive_type || '',
        fuel_consumption: v.fuel_consumption || '',
        tank_volume: v.tank_volume || '',
        emission_class: v.emission_class || '',
        emission_sticker: v.emission_sticker || '',
        hu_valid_until: v.hu_valid_until ? v.hu_valid_until.split('T')[0] : '',
        exterior_color: v.exterior_color || '',
        interior_color: v.interior_color || '',
        interior_material: v.interior_material || '',
        airbags: v.airbags || '',
        climate_control: v.climate_control || '',
        feature_ids: [] // TODO: API muss feature_ids liefern!
      });
      
      setExistingImages(v.images || []);

    }).catch(err => {
        console.error(err);
        alert("Fahrzeug konnte nicht geladen werden");
        navigate('/my-garage');
    });
  }, [id, navigate]);

  // Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFeatureToggle = (featureId) => {
    setFormData(prev => {
      const newFeatures = prev.feature_ids.includes(featureId)
        ? prev.feature_ids.filter(id => id !== featureId)
        : [...prev.feature_ids, featureId];
      return { ...prev, feature_ids: newFeatures };
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const deleteExistingImage = async (img) => {
      if(window.confirm("Bild wirklich löschen?")) {
          // Im echten Code: await client.delete(`/vehicles/${id}/images/${img.image_id}`);
          setExistingImages(prev => prev.filter(i => i.image_url !== img.image_url));
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
        if (key !== 'feature_ids') data.append(key, formData[key]);
    });
    formData.feature_ids.forEach(id => data.append('feature_ids', id));
    files.forEach(file => data.append('gallery', file));

    try {
      await client.put(`/vehicles/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('Änderungen gespeichert!');
      navigate(`/vehicles/${id}`);
    } catch (err) {
      console.error(err);
      alert('Fehler: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
    <Navbar />
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-primary mb-8">Fahrzeug bearbeiten</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* === BILDER (Vorhandene + Neue) === */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h2 className="text-xl font-bold text-slate-800 mb-4">📸 Bilder verwalten</h2>
           
           {/* Vorhandene Bilder */}
           {existingImages.length > 0 && (
             <div className="mb-6">
                 <p className="text-sm font-bold text-slate-500 mb-2">Bereits hochgeladen:</p>
                 <div className="grid grid-cols-4 gap-4">
                    {existingImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                            <img src={getImageUrl(img.image_url)} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => deleteExistingImage(img)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">🗑️</button>
                        </div>
                    ))}
                 </div>
             </div>
           )}

           {/* Upload Neue Bilder */}
           <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition relative cursor-pointer">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <p className="font-bold text-brand-primary">Neue Bilder hinzufügen +</p>
           </div>
           
           {/* Vorschau Neue Bilder */}
           {previews.length > 0 && (
             <div className="grid grid-cols-5 gap-4 mt-4">
               {previews.map((src, index) => (
                 <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-brand-accent/50">
                   <img src={src} className="w-full h-full object-cover" />
                   <button type="button" onClick={() => removeNewFile(index)} className="absolute top-1 right-1 bg-slate-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
                   <span className="absolute bottom-0 w-full text-center bg-brand-accent text-brand-primary text-[10px] font-bold">NEU</span>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* === 2. BASISDATEN (Kopiert aus AddVehicle + Value Props) === */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">🚗 Basisdaten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Hersteller *</label>
              <select name="manufacturer_id" value={formData.manufacturer_id} onChange={handleChange} className="input-field" required>
                <option value="">Bitte wählen...</option>
                {manufacturers.map(m => <option key={m.manufacturer_id} value={m.manufacturer_id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Modell *</label>
              <select name="model_id" value={formData.model_id} onChange={handleChange} className="input-field" required disabled={!models.length}>
                <option value="">Modell wählen...</option>
                {models.map(m => <option key={m.model_id} value={m.model_id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Erstzulassung (Jahr) *</label>
              <input type="number" name="year_of_manufacture" value={formData.year_of_manufacture} placeholder="z.B. 2020" onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Kilometerstand *</label>
              <input type="number" name="mileage_km" value={formData.mileage_km} placeholder="z.B. 50000" onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Kraftstoffart *</label>
              <select name="fuel_type_id" value={formData.fuel_type_id} onChange={handleChange} className="input-field" required>
                <option value="">Wählen...</option>
                {fuelTypes.map(f => <option key={f.fuel_type_id} value={f.fuel_type_id}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Karosserieform</label>
              <select name="body_type" value={formData.body_type} onChange={handleChange} className="input-field">
                <option value="">Wählen...</option>
                {bodyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
             <div>
              <label className="label">Anzahl Türen</label>
              <select name="doors" value={formData.doors} onChange={handleChange} className="input-field">
                <option value="">Wählen...</option>
                <option value="2">2/3</option>
                <option value="4">4/5</option>
                <option value="6">6/7</option>
              </select>
            </div>
            <div>
              <label className="label">Sitzplätze</label>
              <input type="number" name="seats" value={formData.seats} placeholder="z.B. 5" onChange={handleChange} className="input-field" />
            </div>
             <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="has_sliding_door" checked={formData.has_sliding_door} onChange={handleChange} className="w-5 h-5 text-brand-primary rounded" />
                  <span className="text-slate-700 font-medium">Fahrzeug hat Schiebetür(en)</span>
                </label>
            </div>
          </div>
        </div>

        {/* === 3. TECHNISCHE DATEN (Kopiert aus AddVehicle + Value Props) === */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">⚙️ Technik & Umwelt</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
               <label className="label">Getriebe</label>
               <select name="transmission" value={formData.transmission} onChange={handleChange} className="input-field">
                 <option value="">Wählen...</option>
                 {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
             </div>
             <div>
               <label className="label">Leistung (PS)</label>
               <input type="number" name="power_hp" value={formData.power_hp} placeholder="z.B. 150" onChange={handleChange} className="input-field" />
             </div>
             <div>
               <label className="label">Hubraum (ccm)</label>
               <input type="number" name="engine_displacement" value={formData.engine_displacement} placeholder="z.B. 1995" onChange={handleChange} className="input-field" />
             </div>
             <div>
               <label className="label">Antriebsart</label>
               <select name="drive_type" value={formData.drive_type} onChange={handleChange} className="input-field">
                 <option value="">Wählen...</option>
                 {driveTypes.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
             </div>
              <div>
               <label className="label">HU / TÜV bis</label>
               <input type="date" name="hu_valid_until" value={formData.hu_valid_until} onChange={handleChange} className="input-field" />
             </div>
             <div>
               <label className="label">Umweltplakette</label>
               <select name="emission_sticker" value={formData.emission_sticker} onChange={handleChange} className="input-field">
                 <option value="">Wählen...</option>
                 {stickers.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
             </div>
           </div>
        </div>

        {/* === 4. FARBE & INNENRAUM (Kopiert aus AddVehicle + Value Props) === */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">🎨 Farbe & Innenraum</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
               <label className="label">Außenfarbe</label>
               <select name="exterior_color" value={formData.exterior_color} onChange={handleChange} className="input-field">
                 <option value="">Wählen...</option>
                 {colors.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
             <div>
               <label className="label">Innenfarbe</label>
               <select name="interior_color" value={formData.interior_color} onChange={handleChange} className="input-field">
                 <option value="">Wählen...</option>
                 {colors.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
             <div>
               <label className="label">Material Innenausstattung</label>
               <select name="interior_material" value={formData.interior_material} onChange={handleChange} className="input-field">
                 <option value="">Wählen...</option>
                 {interiorMaterials.map(m => <option key={m} value={m}>{m}</option>)}
               </select>
             </div>
             <div>
               <label className="label">Airbags</label>
               <select name="airbags" value={formData.airbags} onChange={handleChange} className="input-field">
                 <option value="">Wählen...</option>
                 {airbagsList.map(a => <option key={a} value={a}>{a}</option>)}
               </select>
             </div>
             <div>
               <label className="label">Klimatisierung</label>
               <select name="climate_control" value={formData.climate_control} onChange={handleChange} className="input-field">
                 <option value="">Wählen...</option>
                 {climateList.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
           </div>
        </div>

        {/* === 5. AUSSTATTUNG (CHECKBOXEN) === */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">✨ Ausstattung</h2>
           
           <div className="space-y-8">
             {Object.keys(groupedFeatures).sort().map(category => (
               <div key={category}>
                 <h3 className="font-bold text-brand-primary border-b border-slate-100 pb-2 mb-4 uppercase text-sm tracking-wider">{category}</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                   {groupedFeatures[category].map(f => (
                     <label key={f.feature_id} className="flex items-start gap-2 cursor-pointer text-sm text-slate-600 hover:text-brand-primary transition">
                       <input 
                         type="checkbox" 
                         className="mt-1 w-4 h-4 text-brand-primary rounded focus:ring-brand-accent"
                         checked={formData.feature_ids.includes(f.feature_id)}
                         onChange={() => handleFeatureToggle(f.feature_id)}
                       />
                       <span>{f.name}</span>
                     </label>
                   ))}
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* === 6. TEXTE (Kopiert aus AddVehicle + Value Props) === */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">📝 Beschreibung & Wunsch</h2>
           
           <div className="space-y-6">
             <div>
               <label className="label">Beschreibung des Fahrzeugs</label>
               <textarea name="description" value={formData.description} rows="5" className="input-field" placeholder="Beschreibe den Zustand, letzte Reparaturen, Kratzer etc." onChange={handleChange}></textarea>
             </div>
             <div>
               <label className="label">Dein Tauschwunsch (Was suchst du?)</label>
               <textarea name="swap_preference" value={formData.swap_preference} rows="3" className="input-field" placeholder="z.B. Suche einen Kombi, Diesel, Anhängerkupplung, gerne Audi oder BMW..." onChange={handleChange}></textarea>
             </div>
           </div>
        </div>

        <button type="submit" className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-xl shadow-brand-primary/20">
          Änderungen speichern
        </button>

      </form>
    </div>
    <Footer />
    <style>{`.label { display: block; font-size: 0.875rem; font-weight: 700; color: #475569; margin-bottom: 0.25rem; } .input-field { width: 100%; border: 1px solid #e2e8f0; padding: 0.5rem 0.75rem; border-radius: 0.5rem; outline: none; transition: all 0.2s; } .input-field:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }`}</style>
    </div>
  );
}