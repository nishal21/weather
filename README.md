# India Weather

Repository: [github.com/nishal21/weather](https://github.com/nishal21/weather) · License: MPL-2.0

Weather app built in India, made for users everywhere.

It shows live weather, hourly and 7-day forecast, rain, wind, UV, air quality, and simple action tips. The app supports city search worldwide, GPS lookup, saved places, and language-friendly UI.

## What it includes

- Live weather from Open-Meteo
- World city search (Open-Meteo geocoding)
- GPS reverse geocoding (BigDataCloud)
- Weather cards for hourly, 7-day, rain, UV, AQI, and details
- Localized UI strings (MyMemory + safety filtering)
- Device language default until user picks a language
- Compact location URLs like `/?p=lat,lon&n=Name&st=State&f=g`
- SEO, GEO, and AEO setup:
  - metadata + canonical
  - `robots.txt`, `sitemap.xml`, `manifest.webmanifest`
  - JSON-LD
  - `public/llms.txt`



## Stack

- Next.js 16
- React 19
- TypeScript



## Local development

1. Install dependencies:

```bash
npm install
```

1. Copy env file and set your values:

```bash
cp .env.example .env.local
```

1. Start dev server:

```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000)



## Environment variables

Use `.env.local` for local development.

Required for production SEO:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

This value is used for canonical URLs, sitemap links, and social metadata.

## Build check

```bash
npm run build
```



## Data sources

- Open-Meteo: forecast and geocoding
- BigDataCloud: reverse geocoding
- MyMemory: UI translation



## Notes

- This app is for weather guidance and convenience.
- Alerts are app-derived weather tips, not official government warnings.



## License

Source code in this repository is licensed under the [Mozilla Public License 2.0](LICENSE) (MPL-2.0).

You may use, modify, and distribute the code under MPL-2.0. If you modify MPL-covered source files and distribute them, those modified files must stay open under MPL-2.0.

## Copyright and assets

Copyright for the project source code is held by [nishal21](https://github.com/nishal21), under MPL-2.0.

Images, animations, icons, videos, fonts, and other media in this project may belong to their respective owners and are not necessarily covered by MPL-2.0. Use or redistribution of those assets may require separate permission or license from the original rights holders.

Third-party data and services (Open-Meteo, BigDataCloud, MyMemory, and others) remain subject to their own terms and attribution requirements.

