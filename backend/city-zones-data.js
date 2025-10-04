// Detailed neighborhood-level zone data for Maharashtra cities
// Based on satellite data patterns, census data, and urban morphology

const cityZonesData = {
  mumbai: {
    cityName: 'Mumbai',
    totalArea: 603.4, // sq km
    zones: [
      {
        id: 'mumbai-1',
        name: 'Dharavi',
        type: 'high-density-slum',
        coordinates: { lat: 19.0428, lng: 72.8517 },
        area: 2.1, // sq km
        population: 1200000,
        lst: 38.2, // Land Surface Temperature (°C)
        ndvi: 0.12, // Normalized Difference Vegetation Index
        elevation: 12,
        landUse: 'residential-mixed',
        infrastructure: 'poor',
        greenSpaces: 0.02 // 2% green space
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
        name: 'Fort & CBD',
        type: 'business-district',
        coordinates: { lat: 18.9335, lng: 72.8351 },
        area: 6.2,
        population: 45000,
        lst: 41.3,
        ndvi: 0.15,
        elevation: 8,
        landUse: 'commercial-office',
        infrastructure: 'excellent',
        greenSpaces: 0.08
      },
      {
        id: 'mumbai-4',
        name: 'Powai',
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
      },
      {
        id: 'mumbai-5',
        name: 'Andheri East',
        type: 'mixed-development',
        coordinates: { lat: 19.1146, lng: 72.8681 },
        area: 8.7,
        population: 420000,
        lst: 36.9,
        ndvi: 0.28,
        elevation: 25,
        landUse: 'residential-commercial',
        infrastructure: 'good',
        greenSpaces: 0.18
      },
      {
        id: 'mumbai-6',
        name: 'Kurla',
        type: 'dense-residential',
        coordinates: { lat: 19.0728, lng: 72.8797 },
        area: 5.3,
        population: 650000,
        lst: 39.1,
        ndvi: 0.19,
        elevation: 15,
        landUse: 'residential-mixed',
        infrastructure: 'fair',
        greenSpaces: 0.12
      },
      {
        id: 'mumbai-7',
        name: 'Sanjay Gandhi National Park Buffer',
        type: 'green-belt',
        coordinates: { lat: 19.2147, lng: 72.9081 },
        area: 25.8,
        population: 12000,
        lst: 29.4,
        ndvi: 0.78,
        elevation: 78,
        landUse: 'forest-residential',
        infrastructure: 'basic',
        greenSpaces: 0.85
      },
      {
        id: 'mumbai-8',
        name: 'Vikhroli Industrial',
        type: 'industrial-zone',
        coordinates: { lat: 19.1075, lng: 72.9222 },
        area: 7.9,
        population: 85000,
        lst: 43.8,
        ndvi: 0.08,
        elevation: 12,
        landUse: 'industrial-residential',
        infrastructure: 'good',
        greenSpaces: 0.05
      }
    ]
  },
  
  pune: {
    cityName: 'Pune',
    totalArea: 729.1,
    zones: [
      {
        id: 'pune-1',
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
        id: 'pune-2',
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
        id: 'pune-3',
        name: 'Old City (Pune Cantonment)',
        type: 'historic-core',
        coordinates: { lat: 18.5204, lng: 73.8567 },
        area: 12.8,
        population: 320000,
        lst: 33.4,
        ndvi: 0.32,
        elevation: 560,
        landUse: 'mixed-heritage',
        infrastructure: 'good',
        greenSpaces: 0.22
      },
      {
        id: 'pune-4',
        name: 'Pimpri-Chinchwad',
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
      },
      {
        id: 'pune-5',
        name: 'Baner-Pashan',
        type: 'suburban-growth',
        coordinates: { lat: 18.5601, lng: 73.7816 },
        area: 22.4,
        population: 180000,
        lst: 29.6,
        ndvi: 0.48,
        elevation: 600,
        landUse: 'residential-commercial',
        infrastructure: 'excellent',
        greenSpaces: 0.31
      },
      {
        id: 'pune-6',
        name: 'Katraj-Kondhwa',
        type: 'emerging-residential',
        coordinates: { lat: 18.4586, lng: 73.8742 },
        area: 28.9,
        population: 210000,
        lst: 31.8,
        ndvi: 0.41,
        elevation: 580,
        landUse: 'residential-agricultural',
        infrastructure: 'developing',
        greenSpaces: 0.25
      }
    ]
  },

  nagpur: {
    cityName: 'Nagpur',
    totalArea: 227.4,
    zones: [
      {
        id: 'nagpur-1',
        name: 'Civil Lines',
        type: 'government-district',
        coordinates: { lat: 21.1619, lng: 79.0865 },
        area: 8.9,
        population: 75000,
        lst: 41.2,
        ndvi: 0.45,
        elevation: 312,
        landUse: 'government-residential',
        infrastructure: 'excellent',
        greenSpaces: 0.38
      },
      {
        id: 'nagpur-2',
        name: 'Dharampeth',
        type: 'dense-residential',
        coordinates: { lat: 21.1358, lng: 79.0882 },
        area: 4.2,
        population: 180000,
        lst: 43.8,
        ndvi: 0.18,
        elevation: 310,
        landUse: 'residential-commercial',
        infrastructure: 'good',
        greenSpaces: 0.15
      },
      {
        id: 'nagpur-3',
        name: 'MIDC Hingna',
        type: 'industrial-zone',
        coordinates: { lat: 21.0724, lng: 78.9644 },
        area: 35.6,
        population: 95000,
        lst: 45.9,
        ndvi: 0.09,
        elevation: 295,
        landUse: 'industrial',
        infrastructure: 'fair',
        greenSpaces: 0.06
      },
      {
        id: 'nagpur-4',
        name: 'Seminary Hills',
        type: 'hilly-residential',
        coordinates: { lat: 21.1180, lng: 79.0441 },
        area: 12.4,
        population: 85000,
        lst: 35.6,
        ndvi: 0.62,
        elevation: 350,
        landUse: 'residential',
        infrastructure: 'excellent',
        greenSpaces: 0.45
      },
      {
        id: 'nagpur-5',
        name: 'Butibori Industrial',
        type: 'new-industrial',
        coordinates: { lat: 21.2069, lng: 78.9975 },
        area: 45.8,
        population: 65000,
        lst: 44.3,
        ndvi: 0.12,
        elevation: 305,
        landUse: 'industrial-logistics',
        infrastructure: 'developing',
        greenSpaces: 0.08
      }
    ]
  },

  nashik: {
    cityName: 'Nashik',
    totalArea: 268.8,
    zones: [
      {
        id: 'nashik-1',
        name: 'Old Nashik',
        type: 'historic-religious',
        coordinates: { lat: 19.9975, lng: 73.7898 },
        area: 6.8,
        population: 140000,
        lst: 35.4,
        ndvi: 0.28,
        elevation: 565,
        landUse: 'mixed-heritage',
        infrastructure: 'good',
        greenSpaces: 0.20
      },
      {
        id: 'nashik-2',
        name: 'Nashik Road Industrial',
        type: 'industrial-corridor',
        coordinates: { lat: 19.9441, lng: 73.8075 },
        area: 25.4,
        population: 85000,
        lst: 38.9,
        ndvi: 0.16,
        elevation: 520,
        landUse: 'industrial-residential',
        infrastructure: 'good',
        greenSpaces: 0.12
      },
      {
        id: 'nashik-3',
        name: 'Gangapur Dam Area',
        type: 'water-adjacent',
        coordinates: { lat: 20.0297, lng: 73.7089 },
        area: 18.9,
        population: 45000,
        lst: 28.6,
        ndvi: 0.68,
        elevation: 490,
        landUse: 'agricultural-residential',
        infrastructure: 'basic',
        greenSpaces: 0.55
      },
      {
        id: 'nashik-4',
        name: 'Ambad MIDC',
        type: 'industrial-zone',
        coordinates: { lat: 19.9189, lng: 73.8542 },
        area: 32.8,
        population: 78000,
        lst: 40.2,
        ndvi: 0.14,
        elevation: 540,
        landUse: 'industrial',
        infrastructure: 'good',
        greenSpaces: 0.09
      }
    ]
  },

  aurangabad: {
    cityName: 'Aurangabad',
    totalArea: 138.5,
    zones: [
      {
        id: 'aurangabad-1',
        name: 'Historic City',
        type: 'unesco-heritage',
        coordinates: { lat: 19.8762, lng: 75.3433 },
        area: 8.2,
        population: 95000,
        lst: 37.8,
        ndvi: 0.25,
        elevation: 568,
        landUse: 'heritage-mixed',
        infrastructure: 'good',
        greenSpaces: 0.18
      },
      {
        id: 'aurangabad-2',
        name: 'Chikalthana Industrial',
        type: 'aerospace-industrial',
        coordinates: { lat: 19.8728, lng: 75.3981 },
        area: 28.4,
        population: 52000,
        lst: 41.6,
        ndvi: 0.11,
        elevation: 555,
        landUse: 'industrial-aerospace',
        infrastructure: 'excellent',
        greenSpaces: 0.08
      },
      {
        id: 'aurangabad-3',
        name: 'Cantonment',
        type: 'planned-residential',
        coordinates: { lat: 19.8667, lng: 75.3264 },
        area: 12.6,
        population: 68000,
        lst: 34.2,
        ndvi: 0.48,
        elevation: 575,
        landUse: 'residential-institutional',
        infrastructure: 'excellent',
        greenSpaces: 0.35
      }
    ]
  },

  thane: {
    cityName: 'Thane',
    totalArea: 147.2,
    zones: [
      {
        id: 'thane-1',
        name: 'Thane West CBD',
        type: 'business-district',
        coordinates: { lat: 19.2183, lng: 72.9781 },
        area: 5.8,
        population: 185000,
        lst: 36.8,
        ndvi: 0.22,
        elevation: 22,
        landUse: 'commercial-residential',
        infrastructure: 'excellent',
        greenSpaces: 0.16
      },
      {
        id: 'thane-2',
        name: 'Ghodbunder Road Corridor',
        type: 'linear-development',
        coordinates: { lat: 19.2570, lng: 72.9644 },
        area: 18.4,
        population: 220000,
        lst: 34.9,
        ndvi: 0.31,
        elevation: 35,
        landUse: 'residential-commercial',
        infrastructure: 'good',
        greenSpaces: 0.24
      },
      {
        id: 'thane-3',
        name: 'Yeoor Hills',
        type: 'forest-fringe',
        coordinates: { lat: 19.2194, lng: 72.9486 },
        area: 22.8,
        population: 28000,
        lst: 30.1,
        ndvi: 0.74,
        elevation: 125,
        landUse: 'forest-low-density-residential',
        infrastructure: 'basic',
        greenSpaces: 0.78
      },
      {
        id: 'thane-4',
        name: 'Kalwa Industrial',
        type: 'petrochemical-industrial',
        coordinates: { lat: 19.1944, lng: 72.9908 },
        area: 8.9,
        population: 95000,
        lst: 42.4,
        ndvi: 0.08,
        elevation: 18,
        landUse: 'heavy-industrial',
        infrastructure: 'fair',
        greenSpaces: 0.04
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