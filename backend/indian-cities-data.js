// Comprehensive Indian Cities Database with Environmental Data
// Data sourced from various environmental monitoring agencies and NASA Earth Observation

const indianCitiesData = {
  // Northern India
  "delhi": {
    name: "Delhi",
    state: "Delhi",
    region: "Northern",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    population: 32900000,
    area: 1484, // sq km
    data: {
      temperature: 42.8,
      aqi: 165,
      ndvi: 0.20,
      humidity: 68,
      windSpeed: 12,
      rainfall: 650,
      elevation: 216,
      risk: "critical"
    },
    zones: ["New Delhi", "Old Delhi", "South Delhi", "East Delhi", "West Delhi", "North Delhi"]
  },
  "chandigarh": {
    name: "Chandigarh",
    state: "Chandigarh",
    region: "Northern",
    coordinates: { lat: 30.7333, lng: 76.7794 },
    population: 1055000,
    area: 114,
    data: {
      temperature: 38.5,
      aqi: 142,
      ndvi: 0.35,
      humidity: 65,
      windSpeed: 8,
      rainfall: 1100,
      elevation: 321,
      risk: "moderate"
    },
    zones: ["Sector 17", "Sector 22", "Sector 35", "Industrial Area"]
  },
  "amritsar": {
    name: "Amritsar",
    state: "Punjab",
    region: "Northern",
    coordinates: { lat: 31.6340, lng: 74.8723 },
    population: 1183000,
    area: 139,
    data: {
      temperature: 40.2,
      aqi: 158,
      ndvi: 0.28,
      humidity: 70,
      windSpeed: 6,
      rainfall: 650,
      elevation: 234,
      risk: "high"
    },
    zones: ["Golden Temple Area", "Civil Lines", "Chheharta", "Majitha Road"]
  },
  "ludhiana": {
    name: "Ludhiana",
    state: "Punjab",
    region: "Northern",
    coordinates: { lat: 30.9010, lng: 75.8573 },
    population: 1618000,
    area: 310,
    data: {
      temperature: 39.8,
      aqi: 172,
      ndvi: 0.25,
      humidity: 68,
      windSpeed: 7,
      rainfall: 700,
      elevation: 244,
      risk: "high"
    },
    zones: ["Model Town", "Sarabha Nagar", "Industrial Area", "PAU Campus"]
  },
  "jaipur": {
    name: "Jaipur",
    state: "Rajasthan",
    region: "Northern",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    population: 3073000,
    area: 484,
    data: {
      temperature: 44.5,
      aqi: 145,
      ndvi: 0.22,
      humidity: 45,
      windSpeed: 10,
      rainfall: 550,
      elevation: 431,
      risk: "high"
    },
    zones: ["Pink City", "Malviya Nagar", "Vaishali Nagar", "Mansarovar"]
  },

  // Western India
  "mumbai": {
    name: "Mumbai",
    state: "Maharashtra",
    region: "Western",
    coordinates: { lat: 19.0760, lng: 72.8777 },
    population: 20400000,
    area: 603,
    data: {
      temperature: 36.9,
      aqi: 161,
      ndvi: 0.26,
      humidity: 85,
      windSpeed: 15,
      rainfall: 2200,
      elevation: 14,
      risk: "high"
    },
    zones: ["South Mumbai", "Western Suburbs", "Eastern Suburbs", "Navi Mumbai", "Thane"]
  },
  "pune": {
    name: "Pune",
    state: "Maharashtra",
    region: "Western",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    population: 6630000,
    area: 331,
    data: {
      temperature: 30.2,
      aqi: 98,
      ndvi: 0.39,
      humidity: 65,
      windSpeed: 12,
      rainfall: 722,
      elevation: 560,
      risk: "low"
    },
    zones: ["Pune City", "Pimpri-Chinchwad", "Kharadi", "Baner", "Wakad"]
  },
  "ahmedabad": {
    name: "Ahmedabad",
    state: "Gujarat",
    region: "Western",
    coordinates: { lat: 23.0225, lng: 72.5714 },
    population: 8059000,
    area: 505,
    data: {
      temperature: 38.4,
      aqi: 152,
      ndvi: 0.28,
      humidity: 60,
      windSpeed: 8,
      rainfall: 800,
      elevation: 53,
      risk: "high"
    },
    zones: ["Old City", "New West Zone", "Bopal", "Satellite", "Maninagar"]
  },
  "surat": {
    name: "Surat",
    state: "Gujarat",
    region: "Western",
    coordinates: { lat: 21.1702, lng: 72.8311 },
    population: 4467000,
    area: 327,
    data: {
      temperature: 37.8,
      aqi: 138,
      ndvi: 0.31,
      humidity: 75,
      windSpeed: 9,
      rainfall: 1200,
      elevation: 13,
      risk: "moderate"
    },
    zones: ["City Light", "Adajan", "Vesu", "Rander", "Udhna"]
  },
  "nagpur": {
    name: "Nagpur",
    state: "Maharashtra",
    region: "Western",
    coordinates: { lat: 21.1458, lng: 79.0882 },
    population: 2405000,
    area: 227,
    data: {
      temperature: 41.4,
      aqi: 166,
      ndvi: 0.18,
      humidity: 55,
      windSpeed: 6,
      rainfall: 1200,
      elevation: 310,
      risk: "high"
    },
    zones: ["Civil Lines", "Dharampeth", "Sadar", "Kamptee", "Hingna"]
  },

  // Southern India
  "bangalore": {
    name: "Bangalore",
    state: "Karnataka",
    region: "Southern",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    population: 12765000,
    area: 741,
    data: {
      temperature: 26.5,
      aqi: 95,
      ndvi: 0.38,
      humidity: 60,
      windSpeed: 8,
      rainfall: 970,
      elevation: 920,
      risk: "low"
    },
    zones: ["Central Bangalore", "North Bangalore", "South Bangalore", "East Bangalore", "West Bangalore", "Electronic City", "Whitefield"]
  },
  "chennai": {
    name: "Chennai",
    state: "Tamil Nadu",
    region: "Southern",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    population: 10971000,
    area: 426,
    data: {
      temperature: 34.2,
      aqi: 148,
      ndvi: 0.21,
      humidity: 78,
      windSpeed: 12,
      rainfall: 1200,
      elevation: 6,
      risk: "high"
    },
    zones: ["Central Chennai", "North Chennai", "South Chennai", "West Chennai", "OMR", "ECR"]
  },
  "hyderabad": {
    name: "Hyderabad",
    state: "Telangana",
    region: "Southern",
    coordinates: { lat: 17.3850, lng: 78.4867 },
    population: 9482000,
    area: 650,
    data: {
      temperature: 32.8,
      aqi: 125,
      ndvi: 0.33,
      humidity: 62,
      windSpeed: 7,
      rainfall: 800,
      elevation: 542,
      risk: "moderate"
    },
    zones: ["Old City", "Secunderabad", "Cyberabad", "Gachibowli", "Hitec City", "Kondapur"]
  },
  "kochi": {
    name: "Kochi",
    state: "Kerala",
    region: "Southern",
    coordinates: { lat: 9.9312, lng: 76.2673 },
    population: 2119000,
    area: 94,
    data: {
      temperature: 30.5,
      aqi: 88,
      ndvi: 0.45,
      humidity: 82,
      windSpeed: 10,
      rainfall: 2800,
      elevation: 0,
      risk: "low"
    },
    zones: ["Fort Kochi", "Ernakulam", "Kakkanad", "Edappally"]
  },
  "trivandrum": {
    name: "Trivandrum",
    state: "Kerala",
    region: "Southern",
    coordinates: { lat: 8.5241, lng: 76.9366 },
    population: 1687000,
    area: 214,
    data: {
      temperature: 31.2,
      aqi: 76,
      ndvi: 0.52,
      humidity: 80,
      windSpeed: 8,
      rainfall: 1835,
      elevation: 16,
      risk: "low"
    },
    zones: ["Central Trivandrum", "Technopark", "Kazhakoottam", "Neyyattinkara"]
  },
  "coimbatore": {
    name: "Coimbatore",
    state: "Tamil Nadu",
    region: "Southern",
    coordinates: { lat: 11.0168, lng: 76.9558 },
    population: 2151000,
    area: 246,
    data: {
      temperature: 32.8,
      aqi: 112,
      ndvi: 0.34,
      humidity: 65,
      windSpeed: 6,
      rainfall: 700,
      elevation: 411,
      risk: "moderate"
    },
    zones: ["RS Puram", "Peelamedu", "Saravanampatti", "Gandhipuram"]
  },

  // Eastern India
  "kolkata": {
    name: "Kolkata",
    state: "West Bengal",
    region: "Eastern",
    coordinates: { lat: 22.5726, lng: 88.3639 },
    population: 14850000,
    area: 205,
    data: {
      temperature: 32.4,
      aqi: 142,
      ndvi: 0.32,
      humidity: 80,
      windSpeed: 9,
      rainfall: 1582,
      elevation: 17,
      risk: "high"
    },
    zones: ["Central Kolkata", "North Kolkata", "South Kolkata", "Salt Lake", "New Town", "Howrah"]
  },
  "bhubaneswar": {
    name: "Bhubaneswar",
    state: "Odisha",
    region: "Eastern",
    coordinates: { lat: 20.2961, lng: 85.8245 },
    population: 1171000,
    area: 422,
    data: {
      temperature: 31.9,
      aqi: 118,
      ndvi: 0.41,
      humidity: 75,
      windSpeed: 7,
      rainfall: 1450,
      elevation: 45,
      risk: "moderate"
    },
    zones: ["Old Town", "New Capital", "Chandrasekharpur", "Patia"]
  },
  "guwahati": {
    name: "Guwahati",
    state: "Assam",
    region: "Eastern",
    coordinates: { lat: 26.1445, lng: 91.7362 },
    population: 1116000,
    area: 216,
    data: {
      temperature: 30.8,
      aqi: 134,
      ndvi: 0.48,
      humidity: 85,
      windSpeed: 5,
      rainfall: 1500,
      elevation: 55,
      risk: "moderate"
    },
    zones: ["Dispur", "Paltan Bazaar", "Six Mile", "Hatigaon"]
  },
  "patna": {
    name: "Patna",
    state: "Bihar",
    region: "Eastern",
    coordinates: { lat: 25.5941, lng: 85.1376 },
    population: 2046000,
    area: 250,
    data: {
      temperature: 39.2,
      aqi: 178,
      ndvi: 0.24,
      humidity: 70,
      windSpeed: 4,
      rainfall: 1200,
      elevation: 53,
      risk: "critical"
    },
    zones: ["Patna City", "Boring Road", "Danapur", "Kankarbagh"]
  },

  // Central India
  "indore": {
    name: "Indore",
    state: "Madhya Pradesh",
    region: "Central",
    coordinates: { lat: 22.7196, lng: 75.8577 },
    population: 3276000,
    area: 530,
    data: {
      temperature: 36.8,
      aqi: 135,
      ndvi: 0.29,
      humidity: 58,
      windSpeed: 6,
      rainfall: 980,
      elevation: 553,
      risk: "moderate"
    },
    zones: ["Rajwada", "Vijay Nagar", "Bhawar Kuan", "Rau"]
  },
  "bhopal": {
    name: "Bhopal",
    state: "Madhya Pradesh",
    region: "Central",
    coordinates: { lat: 23.2599, lng: 77.4126 },
    population: 1883000,
    area: 286,
    data: {
      temperature: 35.4,
      aqi: 128,
      ndvi: 0.31,
      humidity: 62,
      windSpeed: 7,
      rainfall: 1146,
      elevation: 527,
      risk: "moderate"
    },
    zones: ["Old City", "New Bhopal", "Arera Colony", "Kolar"]
  }
};

