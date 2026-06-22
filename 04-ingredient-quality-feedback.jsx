import { useState } from "react";
// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  green:     "#1E5C2E",
  greenMid:  "#3E8A50",
  lime:      "#8DC63F",
  bg:        "#F4EFE8",
  card:      "#EDE8DF",
  white:     "#FFFFFF",
  black:     "#1A1A1A",
  gray:      "#726E68",
  grayLight: "#B8B2A8",
  amber:     "#A06A0A",
  amberBg:   "#FEF3E2",
  orange:    "#D4600A",
  red:       "#C0392B",
};
// ── Recipes from the last box, with traceable ingredients ─────────────────────
const RECIPES = [
  {
    name: "Honey Garlic Salmon", emoji: "🐟", color: "#C4785A", time: "35 min",
    ingredients: [
      { name: "Salmon Fillet", emoji: "🐟", supplier: "Northern Waters Seafood, BC" },
      { name: "Garlic",        emoji: "🧄", supplier: "Heritage Growers, Ontario" },
      { name: "Honey",         emoji: "🍯", supplier: "Golden Meadow Apiary, Ontario" },
      { name: "Broccoli",      emoji: "🥦", supplier: "Valley Fresh Produce, BC" },
      { name: "Green Beans",   emoji: "🫛", supplier: "Garden State Growers, Ontario" },
      { name: "Jasmine Rice",  emoji: "🍚", supplier: "Pantry Staples Co." },
    ],
  },
  {
    name: "Thai Basil Chicken", emoji: "🍗", color: "#B06840", time: "30 min",
    ingredients: [
      { name: "Chicken Breast", emoji: "🍗", supplier: "Maplebrook Poultry, Ontario" },
      { name: "Thai Basil",     emoji: "🌿", supplier: "Greenleaf Farms, Quebec" },
      { name: "Bell Pepper",    emoji: "🫑", supplier: "Sunrise Organics, Ontario" },
      { name: "Garlic",         emoji: "🧄", supplier: "Heritage Growers, Ontario" },
      { name: "Lime",           emoji: "🍋", supplier: "Citrus Select, California" },
      { name: "Jasmine Rice",   emoji: "🍚", supplier: "Pantry Staples Co." },
    ],
  },
  {
    name: "Mushroom & Herb Risotto", emoji: "🍄", color: "#7A9A72", time: "40 min",
    ingredients: [
      { name: "Cremini Mushrooms", emoji: "🍄", supplier: "Forest Floor Fungi, Ontario" },
      { name: "Arborio Rice",      emoji: "🍚", supplier: "Pantry Staples Co." },
      { name: "Parmesan",          emoji: "🧀", supplier: "Harmony Dairy, Ontario" },
      { name: "Shallots",          emoji: "🧅", supplier: "Great Plains Growers, Manitoba" },
      { name: "Fresh Thyme",       emoji: "🌿", supplier: "Greenleaf Farms, Quebec" },
      { name: "Vegetable Stock",   emoji: "🥣", supplier: "Pantry Staples Co." },
    ],
  },
];
const ISSUE_TYPES = [
  { key: "ingredient", icon: "🥦", label: "Ingredient quality",   desc: "Something wasn't fresh or as expected" },
  { key: "recipe",     icon: "📖", label: "Recipe & instructions", desc: "Steps were unclear or didn't work out" },
  { key: "portion",    icon: "⚖️", label: "Portion size",          desc: "Too much or too little for the meal" },
  { key: "packaging",  icon: "📦", label: "Packaging & delivery",  desc: "Damaged, leaking, or arrived late" },
  { key: "other",      icon: "💬", label: "Something else",         desc: "Tell us in your own words" },
];
const PROBLEMS = ["Not fresh", "Wilted / soft", "Bruised / damaged", "Spoiled / moldy", "Too small", "Wrong / missing"];
// ── CSS ───────────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes slideUp  { from { transform:translateY(26px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes checkPop { 0%{transform:scale(0);opacity:0;} 60%{transform:scale(1.2);opacity:1;} 100%{transform:scale(1);opacity:1;} }
  @keyframes popIn    { from { transform:scale(0.9); opacity:0; } to { transform:scale(1); opacity:1; } }
