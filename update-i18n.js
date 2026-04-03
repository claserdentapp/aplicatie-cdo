const fs = require('fs');

const dictionaries = {
  ro: {
    Auth: {
      accountType: "Tip Cont",
      medic: "Medic Dentar",
      lab: "Laborator Partener",
      doctorName: "Nume doctor",
      repName: "Nume reprezentant / tehnician",
      clinicName: "Nume clinică",
      labName: "Nume Laborator",
      phone: "Telefon",
      email: "Email",
      password: "Parolă",
      creating: "Se creează...",
      createBtn: "Creează cont",
      successReg: "Cont creat. Verifică email-ul pentru confirmare, apoi autentifică-te.",
      loginBtn: "Autentificare",
      loggingIn: "Se autentifică...",
      rememberMe: "Păstrează-mă conectat direct în platformă",
      welcomeBack: "Bine ai revenit",
      continueAs: "Continuă ca",
      switchAccount: "Schimbă Contul"
    },
    Order: {
      patientName: "Nume pacient",
      workType: "Tip lucrare",
      workTypePlaceholder: "Ex: Coroană, fațetă, punte, inlay/onlay...",
      material: "Material",
      materialPlaceholder: "Selectează material",
      color: "Culoare VITA",
      colorPlaceholder: "Ex: A1, A2, B1...",
      elementsCount: "Numărul de elemente din lucrare",
      elementsPlaceholder: "Ex: 5",
      dueDate: "Data livrare estimată",
      urgent: "Urgență",
      teethDiagram: "Diagramă dentară (FDI)",
      instructions: "Instrucțiuni specifice",
      instructionsPlaceholder: "Margini, contact proximal, ocluzie, cimentare, preferințe...",
      files: "Fișiere (STL/OBJ/fotografii)",
      dragFiles: "Trage fișiere aici sau selectează din calculator.",
      remove: "elimină",
      sending: "Se trimite...",
      sendBtn: "Trimite comanda",
      success: "Comandă trimisă cu succes."
    }
  },
  en: {
    Auth: {
      accountType: "Account Type",
      medic: "Dentist",
      lab: "Partner Lab",
      doctorName: "Doctor name",
      repName: "Representative / Technician name",
      clinicName: "Clinic name",
      labName: "Lab Name",
      phone: "Phone",
      email: "Email",
      password: "Password",
      creating: "Creating...",
      createBtn: "Sign up",
      successReg: "Account created. Check your email for confirmation, then log in.",
      loginBtn: "Log in",
      loggingIn: "Logging in...",
      rememberMe: "Keep me straight logged into the platform",
      welcomeBack: "Welcome back",
      continueAs: "Continue as",
      switchAccount: "Switch Account"
    },
    Order: {
      patientName: "Patient name",
      workType: "Work type",
      workTypePlaceholder: "Ex: Crown, veneer, bridge, inlay/onlay...",
      material: "Material",
      materialPlaceholder: "Select material",
      color: "VITA Color",
      colorPlaceholder: "Ex: A1, A2, B1...",
      elementsCount: "Number of elements in the work",
      elementsPlaceholder: "Ex: 5",
      dueDate: "Estimated delivery date",
      urgent: "Urgent",
      teethDiagram: "Dental diagram (FDI)",
      instructions: "Specific instructions",
      instructionsPlaceholder: "Margins, proximal contact, occlusion, cementation, preferences...",
      files: "Files (STL/OBJ/photos)",
      dragFiles: "Drag files here or select from computer.",
      remove: "remove",
      sending: "Sending...",
      sendBtn: "Submit order",
      success: "Order submitted successfully."
    }
  },
  de: {
    Auth: {
      accountType: "Kontotyp",
      medic: "Zahnarzt",
      lab: "Partnerlabor",
      doctorName: "Name des Arztes",
      repName: "Name des Vertreters / Technikers",
      clinicName: "Klinikname",
      labName: "Laborname",
      phone: "Telefon",
      email: "E-Mail",
      password: "Passwort",
      creating: "Wird erstellt...",
      createBtn: "Registrieren",
      successReg: "Konto erstellt. Überprüfen Sie Ihre E-Mail zur Bestätigung und melden Sie sich dann an.",
      loginBtn: "Anmelden",
      loggingIn: "Wird angemeldet...",
      rememberMe: "Halte mich direkt auf der Plattform eingeloggt",
      welcomeBack: "Willkommen zurück",
      continueAs: "Fortfahren als",
      switchAccount: "Konto wechseln"
    },
    Order: {
      patientName: "Patientenname",
      workType: "Arbeitstyp",
      workTypePlaceholder: "Bsp: Krone, Veneer, Brücke, Inlay/Onlay...",
      material: "Material",
      materialPlaceholder: "Material auswählen",
      color: "VITA Farbe",
      colorPlaceholder: "Bsp: A1, A2, B1...",
      elementsCount: "Anzahl der Elemente in der Arbeit",
      elementsPlaceholder: "Bsp: 5",
      dueDate: "Voraussichtliches Lieferdatum",
      urgent: "Dringend",
      teethDiagram: "Zahnschema (FDI)",
      instructions: "Spezifische Anweisungen",
      instructionsPlaceholder: "Ränder, Approximalkontakt, Okklusion, Zementierung, Präferenzen...",
      files: "Dateien (STL/OBJ/Fotos)",
      dragFiles: "Dateien hier ablegen oder vom Computer auswählen.",
      remove: "entfernen",
      sending: "Wird gesendet...",
      sendBtn: "Bestellung aufgeben",
      success: "Bestellung erfolgreich übermittelt."
    }
  }
};

['ro', 'en', 'de'].forEach(lang => {
  const path = `./messages/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.Auth = dictionaries[lang].Auth;
  data.Order = dictionaries[lang].Order;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
