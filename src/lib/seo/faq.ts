/** FAQ content for AEO / answer engines and FAQPage JSON-LD. */
export const SITE_FAQ = [
  {
    question: "What is India Weather?",
    answer:
      "India Weather is a free weather app for India and cities worldwide. It shows live temperature, hourly and 7-day forecasts, rain, wind, UV index, air quality, and easy-to-read weather alerts.",
  },
  {
    question: "Which cities does India Weather support?",
    answer:
      "You can search any city worldwide. India coverage includes major cities and districts across all states and union territories, from Mumbai and Delhi to Kochi, Guwahati, and Leh.",
  },
  {
    question: "Where does India Weather get forecast data?",
    answer:
      "Forecasts use Open-Meteo, a free global weather API. Place names use Open-Meteo geocoding and BigDataCloud reverse geocoding. Alerts are derived from live forecast conditions.",
  },
  {
    question: "Does India Weather support Malayalam and Hindi?",
    answer:
      "Yes. The app follows your phone language by default and lets you pick from 70+ languages. UI text is translated online; place names use localized geocoding where available.",
  },
  {
    question: "Can I use GPS to get weather near me?",
    answer:
      "Yes. Allow location in your browser and the app shows weather for your current area. You can also search manually or pick from saved places.",
  },
  {
    question: "Are the weather alerts official IMD bulletins?",
    answer:
      "No. Alerts are generated from forecast data to help you plan your day. They are not official India Meteorological Department warnings.",
  },
] as const;
