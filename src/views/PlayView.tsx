import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Coins, 
  Sparkles, 
  Gamepad2, 
  Trophy, 
  Ticket, 
  RotateCcw,
  Volume2,
  VolumeX,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function PlayView() {
  const { user, addSuperCoins, deductSuperCoins, navigate } = useApp();
  
  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // --- 1. SPIN WHEEL STATE ---
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [spinCooldown, setSpinCooldown] = useState(false);

  const wheelSegments = [
    { text: "10 Coins", color: "bg-emerald-500", val: 10, type: "coins" },
    { text: "Better Luck", color: "bg-zinc-600", val: 0, type: "miss" },
    { text: "50 Coins", color: "bg-yellow-500", val: 50, type: "coins" },
    { text: "50% Voucher", color: "bg-purple-600", val: "SUPER50", type: "voucher" },
    { text: "20 Coins", color: "bg-sky-500", val: 20, type: "coins" },
    { text: "Better Luck", color: "bg-zinc-600", val: 0, type: "miss" },
    { text: "100 Coins", color: "bg-amber-600", val: 100, type: "coins" },
    { text: "10% Voucher", color: "bg-rose-500", val: "GOCART10", type: "voucher" },
  ];

  const handleSpinWheel = () => {
    if (!user) {
      toast.error("Please login to play and claim SuperCoins!");
      return;
    }
    if (isSpinning || spinCooldown) {
      toast.error("You can only spin once every few hours!");
      return;
    }

    setIsSpinning(true);
    setSpinResult(null);

    // Generate a random outcome
    const targetSegmentIndex = Math.floor(Math.random() * wheelSegments.length);
    const segmentAngle = 360 / wheelSegments.length;
    
    // We want the target segment to land at the top pointer (90 degrees or 270 degrees depending on offset)
    // To keep it simple, we rotate a random number of full spins (5 to 10) plus the segment offset
    const fullSpins = 5 + Math.floor(Math.random() * 5);
    const finalAngle = spinAngle + (fullSpins * 360) + (targetSegmentIndex * segmentAngle);
    
    setSpinAngle(finalAngle);

    // Play virtual spin sound
    if (soundEnabled) {
      // Audio cue mock
      console.log("Spinning wheel...");
    }

    setTimeout(() => {
      setIsSpinning(false);
      const prize = wheelSegments[(wheelSegments.length - targetSegmentIndex) % wheelSegments.length];
      setSpinResult(prize.text);
      setSpinCooldown(true);

      // Apply prize
      if (prize.type === "coins" && typeof prize.val === "number") {
        addSuperCoins(prize.val);
        toast.success(`Congratulations! You won ${prize.val} SuperCoins! 🪙`, {
          icon: '🎉',
          duration: 4000
        });
      } else if (prize.type === "voucher" && typeof prize.val === "string") {
        // Unlock voucher in storage
        const unlocked = localStorage.getItem('gocart_unlocked_vouchers');
        const list = unlocked ? JSON.parse(unlocked) : [];
        if (!list.includes(prize.val)) {
          list.push(prize.val);
          localStorage.setItem('gocart_unlocked_vouchers', JSON.stringify(list));
        }
        toast.success(`Jackpot! You unlocked the rare ${prize.text}! 🎫`, {
          icon: '🎁',
          duration: 5000
        });
      } else {
        toast.error("Better luck next time! Try our Slot Machine below! 🎰");
      }
    }, 4000); // 4 seconds spin animation
  };

  // --- 2. SLOT MACHINE STATE ---
  const slotItems = ["🪙", "💎", "🍒", "🎰", "⭐", "🔔"];
  const [slots, setSlots] = useState(["🪙", "🪙", "🪙"]);
  const [isRolling, setIsRolling] = useState(false);
  const [slotResultMsg, setSlotResultMsg] = useState<string | null>(null);

  const rollSlots = () => {
    if (!user) {
      toast.error("Login to play slot machines!");
      return;
    }
    if (user.superCoins < 10) {
      toast.error("It costs 10 SuperCoins to roll the Jackpot slots!");
      return;
    }

    // Deduct 10 coins cost
    deductSuperCoins(10);
    setIsRolling(true);
    setSlotResultMsg(null);

    let rollsLeft = 15;
    const interval = setInterval(() => {
      setSlots([
        slotItems[Math.floor(Math.random() * slotItems.length)],
        slotItems[Math.floor(Math.random() * slotItems.length)],
        slotItems[Math.floor(Math.random() * slotItems.length)]
      ]);
      rollsLeft--;
      if (rollsLeft <= 0) {
        clearInterval(interval);
        setIsRolling(false);
        
        // Final roll result evaluation
        setSlots(currentSlots => {
          const [s1, s2, s3] = currentSlots;
          if (s1 === s2 && s2 === s3) {
            // 3 of a kind
            let prizeAmount = 150;
            if (s1 === "🎰") prizeAmount = 500;
            if (s1 === "🪙") prizeAmount = 250;
            addSuperCoins(prizeAmount);
            setSlotResultMsg(`🎰 JACKPOT MATCH! You won ${prizeAmount} SuperCoins!`);
            toast.success(`Jackpot! Triple ${s1} matching won you ${prizeAmount} coins!`, { icon: '🎰' });
          } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            // 2 of a kind
            addSuperCoins(20);
            setSlotResultMsg("🥈 Double Match! You won 20 SuperCoins!");
            toast.success("Nice! Double match awarded 20 SuperCoins!", { icon: '🪙' });
          } else {
            setSlotResultMsg("❌ No match this time. Try again for a lucky row!");
          }
          return currentSlots;
        });
      }
    }, 100);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4 text-left" id="play-view-container">
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-blue-900 rounded-3xl p-6 text-white border border-indigo-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider animate-pulse flex items-center gap-1">
              <Gamepad2 className="h-3 w-3 fill-yellow-950" />
              Flipkart GameZone
            </span>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)} 
              className="text-white/60 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-sans">
            Play & Save <span className="text-yellow-400">Coins</span>
          </h1>
          <p className="text-xs text-blue-100 font-semibold max-w-md leading-relaxed">
            Win instant cashbacks, discount coupons, and up to 500 SuperCoins daily by playing our authorized mini-games!
          </p>
        </div>

        {/* Current coins card */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-full md:w-52 shrink-0 flex items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Your Balance</span>
            <p className="text-xl font-black text-yellow-400 font-mono tracking-wide mt-1 flex items-center gap-1">
              <Coins className="h-5 w-5 fill-yellow-400 animate-spin-slow" />
              {user ? user.superCoins : "0"}
            </p>
            <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">Plus Club Member ✓</span>
          </div>
          <button 
            onClick={() => navigate('home')}
            className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl text-xs text-white transition-all cursor-pointer font-bold flex flex-col items-center justify-center gap-1 shrink-0"
          >
            <Ticket className="h-4 w-4 text-yellow-400" />
            <span className="text-[8px] uppercase font-black">Shop</span>
          </button>
        </div>
      </div>

      {/* GAMES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- GAME 1: THE SPINNING WHEEL --- */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-md flex flex-col items-center justify-between space-y-6 text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-left">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-800 dark:text-zinc-100 tracking-tight">SuperCoin Spin Wheel</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase">1 Free Spin Available Daily</p>
              </div>
            </div>
            {spinCooldown && (
              <span className="text-[9px] font-black text-red-500 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-900/20 uppercase tracking-widest flex items-center gap-1">
                <Clock className="h-3 w-3 animate-spin" /> Cooldown Active
              </span>
            )}
          </div>

          {/* The Spinning Wheel Canvas Render */}
          <div className="relative w-64 h-64 flex items-center justify-center select-none my-4">
            
            {/* Arrow pointer indicator at the top */}
            <div className="absolute top-[-8px] z-20 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-600 drop-shadow-md filter" />
              <div className="h-2 w-2 rounded-full bg-red-600 -mt-1" />
            </div>

            {/* Inner rotating wheel */}
            <div 
              style={{ 
                transform: `rotate(-${spinAngle}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none'
              }}
              className="absolute w-full h-full rounded-full border-8 border-yellow-400 dark:border-yellow-500 shadow-2xl overflow-hidden relative"
            >
              {/* Center decorative gold ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-200 border-2 border-white flex items-center justify-center shadow-lg">
                <Coins className="h-5 w-5 text-amber-700 fill-amber-700 animate-pulse" />
              </div>

              {/* Segment Slices */}
              {wheelSegments.map((seg, idx) => {
                const angle = 360 / wheelSegments.length;
                const rotate = idx * angle;
                return (
                  <div 
                    key={idx}
                    className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left flex items-end justify-center pb-8"
                    style={{ 
                      transform: `rotate(${rotate}deg)`,
                      transformOrigin: '0% 100%',
                      clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                      width: '100%',
                      height: '100%',
                      left: '50%',
                      top: '0%'
                    }}
                  >
                    <div className={`absolute inset-0 ${seg.color} opacity-90`} />
                    <span className="relative z-10 text-[10px] font-black uppercase text-white tracking-widest -rotate-[22.5deg] translate-y-10 translate-x-14 select-none">
                      {seg.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="w-full space-y-3">
            {spinResult && (
              <p className="text-xs font-black uppercase text-yellow-500 dark:text-yellow-400 animate-bounce">
                🎉 YOU WON: {spinResult}!
              </p>
            )}
            <button
              onClick={handleSpinWheel}
              disabled={isSpinning || spinCooldown}
              className={`w-full py-3 px-6 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all ${
                isSpinning || spinCooldown
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-[#FF9900] hover:scale-103 active:scale-97 text-white cursor-pointer'
              }`}
            >
              {isSpinning ? "SPINNING WHEEL... ⚡" : spinCooldown ? "Spun today! Return Tomorrow" : "SPIN NOW FOR FREE"}
            </button>
          </div>
        </section>

        {/* --- GAME 2: THE JACKPOT SLOTS --- */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-md flex flex-col items-center justify-between space-y-6 text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-left">
              <Gamepad2 className="h-5 w-5 text-indigo-500" />
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-800 dark:text-zinc-100 tracking-tight">SuperCoin Jackpot Slots</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase">10 SuperCoins / Roll</p>
              </div>
            </div>
            <span className="text-[9px] font-black text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/20 uppercase tracking-widest flex items-center gap-1 animate-pulse">
              🎰 WIN UP TO 500 COINS
            </span>
          </div>

          {/* Slot Rollers Visual Display */}
          <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border-4 border-indigo-950 rounded-2xl p-6 w-full flex justify-center gap-4 shadow-inner relative overflow-hidden my-4">
            {/* Slot background lines */}
            <div className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-black/50 via-transparent to-black/50 pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-500/50 pointer-events-none" />

            {slots.map((slot, idx) => (
              <div 
                key={idx}
                className={`h-20 w-16 bg-zinc-800 border-2 border-zinc-700 rounded-xl flex items-center justify-center text-3xl shadow-md select-none font-sans font-black ${isRolling ? 'animate-pulse scale-95' : ''}`}
              >
                {slot}
              </div>
            ))}
          </div>

          {/* Slot triggers & alerts */}
          <div className="w-full space-y-3">
            {slotResultMsg && (
              <p className={`text-xs font-black uppercase ${slotResultMsg.includes('❌') ? 'text-zinc-400' : 'text-emerald-500 dark:text-emerald-400'} animate-fade`}>
                {slotResultMsg}
              </p>
            )}
            <button
              onClick={rollSlots}
              disabled={isRolling}
              className={`w-full py-3 px-6 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all ${
                isRolling
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-103 active:scale-97 cursor-pointer'
              }`}
            >
              {isRolling ? "ROLLING SLOTS... ⚡" : "ROLL FOR 10 COINS 🎰"}
            </button>
          </div>
        </section>

      </div>

      {/* BONUS MISSIONS / HOW TO PLAY SECTION */}
      <section className="bg-zinc-900 text-white rounded-3xl p-6 border border-zinc-800 shadow-xl text-left space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300">SuperCoin Club Missions</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800 flex flex-col justify-between h-32">
            <div>
              <h4 className="font-extrabold text-yellow-400 uppercase tracking-tight text-[11px]">First Buy Bonus</h4>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">Place your first order on SmartBuy India Bazaar to earn an instant bonus of +100 SuperCoins!</p>
            </div>
            <span className="text-[9px] font-black uppercase text-zinc-500 mt-2 block">Reward: +100 Coins</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800 flex flex-col justify-between h-32">
            <div>
              <h4 className="font-extrabold text-indigo-400 uppercase tracking-tight text-[11px]">Daily Explorer</h4>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">Browse any 3 categories on the homepage and unlock our hidden discount vouchers with ease.</p>
            </div>
            <span className="text-[9px] font-black uppercase text-zinc-500 mt-2 block">Reward: Coupon unlock</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800 flex flex-col justify-between h-32">
            <div>
              <h4 className="font-extrabold text-rose-400 uppercase tracking-tight text-[11px]">Super Lucky Wheel</h4>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">Spin the wheel and look for the ultra-rare "50% Discount Voucher" segment to get massive cart drop-offs.</p>
            </div>
            <span className="text-[9px] font-black uppercase text-emerald-400 mt-2 block">Active • Play above</span>
          </div>

        </div>
      </section>

    </div>
  );
}
