import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4242";

const PRODUCTS = [
  { id: 1, name: "Charizard VMAX", set: "Épée & Bouclier", grade: "PSA 10", price: 289.99, category: "pokemon", rarity: "ultra-rare", stock: 3, img: "🔥" },
  { id: 2, name: "Dracaufeu Base Set", set: "Base Set 1999", grade: "PSA 9", price: 1499.99, category: "pokemon", rarity: "holo-rare", stock: 1, img: "🐉" },
  { id: 3, name: "Mewtwo GX", set: "Ombres Ardentes", grade: "BGS 9.5", price: 74.99, category: "pokemon", rarity: "gx", stock: 5, img: "🧬" },
  { id: 4, name: "Pikachu Illustrateur", set: "CoroCoro 1998", grade: "PSA 7", price: 8999.99, category: "pokemon", rarity: "unique", stock: 1, img: "⚡" },
  { id: 5, name: "Black Lotus", set: "Alpha 1993", grade: "PSA 8", price: 24999.99, category: "magic", rarity: "power-9", stock: 1, img: "🌸" },
  { id: 6, name: "Mox Sapphire", set: "Beta 1993", grade: "BGS 8", price: 4500.00, category: "magic", rarity: "power-9", stock: 2, img: "💎" },
  { id: 7, name: "Goku SSJ4 UR", set: "Dragon Ball Super", grade: "PSA 10", price: 189.99, category: "other", rarity: "ultra-rare", stock: 4, img: "🌀" },
  { id: 8, name: "Blue-Eyes White Dragon", set: "LOB 1st Edition", grade: "PSA 9", price: 3200.00, category: "yugioh", rarity: "ultra-rare", stock: 1, img: "🐲" },
  { id: 9, name: "Lugia Neo Genesis Holo", set: "Neo Genesis", grade: "PSA 10", price: 2800.00, category: "pokemon", rarity: "holo-rare", stock: 1, img: "🌊" },
  { id: 10, name: "Dark Magician 1st Ed", set: "Spell Ruler", grade: "PSA 8", price: 890.00, category: "yugioh", rarity: "ultra-rare", stock: 2, img: "🎩" },
  { id: 11, name: "Umbreon VMAX Alt Art", set: "Évolutions Brillantes", grade: "Raw", price: 159.99, category: "pokemon", rarity: "alt-art", stock: 7, img: "🌙" },
  { id: 12, name: "Ancestral Recall", set: "Unlimited 1993", grade: "BGS 7.5", price: 1800.00, category: "magic", rarity: "power-9", stock: 1, img: "📜" },
];

const CATEGORIES = [
  { id: "all", label: "TOUS" },
  { id: "pokemon", label: "POKÉMON" },
  { id: "magic", label: "MAGIC" },
  { id: "yugioh", label: "YU-GI-OH" },
  { id: "other", label: "AUTRES" },
];

const RARITY_COLORS = {
  "ultra-rare": "#ff3366",
  "holo-rare": "#a855f7",
  "gx": "#3b82f6",
  "power-9": "#f59e0b",
  "unique": "#00ff88",
  "alt-art": "#ec4899",
  "Raw": "#6b7280",
};

function GlitchText({ text, style = {} }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{
        fontFamily: "'Courier New', monospace", fontWeight: 900, ...style,
        ...(glitch ? { textShadow: "2px 0 #ff3366, -2px 0 #00ff88", transform: "translateX(2px)", display: "inline-block" } : {})
      }}>{text}</span>
    </span>
  );
}

function Terminal({ lines }) {
  const [displayed, setDisplayed] = useState([]);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (current < lines.length) {
      const t = setTimeout(() => {
        setDisplayed(d => [...d, lines[current]]);
        setCurrent(c => c + 1);
      }, 600 * current + Math.random() * 200);
      return () => clearTimeout(t);
    }
  }, [current, lines]);
  return (
    <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#00ff88", padding: "12px 16px", background: "#050508", borderRadius: 4, minHeight: 80, border: "1px solid #1a1a2e" }}>
      {displayed.map((line, i) => (
        <div key={i} style={{ marginBottom: 2 }}>
          <span style={{ color: "#4ade80" }}>{">"}</span> {line}
        </div>
      ))}
      <span style={{ animation: "blink 1s infinite", color: "#00ff88" }}>█</span>
    </div>
  );
}

