"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";

const fd = "'Cormorant Garamond', Georgia, serif";
const fu = "'Plus Jakarta Sans', system-ui, sans-serif";
const fm = "'DM Mono', 'Courier New', monospace";
const C = {
  cw:"#FDFCFA", cr:"#F5F0E8", cs:"#EDE8DF",
  gold:"#9A7520", goldL:"#B8922A", goldBg:"rgba(154,117,32,.08)", goldBdr:"rgba(154,117,32,.25)",
  red:"#9B0000",
  ink:"#111111", inkM:"#3D3A35", mut:"#5A5850", fnt:"#8A8578",
  bdr:"1px solid rgba(26,26,26,.12)",
  a1:"#1A5276",a2:"#1A7A4A",b1:"#7D3C98",b2:"#C0392B",c1:"#9A7520",c2:"#154360",ms:"#2C3E50",
};

type Screen = "dashboard"|"library"|"lesson"|"profile";
type Level  = "A1"|"A2"|"B1"|"B2"|"C1"|"C2"|"Muttersprache";
type Lesson = {num:number;level:Level;dur:number;title:string;sub:string;goals:string[];kult?:string};

const LC:Record<Level,string> = {A1:C.a1,A2:C.a2,B1:C.b1,B2:C.b2,C1:C.c1,C2:C.c2,Muttersprache:C.ms};
const LEVELS:Level[] = ["A1","A2","B1","B2","C1","C2","Muttersprache"];
const LCT:Record<Level,number> = {A1:19,A2:12,B1:12,B2:10,C1:12,C2:10,Muttersprache:7};
const LXP = [0,200,500,1000,2000,3500,5000];
const LNM = ["Anfänger","Einsteiger","Lernender","Fortgeschrittener","Experte","Meister","Muttersprachler"];
const UNL = new Set([0,1]);

const JOURNEY=[
  {level:"A1",city:"Berlin",      desc:"Du bist angekommen.",           xp:0},
  {level:"A2",city:"Hamburg",     desc:"Du findest dich zurecht.",       xp:200},
  {level:"B1",city:"München",     desc:"Du verstehst die Deutschen.",    xp:500},
  {level:"B2",city:"Wien",        desc:"Du diskutierst auf Augenhöhe.",  xp:1000},
  {level:"C1",city:"Zürich",      desc:"Du liest Kafka.",                xp:2000},
  {level:"C2",city:"Frankfurt",   desc:"Du denkst auf Deutsch.",         xp:3500},
  {level:"Muttersprache",city:"Meisterschaft",desc:"Die Sprache gehört dir.",xp:5000},
];

const HOOKS=[
  "Fernweh — die Sehnsucht nach der Ferne. Kein englisches Wort existiert dafür.",
  "Goethe schrieb Faust in der Sprache die du heute lernst.",
  "Weltschmerz. Der Schmerz darüber wie die Welt ist. Nur auf Deutsch.",
  "Fingerspitzengefühl — das Feingefühl. Deutsch trifft immer genau.",
  "Gemütlichkeit existiert nicht auf Englisch. Auf Deutsch ist es ein Lebensgefühl.",
  "Torschlusspanik — die Panik dass die Tore sich schließen.",
  "Augenblick — der Blick eines Auges. Der flüchtigste Moment.",
  "Kafka schrieb über Entfremdung. Das geht nur auf Deutsch.",
];

