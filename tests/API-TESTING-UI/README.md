Framework de testare automatizata cu Playwright pentru API-uri si interfete web.

Ce am testat
- API Testing - reqres.in (GET/POST/Auth/404)
- UI Testing - Login, navigare, e-commerce, formulare  
- Integration - API + UI cu notificări vizuale și screenshots

 Ce am verificat
- API: Status codes, JSON structure, autentificare cu x-api-key
- UI: Element visibility, user interactions, form validation
- Integration: Storage state persistent, fallback handling

 Organizarea fisierelor
```
Proiect-Ierarhie/
 Helpers/          # API basic (GET/POST/404)
Helpers-UI/       # UI + Auth + Screenshots  
 fixtures/         # Storage state
 tests/           # Teste pe categorii
 test-results/    # Screenshots
```

Principii organizare:
- `Helpers/` - Functii simple pentru testarea API-urilor
- `Helpers-UI/` - Functii complexe UI + autentificare  
- `tests/API-TESTING-UI/` - Testele principale (integration)
- Storage state - Sesiuni persistente între teste

Autentificare
- User: `eve.holt@reqres.in` / Pass: `pistol`
- Storage: `fixtures/storageState.json`
- Workflow: Register → Login → Save → Load în teste

