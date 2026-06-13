import { useState, useEffect, useRef } from "react";
// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  green:     "#1E5C2E",
  lime:      "#8DC63F",
  bg:        "#F4EFE8",
  card:      "#EDE8DF",
  white:     "#FFFFFF",
  black:     "#1A1A1A",
  gray:      "#726E68",
  grayLight: "#B8B2A8",
  amber:     "#A06A0A",
  amberBg:   "#FEF3E2",
};
const NAV       = ["Plans", "Discover", "Cookbook", "Grocery", "Profile"];
const NAV_ICONS = ["📋",    "🔍",       "📖",       "🛒",      "👤"    ];
// ── Milestone data ─────────────────────────────────────────────────────────────
const MILESTONES = {
  m3: {
    key: "m3", label: "3-Month Member", tier: "Fresh Start",
    icon: "🌱", color1: "#8B5E2A", color2: "#C8894E",
    shimmer: "#F0C99A", glow: "rgba(200,137,78,0.45)",
    reward: "20% off your next 2 boxes",
    rewardSub: "Discount applied automatically at checkout. No code needed.",
    rewardIcon: "🎁",
    cardHeadline: "You have unlocked a reward! 🎉",
    notifMsg: "You have unlocked a Fresh Start reward!",
    tagline: "Three months of fresh, home-cooked meals. You are just getting started.",
    mealsCooked: 24, recipesTried: 12, hrsSaved: 16,
    flow: "standard",
  },
  m6: {
    key: "m6", label: "6-Month Member", tier: "Flavour Explorer",
    icon: "⭐", color1: "#5A5A5A", color2: "#A8A8A8",
    shimmer: "#DCDCDC", glow: "rgba(168,168,168,0.42)",
    reward: "Free dessert add-on for 1 month",
    rewardSub: "A sweet treat added to your next 4 boxes, completely on us.",
    rewardIcon: "🍰",
    cardHeadline: "You have unlocked a reward! 🎉",
    notifMsg: "You have hit 6 months. A reward is waiting for you!",
    tagline: "Half a year of cooking brilliance. You have tried over 30 recipes.",
    mealsCooked: 48, recipesTried: 30, hrsSaved: 32,
    flow: "standard",
  },
  m9: {
    key: "m9", label: "9-Month Member", tier: "Kitchen Pro",
    icon: "🔥", color1: "#7A2E00", color2: "#D45C20",
    shimmer: "#FFB090", glow: "rgba(212,92,32,0.45)",
    reward: "Free premium add-on box",
    rewardSub: "A curated selection of premium ingredients delivered with your next box.",
    rewardIcon: "🥗",
    cardHeadline: "You have unlocked a reward! 🎉",
    notifMsg: "Nine months in! Your Kitchen Pro reward is ready.",
    tagline: "Nine months of flavour, skill, and fresh ingredients. You are a Kitchen Pro.",
    mealsCooked: 72, recipesTried: 44, hrsSaved: 48,
    flow: "standard",
  },
  m12: {
    key: "m12", label: "1-Year Member", tier: "HelloFresh Champion",
    icon: "👑", color1: "#9A6E00", color2: "#E8C200",
    shimmer: "#FFF3A0", glow: "rgba(232,194,0,0.5)",
    reward: "Your Anniversary Favourites Box",
    rewardSub: "A curated box of your all-time favourite HelloFresh meals, on us.",
    rewardIcon: "📦",
    cardHeadline: "Welcome to the Inner Circle! 👑",
    notifMsg: "Happy 1 year! You have joined the HelloFresh Inner Circle.",
    tagline: "One full year of fresh, home-cooked meals. You are a true HelloFresh Champion.",
    mealsCooked: 96, recipesTried: 58, hrsSaved: 64,
    flow: "anniversary",
    yearStats: [
      // Nutrition
      { icon: "🥩", val: "18.4 kg", label: "protein served",           group: "nutrition" },
      { icon: "🔥", val: "672k",    label: "kcal prepared",            group: "nutrition" },
      { icon: "🥦", val: "18",      label: "nutrient groups balanced", group: "nutrition" },
      { icon: "📖", val: "47",      label: "new recipes tried",        group: "cooking"   },
      // Impact
      { icon: "♻️", val: "89%",     label: "less food waste",          group: "impact"    },
      { icon: "⏱",  val: "68 hrs",  label: "saved in kitchen",         group: "lifestyle" },
      { icon: "🌾", val: "50",      label: "local farmers supported",  group: "impact"    },
      { icon: "🍽", val: "96",      label: "meals cooked",             group: "cooking"   },
    ],
    bmi: { before: 27.4, after: 24.1 },
  },
};
const MEALS = [
  { name: "Thai Basil Beef",         emoji: "🥩", rating: 5.0, tag: "Your top rated" },
  { name: "Creamy Tuscan Chicken",   emoji: "🍗", rating: 4.9, tag: "Cooked 6 times"  },
  { name: "Smash Burger",            emoji: "🍔", rating: 4.8, tag: "Family favourite" },
  { name: "Honey Garlic Salmon",     emoji: "🐟", rating: 4.7, tag: "Most recent"     },
  { name: "Wild Mushroom Risotto",   emoji: "🍄", rating: 4.6, tag: "Most adventurous" },
];
// ── CSS animations ─────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes bannerSlideIn  { from { opacity:0; transform:translateY(-22px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes bannerSlideOut { from { opacity:1; transform:translateY(0) scale(1); }  to { opacity:0; transform:translateY(-18px) scale(0.95); } }
  @keyframes badgeGlow      { 0%,100%{opacity:.55;transform:scale(1);}  50%{opacity:1;transform:scale(1.1);} }
  @keyframes badgeDrop      { from{transform:scale(0.3) translateY(-24px);opacity:0;} to{transform:scale(1) translateY(0);opacity:1;} }
  @keyframes slideUp        { from{transform:translateY(36px);opacity:0;} to{transform:translateY(0);opacity:1;} }
  @keyframes fadeIn         { from{opacity:0;} to{opacity:1;} }
  @keyframes checkPop       { 0%{transform:scale(0);opacity:0;} 60%{transform:scale(1.2);opacity:1;} 100%{transform:scale(1);opacity:1;} }
  @keyframes lemonBounce    { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
  @keyframes shimmerMove    { 0%{transform:translateX(-100%);} 100%{transform:translateX(400%);} }
  @keyframes confettiBurst  {
    0%  { opacity:1; transform:translate(-50%,-50%) scale(1.2) rotate(0deg); }
    70% { opacity:.9; }
    100%{ opacity:0; transform:translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.3) rotate(540deg); }
  }
  @keyframes ringPulse { 0%,100%{opacity:.3;transform:scale(1);} 50%{opacity:.9;transform:scale(1.14);} }
