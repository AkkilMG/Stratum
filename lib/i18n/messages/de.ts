import type { Messages } from "../types";

export const de: Messages = {
  brand: {
    name: "Stratum",
    tagline: "Dokumentation",
  },
  header: {
    search: "Suchen",
    searchShort: "Dokumentation durchsuchen…",
    language: "Sprache",
    theme: "Design",
    light: "Hell",
    dark: "Dunkel",
    system: "System",
    github: "GitHub",
    menu: "Menü",
    close: "Schließen",
  },
  sidebar: {
    label: "Dokumentation",
    sections: {
      introduction: "Einführung",
      "getting-started": "Erste Schritte",
      guide: "Benutzerhandbuch",
      reference: "Referenz",
      troubleshooting: "Fehlerbehebung",
      building: "Build & Mitarbeit",
      changelog: "Änderungen",
    },
    backHome: "Zurück zur Übersicht",
  },
  search: {
    title: "Die Dokumentation durchsuchen",
    placeholder: "Anleitungen, Funktionen, Tastenkürzel suchen…",
    empty: "Keine Ergebnisse",
    emptyHint: "Versuchen Sie ein anderes Stichwort oder nutzen Sie die Seitenleiste.",
    navigate: "zum Navigieren",
    open: "zum Öffnen",
    close: "zum Schließen",
    results: "Ergebnisse",
  },
  toc: {
    title: "Auf dieser Seite",
  },
  footer: {
    prev: "Zurück",
    next: "Weiter",
    edit: "Diese Seite bearbeiten",
    rights: "Alle Rechte vorbehalten.",
    madeBy: "Erstellt von Arkynox",
    docsHome: "Dokumentations-Startseite",
    product: "Produkt",
  },
  common: {
    notTranslated: "Diese Seite ist noch nicht übersetzt",
    notTranslatedBody:
      "Sie sehen die englische Originalfassung. Wechseln Sie zu Englisch für das volle Erlebnis oder helfen Sie beim Übersetzen.",
    capture: "Screenshot folgt",
    captureHint: "Legen Sie „{name}.png“ in /public/screenshots ab, um diesen Rahmen zu ersetzen.",
    copy: "Kopieren",
    copied: "Kopiert!",
    version: "Version",
    basedOn: "Basierend auf",
  },
  home: {
    eyebrow: "Stratum · Dokumentation",
    title: "Die Assets deines Studios,",
    titleAccent: "versioniert und durchsuchbar.",
    subtitle:
      "Stratum ist ein Local-First-Asset-Tresor für Game-Studios. Jede Datei ist versioniert, sofort durchsuchbar und offline sicher – mit optionalem KI-Tagging und Synchronisation zwischen Kollegen über dein eigenes Netzwerk.",
    getStarted: "Loslegen",
    viewGuide: "Benutzerhandbuch öffnen",
    featuresTitle: "Alles, was deine Art-Pipeline braucht",
    featuresSubtitle:
      "Kein Cloud-Konto. Keine Bindung. Nur ein Ordner auf der Festplatte, der ein Gedächtnis entwickelt.",
    exploreTitle: "Jetzt erkunden",
    exploreSubtitle: "Springe direkt zu dem Teil von Stratum, den du brauchst.",
    stats: {
      local: "Local-First",
      versioned: "Versioniert",
      instant: "Sofortsuche",
      searchable: "KI-gestützt",
    },
    ctaTitle: "Bereit, Ordnung in deine Assets zu bringen?",
    ctaSubtitle: "Installiere Stratum, richte es auf einen Ordner und lass es alles merken.",
    ctaButton: "Stratum installieren",
    features: [
      {
        title: "Local-First & offline",
        body: "Alles liegt in einem normalen Ordner auf deiner Festplatte. Kein Konto, kein Upload, keine Bindung.",
      },
      {
        title: "Automatische Versionierung",
        body: "Jede Änderung wird zu einer wiederherstellbaren Version – angetrieben von Git.",
      },
      {
        title: "Finde alles sofort",
        body: "Semantische KI-Suche mit Stichwort-Fallback – selbst in riesigen Bibliotheken.",
      },
      {
        title: "Für Teams gebaut",
        body: "Synchronisiere einen geteilten Tresor über LAN oder NAS. Konflikte bleiben erhalten, nichts geht verloren.",
      },
      {
        title: "KI, die für dich taggt",
        body: "Optionale lokale Modelle beschreiben Bilder und fügen durchsuchbare Tags hinzu.",
      },
      {
        title: "Standardmäßig sicher",
        body: "Gehärtete Desktop-Umgebung, signierte Updates und keinerlei Telemetrie.",
      },
    ],
    explore: [
      {
        title: "Schnellstart",
        body: "Installiere Stratum in wenigen Minuten unter Windows, macOS oder Linux.",
        href: "/getting-started/installation",
      },
      {
        title: "Benutzerhandbuch",
        body: "Lerne jeden Bildschirm und Workflow kennen – vom Import bis zur Wiederherstellung.",
        href: "/guide/library",
      },
      {
        title: "Kernkonzepte",
        body: "Verstehe Spaces, Assets, Versionen, Tags und wie Synchronisation funktioniert.",
        href: "/introduction/concepts",
      },
      {
        title: "Referenz",
        body: "Unterstützte Dateitypen, Tastenkürzel und Fehlercodes.",
        href: "/reference/asset-kinds",
      },
    ],
  },
};