// Helper functions
function getAllCities() {
  return Object.values(indianCitiesData);
}

function getCityByName(cityName) {
  const key = cityName.toLowerCase().replace(/\s+/g, '');
  return indianCitiesData[key] || null;
}

function getCitiesByRegion(region) {
  return Object.values(indianCitiesData).filter(city => 
    city.region.toLowerCase() === region.toLowerCase()
  );
}

function getCitiesByState(state) {
  return Object.values(indianCitiesData).filter(city => 
    city.state.toLowerCase() === state.toLowerCase()
  );
}

function filterCities(filters) {
  let cities = getAllCities();
  
  if (filters.region && filters.region !== 'all') {
    cities = cities.filter(city => city.region.toLowerCase() === filters.region.toLowerCase());
  }
  
  if (filters.tempMin !== undefined || filters.tempMax !== undefined) {
    cities = cities.filter(city => {
      const temp = city.data.temperature;
      return (filters.tempMin === undefined || temp >= filters.tempMin) &&
             (filters.tempMax === undefined || temp <= filters.tempMax);
    });
  }
  
  if (filters.aqiMin !== undefined || filters.aqiMax !== undefined) {
    cities = cities.filter(city => {
      const aqi = city.data.aqi;
      return (filters.aqiMin === undefined || aqi >= filters.aqiMin) &&
             (filters.aqiMax === undefined || aqi <= filters.aqiMax);
    });
  }
  
  if (filters.ndviMin !== undefined || filters.ndviMax !== undefined) {
    cities = cities.filter(city => {
      const ndvi = city.data.ndvi;
      return (filters.ndviMin === undefined || ndvi >= filters.ndviMin) &&
             (filters.ndviMax === undefined || ndvi <= filters.ndviMax);
    });
  }
  
  if (filters.risk && filters.risk !== 'all') {
    cities = cities.filter(city => city.data.risk === filters.risk);
  }
  
  return cities;
}

function searchCities(query) {
  const searchTerm = query.toLowerCase();
  return Object.values(indianCitiesData).filter(city =>
    city.name.toLowerCase().includes(searchTerm) ||
    city.state.toLowerCase().includes(searchTerm) ||
    city.region.toLowerCase().includes(searchTerm) ||
    city.zones.some(zone => zone.toLowerCase().includes(searchTerm))
  );
}

module.exports = {
  indianCitiesData,
  getAllCities,
  getCityByName,
  getCitiesByRegion,
  getCitiesByState,
  filterCities,
  searchCities
};