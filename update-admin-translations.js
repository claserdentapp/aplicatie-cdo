const fs = require('fs');
const path = require('path');

const locales = ['ro', 'en', 'de'];
const messagesDir = path.join(__dirname, 'messages');

const newTranslations = {
  Admin: {
    ro: {
      "dashboardTitle": "Dashboard Laborator",
      "ordersTitle": "Comenzi",
      "ordersDesc": "Tabel centralizat cu filtre. Poți schimba statusul și seta prețul.",
      "tabInProgress": "În Lucru (De procesat)",
      "tabDone": "Gata (Finalizate / Livrate)",
      "tabAll": "Istoric Complet",
      "searchLabel": "Căutare",
      "searchPlaceholder": "pacient, lucrare, material, doctor...",
      "doctorLabel": "Doctor",
      "all": "Toți",
      "statusLabel": "Status",
      "billingLabel": "Facturare",
      "billed": "Facturate",
      "unbilled": "Nefacturate",
      "urgentLabel": "Urgență:",
      "yes": "Da",
      "no": "Nu",
      "resultsCount": "{count} rezultate",
      "thDoctor": "Doctor",
      "thPatient": "Pacient",
      "thWork": "Lucrare",
      "thStatus": "Status",
      "thPrice": "Preț",
      "thUrgent": "Urgență",
      "thDelivery": "Livrare",
      "noOrdersFound": "Nicio comandă găsită.",
      "unbilledText": "Nefacturat",
      "orderDetailsTitle": "Detalii comandă",
      "viewTicket": "Vizualizare Aviz / Tipărire",
      "doctorOrClinic": "Doctor / Clinică",
      "deliveryCalendar": "Calendar Livrare",
      "entryDate": "Intrare:",
      "estDeadline": "Termen estimat:",
      "labCost": "Cost estimat de laborator:",
      "changeBtn": "Modifică",
      "techInstructions": "Instrucțiuni Tehnice",
      "backToOrders": "Înapoi la Comenzi",
      "workflowStatus": "Status workflow"
    },
    en: {
      "dashboardTitle": "Laboratory Dashboard",
      "ordersTitle": "Orders",
      "ordersDesc": "Centralized table with filters. You can change the status and set the price.",
      "tabInProgress": "In Progress (To Process)",
      "tabDone": "Done (Completed / Delivered)",
      "tabAll": "Complete History",
      "searchLabel": "Search",
      "searchPlaceholder": "patient, work, material, doctor...",
      "doctorLabel": "Doctor",
      "all": "All",
      "statusLabel": "Status",
      "billingLabel": "Billing",
      "billed": "Billed",
      "unbilled": "Unbilled",
      "urgentLabel": "Urgent:",
      "yes": "Yes",
      "no": "No",
      "resultsCount": "{count} results",
      "thDoctor": "Doctor",
      "thPatient": "Patient",
      "thWork": "Work",
      "thStatus": "Status",
      "thPrice": "Price",
      "thUrgent": "Urgent",
      "thDelivery": "Delivery",
      "noOrdersFound": "No orders found.",
      "unbilledText": "Unbilled",
      "orderDetailsTitle": "Order Details",
      "viewTicket": "View Ticket / Print",
      "doctorOrClinic": "Doctor / Clinic",
      "deliveryCalendar": "Delivery Calendar",
      "entryDate": "Entry:",
      "estDeadline": "Est. Deadline:",
      "labCost": "Estimated lab cost:",
      "changeBtn": "Modify",
      "techInstructions": "Technical Instructions",
      "backToOrders": "Back to Orders",
      "workflowStatus": "Workflow Status"
    },
    de: {
      "dashboardTitle": "Labor-Dashboard",
      "ordersTitle": "Aufträge",
      "ordersDesc": "Zentrale Tabelle mit Filtern. Sie können den Status ändern und den Preis festlegen.",
      "tabInProgress": "In Bearbeitung (Zu verarbeiten)",
      "tabDone": "Erledigt (Abgeschlossen / Geliefert)",
      "tabAll": "Vollständiger Verlauf",
      "searchLabel": "Suche",
      "searchPlaceholder": "Patient, Arbeit, Material, Arzt...",
      "doctorLabel": "Arzt",
      "all": "Alle",
      "statusLabel": "Status",
      "billingLabel": "Abrechnung",
      "billed": "Abgerechnet",
      "unbilled": "Nicht abgerechnet",
      "urgentLabel": "Dringend:",
      "yes": "Ja",
      "no": "Nein",
      "resultsCount": "{count} Ergebnisse",
      "thDoctor": "Arzt",
      "thPatient": "Patient",
      "thWork": "Arbeit",
      "thStatus": "Status",
      "thPrice": "Preis",
      "thUrgent": "Dringend",
      "thDelivery": "Lieferung",
      "noOrdersFound": "Keine Aufträge gefunden.",
      "unbilledText": "Nicht abgerechnet",
      "orderDetailsTitle": "Auftragsdetails",
      "viewTicket": "Ticket ansehen / Drucken",
      "doctorOrClinic": "Arzt / Klinik",
      "deliveryCalendar": "Lieferkalender",
      "entryDate": "Eingang:",
      "estDeadline": "Geschätzte Frist:",
      "labCost": "Geschätzte Laborkosten:",
      "changeBtn": "Ändern",
      "techInstructions": "Technische Anweisungen",
      "backToOrders": "Zurück zu Aufträgen",
      "workflowStatus": "Workflow-Status"
    }
  }
};

locales.forEach(loc => {
  const filePath = path.join(messagesDir, `${loc}.json`);
  let data = {};
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  
  if (!data.Admin) {
    data.Admin = {};
  }
  
  data.Admin = { ...data.Admin, ...newTranslations.Admin[loc] };
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${loc}.json`);
});
