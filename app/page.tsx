"use client";
import { useState, useEffect } from "react";

// ── COLORS ────────────────────────────────────────────────────
const C = {
  cw: "#FDFCFA", cr: "#F5F0E8", cb: "#070B18",
  gold: "#B8922A", goldL: "#E8C96A", goldBg: "rgba(184,146,42,.08)",
  red: "#B80000", ink: "#1A1A1A", mut: "#6B6A65", fnt: "#B0AFA8",
  bdr: "1px solid rgba(26,26,26,.1)",
  a1: "#1A5276", a2: "#1A7A4A", b1: "#7D3C98",
  b2: "#C0392B", c1: "#B7950B", c2: "#154360", ms: "#2C3E50",
};

// ── TYPES ─────────────────────────────────────────────────────
type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Muttersprache";
type Lesson = { num: number; level: Level; dur: number; title: string; sub: string };

// ── LEVEL META ────────────────────────────────────────────────
const LM: Record<Level, { color: string; count: string }> = {
  A1: { color: C.a1, count: "19" }, A2: { color: C.a2, count: "12" },
  B1: { color: C.b1, count: "12" }, B2: { color: C.b2, count: "10" },
  C1: { color: C.c1, count: "12" }, C2: { color: C.c2, count: "10" },
  Muttersprache: { color: C.ms, count: "7" },
};
const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2", "Muttersprache"];

