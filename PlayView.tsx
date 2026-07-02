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
  ArrowRight,
  Gift,
  RefreshCw,
  Sparkle,
  Info
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

  // --- 3. SCRATCH CARD STATE & LOGIC ---
  const [scratchUnlocked, setScratchUnlocked] = useState(false);
  const [scratchFinished, setScratchFinished] = useState(false);
  const [scratchPrize, setScratchPrize] = useState<{ text: string; val: number | string; type: string } | null>(null);
  const scratchCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const isScratching = React.useRef(false);
  const scratchMoves = React.useRef(0);

  const scratchPrizes = [
    { text: "15 SuperCoins", val: 15, type: "coins" },
    { text: "30 SuperCoins", val: 30, type: "coins" },
    { text: "100 SuperCoins", val: 100, type: "coins" },
    { text: "Flat 20% Voucher", val: "MEMBER20", type: "voucher" },
    { text: "Better Luck! 🍀", val: 0, type: "miss" }
  ];

  const handleBuyScratchCard = () => {
    if (!user) {
      toast.error("Please login to buy a scratch card!");
      return;
    }
    if (user.superCoins < 5) {
      toast.error("It costs 5 SuperCoins to buy a Golden Scratch Card!");
      return;
    }

    deductSuperCoins(5);
    setScratchUnlocked(true);
    setScratchFinished(false);
    scratchMoves.current = 0;

    // Pick a random prize
    const randomPrize = scratchPrizes[Math.floor(Math.random() * scratchPrizes.length)];
    setScratchPrize(randomPrize);
    toast.success("Golden Scratch Card purchased! Scratch to reveal! 🪙");
  };

  const initScratchCanvas = () => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and paint silver coating
    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#c0c0c0'); // silver
    grad.addColorStop(0.5, '#e2e8f0'); // slate-200
    grad.addColorStop(1, '#a1a1aa'); // zinc-400
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative texture lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    for (let i = -canvas.width; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + canvas.height, canvas.height);
      ctx.stroke();
    }

    // Add instructions text
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH WITH CURSOR 🪙', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#475569'; // slate-600
    ctx.fillText('(or tap & swipe on mobile)', canvas.width / 2, canvas.height / 2 + 15);
  };

  useEffect(() => {
    if (scratchUnlocked && !scratchFinished) {
      // Paint canvas with small delay
      setTimeout(initScratchCanvas, 150);
    }
  }, [scratchUnlocked, scratchFinished]);

  const handleScratchStart = () => {
    isScratching.current = true;
  };

  const handleScratchMoveEvent = (clientX: number, clientY: number) => {
    if (!isScratching.current || !scratchUnlocked || scratchFinished) return;
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    scratchMoves.current += 1;
    if (scratchMoves.current > 40) {
      finishScratching();
    }
  };

  const handleScratchEnd = () => {
    isScratching.current = false;
  };

  const finishScratching = () => {
    if (scratchFinished || !scratchPrize) return;
    setScratchFinished(true);
    
    // Apply reward
    if (scratchPrize.type === "coins" && typeof scratchPrize.val === "number") {
      if (scratchPrize.val > 0) {
        addSuperCoins(scratchPrize.val);
        toast.success(`You scratched & won ${scratchPrize.val} SuperCoins! 🪙`, { icon: '🌟' });
      } else {
        toast.error("Better luck next time! Try again for a lucky scratch! 🍀");
      }
    } else if (scratchPrize.type === "voucher" && typeof scratchPrize.val === "string") {
      const unlocked = localStorage.getItem('gocart_unlocked_vouchers');
      const list = unlocked ? JSON.parse(unlocked) : [];
      if (!list.includes(scratchPrize.val)) {
        list.push(scratchPrize.val);
        localStorage.setItem('gocart_unlocked_vouchers', JSON.stringify(list));
      }
      toast.success(`You scratched & won a ${scratchPrize.text}! 🎫`, { icon: '🎁' });
    }
  };

  // --- 4. LUCKY FLIP CARDS STATE & LOGIC ---
  const [flipGameActive, setFlipGameActive] = useState(false);
  const [flippedCardIdx, setFlippedCardIdx] = useState<number | null>(null);
  const [cardPrizes, setCardPrizes] = useState<any[]>([]);

  const defaultCardPrizes = [
    { text: "50 Coins", val: 50, type: "coins", icon: "🪙" },
    { text: "10% Coupon", val: "GOCART10", type: "voucher", icon: "🎫" },
    { text: "Better Luck", val: 0, type: "miss", icon: "🍀" },
    { text: "20 Coins", val: 20, type: "coins", icon: "🪙" },
    { text: "50% Coupon", val: "SUPER50", type: "voucher", icon: "🎁" }
  ];

  const handleStartFlipGame = () => {
    if (!user) {
      toast.error("Please login to play Lucky Cards!");
      return;
    }
    if (user.superCoins < 8) {
      toast.error("It costs 8 SuperCoins to play Lucky Flip Cards!");
      return;
    }

    deductSuperCoins(8);
    setFlippedCardIdx(null);
    setFlipGameActive(true);

    // Pick 3 random, shuffled prizes from defaultCardPrizes
    const shuffled = [...defaultCardPrizes].sort(() => 0.5 - Math.random()).slice(0, 3);
    setCardPrizes(shuffled);
    toast.success("Golden cards dealt! Pick one card to flip over! 🃏");
  };

  const handleFlipCard = (index: number) => {
    if (flippedCardIdx !== null || !flipGameActive) return;
    setFlippedCardIdx(index);

    const chosenPrize = cardPrizes[index];
    if (chosenPrize.type === "coins" && typeof chosenPrize.val === "number") {
      if (chosenPrize.val > 0) {
        addSuperCoins(chosenPrize.val);
        toast.success(`Superb! You flipped and won ${chosenPrize.text}! 🪙`, { icon: '⚡' });
      } else {
        toast.error("Better luck next time! Try another card flip.");
      }
    } else if (chosenPrize.type === "voucher" && typeof chosenPrize.val === "string") {
      const unlocked = localStorage.getItem('gocart_unlocked_vouchers');
      const list = unlocked ? JSON.parse(unlocked) : [];
      if (!list.includes(chosenPrize.val)) {
        list.push(chosenPrize.val);
        localStorage.setItem('gocart_unlocked_vouchers', JSON.stringify(list));
      }
      toast.success(`Jackpot! You flipped and won a ${chosenPrize.text}! 🎫`, { icon: '🎁' });
    }
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

        {/* --- GAME 3: GOLDEN SCRATCH CARD --- */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-md flex flex-col items-center justify-between space-y-6 text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-left">
              <Gift className="h-5 w-5 text-amber-500" />
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-800 dark:text-zinc-100 tracking-tight">Golden Scratch Card</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase">5 SuperCoins / Card</p>
              </div>
            </div>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/20 uppercase tracking-widest flex items-center gap-1">
              ✨ GUARANTEED WIN
            </span>
          </div>

          {/* Scratch Card container */}
          <div className="relative w-64 h-40 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center overflow-hidden my-2 shadow-inner">
            {scratchUnlocked ? (
              <>
                {/* Prize text shown underneath */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-yellow-50/20 dark:bg-yellow-950/10">
                  <Sparkle className="h-8 w-8 text-yellow-400 animate-spin-slow mb-2" />
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-wider">Your Scratch Reward</p>
                  <p className="text-xl font-black text-zinc-900 dark:text-white mt-1">
                    {scratchPrize?.text}
                  </p>
                  {scratchFinished && (
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded mt-2 uppercase">Claimed ✓</span>
                  )}
                </div>

                {/* Scratch Coating Canvas */}
                {!scratchFinished && (
                  <canvas
                    ref={scratchCanvasRef}
                    width={256}
                    height={160}
                    onMouseDown={handleScratchStart}
                    onMouseMove={(e) => handleScratchMoveEvent(e.clientX, e.clientY)}
                    onMouseUp={handleScratchEnd}
                    onMouseLeave={handleScratchEnd}
                    onTouchStart={handleScratchStart}
                    onTouchMove={(e) => {
                      if (e.touches[0]) {
                        handleScratchMoveEvent(e.touches[0].clientX, e.touches[0].clientY);
                      }
                    }}
                    onTouchEnd={handleScratchEnd}
                    className="absolute inset-0 cursor-crosshair touch-none rounded-2xl"
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-950/40 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                  <Gift className="h-6 w-6" />
                </div>
                <p className="text-xs font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-tight">Purchase Card</p>
                <p className="text-[10px] text-zinc-400 max-w-[180px] leading-tight">Unlock a scratch card to win coins or 20% discount coupon!</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="w-full space-y-2">
            {!scratchUnlocked ? (
              <button
                onClick={handleBuyScratchCard}
                className="w-full py-3 px-6 rounded-2xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-yellow-500 to-amber-600 hover:scale-103 active:scale-97 text-white cursor-pointer shadow-lg transition-all"
              >
                UNLOCK CARD FOR 5 COINS 🪙
              </button>
            ) : (
              <div className="flex gap-2">
                {!scratchFinished && (
                  <button
                    onClick={finishScratching}
                    className="flex-1 py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 cursor-pointer transition-all"
                  >
                    Quick Reveal
                  </button>
                )}
                <button
                  onClick={() => setScratchUnlocked(false)}
                  disabled={!scratchFinished}
                  className={`flex-grow py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    scratchFinished 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer' 
                      : 'bg-zinc-100 dark:bg-zinc-850 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  Scratch Another
                </button>
              </div>
            )}
          </div>
        </section>

        {/* --- GAME 4: LUCKY FLIP CARDS --- */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-md flex flex-col items-center justify-between space-y-6 text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-left">
              <RefreshCw className="h-5 w-5 text-rose-500" />
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-800 dark:text-zinc-100 tracking-tight">Lucky Card Flip</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase">8 SuperCoins / Play</p>
              </div>
            </div>
            <span className="text-[9px] font-black text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-900/20 uppercase tracking-widest flex items-center gap-1">
              🃏 CHOOSE & FLIP
            </span>
          </div>

          {/* Cards Area */}
          <div className="w-full flex justify-center gap-3 my-2 h-40 items-center">
            {flipGameActive && cardPrizes.length === 3 ? (
              cardPrizes.map((prize, idx) => {
                const isFlipped = flippedCardIdx !== null;
                const isUserChoice = flippedCardIdx === idx;
                
                return (
                  <div
                    key={idx}
                    onClick={() => handleFlipCard(idx)}
                    className="relative w-20 h-28 cursor-pointer group"
                    style={{ perspective: '1000px' }}
                  >
                    <div
                      className="relative w-full h-full duration-500 rounded-xl shadow-md border transition-transform"
                      style={{
                        transform: isFlipped ? 'rotateY(180deg)' : 'none',
                        transformStyle: 'preserve-3d',
                        borderColor: isUserChoice ? '#2874F0' : 'rgba(120, 120, 120, 0.15)'
                      }}
                    >
                      {/* CARD FRONT (Face down) */}
                      <div
                        className="absolute inset-0 rounded-xl bg-gradient-to-b from-amber-500 to-yellow-600 border border-yellow-400 flex flex-col items-center justify-center p-2 text-white"
                        style={{ backfaceVisibility: 'hidden', zIndex: 2 }}
                      >
                        <span className="text-lg font-black font-mono">?</span>
                        <span className="text-[7px] font-extrabold uppercase mt-1 text-yellow-100 tracking-wider">Lucky Flip</span>
                      </div>

                      {/* CARD BACK (Face up) */}
                      <div
                        className="absolute inset-0 rounded-xl bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-2 text-center border-2 border-zinc-200 dark:border-zinc-800"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          zIndex: 1
                        }}
                      >
                        <span className="text-2xl">{prize.icon}</span>
                        <h4 className="text-[9px] font-black uppercase text-zinc-900 dark:text-zinc-100 mt-1 leading-none truncate w-full">
                          {prize.text}
                        </h4>
                        {isUserChoice && (
                          <span className="text-[6px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-950/20 px-1 py-0.5 rounded mt-1.5 border border-blue-100 dark:border-blue-900/30">
                            Won
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center p-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <Sparkle className="h-6 w-6 text-rose-500" />
                </div>
                <p className="text-xs font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-tight font-sans">Flip to win 50 Coins</p>
                <p className="text-[10px] text-zinc-400 max-w-[190px] leading-tight">Deal 3 golden mystery cards. Click to reveal jackpot coins!</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="w-full space-y-2">
            {(!flipGameActive || flippedCardIdx !== null) ? (
              <button
                onClick={handleStartFlipGame}
                className="w-full py-3 px-6 rounded-2xl text-xs font-black uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-lg transition-all"
              >
                {flippedCardIdx !== null ? "DEAL & PLAY AGAIN" : "DEAL CARDS FOR 8 COINS 🃏"}
              </button>
            ) : (
              <p className="text-xs text-[#2874F0] dark:text-[#5094ff] font-extrabold uppercase tracking-widest animate-pulse py-3">
                👆 Choose 1 of the 3 cards above!
              </p>
            )}
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
