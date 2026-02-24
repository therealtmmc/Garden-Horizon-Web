import React, { useState, useMemo } from 'react';
import { Calculator as CalcIcon, Plus, Trash2, Coins, Scale, Sprout, ChevronDown, X, Zap, CloudRain, Snowflake, Wind, Droplets, Star, Award, Leaf, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Plant {
  id: string;
  name: string;
  weight: number;
  baseWeight: number;
  basePrice: number;
  multipliers: Multiplier[];
  finalValue: number;
}

interface Multiplier {
  id: string;
  name: string;
  value: number;
  emoji: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

const PREDEFINED_PLANTS = [
  { name: "Amberpine", weight: 0.08, price: 400 },
  { name: "Apple", weight: 0.19, price: 270 },
  { name: "Banana", weight: 0.13, price: 750 },
  { name: "Beetroot", weight: 0.09, price: 2000 },
  { name: "Bellpepper", weight: 0.14, price: 50 },
  { name: "Birch", weight: 0.06, price: 500 },
  { name: "Cabbage", weight: 1.1, price: 60000 },
  { name: "Carrot", weight: 0.07, price: 30 },
  { name: "Cherry", weight: 0.01, price: 8000 },
  { name: "Corn", weight: 0.18, price: 15 },
  { name: "Dandelion", weight: 0.03, price: 45 },
  { name: "Dawnblossom", weight: 0.12, price: 12000 },
  { name: "Dawnfruit", weight: 0.06, price: 600 },
  { name: "Emberspine", weight: 0.08, price: 400 },
  { name: "Goldenberry", weight: 0.02, price: 65 },
  { name: "Mushroom", weight: 0.03, price: 40 },
  { name: "Olive", weight: 0.06, price: 10000 },
  { name: "Onion", weight: 0.13, price: 220 },
  { name: "Orange", weight: 0.21, price: 1800 },
  { name: "Plum", weight: 0.07, price: 1000 },
  { name: "Potato", weight: 0.17, price: 1500 },
  { name: "Rose", weight: 0.04, price: 320 },
  { name: "Strawberry", weight: 0.02, price: 32 },
  { name: "Sunpetal", weight: 0.04, price: 60 },
  { name: "Tomato", weight: 0.15, price: 60 },
  { name: "Wheat", weight: 0.03, price: 7200 },
];

const AVAILABLE_MULTIPLIERS: Omit<Multiplier, 'id'>[] = [
  { name: "Starstruck", value: 6.5, emoji: "🌟" },
  { name: "Shocked", value: 4.5, emoji: "⚡" },
  { name: "Sandy", value: 2.5, emoji: "🌪️" },
  { name: "Snowy", value: 2.0, emoji: "❄️" },
  { name: "Flooded", value: 1.8, emoji: "🌊" },
  { name: "Chilled", value: 1.5, emoji: "🧊" },
  { name: "Soaked", value: 1.2, emoji: "💧" },
  { name: "Foggy", value: 1.2, emoji: "🌫️" },
  { name: "Muddy", value: 5.0, emoji: "👢" },
  { name: "Frostbit", value: 3.5, emoji: "🥶" },
  { name: "Mossy", value: 3.5, emoji: "🌿" },
  { name: "Lush", value: 3.0, emoji: "🍃" },
  { name: "Ripened", value: 2.0, emoji: "🎋" },
  { name: "Unripe", value: 1.0, emoji: "🌱" },
  { name: "Gold", value: 5.0, emoji: "💰" },
  { name: "Silver", value: 2.0, emoji: "🥈" },
];

export function Calculator() {
  const [plants, setPlants] = useState<Plant[]>(() => {
    const saved = localStorage.getItem('garden-horizon-plants');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved plants", e);
        return [];
      }
    }
    return [];
  });
  const [selectedPlantName, setSelectedPlantName] = useState('');
  const [selectedMultipliers, setSelectedMultipliers] = useState<Multiplier[]>([]);
  const [activeMultiplierId, setActiveMultiplierId] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Save to localStorage whenever plants change
  React.useEffect(() => {
    localStorage.setItem('garden-horizon-plants', JSON.stringify(plants));
  }, [plants]);

  const selectedPlantData = useMemo(() => 
    PREDEFINED_PLANTS.find(p => p.name === selectedPlantName),
    [selectedPlantName]
  );

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handlePlantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlantName(e.target.value);
  };

  const addMultiplier = () => {
    if (!activeMultiplierId) return;
    const multiplierDef = AVAILABLE_MULTIPLIERS.find(m => m.name === activeMultiplierId);
    if (multiplierDef && !selectedMultipliers.some(m => m.name === multiplierDef.name)) {
      setSelectedMultipliers([...selectedMultipliers, { ...multiplierDef, id: crypto.randomUUID() }]);
    }
    setActiveMultiplierId('');
  };

  const removeMultiplier = (id: string) => {
    setSelectedMultipliers(selectedMultipliers.filter(m => m.id !== id));
  };

  const calculateCurrentValue = () => {
    if (!selectedPlantData) return 0;

    // Formula: basePrice * totalMutationMultiplier (assuming standard base weight)
    const totalMultiplier = selectedMultipliers.reduce((acc, curr) => acc * curr.value, 1);
    
    const value = selectedPlantData.price * totalMultiplier;
    
    return value;
  };

  const addPlantToList = () => {
    if (!selectedPlantData) return;
    
    setIsCalculating(true);

    // Simulate calculation delay for effect
    setTimeout(() => {
      const finalValue = calculateCurrentValue();
      
      const newPlant: Plant = {
        id: crypto.randomUUID(),
        name: selectedPlantData.name,
        weight: selectedPlantData.weight, // Default to base weight
        baseWeight: selectedPlantData.weight,
        basePrice: selectedPlantData.price,
        multipliers: [...selectedMultipliers],
        finalValue: finalValue,
      };

      // Add to beginning of list so user sees it immediately
      setPlants(prev => [newPlant, ...prev]);
      showToast(`Harvested ${newPlant.name}!`, 'success');
      
      // Reset form
      setSelectedPlantName('');
      setSelectedMultipliers([]);
      setIsCalculating(false);
    }, 600);
  };

  const removePlantFromList = (id: string) => {
    const plantToRemove = plants.find(p => p.id === id);
    if (plantToRemove) {
      showToast(`Removed ${plantToRemove.name}`, 'error');
    }
    setPlants(plants.filter(p => p.id !== id));
  };

  const currentCalculatedValue = calculateCurrentValue();

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8 relative">
      {/* Toasts Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: 20, transition: { duration: 0.2 } }}
              layout
              className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-[0_8px_16px_rgba(0,0,0,0.15)] font-bold text-white min-w-[200px] border-b-4 ${
                toast.type === 'success' 
                  ? 'bg-farm-green border-farm-dark-green' 
                  : 'bg-kahoot-red border-red-700'
              }`}
            >
              <div className="bg-white/20 p-1 rounded-full">
                {toast.type === 'success' ? <CheckCircle size={20} strokeWidth={3} /> : <Trash2 size={20} strokeWidth={3} />}
              </div>
              <span className="drop-shadow-sm">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Calculator Section */}
      <div className="bg-white border-4 border-kahoot-blue rounded-3xl p-6 shadow-[0_8px_0_#0f52ba]">
        <h2 className="text-2xl font-bold text-kahoot-blue mb-6 flex items-center gap-2">
          <CalcIcon className="w-8 h-8" />
          Calculate Plant Value
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plant Selection */}
              <div className="md:col-span-2">
                <label className="block text-gray-500 font-bold mb-2 ml-1">Select Plant</label>
                <div className="relative">
                  <select
                    value={selectedPlantName}
                    onChange={handlePlantChange}
                    className="w-full bg-gray-100 border-2 border-gray-300 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-kahoot-blue focus:ring-4 focus:ring-kahoot-blue/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Choose a plant...</option>
                    {PREDEFINED_PLANTS.map((plant) => (
                      <option key={plant.name} value={plant.name}>
                        {plant.name} (Base: {plant.weight}kg | ${plant.price})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Base Stats Display */}
              {selectedPlantData && (
                <div className="md:col-span-2 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-gray-100 rounded-xl p-3 border-2 border-gray-200 flex flex-col items-center justify-center text-center">
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Base Weight</span>
                    <span className="text-xl font-black text-gray-700 flex items-center gap-1">
                      <Scale className="w-4 h-4 text-gray-400" />
                      {selectedPlantData.weight}kg
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-3 border-2 border-gray-200 flex flex-col items-center justify-center text-center">
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Base Price</span>
                    <span className="text-xl font-black text-gray-700 flex items-center gap-1">
                      <Coins className="w-4 h-4 text-gray-400" />
                      ${selectedPlantData.price}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Multipliers Selection */}
            <div>
              <label className="block text-gray-500 font-bold mb-2 ml-1">Add Mutations & Weather</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={activeMultiplierId}
                    onChange={(e) => setActiveMultiplierId(e.target.value)}
                    className="w-full bg-gray-100 border-2 border-gray-300 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-kahoot-blue focus:ring-4 focus:ring-kahoot-blue/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select multiplier...</option>
                    {AVAILABLE_MULTIPLIERS.filter(m => !selectedMultipliers.some(sm => sm.name === m.name)).map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.emoji} {m.name} ({m.value}x)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
                <button
                  onClick={addMultiplier}
                  disabled={!activeMultiplierId}
                  className={`px-6 rounded-xl font-bold border-b-4 transition-all flex items-center ${
                    activeMultiplierId
                      ? 'bg-kahoot-yellow hover:bg-yellow-400 text-white border-yellow-600 active:border-b-0 active:translate-y-1'
                      : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Active Multipliers Tags */}
            {selectedMultipliers.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 border-dashed">
                <AnimatePresence>
                  {selectedMultipliers.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="bg-white border-2 border-kahoot-purple text-kahoot-purple px-3 py-1.5 rounded-lg font-bold shadow-sm flex items-center gap-2"
                    >
                      <span>{m.emoji} {m.name} <span className="text-xs opacity-75">x{m.value}</span></span>
                      <button
                        onClick={() => removeMultiplier(m.id)}
                        className="hover:bg-red-100 p-0.5 rounded-full text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-kahoot-blue/5 rounded-2xl p-6 border-2 border-kahoot-blue/10">
            <div>
              <h3 className="text-lg font-bold text-kahoot-blue mb-4 uppercase tracking-wider">Estimated Value</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Base Price:</span>
                  <span>
                    {selectedPlantData 
                      ? `$${selectedPlantData.price.toFixed(2)}` 
                      : '$0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Total Multiplier:</span>
                  <span className="bg-kahoot-yellow/20 text-kahoot-yellow px-2 py-0.5 rounded text-sm font-bold border border-kahoot-yellow/30">
                    x{selectedMultipliers.reduce((acc, curr) => acc * curr.value, 1).toFixed(2)}
                  </span>
                </div>
                <div className="h-px bg-gray-300 my-2"></div>
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-kahoot-blue block break-words">
                    ${currentCalculatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={addPlantToList}
              disabled={!selectedPlantData || isCalculating}
              className={`w-full mt-6 font-bold py-4 px-6 rounded-xl border-b-4 transition-all flex items-center justify-center gap-2 text-lg ${
                selectedPlantData && !isCalculating
                  ? 'bg-farm-green hover:bg-green-500 text-white border-farm-dark-green active:border-b-0 active:translate-y-1 shadow-lg shadow-green-200' 
                  : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
              }`}
            >
              {isCalculating ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
              {isCalculating ? 'Calculating...' : 'Add to List'}
            </button>

            <div className="mt-4 text-xs text-gray-500 italic bg-white/50 p-3 rounded-xl border border-gray-200">
              <p>
                Values are estimated based on observed in-game behavior.
                The game uses hidden scaling, rounding, and plant-specific modifiers which may cause real values to differ slightly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-700 ml-2 flex items-center gap-2">
          <Sprout className="w-6 h-6" />
          Harvest History
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {plants.map((plant, index) => (
              <motion.div
                layout
                key={plant.id}
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="bg-white border-4 border-kahoot-purple rounded-3xl p-4 shadow-[0_6px_0_#34116b] relative group"
              >
                <button
                  onClick={() => removePlantFromList(plant.id)}
                  className="absolute -top-3 -right-3 bg-kahoot-red text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex flex-col h-full justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-black text-gray-800 mb-1">{plant.name}</h3>
                      <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">
                        {plant.weight}kg
                      </span>
                    </div>
                    
                    {/* Multipliers List in Card */}
                    {plant.multipliers.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-2 mb-3">
                        {plant.multipliers.map(m => (
                          <span key={m.id} className="text-xs bg-kahoot-purple/10 text-kahoot-purple px-1.5 py-0.5 rounded font-bold border border-kahoot-purple/20" title={`${m.name} (x${m.value})`}>
                            {m.emoji} x{m.value}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic mt-2 mb-3">No mutations</div>
                    )}
                  </div>
                  
                  <div className="bg-kahoot-purple/10 rounded-xl p-3 text-center border-2 border-kahoot-purple/20">
                    <span className="block text-xs font-bold text-kahoot-purple uppercase tracking-wider">Total Value</span>
                    <span className="text-3xl font-black text-kahoot-purple">
                      ${plant.finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {plants.length === 0 && (
            <div className="col-span-full text-center py-12 opacity-50">
              <div className="bg-white/50 inline-block p-6 rounded-full border-4 border-dashed border-gray-300 mb-4">
                <Sprout className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl font-bold text-gray-500">No plants harvested yet!</p>
              <p className="text-gray-400 font-medium">Calculate and add plants to see them here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
