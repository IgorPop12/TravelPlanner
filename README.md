# TravelPlanner

Web aplikacija za planiranje putovanja, razvijena kao mikroservisna arhitektura na Microsoft Service Fabric platformi. Predmetni projekat iz predmeta **Primjena veb programiranja u infrastrukturnim sistemima**.

---

## Tehnologije

- **Frontend:** React 18 + Vite (JavaScript), React Router v6, Context API
- **Backend:** ASP.NET Core 8, Microsoft Service Fabric
- **Baza podataka:** Microsoft SQL Server, po jedna baza po servisu
- **Autentikacija:** JWT Bearer tokeni, BCrypt heširanje lozinki
- **ORM:** Entity Framework Core (Code First, migracije)
- **PDF generisanje:** jsPDF (frontend biblioteka)
- **QR kod:** qrcode.react

---

## Arhitektura

Sistem se sastoji od 3 mikroservisa, svaki sa svojom bazom podataka (1 servis = 1 baza):

| Servis | Port | Tip | Baza | Opis |
|---|---|---|---|---|
| UserService | 5010 | Stateless | TravelPlannerUsers | Registracija, login, upravljanje korisnicima, share tokeni |
| TravelService | 5011 | Stateful | TravelPlannerTravel | Planovi, destinacije, aktivnosti, checklist, dijeljenje |
| ExpenseService | 5012 | Stateless | TravelPlannerExpenses | Troškovi i praćenje budžeta |

Frontend direktno komunicira sa svakim servisom. Servisi međusobno komuniciraju kroz HTTP kada im zatreba podatak iz druge baze (npr. ExpenseService poziva TravelService da provjeri vlasništvo plana, UserService poziva TravelService i ExpenseService pri brisanju korisnika).

---

## Preduslovi

- Windows 10/11
- Visual Studio 2022 (workload **Azure development**, radi Service Fabric alata)
- .NET 8 SDK
- Microsoft Service Fabric SDK
- Node.js 18+
- SQL Server (lokalna instanca, podrazumijevani port 1433, SQL autentikacija)
- SQL Server Management Studio (SSMS) — opciono, korisno za provjeru podataka

---

## Pokretanje

### 1. Kloniranje repozitorijuma

```bash
git clone <repo-url>
cd TravelPlanner
```

### 2. Priprema SQL Server-a

Sve tri baze (`TravelPlannerUsers`, `TravelPlannerTravel`, `TravelPlannerExpenses`) koriste isti nalog:

```
Server: 127.0.0.1,1433
User Id: sa
Password: TravelPlanner123!
```

Baze se kreiraju automatski pri pokretanju migracija. Connection stringovi se nalaze u `appsettings.json` svakog servisa i mogu se prilagoditi svom SQL Server podešavanju.

### 3. Pokretanje lokalnog Service Fabric klastera

Klikni na Service Fabric ikonicu u system tray-u → **Start Local Cluster** (prvi put može potrajati 1-3 minuta). Provjeri da je gore na `http://localhost:19080` (Service Fabric Explorer) — treba da vidiš 1 node u stanju `Up`.

### 4. Build i deploy backend servisa

Otvori `TravelPlanner.ServiceFabric.sln` u Visual Studio-u. Deploy se radi kroz **Developer PowerShell for VS 2022** (Start meni), ne kroz običnu PowerShell konzolu:

```powershell
cd TravelPlanner\TravelPlanner.ServiceFabric
msbuild TravelPlanner.ServiceFabric.sfproj /t:Package /p:Configuration=Debug

Connect-ServiceFabricCluster

.\Scripts\Deploy-FabricApplication.ps1 `
    -ApplicationPackagePath 'pkg\Debug' `
    -PublishProfileFile 'PublishProfiles\Local.1Node.xml' `
    -ApplicationParameter @{} `
    -OverwriteBehavior Always
```

Provjeri da su svi servisi gore:

```powershell
Get-ServiceFabricApplication
Get-ServiceFabricService -ApplicationName fabric:/TravelPlanner
```

Treba da vidiš 3 servisa (UserService, TravelService, ExpenseService) sa `HealthState : Ok`.

### 5. Kreiranje admin korisnika

Registruj se normalno kroz frontend (ili preko Swagger-a na `http://localhost:5010/swagger`), pa u SSMS-u pokreni:

```sql
USE TravelPlannerUsers;
UPDATE Users SET Role = 'admin' WHERE Email = 'tvoj@email.com';
```

### 6. Pokretanje frontenda

```bash
cd travel-planner-frontend
npm install
npm run dev
```

Frontend je dostupan na `http://localhost:5173`.

### 7. Konfiguracija frontenda

Kreiraj `.env` fajl u `travel-planner-frontend/` folderu (kopiraj iz `.env.example`):

```env
VITE_API_USER_URL=http://localhost:5010
VITE_API_TRAVEL_URL=http://localhost:5011
VITE_API_EXPENSE_URL=http://localhost:5012
VITE_APP_URL=http://localhost:5173
```

### 8. Service Fabric Explorer

Dostupan na `http://localhost:19080` — pregled zdravlja svih servisa, replika i particija.

### Sledeći put kad pokrećeš (poslije restarta računara)

Lokalni klaster se **ne** pali sam poslije restarta:

1. Tray ikonica → **Start Local Cluster**, sačekaj da se digne
2. Provjeri `Get-ServiceFabricApplication` — ako je `fabric:/TravelPlanner` i dalje tu, **ne treba redeploy**, samo pokreni frontend
3. Ako aplikacija nije tu (rijetko, samo poslije potpunog reseta klastera), ponovi Korak 4