const CUR:Lesson[] = [
  {num:0,level:"A1",dur:20,title:"Aussprache — Das Fundament",sub:"Lerne in 20 Minuten jedes deutsche Wort korrekt auszusprechen.",goals:["Jeden deutschen Buchstaben korrekt aussprechen","Die 5 kritischsten Unterschiede zum Englischen kennen","Umlaute (ä, ö, ü) und ß produzieren","Jedes neue Wort phonetisch korrekt lesen"],kult:"Deutsch in der Welt"},
  {num:1,level:"A1",dur:18,title:"Die ersten Worte",sub:"Überleben auf Deutsch. Höflichkeit, Grüße, die allerersten Sätze.",goals:["Auf Deutsch begrüßen und verabschieden (formal und informell)","Bitte, Danke, Entschuldigung sicher und natürlich verwenden","Nach dem Weg fragen und verstehen: geradeaus, links, rechts","Das formale Sie vom informellen du unterscheiden"],kult:"Siezen und Duzen"},
  {num:2,level:"A1",dur:20,title:"Wer bin ich?",sub:"SEIN — das fundamentalste Verb.",goals:["SEIN in allen 6 Formen fehlerfrei konjugieren","Sich auf Deutsch vorstellen (Name, Herkunft, Beruf)","Ja/Nein-Fragen durch Inversion bilden","Berufe OHNE Artikel nennen"]},
  {num:3,level:"A1",dur:20,title:"Zahlen, Preise, Mengen",sub:"Die Mathematik der deutschen Sprache.",goals:["Zahlen 1–100 sicher aussprechen","Preise im Alltag nennen","Mengenangaben auf dem Markt","Einerstelle zuerst bei 21–99"]},
  {num:4,level:"A1",dur:20,title:"HABEN — Besitz, Zustände, Verneinung",sub:"Das zweite Fundamentalverb.",goals:["HABEN in allen 6 Formen konjugieren","Körperliche Zustände ausdrücken","Verneinung mit kein/keine/keinen","HABEN vs. SEIN bei Zuständen"]},
  {num:5,level:"A1",dur:22,title:"Der, Die, Das — Mit System",sub:"Das berühmteste Problem ist lösbar.",goals:["Artikel der/die/das korrekt verwenden","Endungsregeln anwenden (-ung → die)","Plural immer mit die","Artikel als Teil des Nomens lernen"]},
  {num:6,level:"A1",dur:20,title:"Im Café — Bestellen wie ein Berliner",sub:"Dein erstes echtes Gespräch.",goals:["Höflich bestellen mit möchte","Nach dem Preis fragen","möchte vs. will","Akkusativ: ein → einen"]},
  {num:7,level:"A1",dur:19,title:"Wo ist…? — Stadtorientierung",sub:"Fragen, verstehen, ankommen.",goals:["Nach dem Weg fragen","Wegbeschreibungen verstehen","Präpositionen des Ortes","Sie-Imperativ für Wegbeschreibungen"]},
  {num:8,level:"A1",dur:19,title:"Meine Familie",sub:"Verwandtschaftsbeziehungen.",goals:["Familienmitglieder benennen","Possessivartikel mein/dein/sein/ihr","Über Familie sprechen","Typische Familienthemen"]},
  {num:9,level:"A1",dur:20,title:"Wie spät ist es?",sub:"Zeit und Datum im Alltag.",goals:["Uhrzeit nennen (formal und informell)","Wochentage und Monate","Datum nennen: der 3. Oktober","Präpositionen: um, am, im"]},
  {num:10,level:"A1",dur:21,title:"Modalverben — kann, muss, darf, will",sub:"Erlaubnis, Pflicht, Wunsch.",goals:["Die 4 wichtigsten Modalverben konjugieren","können/müssen/dürfen/wollen","Infinitiv ans Satzende","nicht dürfen vs. nicht müssen"]},
  {num:11,level:"A1",dur:20,title:"Einkaufen — Akkusativ im Alltag",sub:"Kaufen, suchen, bezahlen.",goals:["Akkusativ bei Artikeln","Einkaufsgespräche führen","Kleidung und Farben","Nach Größe und Preis fragen"]},
  {num:12,level:"A1",dur:18,title:"Das Wetter",sub:"Small Talk auf Deutsch beginnen.",goals:["Wetter beschreiben","Jahreszeiten","Wettervorhersage","Small Talk beginnen"]},
  {num:13,level:"A1",dur:20,title:"Körper und Gesundheit",sub:"Beim Arzt und im Alltag.",goals:["Körperteile benennen","Schmerzen ausdrücken","Beim Arzt","Dativ bei Körperteilen"]},
  {num:14,level:"A1",dur:20,title:"Meine Wohnung",sub:"Zu Hause auf Deutsch.",goals:["Räume benennen","Möbel und Position","Lokale Präpositionen","Über Wohnwünsche sprechen"]},
  {num:15,level:"A1",dur:19,title:"Hobbys und Freizeit",sub:"gern, lieber, am liebsten.",goals:["Hobbys nennen","gern/lieber/am liebsten","gehen + Infinitiv","Wochenendpläne"]},
  {num:16,level:"A1",dur:20,title:"Im Restaurant",sub:"Bestellen, bezahlen, genießen.",goals:["Bestellung aufgeben","Nach Empfehlungen fragen","Getränke und Gerichte","Zusammen oder getrennt?"]},
  {num:17,level:"A1",dur:20,title:"Arbeit und Beruf",sub:"Trennbare Verben im Alltag.",goals:["Trennbare Verben verwenden","Berufsalltag beschreiben","Tagesablauf","anfangen, aufhören, anrufen"]},
  {num:18,level:"A1",dur:25,title:"A1 — Das große Finale",sub:"Alles zusammen — A1 abgeschlossen!",goals:["Alle A1-Strukturen anwenden","Einen Dialog führen","Kurze Nachricht schreiben","Selbsteinschätzung"]},
  {num:19,level:"A2",dur:22,title:"Das Perfekt",sub:"Gestern, neulich, schon mal.",goals:["Perfekt mit haben und sein","Regelmäßige und unregelmäßige Partizipien","Vergangenheit im Gespräch","Signalwörter: schon, noch nie"]},
  {num:20,level:"A2",dur:19,title:"Größer, schöner, am besten",sub:"Komparativ und Superlativ.",goals:["Komparativ: schneller, schöner","Superlativ: am schnellsten","Unregelmäßige Formen: gut → besser","Vergleiche mit als und wie"]},
  {num:21,level:"A2",dur:21,title:"weil, obwohl, dass — Nebensätze",sub:"Komplexe Sätze beginnen.",goals:["Nebensätze bilden","Verb ans Ende","Hauptsatz + Nebensatz","Meinungen begründen"]},
  {num:22,level:"A2",dur:22,title:"Adjektivdeklination",sub:"ein alter Mann / der alte Mann.",goals:["Nach bestimmtem Artikel","Nach unbestimmtem Artikel","Prädikativ vs. attributiv","Endungen systematisch"]},
  {num:23,level:"A2",dur:20,title:"Dativ vertieft",sub:"mir, dir, ihm, ihr.",goals:["Dativobjekte verwenden","Dativpräpositionen","Wechselpräpositionen","Dativ in der Umgangssprache"]},
  {num:24,level:"A2",dur:19,title:"Reflexive Verben",sub:"sich freuen, sich ärgern.",goals:["Reflexivverben Akk. und Dat.","sich freuen auf vs. über","Emotionen ausdrücken","Im Perfekt"]},
  {num:25,level:"A2",dur:18,title:"Futur",sub:"Pläne, Prognosen, Versprechen.",goals:["Futur I: werden + Infinitiv","Präsens als Zukunft","Absichten mit wollen","Prognosen formulieren"]},
  {num:26,level:"A2",dur:19,title:"Präteritum",sub:"war, hatte, wollte.",goals:["Präteritum von sein/haben","Modalverben im Präteritum","Präteritum vs. Perfekt","Schriftlich erzählen"]},
  {num:27,level:"A2",dur:20,title:"Konjunktiv II",sub:"wäre, hätte, würde.",goals:["würde + Infinitiv","wäre und hätte","Höfliche Bitten","Irreale Bedingungen"]},
  {num:28,level:"A2",dur:19,title:"Konnektoren vertieft",sub:"als, während, deshalb.",goals:["Temporale Konnektoren","Kausale Konnektoren","Konzessive Konnektoren","Texte formulieren"]},
  {num:29,level:"A2",dur:20,title:"Formelles Schreiben",sub:"Briefe und E-Mails.",goals:["E-Mails strukturieren","Anrede und Grußformeln","Bewerbungen","Formell vs. informell"]},
  {num:30,level:"A2",dur:25,title:"A2-Finale",sub:"Du hast A2 abgeschlossen!",goals:["Alle A2-Strukturen","Längeres Gespräch","Formelle E-Mail","Reflexion"]},
  {num:31,level:"B1",dur:22,title:"Relativsätze",sub:"Der Mann, der alles weiß.",goals:["Relativsätze mit der/die/das","Relativpronomen im Akkusativ","Mit Präpositionen","Textverknüpfung"]},
  {num:32,level:"B1",dur:22,title:"Das Passiv",sub:"wenn die Handlung wichtiger ist.",goals:["Vorgangspassiv Präsens + Präteritum","Passiv Perfekt","Passiv mit Modalverben","Passiv vs. Aktiv"]},
  {num:33,level:"B1",dur:19,title:"Modalpartikeln",sub:"doch, mal, ja, halt.",goals:["doch, mal, ja, halt, eigentlich","Ton und Subtext","In Sprechakten","In authentischen Dialogen"]},
  {num:34,level:"B1",dur:20,title:"um zu, ohne zu, anstatt zu",sub:"Infinitivkonstruktionen.",goals:["um zu für Zweck","ohne zu","anstatt zu","vs. Nebensätze"]},
  {num:35,level:"B1",dur:22,title:"Argumentieren",sub:"Eine Meinung vertreten.",goals:["Meinung begründen","Gegenargumente","Diskursmarker","Schriftlich argumentieren"]},
  {num:36,level:"B1",dur:20,title:"Genitiv",sub:"des Mannes, wegen des Wetters.",goals:["Genitiv Possessivität","Genitivpräpositionen","Formelle Sprache","Genitiv vs. von"]},
  {num:37,level:"B1",dur:19,title:"Indirekte Rede",sub:"Konjunktiv I.",goals:["Konjunktiv I bilden","In Berichten","In der Presse","Direkt vs. indirekt"]},
  {num:38,level:"B1",dur:18,title:"Plusquamperfekt",sub:"was schon vorher war.",goals:["hatte/war + Partizip","Zeitliche Abfolge","In Erzähltexten","Mit als und nachdem"]},
  {num:39,level:"B1",dur:19,title:"Nominalisierung",sub:"das Denken, die Entscheidung.",goals:["Nominalisierung von Verben","das + Infinitiv","In Fachtexten","Nominalstil"]},
  {num:40,level:"B1",dur:20,title:"Konzessive und kausale Strukturen",sub:"Weil, obwohl, trotzdem.",goals:["Konzessivkonstruktionen","Kausalkonstruktionen","da vs. weil","Satzverknüpfung"]},
  {num:41,level:"B1",dur:19,title:"Sprachregister",sub:"formell, neutral, informell.",goals:["Drei Register erkennen","Registeranpassung","Vokabular nach Register","Code-Switching"]},
  {num:42,level:"B1",dur:25,title:"B1-Finale",sub:"Ich denke auf Deutsch.",goals:["Freies Gespräch","Essay 200 Wörter","Alle B1-Strukturen","Nächste Schritte"]},
  {num:43,level:"B2",dur:22,title:"Partizipialkonstruktionen",sub:"das gelöste Problem.",goals:["Partizip I und II als Attribut","Konstruktionen lesen","In Fachtexten","Umwandlung in Relativsätze"]},
  {num:44,level:"B2",dur:20,title:"Erweiterte Nominalisierung",sub:"akademischer Stil.",goals:["Nominalisierungsketten","Verbale Ausdrücke","Nominalstil Wissenschaft","Im eigenen Schreiben"]},
  {num:45,level:"B2",dur:22,title:"Komplexe Satzgefüge",sub:"Verschachtelung meistern.",goals:["Mehrfache Nebensätze","Selbst produzieren","Entschlüsseln","Klarheit vs. Komplexität"]},
  {num:46,level:"B2",dur:21,title:"Stilistik",sub:"Variation, Eleganz, Präzision.",goals:["Stilistische Mittel","Wiederholungen vermeiden","Satzrhythmus","Präzise Wortwahl"]},
  {num:47,level:"B2",dur:22,title:"Wissenschaftliches Schreiben",sub:"Essay und Analyse.",goals:["Essay-Struktur","These, Argument, Beleg","Akademisches Vokabular","Eigene Position"]},
  {num:48,level:"B2",dur:20,title:"Rhetorische Mittel",sub:"Überzeugung auf Deutsch.",goals:["Metaphern und Analogien","Rhetorische Fragen","Überzeugungsstrategien","Argumentative Wirkung"]},
  {num:49,level:"B2",dur:20,title:"Idiome und feste Wendungen",sub:"natürlich klingen.",goals:["50 Idiome verstehen","Im Kontext einsetzen","Herkunft verstehen","In Medien erkennen"]},
  {num:50,level:"B2",dur:21,title:"Medien und Gesellschaft",sub:"aktuelle Themen.",goals:["Zeitungsartikel lesen","Mediale Sprache","Position beziehen","Nuanciert auf B2"]},
  {num:51,level:"B2",dur:21,title:"Berufliche Kommunikation",sub:"Präsentieren, Verhandeln.",goals:["Präsentationen halten","Verhandlungsstrategien","Meetings moderieren","Berichte und Protokolle"]},
  {num:52,level:"B2",dur:25,title:"B2-Finale",sub:"Ich argumentiere auf Muttersprachler-Niveau.",goals:["Freies Gespräch","Essay 400 Wörter","B2-Kompetenzen","C1 und darüber"]},
  {num:53,level:"C1",dur:22,title:"Idiomatische Kompetenz",sub:"Humor, Ironie, Subtext.",goals:["Idiome auf C1","Ironie verstehen","Humor einsetzen","Implizite Bedeutungen"]},
  {num:54,level:"C1",dur:22,title:"Sprachliche Kreativität",sub:"Wortspiele, Neologismen.",goals:["Wortspiele","Neologismen","Kreative Sprache","Wortneuschöpfungen"]},
  {num:55,level:"C1",dur:22,title:"Deutsche Literatur",sub:"Texte lesen, verstehen, erleben.",goals:["Literarische Texte analysieren","Stilistische Mittel","Historischen Kontext","Literarische Analyse"]},
  {num:56,level:"C1",dur:22,title:"Geschichte und Erinnerungskultur",sub:"Vergangenheit auf Deutsch.",goals:["Historische Ereignisse","Erinnerungskultur","Zeitgeschichte auf C1","Narrative analysieren"]},
  {num:57,level:"C1",dur:20,title:"Regionale Vielfalt",sub:"Dialekte, Akzente, Kulturen.",goals:["Dialekte einordnen","Regionale Unterschiede","DACH-Varianten","Österreichisch und Schweizerdeutsch"]},
  {num:58,level:"C1",dur:21,title:"Philosophie auf Deutsch",sub:"Kant, Hegel, Nietzsche.",goals:["Philosophische Texte","Denken auf Deutsch","Philosophisches Vokabular","Abstrakt argumentieren"]},
  {num:59,level:"C1",dur:21,title:"Komplexe Argumentation",sub:"Nuancen, Subtext, implizite Logik.",goals:["Implizite Argumente","Nuancierte Position","Subtext lesen","Höchstes Niveau"]},
  {num:60,level:"C1",dur:20,title:"Emotionale Intelligenz auf Deutsch",sub:"Gefühle präzise ausdrücken.",goals:["Emotionen nuanciert","Empathie in Sprache","Psychologisches Vokabular","Gefühle anderer erfassen"]},
  {num:61,level:"C1",dur:19,title:"Interkulturelle Kompetenz vertieft",sub:"zwischen den Zeilen lesen.",goals:["Kulturelle Codes","Interkulturelle Missverständnisse","Deutsch im Kontext","Kulturelle Intelligenz"]},
  {num:62,level:"C1",dur:21,title:"Spontaneität",sub:"Reagieren, Improvisieren, Witzeln.",goals:["Spontan reagieren","Improvisation","Witze einsetzen","Schlagfertigkeit"]},
  {num:63,level:"C1",dur:20,title:"Meisterklasse Schreiben",sub:"literarische und essayistische Texte.",goals:["Literarische Texte verfassen","Essayistische Schreibweise","Eigene Stimme","Stilistische Exzellenz"]},
  {num:64,level:"C1",dur:25,title:"C1-Finale",sub:"Ich bin Deutsch.",goals:["Freies Gespräch","Literarischer Essay","Alle C1-Strukturen","Wer bist du auf Deutsch?"]},
  {num:65,level:"C2",dur:23,title:"Komplexe Textsorten meistern",sub:"alle Register, alle Stile.",goals:["Alle Textsorten","Register meistern","Texte dekonstruieren","Eigene Texte auf C2"]},
  {num:66,level:"C2",dur:22,title:"Sprachliche Nuancen",sub:"der feine Unterschied.",goals:["Semantische Feinheiten","Synonyme und Konnotationen","Bedeutungsverschiebung","Authentische Texte"]},
  {num:67,level:"C2",dur:21,title:"Spontane Eloquenz",sub:"denken und sprechen zugleich.",goals:["Sofort eloquent reagieren","Echtzeit strukturieren","Rhetorische Perfektion","Spontan auf höchstem Niveau"]},
  {num:68,level:"C2",dur:22,title:"Texte dekonstruieren",sub:"Subtext, Ideologie, Macht.",goals:["Texte kritisch analysieren","Subtext","Sprachliche Macht","Diskursanalyse"]},
  {num:69,level:"C2",dur:21,title:"Akademische Exzellenz",sub:"Texte die überzeugen.",goals:["Akademische Perfektion","Exzellente Argumentation","Wissenschaftliche Originalität","Texte die Maßstäbe setzen"]},
  {num:70,level:"C2",dur:20,title:"Kulturelle Tiefe",sub:"das unausgesprochene Deutschland.",goals:["Das Unausgesprochene","Tiefenstrukturen","Deutschland beyond","Mentale Modelle"]},
  {num:71,level:"C2",dur:19,title:"Humor als Meisterschaft",sub:"Witz, Ironie, Absurdismus.",goals:["Deutschen Humor","Ironie und Sarkasmus","Absurdismus","Selbst witzig sein"]},
  {num:72,level:"C2",dur:19,title:"Sprachliche Flexibilität",sub:"zwischen allen Registern.",goals:["Alle Register wechseln","Stilistische Anpassung","Kontext synchronisieren","Sprachliche Agilität"]},
  {num:73,level:"C2",dur:23,title:"Das geschriebene Meisterwerk",sub:"C2-Essay und Prosa.",goals:["C2-Essay","Literarische Prosa","Eigene Identität","Texte mit Nachhall"]},
  {num:74,level:"C2",dur:25,title:"C2-Finale",sub:"Vollständige Meisterschaft.",goals:["Vollständige C2-Kompetenz","Meisterhaftes Schreiben","Alle C2-Strukturen","Der Weg nach vorne"]},
  {num:75,level:"Muttersprache",dur:23,title:"Sprachintuition",sub:"Grammatik fühlen statt denken.",goals:["Grammatik als Instinkt","Sprachgefühl","Intuitiv korrekte Sätze","Zweite Natur"]},
  {num:76,level:"Muttersprache",dur:23,title:"Die Seele des Deutschen",sub:"was Deutsch zu Deutsch macht.",goals:["Das Unverwechselbare","Sprachseele","Kultur als Sprache","Deutsch von innen"]},
  {num:77,level:"Muttersprache",dur:22,title:"Schweigen auf Deutsch",sub:"was nicht gesagt wird.",goals:["Das Unausgesprochene","Schweigen als Kommunikation","Zwischen den Zeilen","Sprachliche Leerstellen"]},
  {num:78,level:"Muttersprache",dur:22,title:"Träumen, Denken, Fühlen auf Deutsch",sub:"Innenleben auf Deutsch.",goals:["Träume auf Deutsch","Innere Sprache","Emotionen als Deutsche","Gedanken auf Deutsch"]},
  {num:79,level:"Muttersprache",dur:21,title:"Die Sprache der Kindheit",sub:"Lieder, Märchen, Erinnerungen.",goals:["Kindheitssprache","Märchen","Lieder","Erinnerungen auf Deutsch"]},
  {num:80,level:"Muttersprache",dur:22,title:"Deutsch als zweite Identität",sub:"wer du auf Deutsch bist.",goals:["Deine Stimme","Persönlichkeit","Identität und Sprache","Wer bist du?"]},
  {num:81,level:"Muttersprache",dur:25,title:"Das Ende und der Anfang",sub:"Es gibt kein Ende — nur mehr Deutsch.",goals:["Meisterschaft feiern","Rückblick","Deutsch als Heimat","Kein Ende"]},
];

