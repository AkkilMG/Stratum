import type { Messages } from "../types";

export const es: Messages = {
  brand: {
    name: "Stratum",
    tagline: "Documentación",
  },
  header: {
    search: "Buscar",
    searchShort: "Buscar en la documentación…",
    language: "Idioma",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
    github: "GitHub",
    menu: "Menú",
    close: "Cerrar",
  },
  sidebar: {
    label: "Documentación",
    sections: {
      introduction: "Introducción",
      "getting-started": "Primeros pasos",
      guide: "Guía de uso",
      reference: "Referencia",
      troubleshooting: "Solución de problemas",
      building: "Para desarrolladores",
      changelog: "Novedades",
    },
    backHome: "Volver al inicio",
  },
  search: {
    title: "Buscar en la documentación",
    placeholder: "Busca guías, funciones, atajos…",
    empty: "Sin resultados",
    emptyHint: "Prueba con otra palabra clave o explora la barra lateral.",
    navigate: "para navegar",
    open: "para abrir",
    close: "para cerrar",
    results: "resultados",
  },
  toc: {
    title: "En esta página",
  },
  footer: {
    prev: "Anterior",
    next: "Siguiente",
    rights: "Todos los derechos reservados.",
    madeBy: "Creado por Arkynox",
    docsHome: "Inicio de la documentación",
    product: "Producto",
  },
  common: {
    notTranslated: "Esta página aún no está traducida",
    notTranslatedBody:
      "Estás viendo la versión en inglés. Cambia a inglés para la experiencia completa o ayuda a traducir esta página.",
    capture: "Captura próximamente",
    captureHint: "Coloca “{name}.png” en /public/screenshots para reemplazar este marco.",
    copy: "Copiar",
    copied: "¡Copiado!",
    learnMore: "Saber más",
    version: "Versión",
    basedOn: "Basado en",
    home: "Inicio",
    backToTop: "Volver arriba",
    contents: "Contenido",
  },
  home: {
    eyebrow: "Stratum · Documentación",
    title: "Los recursos de tu estudio,",
    titleAccent: "versionados y con búsqueda.",
    subtitle:
      "Stratum es una bóveda de recursos local-first para estudios de videojuegos. Cada archivo está versionado, se busca al instante y funciona sin conexión, con etiquetado por IA y sincronización entre compañeros por tu propia red.",
    getStarted: "Comenzar",
    viewGuide: "Abrir la guía de uso",
    featuresTitle: "Todo lo que tu flujo de arte necesita",
    featuresSubtitle:
      "Sin cuenta en la nube. Sin dependencias. Solo una carpeta en disco que desarrolla memoria.",
    exploreTitle: "Empieza a explorar",
    exploreSubtitle: "Ve directamente a la parte de Stratum que necesitas.",
    stats: {
      local: "Local-first",
      versioned: "Versionado",
      instant: "Búsqueda instantánea",
      searchable: "Con IA",
    },
    ctaTitle: "¿Listo para poner orden en tus recursos?",
    ctaSubtitle: "Instala Stratum, apúntalo a una carpeta y deja que lo recuerde todo.",
    ctaButton: "Instalar Stratum",
    features: [
      {
        title: "Local-first y sin conexión",
        body: "Todo vive en una carpeta normal de tu disco. Sin cuenta, sin subidas, sin ataduras.",
      },
      {
        title: "Versionado automático",
        body: "Cada cambio se convierte en una versión restaurable, con Git por debajo.",
      },
      {
        title: "Encuentra todo al instante",
        body: "Búsqueda semántica con IA y respaldo por palabras clave, incluso en bibliotecas enormes.",
      },
      {
        title: "Hecho para equipos",
        body: "Sincroniza una bóveda compartida por tu LAN o NAS. Los conflictos se conservan, nunca se pierden.",
      },
      {
        title: "IA que etiqueta por ti",
        body: "Modelos locales opcionales describen imágenes y añaden etiquetas buscables.",
      },
      {
        title: "Seguro por defecto",
        body: "Un entorno de escritorio reforzado, actualizaciones firmadas y cero telemetría.",
      },
    ],
    explore: [
      {
        title: "Inicio rápido",
        body: "Instala Stratum en Windows, macOS o Linux en unos minutos.",
        href: "/getting-started/installation",
      },
      {
        title: "Guía de uso",
        body: "Aprende cada pantalla y flujo, desde importar hasta restaurar versiones.",
        href: "/guide/library",
      },
      {
        title: "Conceptos clave",
        body: "Entiende espacios, recursos, versiones, etiquetas y cómo funciona la sincronización.",
        href: "/introduction/concepts",
      },
      {
        title: "Referencia",
        body: "Tipos de archivo compatibles, atajos de teclado y códigos de error.",
        href: "/reference/asset-kinds",
      },
      {
        title: "Para desarrolladores",
        body: "Compila Stratum desde el código fuente, ejecuta las pruebas y contribuye al proyecto.",
        href: "/building/overview",
      },
    ],
  },
};
