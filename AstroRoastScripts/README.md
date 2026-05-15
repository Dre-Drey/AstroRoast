# AstroRoastScripts

Scripts utilitaires pour générer les événements cosmiques utilisés par AstroRoast.

## Générateur d'événements

Le script principal est [scripts/generate_cosmic_events.ts](scripts/generate_cosmic_events.ts). Il calcule les positions planétaires via Swiss Ephemeris et produit un événement par jour sur la plage définie dans le script.

### Ce que le script détecte

- Rétrograde si la vitesse longitudinale passe de positive à négative.
- Ingrès lorsqu'une planète change de signe zodiacal.
- Oppositions lorsque deux planètes sont séparées d'environ 180°.
- Carrés lorsque deux planètes sont séparées d'environ 90°.
- Position de la Lune en fallback si aucun événement majeur n'est trouvé.

### Priorité de sélection

Le script retient un seul événement par jour selon l'ordre suivant:

1. Rétrograde
2. Opposition
3. Carré
4. Ingrès
5. Lune en fallback

### Variables d'environnement

Le script lit les variables suivantes depuis un fichier [.env](.env):

- `EXPO_PUBLIC_SUPABASE_URL`
- `SERVICE_ROLE_KEY`

Si l'une de ces valeurs est absente, le script s'arrête immédiatement avec une erreur.

### Installation et exécution

Depuis le dossier `AstroRoastScripts`:

```bash
npm install
npx tsx scripts/generate_cosmic_events.ts
```

### Notes

- Le calcul utilise une marge d'orbe de 6° pour les oppositions et les carrés.
- Le script est actuellement configuré pour la période du 1er au 31 mai 2026. Modifie `startDate` et `endDate` dans [scripts/generate_cosmic_events.ts](scripts/generate_cosmic_events.ts) si besoin.