---

## Korisničke uloge

| Uloga | Opis |
|---|---|
| user | Kreira i upravlja svojim planovima, destinacijama, aktivnostima, troškovima i checklistom |
| admin | Sve što i user + pregled svih planova i korisnika, brisanje bilo kojeg plana ili korisnika |

---

## Ključne funkcionalnosti

- Registracija i login sa JWT autentikacijom, BCrypt heširanje lozinki
- CRUD upravljanje planovima putovanja, destinacijama, aktivnostima, troškovima, checklistom
- Kalendarski prikaz aktivnosti po danima (react-big-calendar)
- Automatski proračun ukupnih troškova i preostalog budžeta
- Automatsko kreiranje troška pri dodavanju aktivnosti sa procijenjenim troškom
- Dijeljenje plana putem QR koda sa dva nivoa pristupa:
  - **VIEW** — pregled bez logovanja
  - **EDIT** — izmjena sadržaja plana bez logovanja
- Kaskadno brisanje: plan → destinacije, aktivnosti, checklist; korisnik → svi njegovi planovi i troškovi
- Generisanje PDF izvještaja (jsPDF) — destinacije, aktivnosti, troškovi, checklist
- Admin panel za upravljanje korisnicima i svim planovima

---

## API endpointi

### UserService (`http://localhost:5010`)

| Metoda | Endpoint | Opis |
|---|---|---|
| POST | `/api/auth/register` | Registracija |
| POST | `/api/auth/login` | Login, vraća JWT token |
| GET | `/api/users` | Svi korisnici (admin) |
| GET | `/api/users/{id}` | Jedan korisnik |
| DELETE | `/api/users/{id}` | Brisanje korisnika (admin, kaskadno briše planove) |
| POST | `/api/shared-plans/tokens` | Generisanje share tokena |
| POST | `/api/shared-plans/validate` | Validacija share tokena |

### TravelService (`http://localhost:5011`)

| Metoda | Endpoint | Opis |
|---|---|---|
| GET | `/api/travel-plans` | Planovi korisnika |
| GET | `/api/travel-plans/all` | Svi planovi (admin) |
| POST | `/api/travel-plans` | Kreiranje plana |
| GET | `/api/travel-plans/{id}` | Detalji plana |
| PUT | `/api/travel-plans/{id}` | Izmjena plana |
| DELETE | `/api/travel-plans/{id}` | Brisanje plana |
| GET/POST/PUT/DELETE | `/api/travel-plans/{id}/destinations` | Upravljanje destinacijama |
| GET/POST/PUT/DELETE | `/api/travel-plans/{id}/activities` | Upravljanje aktivnostima |
| GET/POST | `/api/travel-plans/{id}/checklist-items` | Upravljanje checklistom |
| PATCH | `/api/travel-plans/{id}/checklist-items/{itemId}/toggle` | Toggle checklist stavke |
| GET | `/api/shared-access/plans/{id}?token=...` | Javni pristup planu |

### ExpenseService (`http://localhost:5012`)

| Metoda | Endpoint | Opis |
|---|---|---|
| GET | `/api/travel-plans/{id}/expenses` | Lista troškova |
| POST | `/api/travel-plans/{id}/expenses` | Dodavanje troška |
| PUT | `/api/travel-plans/{id}/expenses/{expId}` | Izmjena troška |
| DELETE | `/api/travel-plans/{id}/expenses/{expId}` | Brisanje troška |
| GET | `/api/travel-plans/{id}/expenses/summary` | Pregled budžeta po kategorijama |

---

## Struktura projekta

```
TravelPlanner/
├── TravelPlanner.ServiceFabric/
│   ├── TravelPlanner.ServiceFabric/    ← SF Application (ApplicationManifest.xml)
│   ├── TravelPlanner.UserService/      ← Stateless servis
│   ├── TravelPlanner.TravelService/    ← Stateful servis
│   └── TravelPlanner.ExpenseService/   ← Stateless servis
├── travel-planner-frontend/            ← React + Vite frontend
│   ├── src/
│   │   ├── components/                 ← UI komponente
│   │   ├── context/                    ← AuthContext
│   │   ├── models/                     ← Modeli podataka
│   │   ├── pages/                      ← Stranice
│   │   └── services/                   ← HTTP servisi
│   └── .env.example
├── docs/                               ← Dijagrami (arhitektura, use case)
└── README.md
```

---

## Napomena o Service Fabric lokalnom clusteru

Aplikacija je u potpunosti implementirana kao Service Fabric mikroservisna aplikacija. Svi servisi nasljeđuju SF bazne klase (`StatelessService`, `StatefulService`) i koriste `KestrelCommunicationListener` za HTTP komunikaciju. `ApplicationManifest.xml` i `ServiceManifest.xml` fajlovi su ispravno konfigurisani.

`FabricHostSvc` ne može da se pokrene na Windows 11 zbog poznatog kompatibilitetnog problema. Za lokalni razvoj, servisi se pokreću direktno kao ASP.NET Core aplikacije na portovima 5010, 5011 i 5012, što demonstrira istu mikroservisnu arhitekturu.

---

## Poznata ograničenja

- `TravelService` je deklarisan kao Stateful (zahtjev specifikacije), ali perzistenciju drži isključivo u SQL bazi — ne koristi Service Fabric Reliable Collections
- Lokalni razvoj koristi direktno pokretanje servisa umjesto SF orkestarcije zbog kompatibilitetnog problema sa FabricHostSvc na Windows 11
