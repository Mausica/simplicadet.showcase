import cnmtvInsignia from "@/assets/insignia/cnmtv.png";
import cnmdcInsignia from "@/assets/insignia/cnmdc.png";
import aftInsignia from "@/assets/insignia/aft.png";
import atmInsignia from "@/assets/insignia/atm.png";
import cnmtvCover from "@/assets/insignia/b_cnmtv.png";
import cnmdcCover from "@/assets/insignia/b_cnmdc.png";
import aftCover from "@/assets/insignia/b_aft.png";
import atmCover from "@/assets/insignia/b_atm.png";

import elevCaporal from "@/assets/ranks/elev-caporal.png";
import elevSergent from "@/assets/ranks/elev-sergent.png";
import elevAdjutant from "@/assets/ranks/elev-adjutant.png";

export type InstitutionType = "colegiu" | "academie" | "baza" | "centru" | "other";

export interface Rank {
  name: string;
  image: string;
  description: string;
}

export interface Faculty {
  name: string;
  description: string;
  specializations?: string[];
}

export interface Department {
  name: string;
  description: string;
}

export interface Institution {
  slug: string;
  name: string;
  shortName: string;
  city: string;
  motto: string;
  type: InstitutionType;
  colors: {
    primary: string;
    secondary: string;
    primaryHsl: string;
    secondaryHsl: string;
  };
  insignia: string;
  coverImage?: string;
  galleryImages: { url: string; caption: string }[];
  description: string;
  mission: string;
  values: string[];
  history: string;
  ranks: Rank[];
  faculties?: Faculty[];
  departments?: Department[];
}