`;
const outerStyle = {
  minHeight: "100vh", background: "#1A3020",
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  padding: 24, gap: 14,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};
const phoneStyle = {
  width: 390, height: 844, borderRadius: 44, position: "relative", overflow: "hidden",
  boxShadow: "0 32px 80px rgba(0,0,0,0.32), 0 0 0 2px #2a2a2a",
  background: C.bg,
};
// ══════════════════════════════════════════════════════════════════════════════
export default function IngredientFeedback() {
  const [screen,   setScreen]   = useState("rate");
  const [recipe,   setRecipe]   = useState(null);
  const [issue,    setIssue]    = useState(null);
  const [bad,      setBad]      = useState([]);    // flagged ingredient names
  const [issues,   setIssues]   = useState({});    // name -> [problems]
  const [ratings,  setRatings]  = useState({});    // recipeName -> 'up'

  const startReport = (r) => { setRecipe(r); setIssue(null); setBad([]); setIssues({}); setScreen("issue"); };
  const chooseIssue = (t) => { setIssue(t); setScreen(t.key === "ingredient" ? "ingredients" : "done"); };
  const toggleBad   = (n) => setBad(b => b.includes(n) ? b.filter(x => x !== n) : [...b, n]);
  const toggleProb  = (n, p) => setIssues(prev => {
    const cur = prev[n] || [];
    return { ...prev, [n]: cur.includes(p) ? cur.filter(x => x !== p) : [...cur, p] };
  });
  const reset = () => { setScreen("rate"); setRecipe(null); setIssue(null); setBad([]); setIssues({}); };

  const supplierOf = (n) => recipe?.ingredients.find(i => i.name === n)?.supplier;
  const emojiOf    = (n) => recipe?.ingredients.find(i => i.name === n)?.emoji;

  // ── Step indicator for the flow ──
  const stepIndex = { issue: 0, ingredients: 1, detail: 2 }[screen];
  const Stepper = () => (
    <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          height: 4, flex: 1, borderRadius: 2,
          background: i <= stepIndex ? C.lime : "rgba(255,255,255,0.25)",
          transition: "background 0.3s",
        }} />
      ))}
    </div>
  );
  const BackHeader = ({ title, sub, onBack, showStep }) => (
    <div style={{
      background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenMid} 100%)`,
      paddingTop: 56, paddingBottom: 18, paddingLeft: 18, paddingRight: 18,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, background: "rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 17, color: "white", flexShrink: 0,
        }}>←</div>
        <div>
          <div style={{ color: "white", fontWeight: 900, fontSize: 17 }}>{title}</div>
          {sub && <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 1 }}>{sub}</div>}
        </div>
      </div>
      {showStep && <Stepper />}
    </div>
  );

  return (
    <div style={outerStyle}>
      <div style={phoneStyle}>
        {/* Status bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, zIndex: 5 }} />

        {/* ════════════════ RATE (home) ════════════════ */}
        {screen === "rate" && (
          <div style={{ height: "100%", overflowY: "auto" }}>
            <div style={{ background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenMid} 100%)`, paddingTop: 54, paddingBottom: 22, paddingLeft: 20, paddingRight: 20 }}>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>Last box · delivered Dec 4</div>
              <div style={{ color: "white", fontSize: 23, fontWeight: 900, marginTop: 3 }}>How were your meals?</div>
              <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
                Your feedback is traced straight to the supplier, so we can fix quality at the source.
              </div>
            </div>
            <div style={{ padding: "16px 16px 32px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.gray, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 12 }}>
                Rate this week's recipes
              </div>
              {RECIPES.map((r, i) => {
                const rated = ratings[r.name];
                return (
                  <div key={r.name} style={{
                    background: C.white, borderRadius: 16, padding: 14, marginBottom: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    display: "flex", alignItems: "center", gap: 14,
                    animation: `slideUp 0.4s ${i * 0.07}s ease-out both`,
                  }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: r.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{r.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: C.black }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{r.time} · {r.ingredients.length} ingredients</div>
                    </div>
                    {rated === "up" ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.green, fontSize: 12, fontWeight: 800 }}>
                        <span style={{ fontSize: 16 }}>👍</span> Thanks!
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setRatings(p => ({ ...p, [r.name]: "up" }))} style={{
                          width: 38, height: 38, borderRadius: 12, border: `1.5px solid ${C.card}`,
                          background: C.bg, cursor: "pointer", fontSize: 17,
                        }}>👍</button>
                        <button onClick={() => startReport(r)} style={{
                          width: 38, height: 38, borderRadius: 12, border: `1.5px solid ${C.red}44`,
                          background: `${C.red}10`, cursor: "pointer", fontSize: 17,
                        }}>👎</button>
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ textAlign: "center", fontSize: 12, color: C.grayLight, marginTop: 8 }}>
                👎 to report what went wrong
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ ISSUE TYPE ════════════════ */}
        {screen === "issue" && recipe && (
          <div style={{ height: "100%", overflowY: "auto" }}>
            <BackHeader title="Report an issue" sub={recipe.name} onBack={reset} showStep />
            <div style={{ padding: "18px 16px 32px" }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: C.black, marginBottom: 4 }}>Sorry that meal missed the mark.</div>
              <div style={{ fontSize: 13, color: C.gray, marginBottom: 16, lineHeight: 1.5 }}>What was the main issue?</div>
              {ISSUE_TYPES.map((t, i) => (
                <div key={t.key} onClick={() => chooseIssue(t)} style={{
                  background: C.white, borderRadius: 14, padding: "14px 16px", marginBottom: 10,
                  display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  border: `1.5px solid ${C.white}`,
                  animation: `slideUp 0.35s ${i * 0.05}s ease-out both`,
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: C.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{t.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.black }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: C.gray, marginTop: 1 }}>{t.desc}</div>
                  </div>
                  <span style={{ color: C.grayLight, fontSize: 18 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════ PICK INGREDIENTS ════════════════ */}
        {screen === "ingredients" && recipe && (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <BackHeader title="Which ingredients?" sub={recipe.name} onBack={() => setScreen("issue")} showStep />
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px 16px" }}>
              <div style={{ fontSize: 13, color: C.gray, marginBottom: 16, lineHeight: 1.5 }}>
                Tap the ingredient(s) that had a problem. We'll trace each one back to its supplier.
              </div>
              {recipe.ingredients.map((ing, i) => {
                const on = bad.includes(ing.name);
                return (
                  <div key={ing.name} onClick={() => toggleBad(ing.name)} style={{
                    background: on ? `${C.green}0E` : C.white, borderRadius: 14, padding: "12px 14px", marginBottom: 10,
                    display: "flex", alignItems: "center", gap: 13, cursor: "pointer",
                    border: `1.5px solid ${on ? C.green : C.card}`,
                    boxShadow: "0 1px 5px rgba(0,0,0,0.04)",
                    transition: "all 0.15s",
                    animation: `slideUp 0.3s ${i * 0.04}s ease-out both`,
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: C.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{ing.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.black }}>{ing.name}</div>
                      <div style={{ fontSize: 11, color: C.gray, marginTop: 1 }}>{ing.supplier}</div>
                    </div>
                    <div style={{
                      width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                      border: `2px solid ${on ? C.green : C.grayLight}`,
                      background: on ? C.green : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontSize: 14, fontWeight: 900,
                    }}>{on ? "✓" : ""}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "12px 16px 24px", background: C.white, borderTop: `1px solid ${C.card}` }}>
              <button
                disabled={bad.length === 0}
                onClick={() => setScreen("detail")}
                style={{
                  width: "100%", border: "none", borderRadius: 14, padding: "15px 0",
                  fontSize: 15, fontWeight: 900, cursor: bad.length ? "pointer" : "default",
                  background: bad.length ? C.green : C.card,
                  color: bad.length ? "white" : C.grayLight,
                  transition: "all 0.2s",
                }}
              >
                {bad.length === 0 ? "Select at least one" : `Continue with ${bad.length} ingredient${bad.length > 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        )}

        {/* ════════════════ WHAT WAS WRONG ════════════════ */}
        {screen === "detail" && recipe && (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <BackHeader title="What was wrong?" sub={`${bad.length} ingredient${bad.length > 1 ? "s" : ""}`} onBack={() => setScreen("ingredients")} showStep />
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px 16px" }}>
              <div style={{ fontSize: 13, color: C.gray, marginBottom: 16, lineHeight: 1.5 }}>
                Pick what went wrong with each. This tells us exactly what to fix.
              </div>
              {bad.map((n, i) => (
                <div key={n} style={{
                  background: C.white, borderRadius: 16, padding: 14, marginBottom: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  animation: `slideUp 0.35s ${i * 0.06}s ease-out both`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{emojiOf(n)}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: C.black }}>{n}</div>
                      <div style={{ fontSize: 10.5, color: C.gray }}>{supplierOf(n)}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {PROBLEMS.map(p => {
                      const on = (issues[n] || []).includes(p);
                      return (
                        <div key={p} onClick={() => toggleProb(n, p)} style={{
                          borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                          background: on ? C.green : C.bg,
                          color: on ? "white" : C.gray,
                          border: `1.5px solid ${on ? C.green : C.card}`,
                          transition: "all 0.15s",
                        }}>{p}</div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 16px 24px", background: C.white, borderTop: `1px solid ${C.card}` }}>
              <button onClick={() => setScreen("done")} style={{
                width: "100%", border: "none", borderRadius: 14, padding: "15px 0",
                fontSize: 15, fontWeight: 900, cursor: "pointer", background: C.green, color: "white",
              }}>
                Submit feedback
              </button>
            </div>
          </div>
        )}

        {/* ════════════════ CONFIRMATION ════════════════ */}
        {screen === "done" && (
          <div style={{ height: "100%", overflowY: "auto" }}>
            <div style={{ background: `linear-gradient(160deg, ${C.green} 0%, #0F3A1C 100%)`, paddingTop: 64, paddingBottom: 30, paddingLeft: 20, paddingRight: 20, textAlign: "center" }}>
              <div style={{
                width: 76, height: 76, borderRadius: 38, background: C.lime, margin: "0 auto 14px",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "white", fontWeight: 900,
                boxShadow: "0 8px 26px rgba(141,198,63,0.5)",
                animation: "checkPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both",
              }}>✓</div>
              <div style={{ color: "white", fontSize: 22, fontWeight: 900 }}>Thanks, Jawdee!</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
                Your feedback on <strong style={{ color: "white" }}>{recipe?.name}</strong> has been logged.
              </div>
            </div>
            <div style={{ padding: "16px 16px 32px" }}>
              {issue?.key === "ingredient" ? (
                <>
                  {/* Traceability summary */}
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.gray, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 12 }}>
                    Flagged & traced to supplier
                  </div>
                  {bad.map((n, i) => (
                    <div key={n} style={{
                      background: C.white, borderRadius: 14, padding: 14, marginBottom: 10,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      animation: `slideUp 0.35s ${i * 0.06}s ease-out both`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{emojiOf(n)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: C.black }}>{n}</div>
                          <div style={{ fontSize: 11, color: C.gray }}>↳ {supplierOf(n)}</div>
                        </div>
                      </div>
                      {(issues[n] || []).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                          {(issues[n] || []).map(p => (
                            <span key={p} style={{ background: `${C.red}12`, color: C.red, borderRadius: 14, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{p}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Credit */}
                  <div style={{ background: C.amberBg, border: `1px solid ${C.amber}44`, borderRadius: 14, padding: 16, marginTop: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: C.amber, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>What happens next</div>
                    <div style={{ fontSize: 13, color: C.black, lineHeight: 1.65 }}>
                      We've sent this to our quality review team to investigate the flagged ingredient{bad.length > 1 ? "s" : ""} with the supplier. You'll hear back with the outcome and any resolution within 3-5 business days. Thanks for helping us improve quality at the source.
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ background: C.amberBg, border: `1px solid ${C.amber}44`, borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.amber, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>What happens next</div>
                  <div style={{ fontSize: 13, color: C.black, lineHeight: 1.65 }}>
                    Our team will review your note about <strong>{issue?.label.toLowerCase()}</strong> and follow up if needed. Thanks for helping us improve.
                  </div>
                </div>
              )}
              <button onClick={reset} style={{
                width: "100%", marginTop: 16, background: C.green, color: "white",
                border: "none", borderRadius: 14, padding: "15px 0", fontSize: 15, fontWeight: 900, cursor: "pointer",
              }}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center" }}>
        Tap 👎 on a recipe → choose “Ingredient quality” to see the full flow
      </div>
      <style>{STYLES}</style>
    </div>
  );
}
