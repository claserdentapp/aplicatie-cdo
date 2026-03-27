# Documentația Oficială a Platformei CDO Lab (Gestiune B2B Laborator Dentar)

Acest document este **Cartea Tehnică (Manualul Arhitectural)** al aplicației. Este scris pentru a detalia modul în care a fost gândit sistemul cap-coadă, astfel încât pe viitor orice alt dezvoltator, auditor tehnic sau administrator să înțeleagă instant structura aplicației.

---

## 🚀 1. Stiva Tehnologică (Tech Stack)

Aplicația este o soluție Full-Stack modernă, proiectată pentru viteză extremă, securitate și rulare în mediu „Serverless”:
*   **Vercel / Next.js 14 (App Router):** Reprezintă motorul principal de față al aplicației. Oferă componente de *Server-Side Rendering* (SSR) pentru a citi în siguranță baza de date înainte ca pagina să ajungă la client, sporind exponențial siguranța datelor.
*   **React + Tailwind CSS + Shadcn/UI:** Stiva grafică superioară. Toate diagramele, butoanele și tabelele folosesc tema medicală, cu accent pus pe o variantă impecabilă pe Desktop și Mobil, plus suport extins pentru Print (Generare PDF pentru Avize).
*   **Supabase (Bază de date PostgreSQL):** Găzduiește toate statele aplicației, de la Parolele Userilor la fișierele .STL 3D sau Poze. Are „*Row Level Security (RLS)*” pus la baza sa, cea mai avansată protecție izolatoare din piață disponibilă astăzi.

---

## 🗄️ 2. Arhitectura Bazei de Date (Schema)

În backend (Supabase), sistemul stochează 6 piloni principali (Tabele) pe care este așezată toată aplicația. Securitatea RLS garantează că **un Medic poate interoga (vezi `SELECT`) doar informații unde ID-ul său se regăsește pe acel rând**, exceptând Adminul:

1.  **`profiles`**: Creată automat când un om își ridică cont pe aplicație („Register”). Memorează: 
    *   `id` (Unic pentru ficare persoană)
    *   `nume_doctor`, `nume_clinica`, `telefon`
    *   `rol`: Poate fi `'medic'` sau `'admin'`.
2.  **`orders`**: Inima platformei. Este comanda propriu-zisă generată de un Medic.
    *   Stochează: Nume Pacient, Tip Lucrare, Status, Preț (adăugat doar de admin), Urgență, Culoare VITA, Dată intrare/livrare și Instrucțiunile speciale ale medicului.
3.  **`order_files`**: Registrul fișierelor medicale trimise (Poze/Radiologii sau Scanari voluminoase 3D de tip STL/OBJ). Se leagă mereu de o Comandă (`order_id`) și indică URL-ul privat pe sistemul de **Supabase Storage (Bucket: order-files)**.
4.  **`order_status_history`**: Se populează automat printr-un *Trăgaci* (Trigger) SQL de fiecare dată când Adminul schimbă statusul unei comenzi dintr-un rând în altul (ex: Nou -> Sinterizare). Folosită pentru tabloul „Timeline-Istoric”.
5.  **`comments`**: Mesageria integrată - discuțiile live purtate direct în interiorul paginii de comandă.
6.  **`notifications`**: Panoul de Notificări pentru Medic. Se încarcă tot automat, cu mesaje instante la fiecare schimbare de Status dictată de la Laborator către Clinică.

---

## ⚙️ 3. Structura pe Rute a Aplicației Front-End

Codul de Interfață conține 2 "Dashboards" principale care sunt perfect separate de un *Middleware de Securitate* (`middleware.ts`). O entitate nepotrivită încercând să intre pe o adresă greșită va primi Reject automat (redirect către login).

### 🖥️ Dashboard-ul de Admin (`/admin/...`)
Laboratorul este singurul ce primește acces spre acest hub:
*   `/admin`: Tabelul gigantic KanBan (Aici Adminul vede Status-ul "În Lucru" vs "Gata", Panouri de Analytics Financiar și setul de comenzi din toată rețeaua).
*   `/admin/comenzi/[id]`: Pagina de Analiză a unui Caz. De aici, Adminul pune **Costul (Prețul)** total prin componenta `PriceEditor` și schimbă traseul protetic (`StatusEditor`). Aceste 2 acțiuni sunt absolut zăvorâte pentru oricine altcineva.
*   `/admin/comenzi/[id]/aviz`: Avizul Printabil – Pagina ce trage automat datele financiare și detaliile comenzii luând prețul pe care l-a plasat Adminul pentru a exporta documentul sub formă de Factură fizică/digitală către Medic.
*   `/admin/medici`: **Agenda Partenerilor**. Modul creat ca Adminul să vizualizeze într-un Tabel curat toate conturile de medici activate (nume, număr de telefon, denumirea clinicii lor).

### 🥼 Dashboard-ul de Medic (`/medic/...`)
Spațiul perfect ordonat al Doctorului:
*   `/medic`: Aici doctorul vede doar lucrările sale, despărțite frumos prin "Tab-uri" ca să știe precis la ce caz e de lucru. Coloana *Cost* dezvăluie imediat suma aplicată de Laborator la plată.
*   `/medic/comanda-noua`: Platforma simplă de Adăugat Pacient Nou. Interfață complexă cu *Teeth Picker* (Diagramă Dentară) și Box de "Drag&Drop" pentru fișiere Scan STL de capacități masive care merg fix în „Seif-ul” (Supabase Storage).
*   `/medic/notificari`: Pagina tip Inbox în care primește alarme referitoare la orice modificări de traseu executate de Laborator (`notifications-badge`).

---

## 🔒 4. Funcția White-Label & Cum Funcționează Bootstrapping-ul

Proiectul a fost regândit la nivel macro (**SaaS White-Label**). Nu mai conține inserții textuale hardcodate „CDO Lab”. Titlurile, Avizele de plată și Meniurile iau numele inteligent de la variabila `.env` (Numele aplicației setat la instalarea pe Server):

```env
NEXT_PUBLIC_LAB_NAME="Numele Tău Aici SRL"
```

Asta înseamnă că produsul de cod poate deservi oricâte laboratoare independente dentare doriți să îi mai afiliați, rulând identic pentru toți în mod propriu. Primul cont creat este considerat prin definiție mereu *Medic*, setarea Liderului Global de aplicație dictându-se prin executarea comenzii SQL Supreme în propriul Supabase odată cu trecerea pe mediul Live de lansare.

---
**Status Actual (Produs):** Gata pentru Producție / 100% Capacitate Operațională.
