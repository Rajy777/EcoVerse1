// Comprehensive environmental zone data for major Indian cities
// Based on satellite data patterns, census data, and urban morphology
// Covering all major metropolitan areas across India

const cityZonesData = {
  // NORTHERN INDIA
  delhi: {
    cityName: 'Delhi',
    state: 'Delhi',
    region: 'Northern India',
    totalArea: 1484, // sq km
    zones: [
      {
        id: 'delhi-1',
        name: 'Connaught Place',
        type: 'business-district',
        coordinates: { lat: 28.6304, lng: 77.2177 },
        area: 4.2,
        population: 85000,
        lst: 42.8,
        ndvi: 0.18,
        elevation: 216,
        landUse: 'commercial-office',
        infrastructure: 'excellent',
        greenSpaces: 0.12
      },
      {
        id: 'delhi-2',
        name: 'Karol Bagh',
        type: 'dense-commercial',
        coordinates: { lat: 28.6519, lng: 77.1909 },
        area: 3.8,
        population: 450000,
        lst: 44.2,
        ndvi: 0.14,
        elevation: 218,
        landUse: 'commercial-residential',
        infrastructure: 'good',
        greenSpaces: 0.08
      },
      {
        id: 'delhi-3',
        name: 'Gurgaon Tech Hub',
        type: 'tech-corridor',
        coordinates: { lat: 28.4595, lng: 77.0266 },
        area: 15.6,
        population: 320000,
        lst: 41.5,
        ndvi: 0.22,
        elevation: 217,
        landUse: 'commercial-tech',
        infrastructure: 'excellent',
        greenSpaces: 0.15
      },
      {
        id: 'delhi-4',
        name: 'Yamuna Riverfront',
        type: 'water-adjacent',
        coordinates: { lat: 28.6562, lng: 77.2410 },
        area: 22.1,
        population: 180000,
        lst: 38.9,
        ndvi: 0.35,
        elevation: 213,
        landUse: 'mixed-recreational',
        infrastructure: 'developing',
        greenSpaces: 0.28
      },
      {
        id: 'delhi-5',
        name: 'Rohini Suburb',
        type: 'planned-residential',
        coordinates: { lat: 28.7041, lng: 77.1025 },
        area: 18.9,
        population: 650000,
        lst: 43.1,
        ndvi: 0.26,
        elevation: 220,
        landUse: 'residential',
        infrastructure: 'good',
        greenSpaces: 0.18
      }
    ]
  },

  mumbai: {
    cityName: 'Mumbai',
    state: 'Maharashtra',
    region: 'Western India',
    totalArea: 603.4,
    zones: [
      {
        id: 'mumbai-1',
        name: 'Dharavi',
        type: 'high-density-slum',
        coordinates: { lat: 19.0428, lng: 72.8517 },
        area: 2.1,
        population: 1200000,
        lst: 38.2,
        ndvi: 0.12,
        elevation: 12,
        landUse: 'residential-mixed',
        infrastructure: 'poor',
        greenSpaces: 0.02
      },
      {
        id: 'mumbai-2',
        name: 'Bandra West',
        type: 'affluent-residential',
        coordinates: { lat: 19.0594, lng: 72.8284 },
        area: 4.8,
        population: 180000,
        lst: 34.1,
        ndvi: 0.38,
        elevation: 18,
        landUse: 'residential-commercial',
        infrastructure: 'excellent',
        greenSpaces: 0.25
      },
      {
        id: 'mumbai-3',
        name: 'BKC Financial District',
        type: 'business-district',
        coordinates: { lat: 19.0596, lng: 72.8656 },
        area: 3.7,
        population: 25000,
        lst: 39.8,
        ndvi: 0.19,
        elevation: 15,
        landUse: 'commercial-office',
        infrastructure: 'excellent',
        greenSpaces: 0.14
      },
      {
        id: 'mumbai-4',
        name: 'Powai Tech City',
        type: 'planned-suburban',
        coordinates: { lat: 19.1197, lng: 72.9081 },
        area: 12.4,
        population: 95000,
        lst: 32.8,
        ndvi: 0.52,
        elevation: 42,
        landUse: 'residential-institutional',
        infrastructure: 'excellent',
        greenSpaces: 0.35
      }
    ]
  },

  // SOUTHERN INDIA
  bangalore: {
    cityName: 'Bangalore',
    state: 'Karnataka',
    region: 'Southern India',
    totalArea: 741,
    zones: [
      {
        id: 'bangalore-1',
        name: 'Electronic City',
        type: 'tech-corridor',
        coordinates: { lat: 12.8456, lng: 77.6603 },
        area: 12.8,
        population: 180000,
        lst: 26.5,
        ndvi: 0.35,
        elevation: 920,
        landUse: 'commercial-tech',
        infrastructure: 'excellent',
        greenSpaces: 0.22
      },
      {
        id: 'bangalore-2',
        name: 'Whitefield IT Hub',
        type: 'tech-residential',
        coordinates: { lat: 12.9698, lng: 77.7500 },
        area: 15.2,
        population: 250000,
        lst: 28.1,
        ndvi: 0.41,
        elevation: 870,
        landUse: 'mixed-tech',
        infrastructure: 'excellent',
        greenSpaces: 0.28
      },
      {
        id: 'bangalore-3',
        name: 'Cubbon Park Area',
        type: 'green-district',
        coordinates: { lat: 12.9716, lng: 77.5946 },
        area: 8.9,
        population: 95000,
        lst: 24.8,
        ndvi: 0.68,
        elevation: 920,
        landUse: 'recreational-commercial',
        infrastructure: 'excellent',
        greenSpaces: 0.45
      },
      {
        id: 'bangalore-4',
        name: 'Hebbal Industrial',
        type: 'industrial-zone',
        coordinates: { lat: 13.0358, lng: 77.5970 },
        area: 22.4,
        population: 320000,
        lst: 29.8,
        ndvi: 0.28,
        elevation: 900,
        landUse: 'industrial-residential',
        infrastructure: 'good',
        greenSpaces: 0.18
      }
    ]
  },

  chennai: {
    cityName: 'Chennai',
    state: 'Tamil Nadu',
    region: 'Southern India',
    totalArea: 426,
    zones: [
      {
        id: 'chennai-1',
        name: 'T Nagar Commercial',
        type: 'commercial-district',
        coordinates: { lat: 13.0418, lng: 80.2341 },
        area: 4.2,
        population: 280000,
        lst: 35.6,
        ndvi: 0.16,
        elevation: 6,
        landUse: 'commercial-residential',
        infrastructure: 'good',
        greenSpaces: 0.08
      },
      {
        id: 'chennai-2',
        name: 'Marina Beach Corridor',
        type: 'coastal-zone',
        coordinates: { lat: 13.0827, lng: 80.2707 },
        area: 18.6,
        population: 120000,
        lst: 32.4,
        ndvi: 0.25,
        elevation: 3,
        landUse: 'recreational-residential',
        infrastructure: 'good',
        greenSpaces: 0.35
      },
      {
        id: 'chennai-3',
        name: 'OMR IT Corridor',
        type: 'tech-corridor',
        coordinates: { lat: 12.9698, lng: 80.2429 },
        area: 25.8,
        population: 450000,
        lst: 34.2,
        ndvi: 0.22,
        elevation: 15,
        landUse: 'commercial-tech',
        infrastructure: 'excellent',
        greenSpaces: 0.19
      }
    ]
  },

  hyderabad: {
    cityName: 'Hyderabad',
    state: 'Telangana',
    region: 'Southern India',
    totalArea: 650,
    zones: [
      {
        id: 'hyderabad-1',
        name: 'HITEC City',
        type: 'tech-corridor',
        coordinates: { lat: 17.4483, lng: 78.3915 },
        area: 14.5,
        population: 180000,
        lst: 32.8,
        ndvi: 0.28,
        elevation: 515,
        landUse: 'commercial-tech',
        infrastructure: 'excellent',
        greenSpaces: 0.21
      },
      {
        id: 'hyderabad-2',
        name: 'Old City Charminar',
        type: 'historic-core',
        coordinates: { lat: 17.3616, lng: 78.4747 },
        area: 8.9,
        population: 420000,
        lst: 36.4,
        ndvi: 0.18,
        elevation: 505,
        landUse: 'heritage-commercial',
        infrastructure: 'fair',
        greenSpaces: 0.12
      },
      {
        id: 'hyderabad-3',
        name: 'Hussain Sagar Lake',
        type: 'water-adjacent',
        coordinates: { lat: 17.4239, lng: 78.4738 },
        area: 22.1,
        population: 85000,
        lst: 30.6,
        ndvi: 0.52,
        elevation: 542,
        landUse: 'recreational-residential',
        infrastructure: 'good',
        greenSpaces: 0.38
      }
    ]
  },

  // EASTERN INDIA
  kolkata: {
    cityName: 'Kolkata',
    state: 'West Bengal',
    region: 'Eastern India',
    totalArea: 205,
    zones: [
      {
        id: 'kolkata-1',
        name: 'Park Street Commercial',
        type: 'commercial-district',
        coordinates: { lat: 22.5726, lng: 88.3639 },
        area: 3.2,
        population: 180000,
        lst: 34.8,
        ndvi: 0.19,
        elevation: 9,
        landUse: 'commercial-heritage',
        infrastructure: 'good',
        greenSpaces: 0.14
      },
      {
        id: 'kolkata-2',
        name: 'Salt Lake City',
        type: 'planned-residential',
        coordinates: { lat: 22.5744, lng: 88.4348 },
        area: 16.8,
        population: 320000,
        lst: 32.4,
        ndvi: 0.35,
        elevation: 8,
        landUse: 'residential-commercial',
        infrastructure: 'excellent',
        greenSpaces: 0.26
      },
      {
        id: 'kolkata-3',
        name: 'Hooghly Riverfront',
        type: 'water-adjacent',
        coordinates: { lat: 22.5958, lng: 88.2636 },
        area: 12.4,
        population: 95000,
        lst: 31.2,
        ndvi: 0.42,
        elevation: 6,
        landUse: 'mixed-recreational',
        infrastructure: 'developing',
        greenSpaces: 0.32
      }
    ]
  },

  bhubaneswar: {
    cityName: 'Bhubaneswar',
    state: 'Odisha',
    region: 'Eastern India',
    totalArea: 422,
    zones: [
      {
        id: 'bhubaneswar-1',
        name: 'Temple City Core',
        type: 'heritage-district',
        coordinates: { lat: 20.2961, lng: 85.8245 },
        area: 8.5,
        population: 125000,
        lst: 33.6,
        ndvi: 0.38,
        elevation: 45,
        landUse: 'heritage-residential',
        infrastructure: 'good',
        greenSpaces: 0.28
      },
      {
        id: 'bhubaneswar-2',
        name: 'Infocity IT Hub',
        type: 'tech-corridor',
        coordinates: { lat: 20.3019, lng: 85.8449 },
        area: 12.8,
        population: 85000,
        lst: 31.9,
        ndvi: 0.44,
        elevation: 50,
        landUse: 'commercial-tech',
        infrastructure: 'excellent',
        greenSpaces: 0.32
      }
    ]
  },

  // WESTERN INDIA
  pune: {
    cityName: 'Pune',
    state: 'Maharashtra',
    region: 'Western India',
    totalArea: 729.1,
    zones: [
      {
        id: 'pune-1',
        name: 'Hinjawadi IT Hub',
        type: 'tech-corridor',
        coordinates: { lat: 18.5912, lng: 73.7389 },
        area: 15.2,
        population: 120000,
        lst: 28.9,
        ndvi: 0.35,
        elevation: 580,
        landUse: 'commercial-residential',
        infrastructure: 'excellent',
        greenSpaces: 0.28
      },
      {
        id: 'pune-2',
        name: 'Koregaon Park',
        type: 'affluent-residential',
        coordinates: { lat: 18.5362, lng: 73.8958 },
        area: 8.4,
        population: 65000,
        lst: 30.2,
        ndvi: 0.58,
        elevation: 560,
        landUse: 'residential-commercial',
        infrastructure: 'excellent',
        greenSpaces: 0.42
      },
      {
        id: 'pune-3',
        name: 'Pimpri Industrial',
        type: 'industrial-residential',
        coordinates: { lat: 18.6298, lng: 73.7997 },
        area: 18.6,
        population: 520000,
        lst: 35.8,
        ndvi: 0.24,
        elevation: 570,
        landUse: 'industrial-residential',
        infrastructure: 'good',
        greenSpaces: 0.16
      }
    ]
  },

  ahmedabad: {
    cityName: 'Ahmedabad',
    state: 'Gujarat',
    region: 'Western India',
    totalArea: 505,
    zones: [
      {
        id: 'ahmedabad-1',
        name: 'SG Highway Corridor',
        type: 'commercial-corridor',
        coordinates: { lat: 23.0225, lng: 72.5714 },
        area: 18.5,
        population: 280000,
        lst: 38.4,
        ndvi: 0.21,
        elevation: 53,
        landUse: 'commercial-residential',
        infrastructure: 'excellent',
        greenSpaces: 0.18
      },
      {
        id: 'ahmedabad-2',
        name: 'Old City Heritage',
        type: 'heritage-district',
        coordinates: { lat: 23.0258, lng: 72.5873 },
        area: 12.4,
        population: 450000,
        lst: 41.2,
        ndvi: 0.16,
        elevation: 53,
        landUse: 'heritage-commercial',
        infrastructure: 'fair',
        greenSpaces: 0.09
      },
      {
        id: 'ahmedabad-3',
        name: 'Sabarmati Riverfront',
        type: 'water-adjacent',
        coordinates: { lat: 23.0558, lng: 72.5673 },
        area: 22.8,
        population: 95000,
        lst: 35.6,
        ndvi: 0.48,
        elevation: 55,
        landUse: 'recreational-residential',
        infrastructure: 'excellent',
        greenSpaces: 0.42
      }
    ]
  }
};

