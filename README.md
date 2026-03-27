# Dental Lab App - Ghid de Instalare & Administrare

Acesta este ghidul oficial pentru instalarea aplicației de management B2B pentru laboratoare de tehnică dentară, folosind stiva tehnologică modernă (Next.js 14 + Supabase).

## 1. Setup Bază de Date (Supabase)

1. Creați un proiect nou în [Supabase](https://supabase.com).
2. Intrați în panoul **SQL Editor** din Supabase.
3. Copiați întregul cod din fișierul `supabase/schema.sql` (inclus în repository) și rulați-l (Run). Acesta va crea toate tabelele necesare (`profiles`, `orders`, `notifications` etc) alături de cele mai sigure reguli de tip RLS (Row Level Security).

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

---
*Pentru orice ajustare suplimentară sau integrare cu alte servicii cloud, se pot configura API routes în `src/app/api/`.*