export const institutions: Institution[] = [
  {
    slug: "cnmtv",
    name: "Colegiul National Militar Tudor Vladimirescu",
    shortName: "CNMTV",
    city: "Craiova",
    motto: "Per aspera ad astra",
    type: "colegiu",
    colors: {
      primary: "#0a1a3a",
      secondary: "#3b82f6",
      primaryHsl: "220 70% 13%",
      secondaryHsl: "217 91% 60%",
    },
    insignia: cnmtvInsignia,
    coverImage: cnmtvCover,
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1588450248442-1c8357368dba?w=800", caption: "Ceremonial Militar" },
      { url: "https://images.unsplash.com/photo-1427504746696-ea5abd7dfe72?w=800", caption: "Săli de clasă moderne" },
      { url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800", caption: "Activități sportive" },
      { url: "https://images.unsplash.com/photo-1541818817-48f070940520?w=800", caption: "Absolvire" }
    ],
    ranks: [],
    description:
      "Colegiul Național Militar „Tudor Vladimirescu” continuă tradiția învățământului militar din Craiova, formând elevi pentru cariera de ofițer în Armata României.",
    mission:
      "Instituția pune accent pe educație academică de nivel înalt, pregătire militară și dezvoltarea caracterului, într-un mediu bazat pe disciplină și leadership.",
    values: ["Onoare", "Disciplină", "Curaj", "Loialitate", "Excelență"],
    history: "Reînființat în 2016, CNMTV își continuă misiunea de a pregăti elevi dedicați excelenței academice și spiritului militar.",
  },
  {
    slug: "cnmdc",
    name: "Colegiul National Militar Dimitrie Cantemir",
    shortName: "CNMDC",
    city: "Breaza, Prahova",
    motto: "Un colegiu pentru viitorul tău!",
    type: "colegiu",
    colors: {
      primary: "#7f1d1d",
      secondary: "#dc2626",
      primaryHsl: "0 70% 26%",
      secondaryHsl: "0 89% 58%",
    },
    insignia: cnmdcInsignia,
    coverImage: cnmdcCover, 
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1590005354167-fabf701c9cdd?w=800", caption: "Clădirea Comandamentului" },
      { url: "https://images.unsplash.com/photo-1577896851605-df807353aaa7?w=800", caption: "Instrucție de front" },
      { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800", caption: "Biblioteca colegiului" }
    ],
    ranks: [],
    description: "Colegiul Național Militar „Dimitrie Cantemir” este una dintre cele mai cunoscute instituții de învățământ militar liceal din România, cu o tradiție de peste 100 de ani.",
    mission:
      "Instituția îmbină pregătirea academică modernă cu rigorile mediului militar, oferind elevilor un cadru competitiv și orientat spre performanță.",
    values: ["Responsabilitate", "Respect", "Leadership", "Performanță", "Spirit de echipă"],
    history: "Fondat în 1912, CNMDC continuă să formeze generații de elevi pregătiți pentru disciplina și excelența serviciului militar.",
  },
  {
    slug: "aft",
    name: "Academia Fortelor Terestre Nicolae Balcescu",
    shortName: "AFT",
    city: "Sibiu",
    motto: "Patrie, Onoare, Datorie",
    type: "academie",
    colors: {
      primary: "#1a472a",
      secondary: "#22c55e",
      primaryHsl: "145 50% 19%",
      secondaryHsl: "142 71% 45%",
    },
    insignia: aftInsignia,
    coverImage: aftCover,
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1542256844-31f0eb62039a?w=800", caption: "Poligon de instruție" },
      { url: "https://images.unsplash.com/photo-1625723044792-44de168af96e?w=800", caption: "Tehnică militară" },
      { url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800", caption: "Cursuri strategie" }
    ],
    ranks: [],
    faculties: [
      {
        name: "Facultatea de Management Militar",
        description: "Formează ofițeri pentru conducerea unităților de luptă",
        specializations: ["Infanterie", "Blindate", "Artilerie", "Geniu"],
      },
      {
        name: "Facultatea de Științe Militare",
        description: "Pregătire academică și cercetare în domeniul militar",
        specializations: ["Strategie", "Tactică", "Logistică"],
      },
    ],
    departments: [
      {
        name: "Departamentul de Tactică și Strategie",
        description: "Studiul artei militare moderne",
      },
      {
        name: "Departamentul de Limbi Străine",
        description: "Pregătire lingvistică pentru misiuni internaționale",
      },
    ],
    description:
      "Academia Forțelor Terestre „Nicolae Bălcescu” este continuatoarea primei școli militare de ofițeri din România și pregătește viitori ofițeri pentru Forțele Terestre.",
    mission:
      "Academia pregătește viitori ofițeri pentru armele și specialitățile Forțelor Terestre, combinând educația academică, instruirea militară și dezvoltarea abilităților de comandă.",
    values: ["Patrie", "Onoare", "Datorie", "Leadership", "Profesionalism"],
    history: "Fondată în 1847, Academia Fortelor Terestre continuă tradiția formării liderilor militari pentru România.",
  },
  {
    slug: "atm",
    name: "Academia Tehnica Militara Ferdinand I",
    shortName: "ATM",
    city: "București",
    motto: "Traditio, Scientia, Virtus",
    type: "academie",
    colors: {
      primary: "#5a5a5a",
      secondary: "#c0c0c0",
      primaryHsl: "0 0% 35%",
      secondaryHsl: "0 0% 75%",
    },
    insignia: atmInsignia,
    coverImage: atmCover,
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1581093458791-9f302e683800?w=800", caption: "Laborator Robotic─â" },
      { url: "https://images.unsplash.com/photo-1504384308090-c54be3852f33?w=800", caption: "Inginerie IT" },
      { url: "https://images.unsplash.com/photo-1531297461136-82lw9b6291a8?w=800", caption: "Cercetare Avansat─â" }
    ],
    ranks: [],
    faculties: [
      {
        name: "Facultatea de Sisteme Electronice si Informatice Militare",
        description: "Inginerie electronica, IT si sisteme de comunicatii",
        specializations: ["Informatica", "Electronica", "Comunicatii", "Radar"],
      },
      {
        name: "Facultatea de Mecatronica si Sisteme Integrate de Armament",
        description: "Sisteme de armament si tehnologii mecanice",
        specializations: ["Mecatronica", "Armament", "Rachete", "Munitii"],
      },
      {
        name: "Facultatea de Stiinte si Tehnologii Militare Avansate",
        description: "Cercetare si dezvoltare in tehnologii de aparare",
        specializations: ["Materiale speciale", "CBRN", "Geodezie"],
      },
    ],
    departments: [
      {
        name: "Departamentul de Informatica Aplicata",
        description: "Dezvoltare software pentru sisteme militare",
      },
      {
        name: "Departamentul de Electronica si Telecomunicatii",
        description: "Sisteme de comunicatii si supraveghere",
      },
    ],
    description:
      "Academia Tehnică Militară „Ferdinand I” formează specialiști și ofițeri ingineri pentru structurile de apărare, securitate și tehnologie ale României.",
    mission:
      "Instituția este recunoscută pentru programele sale de inginerie și cercetare, pregătind studenți în domenii moderne precum securitate cibernetică, sisteme electronice, comunicații și tehnică militară avansată.",
    values: ["Inovație", "Precizie", "Profesionalism", "Responsabilitate", "Excelență tehnică"],
    history: "Fondata in 1949, Academia Tehnica Militara poarta numele Regelui Ferdinand I. A format generatii de ingineri care au modernizat armata romana.",
  },
];

export const getInstitutionBySlug = (slug: string): Institution | undefined => {
  return institutions.find((i) => i.slug === slug);
};

export const getAllTypes = (): InstitutionType[] => {
  return [...new Set(institutions.map((inst) => inst.type))];
};

export const institutionTypeLabels: Record<InstitutionType, string> = {
  colegiu: "Colegiu Militar",
  academie: "Academie Militara",
  baza: "Baza Militara",
  centru: "Centru de Instructie",
  other: "Alta Institutie",
};