`;
// ── Lemon mascot (CSS-drawn) ───────────────────────────────────────────────────
function LemonMascot({ size = 90, animate = false }) {
  const s = size;
  return (
    <div style={{ width: s, height: s * 1.18, position: "relative", flexShrink: 0 }}>
      {/* Green leaf */}
      <div style={{
        position: "absolute", top: -s * 0.1, left: "50%",
        transform: "translateX(-44%) rotate(-22deg)",
        width: s * 0.32, height: s * 0.24,
        background: "linear-gradient(135deg, #66BB6A, #2E7D32)",
        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
        zIndex: 2,
        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
      }} />
      {/* Body */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: s, height: s,
        borderRadius: "50%",
        background: "radial-gradient(circle at 36% 30%, #FFF176 0%, #FFD600 55%, #F9A825 100%)",
        boxShadow: "0 6px 20px rgba(255,193,7,0.35)",
        animation: animate ? "lemonBounce 2.4s ease-in-out infinite" : "none",
        zIndex: 1,
      }}>
        {/* Left eye */}
        <div style={{
          position: "absolute", top: "32%", left: "24%",
          width: s * 0.1, height: s * 0.12, borderRadius: "50%", background: C.black,
        }}>
          <div style={{ position:"absolute", top:2, left:2, width:3, height:3, borderRadius:"50%", background:"white" }} />
        </div>
        {/* Right eye */}
        <div style={{
          position: "absolute", top: "32%", right: "24%",
          width: s * 0.1, height: s * 0.12, borderRadius: "50%", background: C.black,
        }}>
          <div style={{ position:"absolute", top:2, left:2, width:3, height:3, borderRadius:"50%", background:"white" }} />
        </div>
        {/* Rosy cheeks */}
        <div style={{ position:"absolute", top:"51%", left:"14%", width:s*0.18, height:s*0.1, borderRadius:"50%", background:"rgba(240,100,80,0.22)" }} />
        <div style={{ position:"absolute", top:"51%", right:"14%", width:s*0.18, height:s*0.1, borderRadius:"50%", background:"rgba(240,100,80,0.22)" }} />
        {/* Smile */}
        <div style={{
          position: "absolute", bottom: "22%", left: "50%", transform: "translateX(-50%)",
          width: s * 0.36, height: s * 0.18,
          border: "2.5px solid #7B4500",
          borderTop: "none",
          borderRadius: "0 0 50px 50px",
        }} />
      </div>
    </div>
  );
}
// ── Medal badge ────────────────────────────────────────────────────────────────
function MedalBadge({ milestone, size = 108 }) {
  const m = MILESTONES[milestone];
  return (
    <div style={{ position: "relative", width: size, height: size + 32, flexShrink: 0 }}>
      {/* Glow ring */}
      <div style={{
        position: "absolute", top: -(size*0.12), left: -(size*0.12),
        width: size*1.24, height: size*1.24, borderRadius: "50%",
        background: `radial-gradient(circle, ${m.glow} 0%, transparent 68%)`,
        animation: "badgeGlow 2.4s ease-in-out infinite", pointerEvents: "none",
      }} />
      {/* Circle */}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `radial-gradient(circle at 34% 28%, ${m.shimmer} 0%, ${m.color2} 42%, ${m.color1} 100%)`,
        boxShadow: `0 8px 28px ${m.glow}, inset 0 3px 10px rgba(255,255,255,0.28), inset 0 -4px 8px rgba(0,0,0,0.18)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 2,
      }}>
        <div style={{
          position: "absolute", inset: size*0.07, borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.32)", pointerEvents: "none",
        }} />
        <span style={{ fontSize: size*0.38, filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.35))", lineHeight: 1 }}>{m.icon}</span>
      </div>
      {/* Ribbon */}
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: size*0.36, zIndex: 1 }}>
        <div style={{
          height: 28,
          background: `linear-gradient(180deg, ${m.color2} 0%, ${m.color1} 100%)`,
          clipPath: "polygon(18% 0%, 82% 0%, 100% 100%, 50% 74%, 0% 100%)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.22)",
        }} />
      </div>
    </div>
  );
}
// ── Confetti ───────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  if (!active) return null;
  const COLORS = [C.lime, "#FFD700", "#D4600A", "#FF6EB4", "#4FC3F7", "#CE93D8"];
  const pieces = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 360 + (i % 3) * 9;
    const dist  = 55 + (i % 4) * 18;
    const rad   = (angle * Math.PI) / 180;
    return {
      tx: Math.round(Math.cos(rad) * dist),
      ty: Math.round(Math.sin(rad) * dist),
      color: COLORS[i % COLORS.length],
      delay: (i * 0.04).toFixed(2),
      size: 5 + (i % 3) * 2,
      round: i % 4 !== 0,
    };
  });
  return (
    <div style={{ position:"absolute", top:"36%", left:"50%", width:0, height:0, pointerEvents:"none", zIndex:60, overflow:"visible" }}>
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: "absolute", width: p.size, height: p.size,
          top: 0, left: 0,
          borderRadius: p.round ? "50%" : "2px",
          background: p.color,
          "--tx": `${p.tx}px`, "--ty": `${p.ty}px`,
          animation: `confettiBurst 1.4s ${p.delay}s ease-out forwards`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}