// ── CURRICULUM ────────────────────────────────────────────────
const CUR: Lesson[] = [
  {num:0,level:"A1",dur:20,title:"Aussprache — Das Fundament",sub:"Jedes deutsche Wort korrekt aussprechen."},
  {num:1,level:"A1",dur:18,title:"Die ersten Worte",sub:"Überleben auf Deutsch. Dein Tag Eins."},
  {num:2,level:"A1",dur:20,title:"Wer bin ich?",sub:"SEIN — das fundamentalste Verb."},
  {num:3,level:"A1",dur:20,title:"Zahlen, Preise, Mengen",sub:"Die Mathematik der deutschen Sprache."},
  {num:4,level:"A1",dur:20,title:"HABEN — Besitz, Zustände, Verneinung",sub:"Das zweite Fundamentalverb."},
  {num:5,level:"A1",dur:22,title:"Der, Die, Das — Mit System",sub:"Das berühmteste Problem ist lösbar."},
  {num:6,level:"A1",dur:20,title:"Im Café — Bestellen wie ein Berliner",sub:"Dein erstes echtes Gespräch."},
  {num:7,level:"A1",dur:19,title:"Wo ist…? — Stadtorientierung",sub:"Fragen, verstehen, ankommen."},
  {num:8,level:"A1",dur:19,title:"Meine Familie",sub:"Verwandtschaftsbeziehungen."},
  {num:9,level:"A1",dur:20,title:"Wie spät ist es?",sub:"Zeit und Datum im Alltag."},
  {num:10,level:"A1",dur:21,title:"Modalverben — kann, muss, darf, will",sub:"Erlaubnis, Pflicht, Wunsch."},
  {num:11,level:"A1",dur:20,title:"Einkaufen — Akkusativ im Alltag",sub:"Kaufen, suchen, bezahlen."},
  {num:12,level:"A1",dur:18,title:"Das Wetter",sub:"Small Talk auf Deutsch beginnen."},
  {num:13,level:"A1",dur:20,title:"Körper und Gesundheit",sub:"Beim Arzt und im Alltag."},
  {num:14,level:"A1",dur:20,title:"Meine Wohnung",sub:"Zu Hause auf Deutsch."},
  {num:15,level:"A1",dur:19,title:"Hobbys und Freizeit",sub:"gern, lieber, am liebsten."},
  {num:16,level:"A1",dur:20,title:"Im Restaurant",sub:"Bestellen, bezahlen, genießen."},
  {num:17,level:"A1",dur:20,title:"Arbeit und Beruf",sub:"Trennbare Verben im Alltag."},
  {num:18,level:"A1",dur:25,title:"A1 — Das große Finale",sub:"Alles zusammen. A1 abgeschlossen!"},
  {num:19,level:"A2",dur:22,title:"Das Perfekt",sub:"Gestern, neulich, schon mal."},
  {num:20,level:"A2",dur:19,title:"Größer, schöner, am besten",sub:"Komparativ und Superlativ."},
  {num:21,level:"A2",dur:21,title:"weil, obwohl, dass — Nebensätze",sub:"Komplexe Sätze beginnen."},
  {num:22,level:"A2",dur:22,title:"Adjektivdeklination",sub:"ein alter Mann / der alte Mann."},
  {num:23,level:"A2",dur:20,title:"Dativ vertieft",sub:"mir, dir, ihm, ihr."},
  {num:24,level:"A2",dur:19,title:"Reflexive Verben",sub:"sich freuen, sich ärgern."},
  {num:25,level:"A2",dur:18,title:"Futur",sub:"Pläne, Prognosen, Versprechen."},
  {num:26,level:"A2",dur:19,title:"Präteritum",sub:"war, hatte, wollte."},
  {num:27,level:"A2",dur:20,title:"Konjunktiv II",sub:"wäre, hätte, würde."},
  {num:28,level:"A2",dur:19,title:"Konnektoren vertieft",sub:"als, während, deshalb."},
  {num:29,level:"A2",dur:20,title:"Formelles Schreiben",sub:"Briefe und E-Mails."},
  {num:30,level:"A2",dur:25,title:"A2-Finale",sub:"Du hast A2 abgeschlossen!"},
  {num:31,level:"B1",dur:22,title:"Relativsätze",sub:"Der Mann, der alles weiß."},
  {num:32,level:"B1",dur:22,title:"Das Passiv",sub:"wenn die Handlung wichtiger ist."},
  {num:33,level:"B1",dur:19,title:"Modalpartikeln",sub:"doch, mal, ja, halt."},
  {num:34,level:"B1",dur:20,title:"um zu, ohne zu, anstatt zu",sub:"Infinitivkonstruktionen."},
  {num:35,level:"B1",dur:22,title:"Argumentieren",sub:"Meinung vertreten."},
  {num:36,level:"B1",dur:20,title:"Genitiv",sub:"des Mannes, wegen des Wetters."},
  {num:37,level:"B1",dur:19,title:"Indirekte Rede",sub:"Konjunktiv I."},
  {num:38,level:"B1",dur:18,title:"Plusquamperfekt",sub:"was schon vorher war."},
  {num:39,level:"B1",dur:19,title:"Nominalisierung",sub:"das Denken, die Entscheidung."},
  {num:40,level:"B1",dur:20,title:"Konzessive und kausale Strukturen",sub:"Weil, obwohl, trotzdem."},
  {num:41,level:"B1",dur:19,title:"Sprachregister",sub:"formell, neutral, informell."},
  {num:42,level:"B1",dur:25,title:"B1-Finale",sub:"Ich denke auf Deutsch."},
  {num:43,level:"B2",dur:22,title:"Partizipialkonstruktionen",sub:"das gelöste Problem."},
  {num:44,level:"B2",dur:20,title:"Erweiterte Nominalisierung",sub:"akademischer Stil."},
  {num:45,level:"B2",dur:22,title:"Komplexe Satzgefüge",sub:"Verschachtelung meistern."},
  {num:46,level:"B2",dur:21,title:"Stilistik",sub:"Variation, Eleganz, Präzision."},
  {num:47,level:"B2",dur:22,title:"Wissenschaftliches Schreiben",sub:"Essay und Analyse."},
  {num:48,level:"B2",dur:20,title:"Rhetorische Mittel",sub:"Überzeugung auf Deutsch."},
  {num:49,level:"B2",dur:20,title:"Idiome und feste Wendungen",sub:"natürlich klingen."},
  {num:50,level:"B2",dur:21,title:"Medien und Gesellschaft",sub:"aktuelle Themen."},
  {num:51,level:"B2",dur:21,title:"Berufliche Kommunikation",sub:"Präsentieren, Verhandeln."},
  {num:52,level:"B2",dur:25,title:"B2-Finale",sub:"Ich argumentiere auf Muttersprachler-Niveau."},
  {num:53,level:"C1",dur:22,title:"Idiomatische Kompetenz",sub:"Humor, Ironie, Subtext."},
  {num:54,level:"C1",dur:22,title:"Sprachliche Kreativität",sub:"Wortspiele, Neologismen."},
  {num:55,level:"C1",dur:22,title:"Deutsche Literatur",sub:"Texte lesen, verstehen, erleben."},
  {num:56,level:"C1",dur:22,title:"Geschichte und Erinnerungskultur",sub:"Vergangenheit auf Deutsch."},
  {num:57,level:"C1",dur:20,title:"Regionale Vielfalt",sub:"Dialekte, Akzente, Kulturen."},
  {num:58,level:"C1",dur:21,title:"Philosophie auf Deutsch",sub:"Kant, Hegel, Nietzsche denken."},
  {num:59,level:"C1",dur:21,title:"Komplexe Argumentation",sub:"Nuancen, Subtext, implizite Logik."},
  {num:60,level:"C1",dur:20,title:"Emotionale Intelligenz auf Deutsch",sub:"Gefühle präzise ausdrücken."},
  {num:61,level:"C1",dur:19,title:"Interkulturelle Kompetenz vertieft",sub:"zwischen den Zeilen lesen."},
  {num:62,level:"C1",dur:21,title:"Spontaneität",sub:"Reagieren, Improvisieren, Witzeln."},
  {num:63,level:"C1",dur:20,title:"Meisterklasse Schreiben",sub:"literarische und essayistische Texte."},
  {num:64,level:"C1",dur:25,title:"C1-Finale",sub:"Ich bin Deutsch."},
  {num:65,level:"C2",dur:23,title:"Komplexe Textsorten meistern",sub:"alle Register, alle Stile."},
  {num:66,level:"C2",dur:22,title:"Sprachliche Nuancen",sub:"der feine Unterschied."},
  {num:67,level:"C2",dur:21,title:"Spontane Eloquenz",sub:"denken und sprechen zugleich."},
  {num:68,level:"C2",dur:22,title:"Texte dekonstruieren",sub:"Subtext, Ideologie, Macht."},
  {num:69,level:"C2",dur:21,title:"Akademische Exzellenz",sub:"Texte die überzeugen und bewegen."},
  {num:70,level:"C2",dur:20,title:"Kulturelle Tiefe",sub:"das unausgesprochene Deutschland."},
  {num:71,level:"C2",dur:19,title:"Humor als Meisterschaft",sub:"Witz, Ironie, Absurdismus."},
  {num:72,level:"C2",dur:19,title:"Sprachliche Flexibilität",sub:"zwischen allen Registern."},
  {num:73,level:"C2",dur:23,title:"Das geschriebene Meisterwerk",sub:"C2-Essay und Prosa."},
  {num:74,level:"C2",dur:25,title:"C2-Finale",sub:"Vollständige Meisterschaft."},
  {num:75,level:"Muttersprache",dur:23,title:"Sprachintuition",sub:"Grammatik fühlen statt denken."},
  {num:76,level:"Muttersprache",dur:23,title:"Die Seele des Deutschen",sub:"was Deutsch zu Deutsch macht."},
  {num:77,level:"Muttersprache",dur:22,title:"Schweigen auf Deutsch",sub:"was nicht gesagt wird."},
  {num:78,level:"Muttersprache",dur:22,title:"Träumen, Denken, Fühlen auf Deutsch",sub:"Innenleben auf Deutsch."},
  {num:79,level:"Muttersprache",dur:21,title:"Die Sprache der Kindheit",sub:"Lieder, Märchen, Erinnerungen."},
  {num:80,level:"Muttersprache",dur:22,title:"Deutsch als zweite Identität",sub:"wer du auf Deutsch bist."},
  {num:81,level:"Muttersprache",dur:25,title:"Das Ende und der Anfang",sub:"Es gibt kein Ende — nur mehr Deutsch."},
];

