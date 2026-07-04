# TravelPlanner — Aplikacija za planiranje putovanja

Web aplikacija razvijena kao predmetni projekat iz predmeta **Primjena veb programiranja u infrastrukturnim sistemima**.

---

## Tehnologije

**Frontend:** React (Vite), React Router, Context API  
**Backend:** ASP.NET Core 8, Microsoft Service Fabric, Entity Framework Core  
**Baza podataka:** Microsoft SQL Server (Docker)  
**Autentikacija:** JWT tokeni, BCrypt heširanje lozinki  

---

## Arhitektura sistema

Aplikacija je zasnovana na mikroservisnoj arhitekturi sa tri odvojena servisa:

| Servis | Tip | Port | Odgovornost |
|---|---|---|---|
| UserService | Stateless ASP.NET Core | 5010 | Registracija, login, JWT, upravljanje korisnicima, share tokeni |
| TravelService | Stateful ASP.NET Core | 5011 | Planovi putovanja, destinacije, aktivnosti, checklist |
| ExpenseService | Stateless ASP.NET Core | 5012 | Troškovi, budžet, kategorije |

---

## Preduslovi

Prije pokretanja aplikacije potrebno je imati instalirano:

- [Visual Studio 2022](https://visualstudio.microsoft.com/) sa workloadom **Azure development** (za Service Fabric)
- [Service Fabric SDK](https://learn.microsoft.com/en-us/azure/service-fabric/service-fabric-get-started)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (v18+)
- [VS Code](https://code.visualstudio.com/) (za frontend)

---

## Pokretanje

### 1. Pokretanje SQL Server baze (Docker)

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=TravelPlanner123!" -p 1433:1433 --name sql-travelplanner --restart always -d mcr.microsoft.com/mssql/server:2022-latest
```

Provjeri da kontejner radi:
```bash
docker ps
```

### 2. Konfiguracija backenda

Svaki servis ima `appsettings.json` sa connection stringom i JWT ključem.

**UserService** (`TravelPlanner.UserService/appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=TravelPlannerUsers;User Id=sa;Password=TravelPlanner123!;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "TravelPlannerSuperSecretKey2024!XYZ",
    "ShareSecret": "TravelPlannerShareSecret2024!ABC"
  },
  "Urls": "http://localhost:5010"
}
```

**TravelService** (`TravelPlanner.TravelService/appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=TravelPlannerTravel;User Id=sa;Password=TravelPlanner123!;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "TravelPlannerSuperSecretKey2024!XYZ"
  },
  "Urls": "http://localhost:5011",
  "Services": {
    "UserServiceUrl": "http://localhost:5010"
  }
}
```

**ExpenseService** (`TravelPlanner.ExpenseService/appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=TravelPlannerExpenses;User Id=sa;Password=TravelPlanner123!;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "TravelPlannerSuperSecretKey2024!XYZ"
  },
  "Urls": "http://localhost:5012",
  "Services": {
    "TravelServiceUrl": "http://localhost:5011"
  }
}
```

### 3. Migracije baze podataka

U Visual Studio Package Manager Console pokrenuti za svaki servis:

```powershell
Add-Migration InitialCreate -Project TravelPlanner.UserService -StartupProject TravelPlanner.UserService
Update-Database -Project TravelPlanner.UserService -StartupProject TravelPlanner.UserService

Add-Migration InitialCreate -Project TravelPlanner.TravelService -StartupProject TravelPlanner.TravelService
Update-Database -Project TravelPlanner.TravelService -StartupProject TravelPlanner.TravelService

Add-Migration InitialCreate -Project TravelPlanner.ExpenseService -StartupProject TravelPlanner.ExpenseService
Update-Database -Project TravelPlanner.ExpenseService -StartupProject TravelPlanner.ExpenseService
```

### 4. Pokretanje backenda

U Visual Studio:
1. Desni klik na Solution → **Set Startup Projects**
2. Odaberi **Multiple startup projects**
3. Za `TravelPlanner.UserService`, `TravelPlanner.TravelService`, `TravelPlanner.ExpenseService` postavi Action na **Start**
4. Pritisni **F5**

Swagger dokumentacija dostupna na:
- UserService: http://localhost:5010/swagger
- TravelService: http://localhost:5011/swagger
- ExpenseService: http://localhost:5012/swagger

### 5. Pokretanje frontenda

```bash
cd travel-planner-frontend
npm install
npm run dev
```

Aplikacija dostupna na: **http://localhost:5173**

---

## Konfiguracija frontenda (.env)

```env
VITE_API_USER_URL=http://localhost:5010
VITE_API_TRAVEL_URL=http://localhost:5011
VITE_API_EXPENSE_URL=http://localhost:5012
VITE_APP_URL=http://localhost:5173
```

---

## Kreiranje admin korisnika

Nakon pokretanja, registruj se normalno kroz aplikaciju, pa u terminalu pokreni:

```bash
docker exec -it sql-travelplanner /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "TravelPlanner123!" -Q "USE TravelPlannerUsers; UPDATE Users SET Role='admin' WHERE Email='tvoj@email.com';" -C
```

---

## Funkcionalnosti

- Registracija i prijava korisnika (JWT autentikacija)
- Kreiranje i upravljanje planovima putovanja
- Dodavanje destinacija sa datumima boravka
- Organizacija aktivnosti po danima sa statusima
- Evidencija troškova po kategorijama sa praćenjem budžeta
- Checklist stavki prije putovanja
- Dijeljenje plana putem QR koda (VIEW/EDIT pristup)
- Admin panel za upravljanje korisnicima
- Swagger dokumentacija za sve servise

---

## Struktura projekta

```
TravelPlanner/
├── TravelPlannerSF/
│   ├── TravelPlanner.UserService/
│   ├── TravelPlanner.TravelService/
│   ├── TravelPlanner.ExpenseService/
│   └── TravelPlanner.Common/
└── travel-planner-frontend/
    └── src/
        ├── components/
        ├── context/
        ├── models/
        ├── pages/
        └── services/
```