// ── Shared phone shell ─────────────────────────────────────────────────────────
const phoneStyle = {
  width: 390, height: 844, borderRadius: 44, position: "relative", overflow: "hidden",
  boxShadow: "0 32px 80px rgba(0,0,0,0.32), 0 0 0 2px #2a2a2a",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  background: C.bg,
};
// ── Outer wrapper ──────────────────────────────────────────────────────────────
const outerStyle = {
  minHeight: "100vh", background: "#1E3020",
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  padding: 24, gap: 16,
};
// ══════════════════════════════════════════════════════════════════════════════
export default function MilestoneRewards() {
  const [screen,    setScreen]    = useState("home");
  const [milestone, setMilestone] = useState("m12");
  const [confetti,  setConfetti]  = useState(false);
  const [bannerIn,  setBannerIn]  = useState(false);
  const [bannerOut, setBannerOut] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const m = MILESTONES[milestone];
  // iOS notification banner — fires 1.8s after landing on home
  useEffect(() => {
    if (screen === "home") {
      setBannerIn(false); setBannerOut(false);
      const show = setTimeout(() => setBannerIn(true),  1800);
      const hide = setTimeout(() => dismissBanner(),    7800);
      return () => { clearTimeout(show); clearTimeout(hide); };
    }
  }, [screen, milestone]);
  // Confetti — fires when reaching celebrate screen
  useEffect(() => {
    if (screen === "celebrate") {
      setConfetti(false);
      const t = setTimeout(() => setConfetti(true), 500);
      return () => clearTimeout(t);
    }
  }, [screen, milestone]);
  function dismissBanner() {
    setBannerOut(true);
    setTimeout(() => { setBannerIn(false); setBannerOut(false); }, 420);
  }
  function openReward() {
    dismissBanner();
    setScreen(m.flow === "anniversary" ? "thankyou" : "celebrate");
  }
  // ── Demo selector pills ──
  const DemoSelector = () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
      {Object.values(MILESTONES).map(ms => (
        <div
          key={ms.key}
          onClick={() => { setMilestone(ms.key); setScreen("home"); }}
          style={{
            borderRadius: 20, padding: "6px 14px", fontSize: 11, fontWeight: 800, cursor: "pointer",
            background: milestone === ms.key ? ms.color2 : "rgba(255,255,255,0.14)",
            color:      milestone === ms.key ? C.black   : "rgba(255,255,255,0.75)",
            border:     `1.5px solid ${milestone === ms.key ? ms.color2 : "transparent"}`,
            transition: "all 0.18s",
          }}
        >{ms.label}</div>
      ))}
    </div>
  );
  // ── Bottom nav ──
  const BottomNav = () => (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 76,
      background: C.white, borderTop: `1px solid ${C.card}`,
      display: "flex",
    }}>
      {NAV.map((item, i) => (
        <div key={i} onClick={() => setActiveNav(i)} style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 3, cursor: "pointer",
        }}>
          <span style={{ fontSize: 20 }}>{NAV_ICONS[i]}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: activeNav===i ? C.green : C.grayLight }}>{item}</span>
        </div>
      ))}
    </div>
  );
  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: HOME
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "home") {
    return (
      <div style={outerStyle}>
        <DemoSelector />
        <div style={phoneStyle}>
          {/* Status bar */}
          <div style={{ background: C.green, height: 48, display: "flex", alignItems: "center", paddingLeft: 20, paddingRight: 20, paddingTop: 10 }}>
            <div style={{ flex:1, color:"rgba(255,255,255,0.65)", fontSize:12, fontWeight:600 }}>9:41</div>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11 }}>●●● ▮▮▮</div>
          </div>
          {/* Greeting */}
          <div style={{ background: C.green, paddingLeft:20, paddingRight:20, paddingBottom:20 }}>
            <div style={{ color:"rgba(255,255,255,0.65)", fontSize:13 }}>Thursday, Nov 28</div>
            <div style={{ color:"white", fontSize:23, fontWeight:900, marginTop:3 }}>Hi, Jawdee 👋</div>
          </div>
          {/* ── iOS push notification banner ── */}
          {bannerIn && (
            <div
              onClick={openReward}
              style={{
                position: "absolute", top: 58, left: 12, right: 12, zIndex: 30,
                background: `linear-gradient(135deg, ${m.color1}F4 0%, ${m.color2}F4 100%)`,
                backdropFilter: "blur(18px)",
                borderRadius: 16, padding: "12px 14px",
                display: "flex", alignItems: "center", gap: 12,
                boxShadow: `0 8px 28px ${m.glow}, 0 2px 8px rgba(0,0,0,0.28)`,
                cursor: "pointer",
                animation: bannerOut
                  ? "bannerSlideOut 0.42s ease-in forwards"
                  : "bannerSlideIn 0.42s cubic-bezier(0.34,1.4,0.64,1) forwards",
              }}
            >
              {/* Pulsing ring + badge */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  position: "absolute", inset: -5, borderRadius: "50%",
                  border: `2px solid ${m.color2}`, opacity: 0.5,
                  animation: "ringPulse 1.8s ease-in-out infinite",
                }} />
                <div style={{
                  width: 42, height: 42, borderRadius: 21,
                  background: `radial-gradient(circle at 35% 28%, ${m.shimmer}, ${m.color2} 55%, ${m.color1})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                }}>{m.icon}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color:"white", fontSize:13, fontWeight:900, lineHeight:1.2 }}>{m.tier} unlocked!</div>
                <div style={{ color:"rgba(255,255,255,0.75)", fontSize:11, marginTop:2 }}>{m.notifMsg}</div>
              </div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:20, fontWeight:700 }}>›</div>
            </div>
          )}
          {/* Feed */}
          <div style={{ height: 680, overflowY: "auto", padding: "16px 16px 90px" }}>
            {/* Milestone reward card */}
            <div
              onClick={openReward}
              style={{
                background: `linear-gradient(138deg, ${m.color1}28 0%, ${m.color2}3A 100%)`,
                border: `1.5px solid ${m.color2}AA`,
                borderRadius: 18, padding: 16, marginBottom: 16,
                cursor: "pointer", position: "relative", overflow: "hidden",
              }}
            >
              {/* Shimmer strip */}
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, overflow:"hidden" }}>
                <div style={{
                  position:"absolute", inset:0,
                  background: `linear-gradient(90deg, transparent, ${m.shimmer}, transparent)`,
                  animation: "shimmerMove 2.2s linear infinite", width:"40%",
                }} />
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <div style={{
                  width:52, height:52, borderRadius:26, flexShrink:0,
                  background: `radial-gradient(circle at 35% 28%, ${m.shimmer}, ${m.color2} 55%, ${m.color1})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:24, boxShadow:`0 4px 14px ${m.glow}`,
                }}>{m.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, fontWeight:800, letterSpacing:0.8, textTransform:"uppercase", color:m.color1, marginBottom:3 }}>{m.label} Milestone</div>
                  <div style={{ fontSize:14, fontWeight:900, color:C.black }}>{m.cardHeadline}</div>
                  <div style={{ fontSize:12, color:C.gray, marginTop:2 }}>{m.reward}</div>
                </div>
              </div>
              <div style={{
                background: `linear-gradient(135deg, ${m.color1}, ${m.color2})`,
                borderRadius:11, padding:"10px 16px",
                display:"flex", justifyContent:"space-between", alignItems:"center",
                boxShadow:`0 4px 14px ${m.glow}`,
              }}>
                <span style={{ color:"white", fontSize:13, fontWeight:900 }}>View your reward</span>
                <span style={{ color:"white", fontSize:20, fontWeight:700, lineHeight:1 }}>→</span>
              </div>
            </div>
            {/* Regular cards */}
            {[
              { title: "This week's menu",     sub: "5 new recipes added",            icon: "🍽" },
              { title: "Your next box",         sub: "Arriving Wednesday, Dec 4",      icon: "📦" },
              { title: "Discover new recipes",  sub: "Curated for your taste profile", icon: "✨" },
              { title: "Your cookbook",         sub: "47 recipes saved",               icon: "📖" },
            ].map((card, i) => (
              <div key={i} style={{
                background: C.card, borderRadius:14, padding:16, marginBottom:12,
                display:"flex", alignItems:"center", gap:12,
              }}>
                <div style={{
                  width:44, height:44, borderRadius:12, background:C.white, flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
                }}>{card.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.black }}>{card.title}</div>
                  <div style={{ fontSize:12, color:C.gray, marginTop:2 }}>{card.sub}</div>
                </div>
                <div style={{ marginLeft:"auto", color:C.grayLight, fontSize:18 }}>›</div>
              </div>
            ))}
          </div>
          <BottomNav />
        </div>
        <style>{STYLES}</style>
      </div>
    );
  }
  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: CELEBRATE (3 / 6 / 9 months — badge flow)
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "celebrate") {
    return (
      <div style={outerStyle}>
        <DemoSelector />
        <div style={phoneStyle}>
          {/* Dark celebration bg */}
          <div style={{ position:"absolute", inset:0, background:`linear-gradient(168deg, ${C.green} 0%, #0D2B14 55%, #09190D 100%)` }} />
          {/* Spotlight */}
          <div style={{
            position:"absolute", top:"22%", left:"50%", transform:"translateX(-50%)",
            width:280, height:280, borderRadius:"50%",
            background:`radial-gradient(circle, ${m.glow} 0%, transparent 70%)`,
            pointerEvents:"none", zIndex:1,
          }} />
          <Confetti active={confetti} />
          <div style={{
            position:"relative", zIndex:10, height:"100%",
            display:"flex", flexDirection:"column", alignItems:"center",
            paddingTop:72, paddingLeft:24, paddingRight:24, paddingBottom:36,
            overflowY:"auto",
          }}>
            {/* Back */}
            <div onClick={() => setScreen("home")} style={{
              position:"absolute", top:52, left:20,
              width:36, height:36, borderRadius:18,
              background:"rgba(255,255,255,0.1)",
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", fontSize:17, color:"white",
            }}>←</div>
            {/* Tier pill */}
            <div style={{
              background:`${m.color2}2A`, border:`1px solid ${m.color2}88`,
              borderRadius:20, padding:"5px 18px",
              fontSize:11, fontWeight:800, letterSpacing:0.8,
              color:m.color2, textTransform:"uppercase",
              marginBottom:30, animation:"fadeIn 0.4s ease-out both",
            }}>{m.tier}</div>
            {/* Badge */}
            <div style={{ animation:"badgeDrop 0.65s cubic-bezier(0.34,1.56,0.64,1) both", marginBottom:26 }}>
              <MedalBadge milestone={milestone} size={110} />
            </div>
            {/* Text */}
            <div style={{ textAlign:"center", marginBottom:20, animation:"slideUp 0.5s 0.2s ease-out both" }}>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginBottom:5 }}>You have reached</div>
              <div style={{ color:"white", fontSize:27, fontWeight:900, lineHeight:1.15 }}>{m.label}</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginTop:10, lineHeight:1.65, maxWidth:300 }}>{m.tagline}</div>
            </div>
            {/* Stats */}
            <div style={{ display:"flex", gap:8, width:"100%", marginBottom:20, animation:"slideUp 0.5s 0.3s ease-out both" }}>
              {[
                { val: m.mealsCooked,        label: "Meals cooked"  },
                { val: m.recipesTried,        label: "Recipes tried" },
                { val: `${m.hrsSaved}h`,      label: "Hours saved"   },
              ].map((s, i) => (
                <div key={i} style={{
                  flex:1, background:"rgba(255,255,255,0.08)", borderRadius:12,
                  padding:"10px 6px", textAlign:"center",
                  border:"1px solid rgba(255,255,255,0.1)",
                }}>
                  <div style={{ fontSize:18, fontWeight:900, color:m.color2, lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", marginTop:3, fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Reward card */}
            <div style={{
              width:"100%",
              background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.13)",
              borderRadius:18, padding:18, marginBottom:18,
              animation:"slideUp 0.5s 0.4s ease-out both",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <div style={{
                  width:44, height:44, borderRadius:12, flexShrink:0,
                  background:`${m.color2}2A`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
                }}>{m.rewardIcon}</div>
                <div>
                  <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:0.6, color:m.color2, marginBottom:3 }}>Your reward</div>
                  <div style={{ fontSize:15, fontWeight:900, color:"white" }}>{m.reward}</div>
                </div>
              </div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, lineHeight:1.65, borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:10 }}>{m.rewardSub}</div>
            </div>
            {/* Claim CTA */}
            <div onClick={() => setScreen("redeemed")} style={{
              width:"100%",
              background:`linear-gradient(135deg, ${m.color1} 0%, ${m.color2} 100%)`,
              borderRadius:14, padding:"15px 20px",
              display:"flex", justifyContent:"space-between", alignItems:"center",
              cursor:"pointer", boxShadow:`0 8px 26px ${m.glow}`,
              animation:"slideUp 0.5s 0.52s ease-out both",
            }}>
              <span style={{ color:"white", fontSize:15, fontWeight:900 }}>Claim your reward</span>
              <span style={{ color:"white", fontSize:22, fontWeight:700, lineHeight:1 }}>→</span>
            </div>
            <div onClick={() => setScreen("home")} style={{
              color:"rgba(255,255,255,0.38)", fontSize:13, marginTop:14,
              cursor:"pointer", textDecoration:"underline",
              animation:"fadeIn 0.5s 0.7s ease-out both",
            }}>Maybe later</div>
          </div>
        </div>
        <style>{STYLES}</style>
      </div>
    );
  }
  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: REDEEMED — confirmation for 3/6/9 month
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "redeemed") {
    return (
      <div style={outerStyle}>
        <DemoSelector />
        <div style={phoneStyle}>
          <div style={{ position:"absolute", inset:0, background:C.bg }} />
          <div style={{
            position:"relative", zIndex:10, height:"100%",
            display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center",
            paddingLeft:28, paddingRight:28, textAlign:"center", gap:18,
          }}>
            <div style={{
              width:84, height:84, borderRadius:42, background:C.lime,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:38, color:"white", fontWeight:900,
              boxShadow:"0 8px 28px rgba(141,198,63,0.45)",
              animation:"checkPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both",
            }}>✓</div>
            <div>
              <div style={{ fontSize:26, fontWeight:900, color:C.black, lineHeight:1.2, marginBottom:8 }}>Reward claimed!</div>
              <div style={{ fontSize:14, color:C.gray, lineHeight:1.7 }}>
                Your <strong style={{ color:C.black }}>{m.reward}</strong> has been applied to your account.
              </div>
            </div>
            <div style={{
              background:C.amberBg, border:`1px solid ${C.amber}44`,
              borderRadius:16, padding:18, width:"100%", textAlign:"left",
            }}>
              <div style={{ fontSize:11, fontWeight:800, color:C.amber, letterSpacing:0.5, textTransform:"uppercase", marginBottom:6 }}>What happens next</div>
              <div style={{ fontSize:13, color:C.black, lineHeight:1.7 }}>
                Your reward is active and applied automatically at checkout. No code, no hassle. Just keep cooking!
              </div>
            </div>
            {/* Mini milestone recap */}
            <div style={{ background:C.card, borderRadius:16, padding:16, width:"100%", display:"flex", alignItems:"center", gap:14, textAlign:"left" }}>
              <div style={{
                width:48, height:48, borderRadius:24, flexShrink:0,
                background:`radial-gradient(circle at 35% 28%, ${m.shimmer}, ${m.color2} 55%, ${m.color1})`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
              }}>{m.icon}</div>
              <div>
                <div style={{ fontSize:10, fontWeight:800, color:m.color1, textTransform:"uppercase", letterSpacing:0.5 }}>{m.tier}</div>
                <div style={{ fontSize:13, fontWeight:700, color:C.black, marginTop:2 }}>{m.label}</div>
              </div>
            </div>
            <div onClick={() => setScreen("home")} style={{
              width:"100%", background:C.green, borderRadius:14, padding:"15px 20px",
              display:"flex", justifyContent:"space-between", alignItems:"center",
              cursor:"pointer", boxShadow:"0 6px 20px rgba(30,92,46,0.3)",
            }}>
              <span style={{ color:"white", fontSize:15, fontWeight:900 }}>Back to home</span>
              <span style={{ color:"white", fontSize:22, fontWeight:700, lineHeight:1 }}>→</span>
            </div>
          </div>
        </div>
        <style>{STYLES}</style>
      </div>
    );
  }
  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: THANK YOU — 1-year lemon mascot + year-in-review
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "thankyou") {
    const yr = MILESTONES.m12.yearStats;
    return (
      <div style={outerStyle}>
        <DemoSelector />
        <div style={phoneStyle}>
          <div style={{ position:"absolute", inset:0, background:`linear-gradient(170deg, #FFFDE7 0%, ${C.bg} 60%)` }} />
          <div style={{
            position:"relative", zIndex:10, height:"100%", overflowY:"auto",
            paddingTop:64, paddingLeft:24, paddingRight:24, paddingBottom:36,
          }}>
            {/* Back */}
            <div onClick={() => setScreen("home")} style={{
              position:"absolute", top:48, left:20,
              width:36, height:36, borderRadius:18,
              background:C.card, display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", fontSize:17,
            }}>←</div>
            {/* Lemon mascot */}
            <div style={{ display:"flex", justifyContent:"center", marginBottom:20, animation:"fadeIn 0.5s ease-out both" }}>
              <LemonMascot size={96} animate={true} />
            </div>
            {/* Heading */}
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:13, color:C.gray, marginBottom:6 }}>One year with HelloFresh 🎉</div>
              <div style={{ fontSize:24, fontWeight:900, color:C.black, lineHeight:1.2 }}>Thank you, Jawdee!</div>
            </div>
            {/* Warm note */}
            <div style={{
              background:C.amberBg, border:`1.5px solid ${C.amber}55`,
              borderRadius:16, padding:18, marginBottom:20,
              animation:"slideUp 0.5s 0.2s ease-out both",
            }}>
              <div style={{ fontSize:13, fontWeight:800, color:C.amber, marginBottom:8 }}>A note from the HelloFresh team 💌</div>
              <div style={{ fontSize:13, color:C.black, lineHeight:1.75 }}>
                One year ago you took the first step toward cooking more at home, wasting less, and enjoying every meal. You have stuck with it, cooked through seasons, tried things you never would have ordered at a restaurant, and made your kitchen a place worth spending time in.
              </div>
              <div style={{ fontSize:13, color:C.black, lineHeight:1.75, marginTop:10 }}>
                That takes real commitment. And we are genuinely grateful you chose us to be a part of it. Here is a look at everything you have achieved this year.
              </div>
            </div>
            {/* ── STATS: Nutrition + Cooking ── */}
            <div style={{ marginBottom:16, animation:"slideUp 0.5s 0.3s ease-out both" }}>
              <div style={{ fontSize:11, fontWeight:800, color:C.gray, letterSpacing:0.6, textTransform:"uppercase", marginBottom:10 }}>Nutrition and cooking</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
                {yr.filter(s => ["nutrition","cooking"].includes(s.group)).map((stat, i) => (
                  <div key={i} style={{
                    background:C.white, borderRadius:13, padding:"12px 11px",
                    display:"flex", alignItems:"center", gap:9,
                    boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
                  }}>
                    <span style={{ fontSize:20 }}>{stat.icon}</span>
                    <div>
                      <div style={{ fontSize:16, fontWeight:900, color:C.black, lineHeight:1 }}>{stat.val}</div>
                      <div style={{ fontSize:10, color:C.gray, marginTop:2 }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* ── STATS: Lifestyle + Impact ── */}
            <div style={{ marginBottom:16, animation:"slideUp 0.5s 0.38s ease-out both" }}>
              <div style={{ fontSize:11, fontWeight:800, color:C.gray, letterSpacing:0.6, textTransform:"uppercase", marginBottom:10 }}>Lifestyle and impact</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
                {yr.filter(s => ["impact","lifestyle"].includes(s.group)).map((stat, i) => (
                  <div key={i} style={{
                    background:C.white, borderRadius:13, padding:"12px 11px",
                    display:"flex", alignItems:"center", gap:9,
                    boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
                  }}>
                    <span style={{ fontSize:20 }}>{stat.icon}</span>
                    <div>
                      <div style={{ fontSize:16, fontWeight:900, color:C.black, lineHeight:1 }}>{stat.val}</div>
                      <div style={{ fontSize:10, color:C.gray, marginTop:2 }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* ── BMI JOURNEY ── */}
            {(() => {
              const bmi = MILESTONES.m12.bmi;
              // BMI scale shown: 15 to 35 (range = 20)
              const toPos = v => `${((v - 15) / 20) * 100}%`;
              const beforePos = ((bmi.before - 15) / 20) * 100;
              const afterPos  = ((bmi.after  - 15) / 20) * 100;
              return (
                <div style={{
                  background:C.white, borderRadius:16, padding:18, marginBottom:16,
                  boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
                  animation:"slideUp 0.5s 0.46s ease-out both",
                }}>
                  <div style={{ fontSize:11, fontWeight:800, color:C.gray, letterSpacing:0.6, textTransform:"uppercase", marginBottom:12 }}>Your health journey</div>
                  {/* Before / After headline */}
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:10, color:C.gray, marginBottom:2 }}>Jan 2024</div>
                      <div style={{ fontSize:22, fontWeight:900, color:"#D4600A" }}>{bmi.before}</div>
                      <div style={{ fontSize:10, color:C.gray }}>BMI</div>
                    </div>
                    <div style={{ flex:1, textAlign:"center" }}>
                      <div style={{
                        display:"inline-flex", alignItems:"center", gap:5,
                        background:"rgba(141,198,63,0.15)", borderRadius:20,
                        padding:"4px 12px", fontSize:11, fontWeight:800, color:C.green,
                      }}>↓ {(bmi.before - bmi.after).toFixed(1)} BMI points</div>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:10, color:C.gray, marginBottom:2 }}>Nov 2024</div>
                      <div style={{ fontSize:22, fontWeight:900, color:C.green }}>{bmi.after}</div>
                      <div style={{ fontSize:10, color:C.gray }}>BMI</div>
                    </div>
                  </div>
                  {/* BMI bar */}
                  <div style={{ position:"relative", height:68, marginBottom:6 }}>
                    {/* ── Labels ── */}
                    <div style={{
                      position:"absolute", top:0, left:`${afterPos}%`, transform:"translateX(-50%)",
                      fontSize:9, fontWeight:800, color:C.green, whiteSpace:"nowrap",
                    }}>Now</div>
                    <div style={{
                      position:"absolute", top:0, left:`${beforePos}%`, transform:"translateX(-50%)",
                      fontSize:9, fontWeight:800, color:"#D4600A", whiteSpace:"nowrap",
                    }}>Before</div>
                    {/* ── Stem lines ── */}
                    <div style={{
                      position:"absolute", top:12, left:`${afterPos}%`, transform:"translateX(-50%)",
                      width:2, height:18, background:C.green, borderRadius:1, opacity:0.5,
                    }} />
                    <div style={{
                      position:"absolute", top:12, left:`${beforePos}%`, transform:"translateX(-50%)",
                      width:2, height:18, background:"#D4600A", borderRadius:1, opacity:0.5,
                    }} />
                    {/* ── Coloured bar ── */}
                    <div style={{
                      position:"absolute", top:30, left:0, right:0,
                      height:10, borderRadius:6,
                      background:"linear-gradient(90deg, #5B9BD5 0%, #5B9BD5 17.5%, #6DBE45 17.5%, #6DBE45 49.5%, #FFC000 49.5%, #FFC000 74.5%, #FF6B6B 74.5%, #FF6B6B 100%)",
                    }} />
                    {/* ── Dots ── */}
                    <div style={{
                      position:"absolute", top:27, left:`${afterPos}%`, transform:"translateX(-50%)",
                      width:16, height:16, borderRadius:8, zIndex:2,
                      background:C.green, border:"2.5px solid white",
                      boxShadow:"0 2px 8px rgba(0,0,0,0.3)",
                    }} />
                    <div style={{
                      position:"absolute", top:27, left:`${beforePos}%`, transform:"translateX(-50%)",
                      width:16, height:16, borderRadius:8, zIndex:2,
                      background:"#D4600A", border:"2.5px solid white",
                      boxShadow:"0 2px 8px rgba(0,0,0,0.3)",
                    }} />
                    {/* ── Zone labels ── */}
                    <div style={{
                      position:"absolute", top:44, left:0, right:0,
                      display:"flex", justifyContent:"space-between",
                    }}>
                      {[["Under","#5B9BD5"],["Healthy","#6DBE45"],["Over","#FFC000"],["Obese","#FF6B6B"]].map(([lbl,col]) => (
                        <span key={lbl} style={{ fontSize:9, fontWeight:700, color:col }}>{lbl}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:C.gray, lineHeight:1.65 }}>
                    Eating balanced, home-cooked meals this year moved you from the overweight range into a healthy BMI. That is a real, measurable change.
                  </div>
                </div>
              );
            })()}
            {/* CTA to box reveal */}
            <div onClick={() => setScreen("boxreveal")} style={{
              background:`linear-gradient(135deg, ${MILESTONES.m12.color1}, ${MILESTONES.m12.color2})`,
              borderRadius:14, padding:"15px 20px",
              display:"flex", justifyContent:"space-between", alignItems:"center",
              cursor:"pointer", boxShadow:`0 8px 26px ${MILESTONES.m12.glow}`,
              animation:"slideUp 0.5s 0.5s ease-out both",
            }}>
              <span style={{ color:"white", fontSize:14, fontWeight:900 }}>And here is how we would like to say thank you 🎁</span>
              <span style={{ color:"white", fontSize:22, fontWeight:700, lineHeight:1 }}>→</span>
            </div>
          </div>
        </div>
        <style>{STYLES}</style>
      </div>
    );
  }
  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: BOX REVEAL — 1-year anniversary box
  // ════════════════════════════════════════════════════════════════════════════
  if (screen === "boxreveal") {
    const gold = MILESTONES.m12;
    return (
      <div style={outerStyle}>
        <DemoSelector />
        <div style={phoneStyle}>
          <div style={{ position:"absolute", inset:0, background:C.bg }} />
          <div style={{
            position:"relative", zIndex:10, height:"100%", overflowY:"auto",
            paddingBottom:24,
          }}>
            {/* Green header */}
            <div style={{
              background:`linear-gradient(135deg, ${gold.color1} 0%, ${gold.color2} 100%)`,
              paddingTop:64, paddingBottom:28, paddingLeft:24, paddingRight:24,
              position:"relative",
            }}>
              <div onClick={() => setScreen("thankyou")} style={{
                position:"absolute", top:52, left:20,
                width:36, height:36, borderRadius:18,
                background:"rgba(255,255,255,0.2)",
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", fontSize:17, color:"white",
              }}>←</div>
              <div style={{ textAlign:"center" }}>
                <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, marginBottom:4 }}>Your 1-year reward</div>
                <div style={{ color:"white", fontSize:22, fontWeight:900, lineHeight:1.2 }}>Anniversary Favourites Box 🎁</div>
                <div style={{ color:"rgba(255,255,255,0.8)", fontSize:13, marginTop:8, lineHeight:1.6 }}>
                  We picked your highest-rated meals from the past year. All in one special box, just for you.
                </div>
              </div>
            </div>
            {/* Meal list */}
            <div style={{ padding:"16px 16px 8px" }}>
              <div style={{ fontSize:12, fontWeight:800, color:C.gray, letterSpacing:0.5, textTransform:"uppercase", marginBottom:12 }}>What is inside</div>
              {MEALS.map((meal, i) => (
                <div key={i} style={{
                  background:C.white, borderRadius:14, padding:"14px 16px", marginBottom:10,
                  display:"flex", alignItems:"center", gap:14,
                  boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
                  animation:`slideUp 0.4s ${i*0.08}s ease-out both`,
                }}>
                  <div style={{
                    width:48, height:48, borderRadius:12, background:C.card, flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:24,
                  }}>{meal.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:C.black }}>{meal.name}</div>
                    <div style={{ fontSize:11, color:C.gray, marginTop:2 }}>{meal.tag}</div>
                  </div>
                  <div style={{
                    background:`${gold.color2}33`, borderRadius:8, padding:"4px 8px",
                    fontSize:12, fontWeight:800, color:gold.color1,
                    display:"flex", alignItems:"center", gap:3,
                  }}>
                    <span>⭐</span>{meal.rating.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
            {/* Confirm CTA */}
            <div style={{ padding:"4px 16px 0" }}>
              <div onClick={() => setScreen("confirmed")} style={{
                background:`linear-gradient(135deg, ${gold.color1}, ${gold.color2})`,
                borderRadius:14, padding:"15px 20px",
                display:"flex", justifyContent:"space-between", alignItems:"center",
                cursor:"pointer", boxShadow:`0 8px 26px ${gold.glow}`,
              }}>
                <span style={{ color:"white", fontSize:15, fontWeight:900 }}>Confirm my anniversary box</span>
                <span style={{ color:"white", fontSize:22, fontWeight:700, lineHeight:1 }}>→</span>
              </div>
            </div>
          </div>
        </div>
        <style>{STYLES}</style>
      </div>
    );
  }
  // ════════════════════════════════════════════════════════════════════════════
  // SCREEN: CONFIRMED — 1-year final confirmation
  // ════════════════════════════════════════════════════════════════════════════
  const gold = MILESTONES.m12;
  return (
    <div style={outerStyle}>
      <DemoSelector />
      <div style={phoneStyle}>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(170deg, #FFFDE7 0%, ${C.bg} 60%)` }} />
        <div style={{
          position:"relative", zIndex:10, height:"100%",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          paddingLeft:28, paddingRight:28, textAlign:"center", gap:16,
        }}>
          {/* Lemon mascot returns */}
          <div style={{ animation:"checkPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <LemonMascot size={80} animate={true} />
          </div>
          <div>
            <div style={{ fontSize:25, fontWeight:900, color:C.black, lineHeight:1.2, marginBottom:8 }}>Your box is on its way! 🎉</div>
            <div style={{ fontSize:14, color:C.gray, lineHeight:1.7 }}>
              Your Anniversary Favourites Box has been confirmed. It will arrive with your next scheduled delivery.
            </div>
          </div>
          {/* Gold card */}
          <div style={{
            background:`linear-gradient(135deg, ${gold.color1}22, ${gold.color2}33)`,
            border:`1.5px solid ${gold.color2}88`,
            borderRadius:16, padding:18, width:"100%", textAlign:"left",
          }}>
            <div style={{ fontSize:11, fontWeight:800, color:gold.color1, textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>In your box</div>
            {MEALS.slice(0, 3).map((meal, i) => (
              <div key={i} style={{ fontSize:13, color:C.black, padding:"4px 0", display:"flex", alignItems:"center", gap:8 }}>
                <span>{meal.emoji}</span> {meal.name}
              </div>
            ))}
            <div style={{ fontSize:12, color:C.gray, marginTop:6 }}>+ 2 more favourite meals</div>
          </div>
          <div style={{
            background:C.amberBg, border:`1px solid ${C.amber}44`,
            borderRadius:14, padding:14, width:"100%", textAlign:"left",
          }}>
            <div style={{ fontSize:13, color:C.black, lineHeight:1.7 }}>
              Thank you for an incredible year, Jawdee. Here is to many more fresh meals together. 💚
            </div>
          </div>
          <div onClick={() => setScreen("home")} style={{
            width:"100%", background:C.green, borderRadius:14, padding:"15px 20px",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            cursor:"pointer", boxShadow:"0 6px 20px rgba(30,92,46,0.3)",
          }}>
            <span style={{ color:"white", fontSize:15, fontWeight:900 }}>Back to home</span>
            <span style={{ color:"white", fontSize:22, fontWeight:700, lineHeight:1 }}>→</span>
          </div>
        </div>
      </div>
      <style>{STYLES}</style>
    </div>
  );
}
