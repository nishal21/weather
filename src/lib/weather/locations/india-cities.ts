import type { LocationRef } from "../types";

/** Major cities across Indian states/UTs for quick picks (real coords for Open-Meteo). */
export const INDIA_QUICK_CITIES: LocationRef[] = [
  { id: "in-delhi", name: "New Delhi", state: "Delhi", countryCode: "IN", lat: 28.6139, lon: 77.209 },
  { id: "in-mumbai", name: "Mumbai", state: "Maharashtra", countryCode: "IN", lat: 19.076, lon: 72.8777 },
  { id: "in-bengaluru", name: "Bengaluru", state: "Karnataka", countryCode: "IN", lat: 12.9716, lon: 77.5946 },
  { id: "in-chennai", name: "Chennai", state: "Tamil Nadu", countryCode: "IN", lat: 13.0827, lon: 80.2707 },
  { id: "in-kolkata", name: "Kolkata", state: "West Bengal", countryCode: "IN", lat: 22.5726, lon: 88.3639 },
  { id: "in-hyderabad", name: "Hyderabad", state: "Telangana", countryCode: "IN", lat: 17.385, lon: 78.4867 },
  { id: "in-pune", name: "Pune", state: "Maharashtra", countryCode: "IN", lat: 18.5204, lon: 73.8567 },
  { id: "in-ahmedabad", name: "Ahmedabad", state: "Gujarat", countryCode: "IN", lat: 23.0225, lon: 72.5714 },
  { id: "in-jaipur", name: "Jaipur", state: "Rajasthan", countryCode: "IN", lat: 26.9124, lon: 75.7873 },
  { id: "in-lucknow", name: "Lucknow", state: "Uttar Pradesh", countryCode: "IN", lat: 26.8467, lon: 80.9462 },
  { id: "in-chandigarh", name: "Chandigarh", state: "Chandigarh", countryCode: "IN", lat: 30.7333, lon: 76.7794 },
  { id: "in-bhopal", name: "Bhopal", state: "Madhya Pradesh", countryCode: "IN", lat: 23.2599, lon: 77.4126 },
  { id: "in-patna", name: "Patna", state: "Bihar", countryCode: "IN", lat: 25.5941, lon: 85.1376 },
  { id: "in-ranchi", name: "Ranchi", state: "Jharkhand", countryCode: "IN", lat: 23.3441, lon: 85.3096 },
  { id: "in-bhubaneswar", name: "Bhubaneswar", state: "Odisha", countryCode: "IN", lat: 20.2961, lon: 85.8245 },
  { id: "in-guwahati", name: "Guwahati", state: "Assam", countryCode: "IN", lat: 26.1445, lon: 91.7362 },
  { id: "in-imphal", name: "Imphal", state: "Manipur", countryCode: "IN", lat: 24.817, lon: 93.9368 },
  { id: "in-shillong", name: "Shillong", state: "Meghalaya", countryCode: "IN", lat: 25.5788, lon: 91.8933 },
  { id: "in-agartala", name: "Agartala", state: "Tripura", countryCode: "IN", lat: 23.8315, lon: 91.2868 },
  { id: "in-aizawl", name: "Aizawl", state: "Mizoram", countryCode: "IN", lat: 23.7271, lon: 92.7176 },
  { id: "in-kohima", name: "Kohima", state: "Nagaland", countryCode: "IN", lat: 25.6751, lon: 94.1086 },
  { id: "in-itanagar", name: "Itanagar", state: "Arunachal Pradesh", countryCode: "IN", lat: 27.0844, lon: 93.6053 },
  { id: "in-gangtok", name: "Gangtok", state: "Sikkim", countryCode: "IN", lat: 27.3389, lon: 88.6065 },
  { id: "in-srinagar", name: "Srinagar", state: "Jammu and Kashmir", countryCode: "IN", lat: 34.0837, lon: 74.7973 },
  { id: "in-leh", name: "Leh", state: "Ladakh", countryCode: "IN", lat: 34.1526, lon: 77.5771 },
  { id: "in-shimla", name: "Shimla", state: "Himachal Pradesh", countryCode: "IN", lat: 31.1048, lon: 77.1734 },
  { id: "in-dehradun", name: "Dehradun", state: "Uttarakhand", countryCode: "IN", lat: 30.3165, lon: 78.0322 },
  { id: "in-raipur", name: "Raipur", state: "Chhattisgarh", countryCode: "IN", lat: 21.2514, lon: 81.6296 },
  { id: "in-panaji", name: "Panaji", state: "Goa", countryCode: "IN", lat: 15.4909, lon: 73.8278 },
  { id: "in-thiruvananthapuram", name: "Thiruvananthapuram", state: "Kerala", countryCode: "IN", lat: 8.5241, lon: 76.9366 },
  { id: "in-kochi", name: "Kochi", state: "Kerala", countryCode: "IN", lat: 9.9312, lon: 76.2673 },
  { id: "in-kozhikode", name: "Kozhikode", state: "Kerala", countryCode: "IN", lat: 11.2588, lon: 75.7804 },
  { id: "in-coimbatore", name: "Coimbatore", state: "Tamil Nadu", countryCode: "IN", lat: 11.0168, lon: 76.9558 },
  { id: "in-madurai", name: "Madurai", state: "Tamil Nadu", countryCode: "IN", lat: 9.9252, lon: 78.1198 },
  { id: "in-visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", countryCode: "IN", lat: 17.6868, lon: 83.2185 },
  { id: "in-vijayawada", name: "Vijayawada", state: "Andhra Pradesh", countryCode: "IN", lat: 16.5062, lon: 80.648 },
  { id: "in-mangaluru", name: "Mangaluru", state: "Karnataka", countryCode: "IN", lat: 12.9141, lon: 74.856 },
  { id: "in-mysuru", name: "Mysuru", state: "Karnataka", countryCode: "IN", lat: 12.2958, lon: 76.6394 },
  { id: "in-nagpur", name: "Nagpur", state: "Maharashtra", countryCode: "IN", lat: 21.1458, lon: 79.0882 },
  { id: "in-indore", name: "Indore", state: "Madhya Pradesh", countryCode: "IN", lat: 22.7196, lon: 75.8577 },
  { id: "in-surat", name: "Surat", state: "Gujarat", countryCode: "IN", lat: 21.1702, lon: 72.8311 },
  { id: "in-vadodara", name: "Vadodara", state: "Gujarat", countryCode: "IN", lat: 22.3072, lon: 73.1812 },
  { id: "in-jodhpur", name: "Jodhpur", state: "Rajasthan", countryCode: "IN", lat: 26.2389, lon: 73.0243 },
  { id: "in-udaipur", name: "Udaipur", state: "Rajasthan", countryCode: "IN", lat: 24.5854, lon: 73.7125 },
  { id: "in-varanasi", name: "Varanasi", state: "Uttar Pradesh", countryCode: "IN", lat: 25.3176, lon: 82.9739 },
  { id: "in-kanpur", name: "Kanpur", state: "Uttar Pradesh", countryCode: "IN", lat: 26.4499, lon: 80.3319 },
  { id: "in-amritsar", name: "Amritsar", state: "Punjab", countryCode: "IN", lat: 31.634, lon: 74.8723 },
  { id: "in-ludhiana", name: "Ludhiana", state: "Punjab", countryCode: "IN", lat: 30.901, lon: 75.8573 },
  { id: "in-faridabad", name: "Faridabad", state: "Haryana", countryCode: "IN", lat: 28.4089, lon: 77.3178 },
  { id: "in-gurgaon", name: "Gurugram", state: "Haryana", countryCode: "IN", lat: 28.4595, lon: 77.0266 },
  { id: "in-portblair", name: "Port Blair", state: "Andaman and Nicobar", countryCode: "IN", lat: 11.6234, lon: 92.7265 },
  { id: "in-kavaratti", name: "Kavaratti", state: "Lakshadweep", countryCode: "IN", lat: 10.5593, lon: 72.6358 },
  { id: "in-siliguri", name: "Siliguri", state: "West Bengal", countryCode: "IN", lat: 26.7271, lon: 88.3953 },
  { id: "in-dibrugarh", name: "Dibrugarh", state: "Assam", countryCode: "IN", lat: 27.4728, lon: 94.912 },
  // Tier-2 / high-search cities
  { id: "in-noida", name: "Noida", state: "Uttar Pradesh", countryCode: "IN", lat: 28.5355, lon: 77.391 },
  { id: "in-ghaziabad", name: "Ghaziabad", state: "Uttar Pradesh", countryCode: "IN", lat: 28.6692, lon: 77.4538 },
  { id: "in-agra", name: "Agra", state: "Uttar Pradesh", countryCode: "IN", lat: 27.1767, lon: 78.0081 },
  { id: "in-prayagraj", name: "Prayagraj", state: "Uttar Pradesh", countryCode: "IN", lat: 25.4358, lon: 81.8463 },
  { id: "in-meerut", name: "Meerut", state: "Uttar Pradesh", countryCode: "IN", lat: 28.9845, lon: 77.7064 },
  { id: "in-nashik", name: "Nashik", state: "Maharashtra", countryCode: "IN", lat: 19.9975, lon: 73.7898 },
  { id: "in-thane", name: "Thane", state: "Maharashtra", countryCode: "IN", lat: 19.2183, lon: 72.9781 },
  { id: "in-navi-mumbai", name: "Navi Mumbai", state: "Maharashtra", countryCode: "IN", lat: 19.033, lon: 73.0297 },
  { id: "in-aurangabad", name: "Chhatrapati Sambhajinagar", state: "Maharashtra", countryCode: "IN", lat: 19.8762, lon: 75.3433 },
  { id: "in-rajkot", name: "Rajkot", state: "Gujarat", countryCode: "IN", lat: 22.3039, lon: 70.8022 },
  { id: "in-gandhinagar", name: "Gandhinagar", state: "Gujarat", countryCode: "IN", lat: 23.2156, lon: 72.6369 },
  { id: "in-kota", name: "Kota", state: "Rajasthan", countryCode: "IN", lat: 25.2138, lon: 75.8648 },
  { id: "in-ajmer", name: "Ajmer", state: "Rajasthan", countryCode: "IN", lat: 26.4499, lon: 74.6399 },
  { id: "in-gwalior", name: "Gwalior", state: "Madhya Pradesh", countryCode: "IN", lat: 26.2183, lon: 78.1828 },
  { id: "in-jabalpur", name: "Jabalpur", state: "Madhya Pradesh", countryCode: "IN", lat: 23.1815, lon: 79.9864 },
  { id: "in-jamshedpur", name: "Jamshedpur", state: "Jharkhand", countryCode: "IN", lat: 22.8046, lon: 86.2029 },
  { id: "in-dhanbad", name: "Dhanbad", state: "Jharkhand", countryCode: "IN", lat: 23.7957, lon: 86.4304 },
  { id: "in-cuttack", name: "Cuttack", state: "Odisha", countryCode: "IN", lat: 20.4625, lon: 85.883 },
  { id: "in-asansol", name: "Asansol", state: "West Bengal", countryCode: "IN", lat: 23.6739, lon: 86.9524 },
  { id: "in-durgapur", name: "Durgapur", state: "West Bengal", countryCode: "IN", lat: 23.5204, lon: 87.3119 },
  { id: "in-howrah", name: "Howrah", state: "West Bengal", countryCode: "IN", lat: 22.5958, lon: 88.2636 },
  { id: "in-jammu", name: "Jammu", state: "Jammu and Kashmir", countryCode: "IN", lat: 32.7266, lon: 74.857 },
  { id: "in-tiruchirappalli", name: "Tiruchirappalli", state: "Tamil Nadu", countryCode: "IN", lat: 10.7905, lon: 78.7047 },
  { id: "in-salem", name: "Salem", state: "Tamil Nadu", countryCode: "IN", lat: 11.6643, lon: 78.146 },
  { id: "in-tirunelveli", name: "Tirunelveli", state: "Tamil Nadu", countryCode: "IN", lat: 8.7139, lon: 77.7567 },
  { id: "in-pondicherry", name: "Puducherry", state: "Puducherry", countryCode: "IN", lat: 11.9416, lon: 79.8083 },
  { id: "in-warangal", name: "Warangal", state: "Telangana", countryCode: "IN", lat: 17.9689, lon: 79.5941 },
  { id: "in-guntur", name: "Guntur", state: "Andhra Pradesh", countryCode: "IN", lat: 16.3067, lon: 80.4365 },
  { id: "in-tirupati", name: "Tirupati", state: "Andhra Pradesh", countryCode: "IN", lat: 13.6288, lon: 79.4192 },
  { id: "in-hubballi", name: "Hubballi", state: "Karnataka", countryCode: "IN", lat: 15.3647, lon: 75.124 },
  { id: "in-belagavi", name: "Belagavi", state: "Karnataka", countryCode: "IN", lat: 15.8497, lon: 74.4977 },
  { id: "in-thrissur", name: "Thrissur", state: "Kerala", countryCode: "IN", lat: 10.5276, lon: 76.2144 },
  { id: "in-kannur", name: "Kannur", state: "Kerala", countryCode: "IN", lat: 11.8745, lon: 75.3704 },
  { id: "in-kollam", name: "Kollam", state: "Kerala", countryCode: "IN", lat: 8.8932, lon: 76.6141 },
  { id: "in-alappuzha", name: "Alappuzha", state: "Kerala", countryCode: "IN", lat: 9.4981, lon: 76.3388 },
  { id: "in-kottayam", name: "Kottayam", state: "Kerala", countryCode: "IN", lat: 9.5916, lon: 76.5222 },
  { id: "in-silchar", name: "Silchar", state: "Assam", countryCode: "IN", lat: 24.8333, lon: 92.7789 },
  { id: "in-dimapur", name: "Dimapur", state: "Nagaland", countryCode: "IN", lat: 25.9063, lon: 93.7276 },
  { id: "in-tura", name: "Tura", state: "Meghalaya", countryCode: "IN", lat: 25.514, lon: 90.203 },
];

export const DEFAULT_LOCATION: LocationRef = INDIA_QUICK_CITIES[0];

export function findQuickCity(id: string): LocationRef | undefined {
  return INDIA_QUICK_CITIES.find((c) => c.id === id);
}

export function encodeCoords(lat: number, lon: number): string {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
}

export function parseCoords(raw: string): { lat: number; lon: number } | null {
  const m = raw.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lon = Number(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon };
}
