# Dental Lab App - Ghid de Instalare & Administrare

Acesta este ghidul oficial pentru instalarea aplicației de management B2B pentru laboratoare de tehnică dentară, folosind stiva tehnologică modernă (Next.js 14 + Supabase).

## 🚀 Funcționalități Cheie

- **Portal B2B Medic & Laborator**: Două interfețe separate bazate pe roluri, unde medicii pot crea comenzi de lucrări dentare (inclusiv selecție dinți și adăugare de poze/fișiere STL), iar laboratoarele le pot gestiona și prețui.
- **Sincronizare Live (Realtime)**: Paginile de comenzi se actualizează automat (auto-refresh) pe toate PC-urile din laborator de îndată ce un medic plasează o comandă nouă. Nu mai este nevoie de "F5".
- **Notificări Web Push pe iOS & Desktop**: Sistem de alerte ultra-securizat pentru a primi o notificare instantă la comenzi noi (funcționează direct pe iPhone 15+ dacă aplicația e salvată pe *Home Screen*). Când primești o comandă, PC-ul va emite și un sunet de alarmă pentru o vizibilitate sporită.
- **Fișă de Laborator Generată Automat (PDF)**: Cu un singur click poți printa o fișă PDF completată automat, cu font profesional (Times New Roman Bold), în care "X"-ul se va plasa fix în căsuța de Zirconiu/Aur/CrCo corespunzătoare. Materialele lipsă din grila fixă vor fi scrise automat ca text.
- **Design Premium**: Aspect modern de tip SaaS, scalabil și prietenos pe mobil (PWA).
- **Atașamente Securizate**: Fișierele 3D (STL/OBJ) și pozele pacienților sunt salvate într-un mediu complet izolat cu RLS.

## 1. Setup Bază de Date (Supabase)

1. Creați un proiect nou în [Supabase](https://supabase.com).
2. Intrați în panoul **SQL Editor** din Supabase.
3. Copiați întregul cod din fișierul `supabase/schema.sql` și rulați-l (Run). Acesta va crea toate tabelele necesare (`profiles`, `orders`, `notifications`, `push_subscriptions` etc) alături de cele mai sigure reguli de tip RLS (Row Level Security) și funcții RPC.

## 2. Crearea Sistemului de Fișiere (Storage)

Pentru a permite medicilor și laboratorului să încarce fotografii sau scanări 3D (STL, OBJ):
1. Navigați la sectiunea **Storage** din Supabase.
2. Creați un nou Bucket denumit **EXACT** așa: `order-files`.
3. Bifați opțiunea ca Bucket-ul să fie **Privat** (debifați `Public`).
*(Politicile de acces au fost deja create prin `schema.sql` astfel încât medicul X să nu poată descărca fișierele atașate la pacientul medicului Y).*

## 3. Deployment & Variabile de Mediu (Vercel)

1. Faceți un cont nou pe [Vercel](https://vercel.com/) și importați acest Repository (din contul dvs. GitHub).
2. La pasul de configurare environment vă recomandăm să creați un fișier de tip "Environment Variables". Introduceți câmpurile:
   - `NEXT_PUBLIC_SUPABASE_URL` -> *(luat din Supabase -> Project Settings -> API)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> *(luat din Supabase -> Project Settings -> API)*
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` -> *(cheia ta publică generată pentru Push Notifications)*
   - `VAPID_PRIVATE_KEY` -> *(cheia ta secretă pentru Web Push)*
   - `NEXT_PUBLIC_LAB_NAME` -> *(opțional - doar dacă aplicația a fost convertită să-ți reflecte propriul brand dinamic)*
3. Apăsați **Deploy**.

## 4. Bootstrapping (Cum devin Primul Administrator)

Inițial, baza de date tratează toți utilizatorii care își fac cont la fel (Medic). Pentru a deveni Stăpân pe Laborator (rol de `admin`):
1. Caută link-ul proaspăt generat de Vercel.
2. Intră pe pagina de Register (`[url-ul-tau]/register`) și creează-ți propriul cont cu adresa ta de email și o parolă.
3. Întoarce-te în Supabase, în secțiunea **SQL Editor** și generează un Query cu următorul text, înlocuind cu adresa ta de email cu care tocmai te-ai înregistrat:

```sql
UPDATE public.profiles 
SET rol = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'adresa.ta@laboratortau.ro');
```

4. Apasă **Run**. 
5. Dă Refresh paginii web! Acum vei avea acces direct în portalul de _Admin_ cu putere absolută peste setarea prețurilor, vizualizarea pacienților din tot sistemul și emiterea avizelor!

## 5. Fișă de Laborator (Printare)

Aplicația generează automat o "Fișă de Laborator" curată pentru fiecare comandă. Pentru a o tipări:
1. Accesați comanda respectivă din Dashboard-ul de Admin.
2. Apăsați butonul **Fișă de Laborator / Tipărire** din colțul dreapta-sus.
3. Se va deschide documentul PDF pre-completat, centrat și ajustat profesional, direct pregătit pentru tipărire (format A4 Portrait).

---
*Pentru orice ajustare suplimentară sau integrare cu alte servicii cloud, se pot configura API routes în `src/app/api/`.*
