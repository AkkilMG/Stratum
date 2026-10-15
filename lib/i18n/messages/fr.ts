import type { Messages } from "../types";

export const fr: Messages = {
  brand: {
    name: "Stratum",
    tagline: "Documentation",
  },
  header: {
    search: "Rechercher",
    searchShort: "Rechercher dans la doc…",
    language: "Langue",
    theme: "Thème",
    light: "Clair",
    dark: "Sombre",
    system: "Système",
    github: "GitHub",
    menu: "Menu",
    close: "Fermer",
  },
  sidebar: {
    label: "Documentation",
    sections: {
      introduction: "Introduction",
      "getting-started": "Premiers pas",
      guide: "Guide d'utilisation",
      reference: "Référence",
      troubleshooting: "Dépannage",
      building: "Compilation et contribution",
      changelog: "Nouveautés",
    },
    backHome: "Retour à l'accueil",
  },
  search: {
    title: "Rechercher dans la documentation",
    placeholder: "Rechercher des guides, fonctions, raccourcis…",
    empty: "Aucun résultat",
    emptyHint: "Essayez un autre mot-clé ou parcourez la barre latérale.",
    navigate: "pour naviguer",
    open: "pour ouvrir",
    close: "pour fermer",
    results: "résultats",
  },
  toc: {
    title: "Sur cette page",
  },
  footer: {
    prev: "Précédent",
    next: "Suivant",
    edit: "Modifier cette page",
    rights: "Tous droits réservés.",
    madeBy: "Conçu par Arkynox",
    docsHome: "Accueil de la documentation",
    product: "Produit",
  },
  common: {
    notTranslated: "Cette page n'est pas encore traduite",
    notTranslatedBody:
      "Vous consultez la version anglaise. Passez à l'anglais pour l'expérience complète ou aidez à traduire cette page.",
    capture: "Capture d'écran à venir",
    captureHint: "Placez « {name}.png » dans /public/screenshots pour remplacer ce cadre.",
    copy: "Copier",
    copied: "Copié !",
    version: "Version",
    basedOn: "Basé sur",
  },
  home: {
    eyebrow: "Stratum · Documentation",
    title: "Les ressources de votre studio,",
    titleAccent: "versionnées et interrogeables.",
    subtitle:
      "Stratum est un coffre de ressources local-first pour les studios de jeux. Chaque fichier est versionné, immédiatement recherchable et sécurisé hors ligne, avec du tagging par IA et une synchronisation entre collègues via votre propre réseau.",
    getStarted: "Commencer",
    viewGuide: "Ouvrir le guide d'utilisation",
    featuresTitle: "Tout ce dont votre pipeline d'art a besoin",
    featuresSubtitle:
      "Pas de compte cloud. Pas de dépendance. Juste un dossier sur votre disque qui développe une mémoire.",
    exploreTitle: "Commencez à explorer",
    exploreSubtitle: "Accédez directement à la partie de Stratum dont vous avez besoin.",
    stats: {
      local: "Local-first",
      versioned: "Versionné",
      instant: "Recherche instantanée",
      searchable: "Assisté par IA",
    },
    ctaTitle: "Prêt à mettre de l'ordre dans vos ressources ?",
    ctaSubtitle: "Installez Stratum, pointez-le vers un dossier et laissez-le tout retenir.",
    ctaButton: "Installer Stratum",
    features: [
      {
        title: "Local-first et hors ligne",
        body: "Tout réside dans un simple dossier sur votre disque. Ni compte, ni envoi, ni dépendance.",
      },
      {
        title: "Versionnage automatique",
        body: "Chaque modification devient une version restaurable, propulsée par Git.",
      },
      {
        title: "Trouvez tout instantanément",
        body: "Recherche sémantique par IA et repli par mots-clés, même dans d'énormes bibliothèques.",
      },
      {
        title: "Conçu pour les équipes",
        body: "Synchronisez un coffre partagé sur votre LAN ou NAS. Les conflits sont conservés, jamais perdus.",
      },
      {
        title: "Une IA qui tague pour vous",
        body: "Des modèles locaux optionnels décrivent les images et ajoutent des tags recherchables.",
      },
      {
        title: "Sûr par défaut",
        body: "Une coquille de bureau renforcée, des mises à jour signées et aucune télémétrie.",
      },
    ],
    explore: [
      {
        title: "Démarrage rapide",
        body: "Installez Stratum sur Windows, macOS ou Linux en quelques minutes.",
        href: "/getting-started/installation",
      },
      {
        title: "Guide d'utilisation",
        body: "Découvrez chaque écran et chaque flux, de l'import à la restauration.",
        href: "/guide/library",
      },
      {
        title: "Concepts clés",
        body: "Comprenez les espaces, ressources, versions, tags et la synchronisation.",
        href: "/introduction/concepts",
      },
      {
        title: "Référence",
        body: "Types de fichiers pris en charge, raccourcis clavier et codes d'erreur.",
        href: "/reference/asset-kinds",
      },
    ],
  },
};