// Generate aggregated city statistics
function calculateCityStats(cityData) {
  const zones = cityData.zones;
  const totalPopulation = zones.reduce((sum, zone) => sum + zone.population, 0);
  const avgLST = zones.reduce((sum, zone) => sum + zone.lst, 0) / zones.length;
  const avgNDVI = zones.reduce((sum, zone) => sum + zone.ndvi, 0) / zones.length;
  const avgGreenSpace = zones.reduce((sum, zone) => sum + zone.greenSpaces, 0) / zones.length;
  
  return {
    name: cityData.cityName,
    totalArea: cityData.totalArea,
    totalPopulation,
    totalZones: zones.length,
    avgTemperature: Math.round(avgLST * 10) / 10,
    avgNDVI: Math.round(avgNDVI * 100) / 100,
    avgGreenSpace: Math.round(avgGreenSpace * 1000) / 10, // as percentage
    populationDensity: Math.round((totalPopulation / cityData.totalArea) * 100) / 100,
    zones
  };
}

// Export processed city data
const processedCityData = {};
Object.keys(cityZonesData).forEach(cityKey => {
  processedCityData[cityKey] = calculateCityStats(cityZonesData[cityKey]);
});

module.exports = {
  cityZonesData: processedCityData,
  getAllZones: () => {
    const allZones = [];
    Object.values(processedCityData).forEach(city => {
      allZones.push(...city.zones);
    });
    return allZones;
  },
  getCityZones: (cityName) => {
    const city = Object.values(processedCityData).find(c => 
      c.name.toLowerCase() === cityName.toLowerCase()
    );
    return city ? city.zones : [];
  },
  getCityStats: (cityName) => {
    const city = Object.values(processedCityData).find(c => 
      c.name.toLowerCase() === cityName.toLowerCase()
    );
    return city || null;
  }
};