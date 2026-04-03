const fs = require('fs');

const dictionaries = {
  ro: {
    titleRegister: "Creare cont",
    descRegister: "Cont nou pentru medic (clinică).",
    alreadyHaveAccount: "Ai deja cont?",
    titleLogin: "Autentificare",
    descLogin: "Accesează portalul laboratorului dentar.",
    noAccount: "Nu ai cont?",
    forgotPasswordQ: "Ai uitat parola?",
    forgotPasswordLink: "Recuperează aici",
    registerLink: "Creează cont"
  },
  en: {
    titleRegister: "Create account",
    descRegister: "New account for dentist.",
    alreadyHaveAccount: "Already have an account?",
    titleLogin: "Log in",
    descLogin: "Access the dental lab portal.",
    noAccount: "Don't have an account?",
    forgotPasswordQ: "Forgot password?",
    forgotPasswordLink: "Recover here",
    registerLink: "Sign up"
  },
  de: {
    titleRegister: "Konto erstellen",
    descRegister: "Neues Konto für Zahnärzte.",
    alreadyHaveAccount: "Haben Sie bereits ein Konto?",
    titleLogin: "Einloggen",
    descLogin: "Greifen Sie auf das Dentallabor-Portal zu.",
    noAccount: "Kein Konto?",
    forgotPasswordQ: "Passwort vergessen?",
    forgotPasswordLink: "Hier wiederherstellen",
    registerLink: "Registrieren"
  }
};

['ro', 'en', 'de'].forEach(lang => {
  const path = `./messages/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.Auth = { ...data.Auth, ...dictionaries[lang] };
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
