# Digitale Binas

Een compacte PDF-viewer voor de BiNaS-tabellen met snelle navigatie via een vooraf samengestelde inhoudsopgave.

## Functionaliteit
- Upload een eigen PDF-bestand en blader pagina voor pagina of in 2-pagina weergave.
- Zoom in/uit, reset zoom, of pas het beeld aan op hoogte of breedte.
- Zoek door de inhoudsopgave om snel naar een tabel te springen.

## Projectstructuur
- `index.html` – HTML-skelet van de viewer en koppeling naar stijl, scripts en favicon.
- `styles.css` – Opmaak, kleuren en lay-out van de viewer, navigatie en knoppen.
- `script.js` – Logica voor het laden van PDF's, navigatie, zoom, weergave-instellingen en het koppelen van de inhoudsopgave aan de viewer.
- `navigation-data.json` – Dataset voor de inhoudsopgave (secties, tabellen en subtabel-items).
- `favicon.png` – Favicon in de rootmap.

## Gebruik
1. Open `index.html` in een moderne browser.
2. Klik op **Bestand** om een PDF van BiNaS te uploaden.
3. Gebruik de navigatie links om snel naar de gewenste pagina te springen of blader met de knoppen bovenaan.

## Techniek
- [PDF.js](https://mozilla.github.io/pdf.js/) wordt via een CDN geladen voor het renderen van PDF-pagina's.
- De inhoudsopgave wordt asynchroon opgehaald uit `navigation-data.json` en geïntegreerd in de navigatieboom.

## Ontwikkelen
- Pas de stijl aan in `styles.css`.
- Wijzig of breid de inhoud uit in `navigation-data.json`.
- De belangrijkste event-handling en renderlogica staat in `script.js`.

