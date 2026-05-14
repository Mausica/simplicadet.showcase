export interface Specialization {
  academie: string;
  specializare: string;
  locuri: number;
  ultimaMedie: number;
  grupaMedicala?: string;
  observatie?: string;
}

export const specializari: Specialization[] = [
  // Academia Fortelor Terestre "Nicolae Balcescu" - Sibiu
  { academie: "AFT Sibiu", specializare: "Infanterie", locuri: 65, ultimaMedie: 6.49 },
  { academie: "AFT Sibiu", specializare: "Vânători de munte", locuri: 15, ultimaMedie: 7.62 },
  { academie: "AFT Sibiu", specializare: "Cercetare", locuri: 55, ultimaMedie: 8.49 },
  { academie: "AFT Sibiu", specializare: "Parașutiști", locuri: 10, ultimaMedie: 6.00, grupaMedicala: "2B", observatie: "Parașutiști - anul trecut nu s-au scos locuri, 6.00 este nota minimă" },
  { academie: "AFT Sibiu", specializare: "Artilerie și rachete", locuri: 42, ultimaMedie: 6.60 },
  { academie: "AFT Sibiu", specializare: "Tancuri", locuri: 21, ultimaMedie: 6.65 },
  { academie: "AFT Sibiu", specializare: "Auto", locuri: 19, ultimaMedie: 7.14 },
  { academie: "AFT Sibiu", specializare: "Geniu", locuri: 28, ultimaMedie: 7.57 },
  { academie: "AFT Sibiu", specializare: "Apărare CBRN", locuri: 9, ultimaMedie: 7.24 },
  { academie: "AFT Sibiu", specializare: "Comunicații", locuri: 40, ultimaMedie: 8.51 },
  { academie: "AFT Sibiu", specializare: "Finanțe-contabilitate", locuri: 8, ultimaMedie: 8.48 },
  { academie: "AFT Sibiu", specializare: "Intendență", locuri: 9, ultimaMedie: 7.69 },
  { academie: "AFT Sibiu", specializare: "Poliție militară", locuri: 27, ultimaMedie: 7.66 },

  // Academia Tehnica Militara "Ferdinand I" - Bucuresti
  { academie: "ATM București", specializare: "Blindate, automobile și tractoare", locuri: 12, ultimaMedie: 9.41 },
  { academie: "ATM București", specializare: "Echipamente și sisteme de comandă și control pentru autovehicule", locuri: 3, ultimaMedie: 9.73 },
  { academie: "ATM București", specializare: "Muniții, rachete, explozivi și pulberi", locuri: 6, ultimaMedie: 8.79 },
  { academie: "ATM București", specializare: "Armament, aparatură artileristică și sisteme de conducere a focului", locuri: 6, ultimaMedie: 8.84 },
  { academie: "ATM București", specializare: "Materiale energetice și apărare CBRN", locuri: 6, ultimaMedie: 9.40 },
  { academie: "ATM București", specializare: "Sisteme pentru baraje de mine, distrugeri și mascare", locuri: 3, ultimaMedie: 8.89 },
  { academie: "ATM București", specializare: "Radioelectronică de aviație", locuri: 4, ultimaMedie: 9.75 },
  { academie: "ATM București", specializare: "Topogeodezie", locuri: 6, ultimaMedie: 9.64 },
  { academie: "ATM București", specializare: "Comunicații pentru apărare și securitate", locuri: 13, ultimaMedie: 9.77 },
  { academie: "ATM București", specializare: "Construcții și fortificații", locuri: 5, ultimaMedie: 9.76 },
  { academie: "ATM București", specializare: "Echipamente și instalații de aviație", locuri: 5, ultimaMedie: 9.81 },
  { academie: "ATM București", specializare: "Aeronave și motoare de aviație", locuri: 6, ultimaMedie: 9.71 },
  { academie: "ATM București", specializare: "Calculatoare", locuri: 15, ultimaMedie: 9.89 },

  // Academia Fortelor Aeriene "Henri Coanda" - Brasov
  { academie: "AFA Brașov", specializare: "Aviație piloți", locuri: 27, ultimaMedie: 9.10, grupaMedicala: "1A (avion) / 2A (elicopter)" },
  { academie: "AFA Brașov", specializare: "Aviație nenaviganți", locuri: 12, ultimaMedie: 9.18, grupaMedicala: "4C (ofițer stat major) / 4A (controlor trafic)", observatie: "Aviație nenaviganți include 1 loc pentru Controlor trafic aerian (ultima medie CTA: 9.37)" },
  { academie: "AFA Brașov", specializare: "Informații militare", locuri: 20, ultimaMedie: 8.84, grupaMedicala: "4A" },
  { academie: "AFA Brașov", specializare: "Meteo", locuri: 0, ultimaMedie: 9.23, grupaMedicala: "4B", observatie: "Meteo - anul acesta nu s-au scos locuri (poate apărea anul viitor)" },
  { academie: "AFA Brașov", specializare: "Rachete și artilerie antiaeriană", locuri: 51, ultimaMedie: 7.82, grupaMedicala: "4C" },
  { academie: "AFA Brașov", specializare: "Radiolocație", locuri: 21, ultimaMedie: 8.21, grupaMedicala: "4C" },
  { academie: "AFA Brașov", specializare: "Război electronic", locuri: 21, ultimaMedie: 8.86, grupaMedicala: "4C" },

  // Academia Navala "Mircea cel Batran" - Constanta
  { academie: "AN Constanța", specializare: "Navigație, hidrografie și echipamente navale", locuri: 23, ultimaMedie: 8.73 },
  { academie: "AN Constanța", specializare: "Navigation, Hydrography and Naval Equipment (lb. engleză)", locuri: 15, ultimaMedie: 8.83 },
  { academie: "AN Constanța", specializare: "Electromecanică navală", locuri: 11, ultimaMedie: 7.85 },
  { academie: "AN Constanța", specializare: "Electromecanică", locuri: 7, ultimaMedie: 8.03 },
  { academie: "AN Constanța", specializare: "Inginerie și management naval și portuar", locuri: 8, ultimaMedie: 8.30 },

  // Universitatea Nationala de Aparare "Carol I" - Bucuresti
  { academie: "UNAp București", specializare: "Intendență", locuri: 26, ultimaMedie: 6.00, observatie: "UNAp Intendență - anul trecut nu s-au scos locuri, 6.00 este nota minimă" }
];
