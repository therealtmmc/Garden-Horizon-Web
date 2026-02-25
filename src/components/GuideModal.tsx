import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Clock, TrendingUp, Sprout, Coins, Zap } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden border-4 border-kahoot-blue"
          >
            {/* Header */}
            <div className="bg-kahoot-blue p-6 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3 text-white">
                <BookOpen className="w-8 h-8" />
                <h2 className="text-2xl font-black uppercase tracking-wide">Farming Guide</h2>
              </div>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Section 1: Sell Price Formula */}
              <section>
                <h3 className="text-xl font-bold text-kahoot-blue mb-4 flex items-center gap-2">
                  <Coins className="w-6 h-6" />
                  How the Sell Price Formula Works
                </h3>
                <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100 text-gray-700 space-y-2">
                  <p>The final sell price is calculated as:</p>
                  <div className="font-mono bg-white p-3 rounded-lg border border-blue-200 text-center font-bold text-blue-800 my-2">
                    Base Price × Variant Total × Mutation Total × (Weight ÷ Avg Weight)²
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Variants</strong> (growth stage, Silver, Gold) add together.</li>
                    <li><strong>Mutations</strong> add together.</li>
                    <li><strong>Weight</strong> has a squared effect — double weight means 4× price!</li>
                  </ul>
                </div>
              </section>

              {/* Section 2: Ripening Times */}
              <section>
                <h3 className="text-xl font-bold text-kahoot-blue mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Ripening Times
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl border-2 border-green-100">
                    <h4 className="font-bold text-green-800 mb-2">Unripe → Ripened</h4>
                    <p className="text-2xl font-black text-green-600">2.4×</p>
                    <p className="text-xs text-green-700 uppercase font-bold">Base Growth Time</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border-2 border-green-100">
                    <h4 className="font-bold text-green-800 mb-2">Ripened → Lush</h4>
                    <p className="text-2xl font-black text-green-600">7.2×</p>
                    <p className="text-xs text-green-700 uppercase font-bold">Base Growth Time</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 italic">
                  *Plants grow offline, but <strong>ripeness does not advance offline</strong>. You must be in-game for the Lush timer to tick.
                </p>
              </section>

              {/* Section 3: Single-Harvest Ranking */}
              <section>
                <h3 className="text-xl font-bold text-kahoot-blue mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Single-Harvest Ranking (ROI)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                      <tr>
                        <th className="p-3 rounded-tl-lg">Plant</th>
                        <th className="p-3">Seed</th>
                        <th className="p-3">Sell (Lush)</th>
                        <th className="p-3">Profit</th>
                        <th className="p-3">ROI</th>
                        <th className="p-3 rounded-tr-lg">Verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50"><td className="p-3 font-bold">Carrot</td><td className="p-3">$20</td><td className="p-3">$90</td><td className="p-3 text-green-600 font-bold">$70</td><td className="p-3">350%</td><td className="p-3 text-gray-500">Best early flip</td></tr>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-bold">Onion</td><td className="p-3">$200</td><td className="p-3">$660</td><td className="p-3 text-green-600 font-bold">$460</td><td className="p-3">230%</td><td className="p-3 text-gray-500">Solid upgrade</td></tr>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-bold">Beetroot</td><td className="p-3">$2,500</td><td className="p-3">$6,000</td><td className="p-3 text-green-600 font-bold">$3,500</td><td className="p-3">140%</td><td className="p-3 text-gray-500">Mid-game king</td></tr>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-bold">Wheat</td><td className="p-3">$12,000</td><td className="p-3">$21,600</td><td className="p-3 text-green-600 font-bold">$9,600</td><td className="p-3">80%</td><td className="p-3 text-gray-500">Best late-game flip</td></tr>
                      <tr className="bg-red-50"><td className="p-3 font-bold text-red-700">Cabbage</td><td className="p-3">$150k</td><td className="p-3">$180k</td><td className="p-3 text-red-600 font-bold">$30k</td><td className="p-3 text-red-600">20%</td><td className="p-3 text-red-600 font-bold">Trap — skip unless Gold</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 4: Multi-Harvest Ranking */}
              <section>
                <h3 className="text-xl font-bold text-kahoot-blue mb-4 flex items-center gap-2">
                  <Sprout className="w-6 h-6" />
                  Multi-Harvest Ranking (Breakeven)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                      <tr>
                        <th className="p-3 rounded-tl-lg">Plant</th>
                        <th className="p-3">Seed</th>
                        <th className="p-3">Per Fruit</th>
                        <th className="p-3">Breakeven</th>
                        <th className="p-3 rounded-tr-lg">Verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50"><td className="p-3 font-bold">Corn</td><td className="p-3">$100</td><td className="p-3">$45</td><td className="p-3 font-bold text-green-600">3 harvests</td><td className="p-3 text-gray-500">Fastest payback</td></tr>
                      <tr className="bg-blue-50"><td className="p-3 font-bold text-blue-700">Apple</td><td className="p-3">$7,000</td><td className="p-3">$810</td><td className="p-3 font-bold text-green-600">9 harvests</td><td className="p-3 text-blue-700 font-bold">Best value overall</td></tr>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-bold">Strawberry</td><td className="p-3">$800</td><td className="p-3">$96</td><td className="p-3">9 harvests</td><td className="p-3 text-gray-500">Cheap but low income</td></tr>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-bold">Rose</td><td className="p-3">$10k</td><td className="p-3">$960</td><td className="p-3">11 harvests</td><td className="p-3 text-gray-500">Solid mid-tier</td></tr>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-bold">Banana</td><td className="p-3">$30k</td><td className="p-3">$2,250</td><td className="p-3">14 harvests</td><td className="p-3 text-gray-500">Good late-game passive</td></tr>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-bold">Cherry</td><td className="p-3">$1M</td><td className="p-3">$24k</td><td className="p-3 text-orange-500">42 harvests</td><td className="p-3 text-gray-500">Endgame money printer</td></tr>
                      <tr className="bg-red-50"><td className="p-3 font-bold text-red-700">Tomato</td><td className="p-3">$4,000</td><td className="p-3">$180</td><td className="p-3 text-red-600 font-bold">23 harvests</td><td className="p-3 text-red-600 font-bold">Worst value — skip</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 5: Best Crops by Budget */}
              <section>
                <h3 className="text-xl font-bold text-kahoot-blue mb-4 flex items-center gap-2">
                  <Coins className="w-6 h-6" />
                  Best Crops by Budget
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border-2 border-gray-200 p-4 rounded-xl shadow-sm">
                    <h4 className="text-sm font-bold text-gray-500 uppercase">Under $500</h4>
                    <p className="text-2xl font-black text-gray-800 mt-1">Carrot</p>
                    <p className="text-green-600 font-bold text-sm">350% ROI</p>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-4 rounded-xl shadow-sm">
                    <h4 className="text-sm font-bold text-gray-500 uppercase">$500 – $5K</h4>
                    <p className="text-2xl font-black text-gray-800 mt-1">Beetroot</p>
                    <p className="text-green-600 font-bold text-sm">140% ROI</p>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-4 rounded-xl shadow-sm">
                    <h4 className="text-sm font-bold text-gray-500 uppercase">$5K+</h4>
                    <p className="text-2xl font-black text-gray-800 mt-1">Wheat</p>
                    <p className="text-green-600 font-bold text-sm">80% ROI</p>
                  </div>
                </div>
              </section>

              {/* Section 6: Free Money (Seed Packs) */}
              <section>
                <h3 className="text-xl font-bold text-kahoot-blue mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  Free Money: Seed Pack Plants
                </h3>
                <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl">
                  <p className="mb-3 text-yellow-800 font-medium">Seed pack plants cost nothing. Every sell is pure profit.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block font-bold text-gray-700">Dawnblossom</span>
                      <span className="text-green-600 font-black">$36,000 / fruit</span>
                    </div>
                    <div>
                      <span className="block font-bold text-gray-700">Olive</span>
                      <span className="text-green-600 font-black">$30,000 / fruit</span>
                    </div>
                    <div>
                      <span className="block font-bold text-gray-700">Emberwood</span>
                      <span className="text-green-600 font-black">$6,600 / fruit</span>
                    </div>
                    <div>
                      <span className="block font-bold text-gray-700">Orange</span>
                      <span className="text-green-600 font-black">$5,400 / fruit</span>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
