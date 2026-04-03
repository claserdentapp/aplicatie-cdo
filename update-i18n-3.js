const fs = require('fs');

const dashboards = {
  ro: {
    medicTitle: "Portal Medic",
    medicDesc: "Comenzi în lucru și finalizate.",
    labTitle: "Portal Laborator",
    labDesc: "Comenzi primite de la medici parteneri.",
    notifications: "Notificări",
    newOrderBtn: "Comandă nouă",
    recentOrders: "Comenzi recente",
    limit50: "Primele 50 comenzi (RLS: vezi doar comenzile tale).",
    noOrders: "Nu ai comenzi încă. Apasă „Comandă nouă”.",
    tabInProgress: "În lucru",
    tabDone: "Finalizate",
    tabAll: "Istoric Complet",
    thPatient: "Pacient",
    thWork: "Lucrare",
    thMaterial: "Material",
    thStatus: "Status",
    thCost: "Cost",
    thUrgent: "Urgență",
    thDelivery: "Livrare est.",
    yes: "Da",
    no: "Nu",
    thLab: "Laborator"
  },
  en: {
    medicTitle: "Dentist Portal",
    medicDesc: "Orders in progress and completed.",
    labTitle: "Laboratory Portal",
    labDesc: "Orders received from partner dentists.",
    notifications: "Notifications",
    newOrderBtn: "New Order",
    recentOrders: "Recent Orders",
    limit50: "First 50 orders (RLS: showing your orders).",
    noOrders: "No orders yet. Click 'New Order'.",
    tabInProgress: "In Progress",
    tabDone: "Completed",
    tabAll: "Full History",
    thPatient: "Patient",
    thWork: "Work Type",
    thMaterial: "Material",
    thStatus: "Status",
    thCost: "Cost",
    thUrgent: "Urgent",
    thDelivery: "Est. Delivery",
    yes: "Yes",
    no: "No",
    thLab: "Laboratory"
  },
  de: {
    medicTitle: "Zahnarzt-Portal",
    medicDesc: "Laufende und abgeschlossene Bestellungen.",
    labTitle: "Labor-Portal",
    labDesc: "Bestellungen von Partner-Zahnärzten.",
    notifications: "Benachrichtigungen",
    newOrderBtn: "Neue Bestellung",
    recentOrders: "Aktuelle Bestellungen",
    limit50: "Erste 50 Bestellungen.",
    noOrders: "Noch keine Bestellungen. 'Neue Bestellung' klicken.",
    tabInProgress: "In Bearbeitung",
    tabDone: "Abgeschlossen",
    tabAll: "Gesamte Historie",
    thPatient: "Patient",
    thWork: "Arbeit",
    thMaterial: "Material",
    thStatus: "Status",
    thCost: "Kosten",
    thUrgent: "Dringend",
    thDelivery: "Est. Lieferung",
    yes: "Ja",
    no: "Nein",
    thLab: "Labor"
  }
};

['ro', 'en', 'de'].forEach(lang => {
  const path = `./messages/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.Dashboard = dashboards[lang];
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