const METHODS = [
  {n:"01",t:"Comprehensible Input",d:"Authentische Dialoge auf deinem Niveau. Krashens i+1 — der Sweet Spot des Lernens.",tag:"Krashen"},
  {n:"02",t:"Noticing-Aufgaben",d:"Du entdeckst Regeln selbst. Was du bemerkst, behältst du.",tag:"Schmidt"},
  {n:"03",t:"Lexical Chunks",d:"Fertige Sprachbausteine statt Einzelvokabeln. Schnellste Route zur natürlichen Sprache.",tag:"Lewis"},
  {n:"04",t:"6 Aufgabentypen",d:"Scramble, Fill-in, Transformation, Fehlersuche, Produktion, KI-Quiz. Jedes Mal anders.",tag:"Penny Ur"},
  {n:"05",t:"Output-Training",d:"Live-Gespräch mit KI am Ende jeder Lektion. Sprechen lernt man durch Sprechen.",tag:"Swain"},
  {n:"06",t:"Spaced Repetition",d:"Heute · 3 Tage · 1 Woche · 2 Wochen · 1 Monat. Science-backed.",tag:"Ebbinghaus"},
];

const FAQS = [
  {q:"Brauche ich Vorkenntnisse?",a:"Absolut nicht. Lektion 0 beginnt mit der Aussprache — du lernst jeden deutschen Laut korrekt bevor du deinen ersten Satz sprichst."},
  {q:"Was bedeutet 'Muttersprache' als Level?",a:"Über C2 hinaus: Sprachintuition, Die Seele des Deutschen, Träumen auf Deutsch. Für Menschen die nicht nur sprechen, sondern denken möchten."},
  {q:"Wie unterscheidet sich Wundervoll von Duolingo?",a:"Duolingo optimiert für Streak-Unterhaltung. Wundervoll optimiert für echten Spracherwerb — freie Produktion, nicht nur Wiedererkennung. Jede Lektion basiert auf Krashen, Schmidt, Lewis und CEFR."},
  {q:"Gibt es eine App?",a:"Ja! iOS + Android im Pro-Plan inklusive. Dark Mode, optimiert für Mobile, native Audio."},
  {q:"Kann ich jederzeit kündigen?",a:"Ja, jederzeit. Zwei Klicks im Profil. Kein Abo-Trick. Dein Fortschritt bleibt gespeichert."},
];