// ── MAIN ──────────────────────────────────────────────────────
export default function Dashboard() {
  const [screen, setScreen]       = useState<Screen>("dashboard");
  const [libLevel, setLibLevel]   = useState<Level>("A1");
  const [curLesson, setCurLesson] = useState<Lesson|null>(null);
  const [step, setStep]           = useState(0);
  const [xp, setXp]               = useState(45);
  const [streak]                  = useState(3);
  const [done, setDone]           = useState<number[]>([0]);
  const [userName, setUserName]   = useState("Lernender");
  const [mounted, setMounted]     = useState(false);
  const [mcDone, setMcDone]       = useState(false);
  const [flipped, setFlipped]     = useState<Set<number>>(new Set());

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const n = session.user.user_metadata?.name
          || session.user.email?.split("@")[0]
          || "Lernender";
        setUserName(n.charAt(0).toUpperCase() + n.slice(1));
      }
    });
  }, []);

  const li    = LXP.filter(t => xp >= t).length - 1;
  const nxp   = LXP[li+1] || 5000;
  const bxp   = LXP[li];
  const pct   = Math.min(((xp-bxp)/(nxp-bxp))*100, 100);
  const hook  = mounted ? HOOKS[new Date().getDate() % HOOKS.length] : HOOKS[0];
  const nextL = CUR.find(l => !done.includes(l.num) && UNL.has(l.num));

  const greeting = () => {
    if (!mounted) return "Willkommen";
    const h = new Date().getHours();
    return h < 12 ? "Guten Morgen" : h < 17 ? "Guten Tag" : "Guten Abend";
  };

  const openLesson = (l: Lesson) => {
    setCurLesson(l); setStep(0); setMcDone(false); setFlipped(new Set());
    setScreen("lesson");
  };
  const finishLesson = useCallback(() => {
    if (!curLesson) return;
    if (!done.includes(curLesson.num)) { setDone(d=>[...d,curLesson.num]); setXp(x=>x+20); }
    setScreen("library");
  }, [curLesson, done]);

  if (!mounted) return null;

  // ── NAV ROW helper ────────────────────────────────────────
  const NavRow = ({onPrev,prevLabel="← Zurück",onNext,nextLabel="Weiter →"}:{onPrev?:()=>void;prevLabel?:string;onNext?:()=>void;nextLabel?:string}) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:48,paddingTop:28,borderTop:C.bdr}}>
      {onPrev ? <button onClick={onPrev} style={{padding:"12px 22px",background:"transparent",color:C.mut,fontSize:14,border:C.bdr,cursor:"pointer",fontFamily:fu}}>{prevLabel}</button> : <div/>}
      {onNext && <button onClick={onNext} style={{padding:"13px 30px",background:C.ink,color:"#fff",fontSize:14,fontWeight:600,letterSpacing:".04em",border:"none",cursor:"pointer",fontFamily:fu}}>{nextLabel}</button>}
    </div>
  );

  // ── SIDEBAR ───────────────────────────────────────────────
  const Sidebar = () => (
    <aside className="sidebar" style={{width:300,flexShrink:0,background:C.cs,borderRight:C.bdr,display:"flex",flexDirection:"column",height:"100vh",overflowY:"auto"}}>
      <div style={{padding:"32px 36px 24px",borderBottom:C.bdr}}>
        <div style={{fontFamily:fd,fontSize:26,fontWeight:600}}>
          <span style={{color:C.ink}}>WUNDER</span><span style={{color:C.red}}>VOL</span><span style={{color:C.goldL}}>L</span>
        </div>
        <div style={{fontFamily:fm,fontSize:10,letterSpacing:".18em",color:C.fnt,marginTop:4,textTransform:"uppercase"}}>German, made wonderful</div>
      </div>

      <div style={{padding:"24px 36px",borderBottom:C.bdr}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:C.ink,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:fd,fontSize:20,fontWeight:700,color:"#fff",flexShrink:0}}>
            {userName.charAt(0)}
          </div>
          <div>
            <div style={{fontSize:16,fontWeight:600,color:C.ink}}>{userName}</div>
            <div style={{fontFamily:fm,fontSize:10,color:C.fnt,letterSpacing:".1em",textTransform:"uppercase",marginTop:2}}>{LNM[li]}</div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
          <span style={{fontFamily:fm,fontSize:12,color:C.goldL,fontWeight:600}}>{xp} XP</span>
          <span style={{fontFamily:fm,fontSize:11,color:C.fnt}}>→ {nxp}</span>
        </div>
        <div style={{height:5,background:"rgba(26,26,26,.12)",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:C.goldL,transition:"width .6s ease"}}/>
        </div>
        <div style={{display:"flex",gap:24,marginTop:14}}>
          <div style={{fontSize:14,color:C.mut,display:"flex",gap:6,alignItems:"center"}}><span>🔥</span><span style={{fontWeight:600}}>{streak}</span><span>Tage</span></div>
          <div style={{fontSize:14,color:C.mut,display:"flex",gap:6,alignItems:"center"}}><span style={{color:C.goldL,fontWeight:700}}>✓</span><span style={{fontWeight:600}}>{done.length}</span><span>fertig</span></div>
        </div>
      </div>

      <nav style={{padding:"12px 0",flex:1}}>
        {([
          {id:"dashboard" as Screen,label:"Dashboard",icon:"◉"},
          {id:"library"   as Screen,label:"Lektionen", icon:"◈"},
          {id:"profile"   as Screen,label:"Fortschritt",icon:"◇"},
        ]).map(({id,label,icon})=>(
          <div key={id} className={`nav-item ${screen===id?"active":""}`} onClick={()=>setScreen(id)}
            style={{display:"flex",alignItems:"center",gap:14,padding:"16px 36px",fontSize:16,fontWeight:screen===id?600:400,color:screen===id?C.ink:C.mut,cursor:"pointer"}}>
            <span style={{fontSize:18,color:screen===id?C.goldL:C.fnt}}>{icon}</span>{label}
          </div>
        ))}
      </nav>

      <div style={{padding:"20px 36px",borderTop:C.bdr}}>
        <button onClick={async()=>{await supabase.auth.signOut();window.location.href="/";}}
          style={{background:"transparent",color:C.fnt,fontSize:14,display:"flex",alignItems:"center",gap:7,cursor:"pointer",border:"none",fontFamily:fu}}>
          ← Abmelden
        </button>
      </div>
    </aside>
  );

  // ── SCREENS ───────────────────────────────────────────────

  // DASHBOARD
  const DashView = () => (
    <div style={{padding:"52px 72px"}}>
      <div className="fade-up" style={{marginBottom:48}}>
        <div style={{fontFamily:fm,fontSize:12,letterSpacing:".22em",color:C.goldL,textTransform:"uppercase",marginBottom:12}}>{greeting()}</div>
        <h1 style={{fontFamily:fd,fontSize:"clamp(56px,6vw,88px)",fontWeight:300,lineHeight:.9,letterSpacing:"-.02em",marginBottom:22,color:C.ink}}>
          Bereit für <em style={{fontStyle:"italic",color:C.red}}>heute</em><span style={{color:C.goldL}}>?</span>
        </h1>
        <div style={{fontFamily:fd,fontSize:20,fontStyle:"italic",color:C.inkM,lineHeight:1.65,maxWidth:680,padding:"18px 0 18px 24px",borderLeft:`4px solid ${C.goldL}`}}>
          "{hook}"
        </div>
      </div>

      {/* Stats */}
      <div className="dash-grid fade-up" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"rgba(26,26,26,.1)",border:"1px solid rgba(26,26,26,.1)",marginBottom:48,animationDelay:".05s"}}>
        {[{v:String(xp),l:"XP gesamt"},{v:String(streak),l:"Tage Streak"},{v:String(done.length),l:"Lektionen fertig"},{v:LNM[li],l:"Dein Level"}].map(({v,l})=>(
          <div key={l} style={{background:C.cw,padding:"32px 36px"}}>
            <div style={{fontFamily:fd,fontSize:v.length>8?28:52,fontWeight:700,lineHeight:1,color:C.ink,marginBottom:8}}>{v}</div>
            <div style={{fontFamily:fm,fontSize:11,color:C.mut,letterSpacing:".14em",textTransform:"uppercase"}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Continue */}
      {nextL && (
        <div className="fade-up" style={{marginBottom:48,animationDelay:".1s"}}>
          <div style={{fontFamily:fm,fontSize:11,letterSpacing:".2em",color:C.mut,textTransform:"uppercase",marginBottom:16}}>Weiter lernen</div>
          <div onClick={()=>openLesson(nextL)}
            style={{background:C.ink,padding:"52px 60px",cursor:"pointer",position:"relative",overflow:"hidden",transition:"opacity .2s"}}
            onMouseEnter={e=>(e.currentTarget.style.opacity=".93")}
            onMouseLeave={e=>(e.currentTarget.style.opacity="1")}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:4,display:"flex"}}>
              <div style={{flex:1,background:"rgba(240,237,230,.3)"}}/><div style={{flex:1,background:C.red}}/><div style={{flex:1,background:C.goldL}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:40}}>
              <div style={{flex:1}}>
                <div style={{fontFamily:fm,fontSize:11,color:C.goldL,letterSpacing:".2em",textTransform:"uppercase",marginBottom:16}}>
                  Lektion {nextL.num} · {nextL.level} · {nextL.dur} Min
                </div>
                <div style={{fontFamily:fd,fontSize:"clamp(32px,3.5vw,52px)",fontWeight:600,color:"#F0EDE6",lineHeight:1.05,marginBottom:12}}>{nextL.title}</div>
                <div style={{fontSize:17,color:"rgba(240,237,230,.6)",lineHeight:1.6}}>{nextL.sub}</div>
              </div>
              <div style={{fontFamily:fd,fontSize:"clamp(80px,10vw,140px)",fontWeight:700,color:"rgba(240,237,230,.05)",lineHeight:1,flexShrink:0}}>
                {String(nextL.num).padStart(2,"0")}
              </div>
            </div>
            <div style={{marginTop:32,display:"flex",alignItems:"center",gap:20}}>
              <button style={{padding:"16px 36px",background:C.goldL,color:C.ink,fontSize:15,fontWeight:700,letterSpacing:".04em",border:"none",cursor:"pointer",fontFamily:fu}}>
                Lektion starten →
              </button>
              <span style={{fontFamily:fm,fontSize:12,color:"rgba(240,237,230,.35)"}}>+20 XP</span>
            </div>
          </div>
        </div>
      )}

      {/* Next list */}
      <div className="fade-up" style={{animationDelay:".15s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontFamily:fm,fontSize:11,letterSpacing:".2em",color:C.mut,textTransform:"uppercase"}}>Nächste Lektionen</div>
          <button onClick={()=>setScreen("library")} style={{background:"transparent",color:C.goldL,fontSize:13,fontFamily:fm,letterSpacing:".1em",border:"none",cursor:"pointer"}}>Alle 82 →</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:1,background:"rgba(26,26,26,.08)",border:"1px solid rgba(26,26,26,.08)"}}>
          {CUR.filter(l=>!done.includes(l.num)&&UNL.has(l.num)).slice(0,3).map(l=>(
            <div key={l.num} className="dash-lcard" onClick={()=>openLesson(l)}
              style={{background:C.cw,padding:"24px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:20,cursor:"pointer"}}>
              <div>
                <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:7}}>
                  <span style={{fontFamily:fm,fontSize:10,letterSpacing:".14em",padding:"3px 9px",border:`1px solid ${LC[l.level]}40`,color:LC[l.level],textTransform:"uppercase"}}>{l.level}</span>
                  <span style={{fontFamily:fm,fontSize:11,color:C.fnt}}>{l.dur} Min</span>
                </div>
                <div style={{fontFamily:fd,fontSize:22,fontWeight:600,color:C.ink}}>{l.title}</div>
              </div>
              <span style={{color:C.fnt,fontSize:28,fontWeight:300}}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // LIBRARY
  const LibView = () => {
    const ls = CUR.filter(l=>l.level===libLevel);
    return (
      <div style={{padding:"52px 72px"}}>
        <div className="fade-up" style={{marginBottom:40}}>
          <div style={{fontFamily:fm,fontSize:12,letterSpacing:".22em",color:C.goldL,textTransform:"uppercase",marginBottom:14}}>Curriculum</div>
          <h1 style={{fontFamily:fd,fontSize:"clamp(44px,5vw,72px)",fontWeight:300,lineHeight:1,letterSpacing:"-.01em",marginBottom:12,color:C.ink}}>A1 → Muttersprache</h1>
          <p style={{fontSize:17,color:C.mut}}>82 vollständige Lektionen — wähle ein Level.</p>
        </div>
        <div style={{display:"flex",gap:1,background:"rgba(26,26,26,.1)",marginBottom:1,overflowX:"auto"}}>
          {LEVELS.map(lv=>(
            <button key={lv} onClick={()=>setLibLevel(lv)}
              style={{flex:1,minWidth:70,padding:"14px 8px",textAlign:"center",background:libLevel===lv?LC[lv]:C.cw,color:libLevel===lv?"#fff":C.mut,fontFamily:fm,fontSize:10,letterSpacing:".12em",textTransform:"uppercase",border:"none",cursor:"pointer",fontWeight:libLevel===lv?700:400,whiteSpace:"nowrap"}}>
              {lv==="Muttersprache"?"MS":lv} · {LCT[lv]}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:1,background:"rgba(26,26,26,.08)",border:"1px solid rgba(26,26,26,.08)"}}>
          {ls.map(l=>{
            const isDone=done.includes(l.num), locked=!UNL.has(l.num);
            return (
              <div key={l.num} className="dash-lcard" onClick={()=>!locked&&openLesson(l)}
                style={{background:C.cw,padding:"28px 32px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:18,position:"relative",cursor:locked?"default":"pointer",opacity:locked?.38:1}}>
                {isDone&&<div style={{position:"absolute",top:16,right:16,width:22,height:22,borderRadius:"50%",background:LC[l.level],display:"grid",placeItems:"center",fontSize:10,color:"#fff",fontWeight:700}}>✓</div>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                    <span style={{fontFamily:fm,fontSize:9,letterSpacing:".14em",padding:"3px 9px",border:`1px solid ${LC[l.level]}35`,color:LC[l.level],textTransform:"uppercase"}}>{l.level==="Muttersprache"?"MS":l.level}</span>
                    <span style={{fontFamily:fm,fontSize:10,color:C.fnt}}>{l.dur} Min</span>
                    {!locked&&<span style={{fontFamily:fm,fontSize:10,color:C.goldL,fontWeight:700}}>Kostenlos</span>}
                  </div>
                  <div style={{fontFamily:fd,fontSize:22,fontWeight:600,lineHeight:1.2,marginBottom:6,color:locked?C.fnt:C.ink}}>{l.title}</div>
                  <div style={{fontSize:14,color:C.mut,fontStyle:"italic",lineHeight:1.4}}>{l.sub.substring(0,70)}{l.sub.length>70?"…":""}</div>
                </div>
                <div style={{fontFamily:fd,fontSize:48,fontWeight:700,color:"rgba(26,26,26,.04)",lineHeight:1,flexShrink:0}}>{String(l.num).padStart(2,"0")}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // LESSON
  const LessonView = () => {
    if (!curLesson) return null;
    const l = curLesson;
    const p = Math.round(step/(5)*100);
    const STEPS=["Ziele","Hören","Verstehen","Chunks","Üben","Fertig"];
    const next=()=>{if(step<5)setStep(step+1);};
    const prev=()=>{if(step>0)setStep(step-1);};
    const flip=(i:number)=>{const s=new Set(flipped);s.has(i)?s.delete(i):s.add(i);setFlipped(s);};
    return (
      <div style={{minHeight:"100vh"}}>
        {/* Header */}
        <div style={{height:54,padding:"0 44px",display:"flex",alignItems:"center",gap:18,borderBottom:C.bdr,background:"rgba(253,252,250,.97)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:100}}>
          <button onClick={()=>setScreen("library")} style={{fontSize:13,color:C.mut,background:"transparent",border:"none",cursor:"pointer",fontFamily:fu,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>← Übersicht</button>
          <div style={{flex:1,height:3,background:"rgba(26,26,26,.1)",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${p}%`,background:C.goldL,transition:"width .5s ease"}}/>
          </div>
          <div style={{display:"flex",gap:5}}>
            {STEPS.map((_,i)=>(
              <div key={i} style={{width:i===step?16:6,height:6,borderRadius:3,background:i===step?C.goldL:i<step?"rgba(184,146,42,.4)":"rgba(26,26,26,.12)",transition:"all .3s"}}/>
            ))}
          </div>
          <div style={{fontFamily:fm,fontSize:11,color:C.goldL,fontWeight:600,whiteSpace:"nowrap"}}>{xp} XP</div>
        </div>

        {/* Body */}
        <div className="lesson-body-inner fade-up" style={{padding:"56px 80px"}}>
          {step===0 && <>
            <div style={{fontFamily:fm,fontSize:10,letterSpacing:".26em",textTransform:"uppercase",color:C.goldL,marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
              01 · Lektion {l.num} · {l.level} · {l.dur} Min
              <div style={{flex:1,height:1,background:C.goldBdr}}/>
            </div>
            <h1 style={{fontFamily:fd,fontSize:"clamp(36px,5vw,54px)",fontWeight:600,lineHeight:1,marginBottom:10,color:C.ink}}>{l.title}</h1>
            <p style={{fontSize:16,color:C.mut,marginBottom:36,lineHeight:1.7}}>{l.sub}</p>
            <div style={{display:"flex",flexDirection:"column",gap:1,marginBottom:32}}>
              {l.goals.map((g,i)=>(
                <div key={i} className="fade-up" style={{display:"flex",gap:14,padding:"16px 20px",background:C.cr,borderLeft:`3px solid ${C.goldL}`,fontSize:15,alignItems:"flex-start",animationDelay:`${i*.06}s`,color:C.ink}}>
                  <span style={{color:C.goldL,flexShrink:0,fontSize:12,marginTop:2}}>✓</span><span>{g}</span>
                </div>
              ))}
            </div>
            {l.kult&&<div style={{border:C.bdr,marginBottom:32}}>
              <div style={{padding:"10px 18px",background:C.goldBg,fontFamily:fm,fontSize:9,letterSpacing:".2em",color:C.gold,textTransform:"uppercase",borderBottom:`1px solid ${C.goldBdr}`}}>Kulturnotiz — {l.kult}</div>
              <div style={{padding:"16px 18px",fontSize:14,color:C.inkM,lineHeight:1.75}}>Jede Lektion enthält eine Kulturnotiz — nicht nur Sprache, sondern die Denkweise dahinter.</div>
            </div>}
            <NavRow onPrev={()=>setScreen("library")} prevLabel="← Abbrechen" onNext={next} nextLabel="Lektion starten →"/>
          </>}

          {step===1 && <>
            <div style={{fontFamily:fm,fontSize:10,letterSpacing:".26em",textTransform:"uppercase",color:C.goldL,marginBottom:14}}>02 · Hören</div>
            <h2 style={{fontFamily:fd,fontSize:44,fontWeight:600,lineHeight:1,marginBottom:10,color:C.ink}}>Hördialog</h2>
            <p style={{fontSize:16,color:C.mut,marginBottom:28,lineHeight:1.7}}>Höre zweimal zu. Erstes Mal: Gesamtverständnis. Zweites Mal: achte auf die markierten Strukturen.</p>
            <div style={{background:"rgba(155,0,0,.05)",borderLeft:`3px solid ${C.red}`,padding:"14px 18px",fontSize:14,color:C.inkM,fontStyle:"italic",marginBottom:28}}>
              ▸ Noticing-Aufgabe: Welche Strukturen erkennst du?
            </div>
            <div style={{border:C.bdr,overflow:"hidden",marginBottom:32}}>
              <div style={{padding:"13px 20px",fontFamily:fm,fontSize:10,letterSpacing:".15em",color:C.goldL,textTransform:"uppercase",borderBottom:C.bdr,background:C.cr}}>Dialog zu: {l.title}</div>
              <div style={{padding:"32px 28px",fontFamily:fd,fontSize:19,fontStyle:"italic",lineHeight:1.8,color:C.inkM}}>
                Der vollständige Hördialog mit Audio und zweisprachiger Transkription ist im fertigen Kurs enthalten — zu <strong style={{fontWeight:600}}>„{l.title}"</strong> auf Niveau {l.level}.
              </div>
            </div>
            <NavRow onPrev={prev} onNext={next} nextLabel="Weiter: Verstehen →"/>
          </>}

          {step===2 && <>
            <div style={{fontFamily:fm,fontSize:10,letterSpacing:".26em",textTransform:"uppercase",color:C.goldL,marginBottom:14}}>03 · Verstehen</div>
            <h2 style={{fontFamily:fd,fontSize:44,fontWeight:600,lineHeight:1,marginBottom:10,color:C.ink}}>Die Regeln</h2>
            <p style={{fontSize:16,color:C.mut,marginBottom:32,lineHeight:1.7}}>Grammatik nicht auswendig lernen — verstehen. Jede Regel hat eine Logik.</p>
            <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:32}}>
              {l.goals.map((g,i)=>(
                <div key={i} className="fade-up" style={{border:C.bdr,overflow:"hidden"}}>
                  <div style={{background:C.goldBg,borderBottom:`1px solid ${C.goldBdr}`,padding:"13px 20px",fontFamily:fd,fontSize:19,fontWeight:600,color:C.gold}}>Regel {i+1}</div>
                  <div style={{padding:"16px 20px",fontSize:15,color:C.ink,lineHeight:1.7}}>{g}</div>
                </div>
              ))}
            </div>
            <NavRow onPrev={prev} onNext={next} nextLabel="Weiter: Chunks →"/>
          </>}

          {step===3 && <>
            <div style={{fontFamily:fm,fontSize:10,letterSpacing:".26em",textTransform:"uppercase",color:C.goldL,marginBottom:14}}>04 · Sprachbausteine</div>
            <h2 style={{fontFamily:fd,fontSize:44,fontWeight:600,lineHeight:1,marginBottom:10,color:C.ink}}>Chunks</h2>
            <p style={{fontSize:16,color:C.mut,marginBottom:32,lineHeight:1.7}}>Lerne diese als fertige Einheiten. Klicke jede Karte zum Aufdecken.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:1,background:"rgba(26,26,26,.08)",border:C.bdr,marginBottom:32}}>
              {l.goals.map((g,i)=>(
                <div key={i} className="chunk-card" onClick={()=>flip(i)}
                  style={{background:flipped.has(i)?C.cr:C.cw,padding:"22px 24px",cursor:"pointer"}}>
                  <div style={{fontFamily:fd,fontSize:19,fontWeight:600,marginBottom:6,color:C.ink}}>{g.split(" ").slice(0,5).join(" ")}…</div>
                  <div style={{fontSize:13,fontStyle:"italic",color:flipped.has(i)?C.goldL:C.fnt,transition:"color .2s"}}>{flipped.has(i)?g:"Klicken zum Aufdecken →"}</div>
                </div>
              ))}
            </div>
            <NavRow onPrev={prev} onNext={next} nextLabel="Weiter: Üben →"/>
          </>}

          {step===4 && <>
            <div style={{fontFamily:fm,fontSize:10,letterSpacing:".26em",textTransform:"uppercase",color:C.goldL,marginBottom:14}}>05 · Üben</div>
            <h2 style={{fontFamily:fd,fontSize:44,fontWeight:600,lineHeight:1,marginBottom:28,color:C.ink}}>Aufgabe</h2>
            <div style={{background:C.cr,border:C.bdr,padding:"32px 36px",marginBottom:24}}>
              <div style={{fontFamily:fm,fontSize:10,letterSpacing:".2em",color:C.goldL,textTransform:"uppercase",marginBottom:16}}>Multiple Choice</div>
              <div style={{fontFamily:fd,fontSize:28,fontWeight:600,marginBottom:26,lineHeight:1.25,color:C.ink}}>Was lernst du in Lektion {l.num}?</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {l.goals.map((g,i)=>(
                  <button key={i} className="opt-btn" disabled={mcDone}
                    onClick={()=>{if(!mcDone){setMcDone(true);if(i===0)setXp(x=>x+10);}}}
                    style={{textAlign:"left",padding:"14px 18px",fontSize:14,background:mcDone&&i===0?"rgba(0,180,100,.07)":"rgba(26,26,26,.03)",border:`1.5px solid ${mcDone&&i===0?"rgba(0,180,100,.35)":"rgba(26,26,26,.1)"}`,color:mcDone&&i===0?"#1A7A4A":C.ink,display:"flex",gap:12,alignItems:"center",cursor:"pointer",fontFamily:fu}}>
                    <span style={{fontFamily:fm,fontSize:10,width:20,height:20,border:"1px solid currentColor",display:"grid",placeItems:"center",flexShrink:0,opacity:.6}}>{String.fromCharCode(65+i)}</span>
                    {g.substring(0,80)}
                  </button>
                ))}
              </div>
              {mcDone&&<div style={{marginTop:16,padding:"12px 16px",background:"rgba(0,180,100,.05)",borderLeft:"3px solid rgba(0,180,100,.4)",fontSize:14,color:C.inkM,fontStyle:"italic"}}>✓ Richtig! {l.goals[0]}</div>}
            </div>
            <NavRow onPrev={prev} onNext={mcDone?()=>setStep(5):undefined} nextLabel="Lektion abschließen →"/>
          </>}

          {step===5 && (
            <div style={{textAlign:"center",padding:"48px 0"}}>
              <div className="pop-in" style={{fontFamily:fd,fontSize:100,fontWeight:700,color:C.goldL,lineHeight:1}}>+20</div>
              <div style={{fontFamily:fm,fontSize:10,letterSpacing:".26em",textTransform:"uppercase",color:C.fnt,marginBottom:28}}>XP verdient · Lektion {l.num}</div>
              <h2 style={{fontFamily:fd,fontSize:46,fontWeight:600,marginBottom:12,color:C.ink}}>Ausgezeichnet!</h2>
              <p style={{fontSize:16,color:C.mut,marginBottom:40}}>Lektion {l.num} abgeschlossen.</p>
              <div style={{display:"flex",gap:1,background:"rgba(26,26,26,.08)",maxWidth:420,margin:"0 auto 40px",border:C.bdr}}>
                {[{v:String(xp+20),l:"XP Total"},{v:String(l.num+1),l:"Lektionen"},{v:l.level,l:"Niveau"}].map(({v,l})=>(
                  <div key={l} style={{flex:1,padding:18,background:C.cw,textAlign:"center"}}>
                    <div style={{fontFamily:fd,fontSize:30,fontWeight:700,color:C.goldL}}>{v}</div>
                    <div style={{fontFamily:fm,fontSize:9,color:C.fnt,letterSpacing:".12em",textTransform:"uppercase",marginTop:4}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{background:C.cr,border:C.bdr,padding:"22px 28px",maxWidth:500,margin:"0 auto 36px",textAlign:"left"}}>
                <div style={{fontFamily:fm,fontSize:9,letterSpacing:".2em",color:C.goldL,textTransform:"uppercase",marginBottom:14}}>Spaced Repetition — Wiederhole heute noch!</div>
                {l.goals.map((g,i)=>(
                  <div key={i} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:"1px solid rgba(26,26,26,.06)",fontSize:14,color:C.inkM}}>
                    <span style={{color:C.goldL,flexShrink:0,fontSize:10,marginTop:3}}>▸</span><span>{g}</span>
                  </div>
                ))}
                <div style={{fontFamily:fm,fontSize:10,color:C.fnt,marginTop:12,letterSpacing:".1em"}}>Heute · 3 Tage · 1 Woche · 2 Wochen</div>
              </div>
              <button onClick={finishLesson} style={{padding:"14px 36px",background:C.ink,color:"#fff",fontSize:14,fontWeight:600,letterSpacing:".04em",border:"none",cursor:"pointer",fontFamily:fu}}>← Zur Übersicht</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // PROFILE
  const ProfileView = () => (
    <div style={{padding:"52px 72px"}}>
      <div className="fade-up" style={{marginBottom:44}}>
        <div style={{fontFamily:fm,fontSize:11,letterSpacing:".22em",color:C.goldL,textTransform:"uppercase",marginBottom:12}}>Fortschritt</div>
        <h1 style={{fontFamily:fd,fontSize:"clamp(32px,4vw,48px)",fontWeight:300,lineHeight:1,letterSpacing:"-.01em",color:C.ink}}>
          Deine <em style={{fontStyle:"italic",color:C.red}}>Reise</em>
        </h1>
      </div>
      <div className="fade-up" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"rgba(26,26,26,.1)",border:C.bdr,marginBottom:36,animationDelay:".05s"}}>
        {[{v:String(xp),l:"XP gesamt"},{v:String(streak),l:"Tage Streak"},{v:String(done.length),l:"Lektionen fertig"}].map(({v,l})=>(
          <div key={l} style={{background:C.cw,padding:"24px 28px"}}>
            <div style={{fontFamily:fd,fontSize:44,fontWeight:700,lineHeight:1,color:C.goldL}}>{v}</div>
            <div style={{fontFamily:fm,fontSize:10,color:C.mut,letterSpacing:".12em",textTransform:"uppercase",marginTop:6}}>{l}</div>
          </div>
        ))}
      </div>
      <div className="fade-up" style={{border:C.bdr,padding:"28px 32px",marginBottom:36,animationDelay:".1s"}}>
        <div style={{fontFamily:fm,fontSize:10,letterSpacing:".2em",color:C.goldL,textTransform:"uppercase",marginBottom:10}}>Aktuelles Level</div>
        <div style={{fontFamily:fd,fontSize:32,fontWeight:600,marginBottom:6,color:C.ink}}>{LNM[li]}</div>
        <div style={{fontSize:15,color:C.mut,fontStyle:"italic",marginBottom:20}}>
          {["Du bist angekommen.","Du findest dich zurecht.","Deutsch beginnt sich zu formen.","Du denkst auf Deutsch.","Die Sprache gehört dir.","Du bist jemand anderes geworden.","Muttersprache erreicht."][li]}
        </div>
        <div style={{height:5,background:"rgba(26,26,26,.1)",borderRadius:3,overflow:"hidden",marginBottom:8}}>
          <div style={{height:"100%",width:`${pct}%`,background:C.goldL,borderRadius:3,transition:"width 1s ease"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.fnt}}>
          <span>{xp} XP</span><span>{nxp} XP — {LNM[li+1]||"Meister"}</span>
        </div>
      </div>
      <div className="fade-up" style={{animationDelay:".15s"}}>
        <div style={{fontFamily:fd,fontSize:24,fontWeight:300,color:C.mut,fontStyle:"italic",marginBottom:24}}>Deine Reise durch Deutschland</div>
        {JOURNEY.map((s,i)=>{
          const passed=xp>=s.xp, cur=i===Math.min(JOURNEY.filter(j=>xp>=j.xp).length-1,6);
          const lc=LC[s.level as Level];
          return (
            <div key={s.city} style={{display:"flex",gap:16,marginBottom:10}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:30}}>
                <div style={{width:cur?16:11,height:cur?16:11,borderRadius:"50%",border:`2px solid ${passed?lc:"rgba(26,26,26,.15)"}`,background:passed?lc:C.cw,marginTop:17,flexShrink:0,transition:"all .4s"}}/>
                {i<JOURNEY.length-1&&<div style={{width:2,flex:1,minHeight:28,background:passed&&xp>=JOURNEY[i+1]?.xp?lc:"rgba(26,26,26,.1)",marginTop:4,transition:"background .4s"}}/>}
              </div>
              <div style={{flex:1,background:cur?C.cr:C.cw,border:`1px solid ${cur?C.goldBdr:"rgba(26,26,26,.08)"}`,padding:"16px 22px",marginBottom:4,opacity:passed?1:.45}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
                  <span style={{fontFamily:fm,fontSize:10,letterSpacing:".16em",color:lc,textTransform:"uppercase",fontWeight:700}}>{s.level}</span>
                  <span style={{fontFamily:fd,fontSize:20,fontWeight:600,color:C.ink}}>{s.city}</span>
                  {passed&&<span style={{fontSize:13,color:"#1A7A4A",fontWeight:700}}>✓</span>}
                </div>
                <div style={{fontSize:14,color:C.mut,fontStyle:"italic"}}>{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden",fontFamily:fu}}>
      {screen!=="lesson" && <Sidebar/>}
      <main className="main-content" style={{flex:1,overflowY:"auto",background:C.cw}}>
        {screen==="dashboard" && <DashView/>}
        {screen==="library"   && <LibView/>}
        {screen==="lesson"    && <LessonView/>}
        {screen==="profile"   && <ProfileView/>}
      </main>
    </div>
  );
}
