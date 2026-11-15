# Karte: Equilio

Dienstplanung für Schichtbetriebe, Niks Bachelorarbeit. Stand: pausiert, nur Sicherheitsupdates (15.11.2026).
Ausführlich: `CLAUDE.md`, Notizen unter `.claude/memory/`.

## Zweige und CI

- Standardzweig ist `master` (nicht `main`).
- `.github/workflows/backend-tests.yml` (PHPUnit, PHP 8.4) und `.github/workflows/deploy-pages.yml` (Vite-Build auf
  GitHub Pages) laufen bei Push auf `master` und auf dem alten Zweig `claude/add-project-documentation-1Qnpn`.
- Dependabot öffnet PRs für npm und Composer.

## Backend (Laravel 12, PHP 8.2+)

- `routes/api.php`: alle Endpunkte, Anmeldung über Sanctum (`config/sanctum.php`).
- `app/Http/Controllers/`: je Fachobjekt ein Controller, `AuthController.php` ist der heikle Teil (Anmeldung).
- `app/Models/`: Eloquent-Modelle (Employee, Shift, Duty, Wish, Absence und weitere).
- `app/Services/RosterGenerator.php` und `app/Services/StrainIndex.php`: Planerzeugung und Belastungsindex.
- `config/rostering.php`: Einstellungen des Planers.
- `database/`: Migrationen und Seeder.
- `tests/Feature/`, `tests/Unit/`: PHPUnit.

## Frontend (React 19, Vite 7)

- `resources/js/app.jsx`: Einstieg, `resources/js/router/` Routen, `resources/js/store.js` Redux-Store.
- `resources/js/features/`: Redux-Slices je Fachobjekt, `resources/js/components/` Ansichten.
- `resources/js/bootstrap.js`: axios-Grundeinstellung (Netz nach außen läuft hier).
- `resources/js/mock/`: Beispieldaten für die Pages-Fassung ohne Backend.
- `tests/frontend/`: Vitest (`npm test`), `vite.config.js` Build (`npm run build`).

## Abhängigkeiten

- npm: `package.json`, `package-lock.json`. Composer: `composer.json`, `composer.lock`.
- Lokal gibt es kein PHP. Composer-Updates daher aus dem Dependabot-PR übernehmen (Lock von echtem Composer erzeugt).