// ── HELPERS ────────────────────────────────────────────────────
const fd = "'Cormorant Garamond', Georgia, serif";
const fu = "'Plus Jakarta Sans', system-ui, sans-serif";
const fm = "'DM Mono', 'Courier New', monospace";

function scrollTo(id: string) {
  if (typeof document !== "undefined")
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ── LOGO ──────────────────────────────────────────────────────
function Logo({ size = 21 }: { size?: number }) {
  return (
    <span style={{ fontFamily: fd, fontSize: size, fontWeight: 600, cursor: "pointer" }}>
      <span style={{ color: C.ink }}>WUNDER</span>
      <span style={{ color: C.red }}>VOL</span>
      <span style={{ color: C.gold }}>L</span>
    </span>
  );
}

// ── PAGE ──────────────────────────────────────────────────────
export default function Page() {
  const [level, setLevel] = useState<Level>("A1");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const lessons = CUR.filter((l) => l.level === level);

  return (
    <>
      {/* NAV */}
      <nav style={{
        height: 56, padding: "0 48px", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: C.bdr,
        background: "rgba(253,252,250,.97)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 200,
      }}>
        <Logo />
        <div className="nav-links" style={{ display: "flex", gap: 28 }}>
          {[["Methode","method"],["Curriculum","curriculum"],["Preise","pricing"]].map(([l,id]) => (
            <span key={id} className="nav-link" onClick={() => scrollTo(id)}
              style={{ fontSize: 12, color: C.mut, cursor: "pointer", fontWeight: 500, transition: "color .2s" }}>
              {l}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="https://wundervolldeutsch.com/auth">
            <button style={{ padding: "7px 18px", background: "transparent", border: C.bdr, color: C.ink, fontSize: 12, fontWeight: 600 }}>
              Einloggen
            </button>
          </a>
          <a href="https://wundervolldeutsch.com/auth">
            <button style={{ padding: "7px 18px", background: C.gold, border: "none", color: "#fff", fontSize: 12, fontWeight: 600 }}>
              Kostenlos starten
            </button>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ borderBottom: C.bdr }}>
        <div className="hero-wrap" style={{ maxWidth: 1140, margin: "0 auto", padding: "72px 48px 64px" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 370px", gap: 64, alignItems: "start" }}>
            {/* Left */}
            <div>
              <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 16 }}>
                {[C.ink, C.red, C.gold].map((c) => <div key={c} style={{ height: 4, width: 24, background: c }} />)}
                <span style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: C.mut, marginLeft: 6 }}>
                  German, made wonderful
                </span>
              </div>
              <h1 style={{ fontFamily: fd, fontSize: "clamp(58px, 8vw, 100px)", fontWeight: 300, lineHeight: .9, letterSpacing: "-.02em", marginTop: 12 }}>
                Deutsch<br />lernen,<br />wie es{" "}
                <em style={{ fontStyle: "italic", color: C.red }}>sein</em>{" "}
                soll<span style={{ color: C.gold }}>.</span>
              </h1>
              <p style={{ fontSize: 15, color: C.mut, lineHeight: 1.75, margin: "24px 0 34px", maxWidth: 440 }}>
                Kein Gamification-Quatsch. 82 vollständige Lektionen — A1 bis Muttersprache — nach neuester Spracherwerbsforschung.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <a href="https://wundervolldeutsch.com/auth">
                  <button className="cta-btn" style={{ padding: "12px 28px", background: C.gold, color: "#fff", fontSize: 13, fontWeight: 600, border: "none", transition: "all .2s" }}>
                    7 Tage kostenlos starten →
                  </button>
                </a>
                <button className="out-btn" onClick={() => scrollTo("method")}
                  style={{ padding: "12px 22px", background: "transparent", color: C.ink, fontSize: 13, border: C.bdr, transition: "all .2s" }}>
                  Wie es funktioniert
                </button>
              </div>
              <p style={{ fontSize: 11, color: C.fnt, marginTop: 10 }}>Keine Kreditkarte. Lektionen 0+1 für immer gratis.</p>
            </div>

            {/* Preview card */}
            <div className="preview-card">
              <div style={{ background: C.cr, border: C.bdr, padding: 28, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.ink} 33%, ${C.red} 33%, ${C.red} 66%, ${C.gold} 66%)` }} />
                <div style={{ fontFamily: fm, fontSize: 8, letterSpacing: ".2em", color: C.gold, textTransform: "uppercase", marginBottom: 10 }}>Lektion 1 · A1 · 18 Min</div>
                <div style={{ fontFamily: fd, fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Die ersten Worte</div>
                <div style={{ fontSize: 11, color: C.mut, fontStyle: "italic", marginBottom: 16 }}>Überleben auf Deutsch — dein Tag Eins.</div>
                {["Begrüßen formal + informell","Bitte · Danke · Entschuldigung","Das Eiserne Gesetz — Verb auf P2","Sie vs. du — sicher navigieren"].map((g) => (
                  <div key={g} style={{ display: "flex", gap: 7, padding: "7px 9px", background: C.cw, borderLeft: `2px solid ${C.gold}`, fontSize: 11, marginBottom: 1, alignItems: "flex-start" }}>
                    <span style={{ color: C.gold, flexShrink: 0, fontSize: 10, marginTop: 1 }}>✓</span>
                    <span>{g}</span>
                  </div>
                ))}
                <a href="https://wundervolldeutsch.com/auth">
                  <button style={{ width: "100%", padding: 11, background: C.ink, color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: ".04em", marginTop: 14, border: "none", transition: "background .2s" }}>
                    Jetzt testen →
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST BAR */}
      <div style={{ borderBottom: C.bdr }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "18px 48px", display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: fm, fontSize: 8, letterSpacing: ".2em", color: C.fnt, whiteSpace: "nowrap", textTransform: "uppercase" }}>Entwickelt nach</span>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {["Krashen","CEFR A1–C2","Nation","Schmidt","Penny Ur","Ellis","Lewis"].map((t) => (
              <span key={t} style={{ fontFamily: fm, fontSize: 8, color: C.fnt, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-g" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: C.bdr }}>
        {[{v:"82",l:"Lektionen A1\nbis Muttersprache"},{v:"328+",l:"Lernziele nach\nCEFR strukturiert"},{v:"6",l:"Lernschritte\npro Lektion"},{v:"A1→MS",l:"Einziger Kurs bis\nMuttersprachniveau"}].map(({v,l}) => (
          <div key={v} style={{ padding: "28px 36px", borderRight: C.bdr }}>
            <div style={{ fontFamily: fd, fontSize: v.length > 4 ? 32 : 44, fontWeight: 700, lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 11, color: C.mut, marginTop: 4, lineHeight: 1.4, whiteSpace: "pre-line" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* METHOD */}
      <div id="method" style={{ borderBottom: C.bdr }}>
        <section className="w-section" style={{ maxWidth: 1140, margin: "0 auto", padding: "72px 48px" }}>
          <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".26em", textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>Die Methode</div>
          <h2 style={{ fontFamily: fd, fontSize: "clamp(32px,4vw,50px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-.01em", marginBottom: 10 }}>
            Lernen, das auf <em style={{ fontStyle: "italic", color: C.red }}>Wissenschaft</em> basiert
          </h2>
          <p style={{ fontSize: 14, color: C.mut, maxWidth: 480, lineHeight: 1.75, marginBottom: 44 }}>
            Jede Lektion folgt einem 6-Schritt-System — von comprehensible input bis zur freien Produktion.
          </p>
          <div className="meth-g" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(26,26,26,.08)" }}>
            {METHODS.map((m) => (
              <div key={m.n} className="mi" style={{ background: C.cw, padding: "28px 24px", transition: "background .2s" }}>
                <div style={{ fontFamily: fd, fontSize: 52, fontWeight: 700, color: "rgba(26,26,26,.04)", lineHeight: 1, marginBottom: 10 }}>{m.n}</div>
                <div style={{ fontFamily: fd, fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{m.t}</div>
                <div style={{ fontSize: 12, color: C.mut, lineHeight: 1.65 }}>{m.d}</div>
                <div style={{ display: "inline-block", marginTop: 10, fontFamily: fm, fontSize: 8, letterSpacing: ".15em", textTransform: "uppercase", padding: "2px 8px", background: "#FBF5E6", color: C.gold, border: "1px solid rgba(184,146,42,.2)" }}>{m.tag}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CURRICULUM */}
      <div id="curriculum" style={{ borderBottom: C.bdr }}>
        <section className="w-section" style={{ maxWidth: 1140, margin: "0 auto", padding: "72px 48px 0" }}>
          <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".26em", textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>Curriculum</div>
          <h2 style={{ fontFamily: fd, fontSize: "clamp(32px,4vw,50px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-.01em", marginBottom: 10 }}>
            A1 → Muttersprache —<br />das vollständige <em style={{ fontStyle: "italic", color: C.red }}>Meisterwerk</em>
          </h2>
          <p style={{ fontSize: 14, color: C.mut, maxWidth: 480, lineHeight: 1.75, marginBottom: 32 }}>
            82 Lektionen. Der einzige Kurs, der nicht bei B2 aufhört.
          </p>
        </section>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 48px 72px" }}>
          {/* Level tabs */}
          <div className="lvl-tabs" style={{ display: "flex", gap: 1, background: "rgba(26,26,26,.08)", marginBottom: 1 }}>
            {LEVELS.map((lv) => (
              <button key={lv} onClick={() => setLevel(lv)}
                style={{
                  flex: 1, minWidth: 60, padding: "11px 6px", textAlign: "center",
                  background: level === lv ? C.ink : C.cw,
                  color: level === lv ? "#fff" : C.mut,
                  fontFamily: fm, fontSize: 8, letterSpacing: ".14em", textTransform: "uppercase",
                  border: "none", cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap",
                }}>
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: level === lv ? "#fff" : LM[lv].color, marginRight: 5, verticalAlign: "middle" }} />
                {lv === "Muttersprache" ? "MS" : lv} · {LM[lv].count}
              </button>
            ))}
          </div>
          {/* Lesson grid */}
          <div className="les-g" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1, background: "rgba(26,26,26,.08)", border: "1px solid rgba(26,26,26,.08)" }}>
            {mounted && lessons.map((l) => (
              <div key={l.num} className={`lcard ${l.num > 1 ? "lcard-locked" : ""}`}
                style={{ background: C.cw, padding: "20px 24px", cursor: l.num <= 1 ? "pointer" : "default", transition: "background .2s", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, position: "relative" }}>
                {l.num === 0 && <div style={{ position: "absolute", top: 12, right: 12, width: 16, height: 16, borderRadius: "50%", background: C.gold, display: "grid", placeItems: "center", fontSize: 8, color: "#fff", fontWeight: 700 }}>✓</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 7 }}>
                    <span style={{ fontFamily: fm, fontSize: 7, letterSpacing: ".14em", padding: "2px 6px", border: `1px solid ${LM[l.level]?.color || C.ink}30`, color: LM[l.level]?.color || C.ink, textTransform: "uppercase" }}>{l.level === "Muttersprache" ? "MS" : l.level}</span>
                    <span style={{ fontFamily: fm, fontSize: 7, color: C.fnt }}>{l.dur} Min</span>
                    {l.num <= 1 && <span style={{ fontFamily: fm, fontSize: 7, color: C.gold, fontWeight: 700 }}>Kostenlos</span>}
                  </div>
                  <div style={{ fontFamily: fd, fontSize: 17, fontWeight: 600, lineHeight: 1.15, marginBottom: 3, color: l.num > 1 ? C.fnt : C.ink }}>{l.title}</div>
                  <div style={{ fontSize: 10, color: C.mut, fontStyle: "italic", lineHeight: 1.4 }}>{l.sub.substring(0, 65)}{l.sub.length > 65 ? "…" : ""}</div>
                </div>
                <div style={{ fontFamily: fd, fontSize: 40, fontWeight: 700, color: "rgba(26,26,26,.04)", lineHeight: 1, flexShrink: 0 }}>{String(l.num).padStart(2, "0")}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <a href="https://wundervolldeutsch.com/auth">
              <button style={{ padding: "11px 28px", background: C.ink, color: "#fff", fontSize: 12, fontWeight: 600, border: "none" }}>
                Alle Lektionen freischalten →
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{ background: C.cr, padding: "72px 48px", borderTop: C.bdr, borderBottom: C.bdr }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".26em", textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>Preise</div>
          <h2 style={{ fontFamily: fd, fontSize: "clamp(32px,4vw,50px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-.01em", marginBottom: 10 }}>
            Einfach. <em style={{ fontStyle: "italic", color: C.red }}>Transparent.</em> Fair.
          </h2>
          <p style={{ fontSize: 14, color: C.mut, maxWidth: 480, lineHeight: 1.75, marginBottom: 44 }}>Starte kostenlos. Keine Tricks.</p>
          <div className="price-g" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(26,26,26,.08)", border: "1px solid rgba(26,26,26,.08)" }}>
            {[
              { name:"Gratis", sub:"Für Neugierige", price:"€0", period:"für immer", featured:false,
                features:[["✓","Lektionen 0+1 vollständig"],["✓","Alle 6 Lernschritte"],["—","KI-Gespräche & Audio"],["—","A2–Muttersprache"]],
                cta:"Gratis starten", bg:"transparent", fg:C.ink, border:C.bdr },
              { name:"Pro", sub:"Für ernsthafte Lerner", price:"€12", period:"pro Monat · jederzeit kündbar", featured:true,
                features:[["✓","A1–B2 (53 Lektionen)"],["✓","KI-Gespräche & Audio"],["✓","iOS + Android App"],["✓","Goethe-Vorbereitung"]],
                cta:"Pro starten →", bg:C.gold, fg:"#fff", border:"none", popular:true },
              { name:"Vollständig", sub:"A1 bis Muttersprache", price:"€29", period:"alle 82 Lektionen", featured:false,
                features:[["✓","Alle 82 Lektionen"],["✓","C1, C2, Muttersprache"],["✓","Persönlicher Lernplan"],["✓","Offline-Modus"]],
                cta:"Vollständig starten", bg:C.ink, fg:"#fff", border:"none" },
            ].map((p) => (
              <div key={p.name} style={{ background: C.cw, padding: "28px 24px", position: "relative", borderLeft: p.name === "Vollständig" ? `2px solid ${C.gold}` : undefined }}>
                {p.popular && <div style={{ display: "block", textAlign: "center", padding: 4, background: C.gold, fontFamily: fm, fontSize: 7, letterSpacing: ".2em", textTransform: "uppercase", color: "#fff", margin: "-28px -24px 20px" }}>Beliebteste Wahl</div>}
                <div style={{ fontFamily: fd, fontSize: 20, fontWeight: 600, marginBottom: 3, color: p.name === "Vollständig" ? C.gold : C.ink }}>{p.name}</div>
                <div style={{ fontSize: 10, color: C.mut, marginBottom: 16 }}>{p.sub}</div>
                <div style={{ fontFamily: fd, fontSize: 42, fontWeight: 700, lineHeight: 1, marginBottom: 2 }}>{p.price}</div>
                <div style={{ fontSize: 10, color: C.mut, marginBottom: 16 }}>{p.period}</div>
                <div style={{ marginBottom: 24 }}>
                  {p.features.map(([ok, txt]) => (
                    <div key={txt} style={{ display: "flex", gap: 6, padding: "7px 0", borderBottom: "1px solid rgba(26,26,26,.07)", fontSize: 11, alignItems: "flex-start" }}>
                      <span style={{ color: ok === "✓" ? C.gold : C.fnt, flexShrink: 0, fontSize: 9, marginTop: 2 }}>{ok}</span>
                      <span style={{ color: ok === "—" ? C.fnt : C.ink }}>{txt}</span>
                    </div>
                  ))}
                </div>
                <a href="https://wundervolldeutsch.com/auth">
                  <button style={{ width: "100%", padding: 10, fontSize: 11, fontWeight: 600, border: p.border, background: p.bg, color: p.fg, cursor: "pointer" }}>
                    {p.cta}
                  </button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ borderBottom: C.bdr }}>
        <section className="w-section" style={{ maxWidth: 1140, margin: "0 auto", padding: "72px 48px" }}>
          <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".26em", textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>Was Lerner sagen</div>
          <h2 style={{ fontFamily: fd, fontSize: "clamp(32px,4vw,50px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-.01em", marginBottom: 44 }}>
            Deutsch <em style={{ fontStyle: "italic", color: C.red }}>endlich</em> verstanden
          </h2>
          <div className="testi-g" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {[
              {q:"Ich habe drei Apps probiert. Wundervoll ist das erste Mal, dass ich wirklich lerne — nicht nur Punkte sammle.",av:"SM",name:"Sarah M.",nat:"London · 3 Monate"},
              {q:"Der Dialog-Ansatz hat alles verändert. B1 in sechs Monaten — das hätte ich nie gedacht.",av:"JP",name:"James P.",nat:"New York · Goethe B1"},
              {q:"Die Wissenschaft dahinter macht den Unterschied. Das beste Curriculum das ich je gesehen habe.",av:"AK",name:"Anna K.",nat:"Sydney · Linguistikstud."},
            ].map((t) => (
              <div key={t.av} className="tcard" style={{ background: C.cr, border: C.bdr, padding: 22, position: "relative" }}>
                <div style={{ color: C.gold, fontSize: 9, letterSpacing: 1, marginBottom: 9 }}>★★★★★</div>
                <div style={{ fontFamily: fd, fontSize: 14, fontStyle: "italic", lineHeight: 1.6, marginBottom: 16 }}>{t.q}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, borderTop: C.bdr, paddingTop: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: fm }}>{t.av}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: C.mut }}>{t.nat}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FAQ */}
      <div style={{ borderBottom: C.bdr }}>
        <section className="w-section" style={{ maxWidth: 1140, margin: "0 auto", padding: "72px 48px" }}>
          <div style={{ fontFamily: fm, fontSize: 9, letterSpacing: ".26em", textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontFamily: fd, fontSize: "clamp(32px,4vw,50px)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-.01em", marginBottom: 44 }}>
            Häufige <em style={{ fontStyle: "italic", color: C.red }}>Fragen</em>
          </h2>
          <div style={{ borderTop: C.bdr }}>
            {FAQS.map((f, i) => (
              <div key={i} className={openFaq === i ? "faq-open" : ""} style={{ borderBottom: C.bdr }}>
                <div onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: 13, fontWeight: 500, gap: 14, userSelect: "none" }}>
                  <span>{f.q}</span>
                  <span className="faq-ic" style={{ width: 17, height: 17, border: "1px solid rgba(26,26,26,.16)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: C.mut, flexShrink: 0, lineHeight: 1 }}>+</span>
                </div>
                <div className="faq-answer" style={{ fontSize: 12, color: C.mut, lineHeight: 1.75 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FINAL CTA */}
      <div style={{ background: C.cb, padding: "72px 48px", textAlign: "center", color: "#F0EDE6" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 28 }}>
          {["rgba(240,237,230,.4)", C.red, C.gold].map((c) => <div key={c} style={{ width: 38, height: 4, background: c }} />)}
        </div>
        <h2 style={{ fontFamily: fd, fontSize: "clamp(38px,5.5vw,72px)", fontWeight: 300, lineHeight: .95, letterSpacing: "-.01em", marginBottom: 16 }}>
          Deutsch,<br />made <em style={{ fontStyle: "italic", color: C.red }}>wonder</em><span style={{ color: C.gold }}>voll.</span>
        </h2>
        <p style={{ fontSize: 13, color: "rgba(240,237,230,.4)", marginBottom: 32 }}>82 Lektionen. Von A1 bis Muttersprache.</p>
        <a href="https://wundervolldeutsch.com/auth">
          <button className="cta-btn" style={{ padding: "13px 44px", background: C.gold, color: "#fff", fontSize: 14, fontWeight: 600, border: "none", transition: "all .2s" }}>
            Jetzt kostenlos starten →
          </button>
        </a>
      </div>

      {/* FOOTER */}
      <footer style={{ padding: "36px 48px", borderTop: C.bdr, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <Logo size={18} />
        <div className="footer-g" style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {["Impressum","Datenschutz","AGB","Kontakt"].map((l) => (
            <span key={l} style={{ fontSize: 10, color: C.mut, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <div style={{ fontFamily: fm, fontSize: 8, color: C.fnt, letterSpacing: ".1em" }}>© 2025 WUNDERVOLL · wundervolldeutsch.com</div>
      </footer>
    </>
  );
}
