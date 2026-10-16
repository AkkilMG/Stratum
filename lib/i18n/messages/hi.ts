import type { Messages } from "../types";

export const hi: Messages = {
  brand: {
    name: "Stratum",
    tagline: "दस्तावेज़",
  },
  header: {
    search: "खोजें",
    searchShort: "दस्तावेज़ खोजें…",
    language: "भाषा",
    theme: "थीम",
    light: "हल्की",
    dark: "गहरी",
    system: "सिस्टम",
    github: "GitHub",
    menu: "मेनू",
    close: "बंद करें",
  },
  sidebar: {
    label: "दस्तावेज़",
    sections: {
      introduction: "परिचय",
      "getting-started": "शुरुआत करें",
      guide: "उपयोगकर्ता गाइड",
      reference: "संदर्भ",
      troubleshooting: "समस्या निवारण",
      building: "डेवलपर्स के लिए",
      changelog: "परिवर्तन",
    },
    backHome: "अवलोकन पर लौटें",
  },
  search: {
    title: "दस्तावेज़ में खोजें",
    placeholder: "गाइड, विशेषताएँ, शॉर्टकट खोजें…",
    empty: "कोई परिणाम नहीं मिला",
    emptyHint: "कोई और शब्द आज़माएँ, या साइडबार देखें।",
    navigate: "नेविगेट करने के लिए",
    open: "खोलने के लिए",
    close: "बंद करने के लिए",
    results: "परिणाम",
  },
  toc: {
    title: "इस पृष्ठ पर",
  },
  footer: {
    prev: "पिछला",
    next: "अगला",
    rights: "सर्वाधिकार सुरक्षित।",
    madeBy: "Arkynox द्वारा निर्मित",
    docsHome: "दस्तावेज़ मुखपृष्ठ",
    product: "उत्पाद",
  },
  common: {
    notTranslated: "यह पृष्ठ अभी अनुवादित नहीं है",
    notTranslatedBody:
      "आप अंग्रेज़ी मूल देख रहे हैं। पूर्ण अनुभव के लिए अंग्रेज़ी पर स्विच करें, या अनुवाद में मदद करें।",
    capture: "स्क्रीनशॉट जल्द आएगा",
    captureHint: "इस फ्रेम को बदलने के लिए “{name}.png” को /public/screenshots में रखें।",
    copy: "कॉपी",
    copied: "कॉपी हो गया!",
    learnMore: "और जानें",
    version: "संस्करण",
    basedOn: "आधारित",
    home: "होम",
    backToTop: "ऊपर जाएँ",
    contents: "सामग्री",
  },
  home: {
    eyebrow: "Stratum · दस्तावेज़",
    title: "आपके स्टूडियो के एसेट्स,",
    titleAccent: "वर्ज़न और खोज के साथ।",
    subtitle:
      "Stratum गेम स्टूडियो के लिए एक लोकल-फर्स्ट एसेट वॉल्ट है। हर फ़ाइल वर्ज़न की जाती है, तुरंत खोजी जाती है और ऑफ़लाइन सुरक्षित रहती है — वैकल्पिक AI टैगिंग और अपने नेटवर्क पर टीम सिंक के साथ।",
    getStarted: "शुरू करें",
    viewGuide: "उपयोगकर्ता गाइड खोलें",
    featuresTitle: "आपके आर्ट पाइपलाइन की हर ज़रूरत",
    featuresSubtitle:
      "कोई क्लाउड अकाउंट नहीं। कोई बंधन नहीं। बस डिस्क पर एक फ़ोल्डर जो याददाश्त बनाता है।",
    exploreTitle: "अन्वेषण शुरू करें",
    exploreSubtitle: "सीधे Stratum के उस हिस्से पर जाएँ जिसकी आपको ज़रूरत है।",
    stats: {
      local: "लोकल-फर्स्ट",
      versioned: "वर्ज़नयुक्त",
      instant: "तुरंत खोज",
      searchable: "AI सहायित",
    },
    ctaTitle: "अपने एसेट्स में व्यवस्था लाने के लिए तैयार?",
    ctaSubtitle: "Stratum इंस्टॉल करें, एक फ़ोल्डर चुनें, और उसे सब याद रखने दें।",
    ctaButton: "Stratum इंस्टॉल करें",
    features: [
      {
        title: "लोकल-फर्स्ट और ऑफ़लाइन",
        body: "सब कुछ आपकी डिस्क के एक साधारण फ़ोल्डर में रहता है। कोई अकाउंट नहीं, कोई अपलोड नहीं, कोई बंधन नहीं।",
      },
      {
        title: "स्वचालित वर्ज़निंग",
        body: "हर बदलाव एक बहाल करने योग्य वर्ज़न बन जाता है, जिसके पीछे Git होता है।",
      },
      {
        title: "कुछ भी तुरंत खोजें",
        body: "AI के साथ सिमेंटिक खोज और कीवर्ड बैकअप — बड़ी लाइब्रेरी में भी।",
      },
      {
        title: "टीमों के लिए बनाया गया",
        body: "LAN या NAS पर साझा वॉल्ट सिंक करें। टकराव सहेजे जाते हैं, कभी नहीं खोते।",
      },
      {
        title: "AI आपके लिए टैग करता है",
        body: "वैकल्पिक लोकल मॉडल छवियों का वर्णन करते हैं और खोजी जा सकने वाले टैग जोड़ते हैं।",
      },
      {
        title: "डिफ़ॉल्ट रूप से सुरक्षित",
        body: "सुरक्षित डेस्कटॉप शेल, हस्ताक्षरित अपडेट और बिल्कुल भी टेलीमेट्री नहीं।",
      },
    ],
    explore: [
      {
        title: "त्वरित शुरुआत",
        body: "कुछ मिनटों में Windows, macOS या Linux पर Stratum इंस्टॉल करें।",
        href: "/getting-started/installation",
      },
      {
        title: "उपयोगकर्ता गाइड",
        body: "इम्पोर्ट से रिस्टोर तक हर स्क्रीन और वर्कफ़्लो सीखें।",
        href: "/guide/library",
      },
      {
        title: "मुख्य अवधारणाएँ",
        body: "स्पेस, एसेट्स, वर्ज़न, टैग और सिंक को समझें।",
        href: "/introduction/concepts",
      },
      {
        title: "संदर्भ",
        body: "समर्थित फ़ाइल प्रकार, कीबोर्ड शॉर्टकट और त्रुटि कोड।",
        href: "/reference/asset-kinds",
      },
      {
        title: "डेवलपर्स के लिए",
        body: "सोर्स से Stratum बनाएँ, टेस्ट चलाएँ और प्रोजेक्ट में योगदान करें।",
        href: "/building/overview",
      },
    ],
  },
};