function CartDrawer({ cart, onClose, onRemove, onQty, onCheckout, loading }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: 360, background: "#0a0a0f", borderLeft: "1px solid #1a1a2e", zIndex: 1000, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a1a2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, color: "#00ff88", fontSize: 18 }}>[PANIER] ({cart.length})</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 22, cursor: "pointer" }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
        {cart.length === 0 && (
          <div style={{ color: "#4b5563", fontFamily: "'Courier New', monospace", fontSize: 13, marginTop: 40, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>PANIER VIDE
          </div>
        )}
        {cart.map(item => (
          <div key={item.id} style={{ marginBottom: 16, padding: 14, background: "#111118", border: "1px solid #1a1a2e", borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, color: "#e5e7eb", fontSize: 13 }}>{item.img} {item.name}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{item.grade}</div>
              </div>
              <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "#ff3366", cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => onQty(item.id, -1)} style={{ background: "#1a1a2e", border: "none", color: "#e5e7eb", width: 24, height: 24, borderRadius: 4, cursor: "pointer" }}>-</button>
                <span style={{ fontFamily: "'Courier New', monospace", color: "#e5e7eb", fontSize: 13 }}>{item.qty}</span>
                <button onClick={() => onQty(item.id, 1)} style={{ background: "#1a1a2e", border: "none", color: "#e5e7eb", width: 24, height: 24, borderRadius: 4, cursor: "pointer" }}>+</button>
              </div>
              <span style={{ fontFamily: "'Courier New', monospace", color: "#00ff88", fontWeight: 700 }}>{(item.price * item.qty).toFixed(2)}€</span>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div style={{ padding: "16px 24px", borderTop: "1px solid #1a1a2e" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Courier New', monospace", color: "#9ca3af", fontSize: 13 }}>TOTAL</span>
            <span style={{ fontFamily: "'Courier New', monospace", color: "#00ff88", fontWeight: 900, fontSize: 20 }}>{total.toFixed(2)}€</span>
          </div>
          <button onClick={onCheckout} disabled={loading} style={{ width: "100%", padding: "14px 0", background: loading ? "#1a1a2e" : "#00ff88", border: "none", color: loading ? "#4b5563" : "#0a0a0f", fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", borderRadius: 6, letterSpacing: 2 }}>
            {loading ? "⏳ CONNEXION À STRIPE..." : "▶ PAYER MAINTENANT"}
          </button>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#4b5563", fontFamily: "'Courier New', monospace" }}>🔒 Paiement sécurisé via Stripe</div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [added, setAdded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visitors] = useState(Math.floor(1200 + Math.random() * 800));
  const [liveSales, setLiveSales] = useState(47);

  useEffect(() => {
    const t = setInterval(() => { if (Math.random() > 0.7) setLiveSales(s => s + 1); }, 8000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_id")) { setCart([]); alert("✅ Paiement confirmé ! Merci pour ta commande."); window.history.replaceState({}, "", "/"); }
    if (window.location.pathname === "/cancel") { alert("❌ Paiement annulé."); window.history.replaceState({}, "", "/"); }
  }, []);

  const addToCart = (product) => {
    setCart(prev => { const exists = prev.find(i => i.id === product.id); if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i); return [...prev, { ...product, qty: 1 }]; });
    setAdded(product.id); setTimeout(() => setAdded(null), 1500);
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const changeQty = (id, delta) => { setCart(prev => prev.map(i => { if (i.id !== id) return i; const newQty = i.qty + delta; return newQty < 1 ? null : { ...i, qty: newQty }; }).filter(Boolean)); };

  const handleCheckout = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_URL}/create-checkout-session`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: cart }) });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; } else { setError(data.error || "Erreur lors du paiement"); }
    } catch (err) { setError("Impossible de contacter le serveur de paiement"); } finally { setLoading(false); }
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  let filtered = PRODUCTS.filter(p => { if (category !== "all" && p.category !== category) return false; if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.set.toLowerCase().includes(search.toLowerCase())) return false; return true; });
  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "grade") filtered = [...filtered].sort((a, b) => a.grade.localeCompare(b.grade));

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e5e7eb", fontFamily: "system-ui, sans-serif" }}>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes pulse-green{0%,100%{box-shadow:0 0 0 0 rgba(0,255,136,0.4)}50%{box-shadow:0 0 0 8px rgba(0,255,136,0)}}.card-hover:hover{border-color:#00ff88!important;transform:translateY(-2px);transition:all 0.2s}.btn-add:hover{background:#00ff88!important;color:#0a0a0f!important}.cat-btn:hover{border-color:#00ff88!important;color:#00ff88!important}::-webkit-scrollbar{width:4px;background:#111}::-webkit-scrollbar-thumb{background:#1a1a2e}`}</style>
      <header style={{ borderBottom: "1px solid #1a1a2e", padding: "0 32px", background: "#07070d", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", animation: "pulse-green 2s infinite" }} />
            <GlitchText text="CARD_MARKET.EXE" style={{ color: "#00ff88", fontSize: 20 }} />
            <span style={{ fontSize: 10, color: "#374151", fontFamily: "'Courier New', monospace", letterSpacing: 2 }}>v2.6.1</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#4b5563" }}>👁 {visitors.toLocaleString()} en ligne</span>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#ff3366" }}>⚡ {liveSales} ventes aujourd'hui</span>
            <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: cartCount > 0 ? "rgba(0,255,136,0.08)" : "none", border: "1px solid " + (cartCount > 0 ? "#00ff88" : "#1a1a2e"), color: cartCount > 0 ? "#00ff88" : "#6b7280", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              🛒 PANIER
              {cartCount > 0 && <span style={{ background: "#ff3366", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
      {error && <div style={{ background: "#ff336622", border: "1px solid #ff3366", padding: "10px 32px", fontFamily: "'Courier New', monospace", fontSize: 12, color: "#ff3366" }}>❌ {error}</div>}
      <div style={{ borderBottom: "1px solid #1a1a2e", padding: "40px 32px", background: "linear-gradient(180deg, #0d0d1a 0%, #0a0a0f 100%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#374151", letterSpacing: 4, marginBottom: 12 }}>// MARCHÉ SECONDAIRE CARTES GRADÉES</div>
            <h1 style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 48, lineHeight: 1.1, margin: "0 0 16px", color: "#e5e7eb" }}>ACHETEZ <span style={{ color: "#00ff88" }}>LES</span><br />MEILLEURES<br /><span style={{ color: "#ff3366" }}>CARTES.</span></h1>
            <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 420, lineHeight: 1.6 }}>Pokémon • Magic • Yu-Gi-Oh et plus. Cartes PSA, BGS, CGC. Livraison sécurisée, paiement Stripe.</p>
            <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
              {[{ n: PRODUCTS.length, l: "CARTES DISPO" }, { n: "PSA / BGS", l: "GRADEURS" }, { n: "24h", l: "LIVRAISON" }].map(({ n, l }) => (
                <div key={l}><div style={{ fontFamily: "'Courier New', monospace", fontSize: 20, fontWeight: 900, color: "#00ff88" }}>{n}</div><div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4b5563", letterSpacing: 2 }}>{l}</div></div>
              ))}
            </div>
          </div>
          <Terminal lines={["Connexion au serveur...", "Auth OK. Bienvenue.", `${PRODUCTS.length} cartes disponibles.`, "Stock en temps réel activé.", "Stripe payment gateway: ✅", "Prêt à trader. 🎴"]} />
        </div>
      </div>
      <div style={{ padding: "20px 32px", borderBottom: "1px solid #1a1a2e", background: "#07070d", position: "sticky", top: 64, zIndex: 90 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#4b5563" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une carte..." style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#111118", border: "1px solid #1a1a2e", borderRadius: 6, color: "#e5e7eb", fontFamily: "'Courier New', monospace", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {CATEGORIES.map(c => <button key={c.id} className="cat-btn" onClick={() => setCategory(c.id)} style={{ padding: "8px 14px", background: category === c.id ? "rgba(0,255,136,0.1)" : "none", border: "1px solid " + (category === c.id ? "#00ff88" : "#1a1a2e"), color: category === c.id ? "#00ff88" : "#6b7280", borderRadius: 6, cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: 1 }}>{c.label}</button>)}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "9px 12px", background: "#111118", border: "1px solid #1a1a2e", color: "#9ca3af", borderRadius: 6, fontFamily: "'Courier New', monospace", fontSize: 12, cursor: "pointer" }}>
            <option value="default">TRIER PAR</option><option value="price-asc">PRIX ↑</option><option value="price-desc">PRIX ↓</option><option value="grade">GRADE</option>
          </select>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "32px auto", padding: "0 32px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {filtered.map(product => (
            <div key={product.id} className="card-hover" style={{ background: "#111118", border: "1px solid #1a1a2e", borderRadius: 8, padding: 20, display: "flex", flexDirection: "column", gap: 12, transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: 32 }}>{product.img}</span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span style={{ fontSize: 10, fontFamily: "'Courier New', monospace", fontWeight: 700, color: RARITY_COLORS[product.rarity] || "#6b7280", background: (RARITY_COLORS[product.rarity] || "#6b7280") + "22", padding: "2px 8px", borderRadius: 4, letterSpacing: 1, border: "1px solid " + ((RARITY_COLORS[product.rarity] || "#6b7280") + "44") }}>{product.rarity.toUpperCase().replace("-", " ")}</span>
                  {product.stock <= 2 && <span style={{ fontSize: 10, fontFamily: "'Courier New', monospace", color: "#ff3366" }}>⚠ {product.stock} restant{product.stock > 1 ? "s" : ""}</span>}
                </div>
              </div>
              <div><div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 14, color: "#e5e7eb", marginBottom: 4 }}>{product.name}</div><div style={{ fontSize: 11, color: "#4b5563" }}>{product.set}</div></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, color: "#a855f7", background: "#a855f722", padding: "3px 8px", borderRadius: 4, border: "1px solid #a855f744" }}>{product.grade}</span>
                <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 16, color: "#00ff88" }}>{product.price.toFixed(2)}€</span>
              </div>
              <button className="btn-add" onClick={() => addToCart(product)} style={{ width: "100%", padding: "10px 0", marginTop: 4, background: added === product.id ? "#00ff88" : "transparent", border: "1px solid " + (added === product.id ? "#00ff88" : "#1a1a2e"), color: added === product.id ? "#0a0a0f" : "#9ca3af", fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 700, letterSpacing: 2, cursor: "pointer", borderRadius: 6, transition: "all 0.15s" }}>
                {added === product.id ? "✓ AJOUTÉ" : "+ AJOUTER"}
              </button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: "#374151", fontFamily: "'Courier New', monospace" }}><div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div><div>AUCUN RÉSULTAT</div></div>}
      </div>
      <footer style={{ borderTop: "1px solid #1a1a2e", padding: "24px 32px", background: "#07070d" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <GlitchText text="CARD_MARKET.EXE" style={{ color: "#374151", fontSize: 14 }} />
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#374151" }}>🔒 Stripe • Livraison assurée • © 2026</span>
        </div>
      </footer>
      {cartOpen && (<><div onClick={() => setCartOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 999 }} /><CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onQty={changeQty} onCheckout={handleCheckout} loading={loading} /></>)}
    </div>
  );
}
