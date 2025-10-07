// Dynamic Zone Generator for Indian Cities
// Generates realistic zone data for any Indian city based on population, climate, and geography

const { getCityByName } = require('./indian-cities-data');

class DynamicZoneGenerator {
    constructor() {
        // Zone types based on Indian urban patterns
        this.zoneTypes = {
            'commercial-district': {
                tempIncrease: 3.5,
                ndviBase: 0.15,
                greenSpaceBase: 0.10,
                populationDensityFactor: 2.5
            },
            'residential-dense': {
                tempIncrease: 2.8,
                ndviBase: 0.25,
                greenSpaceBase: 0.18,
                populationDensityFactor: 3.2
            },
            'residential-planned': {
                tempIncrease: 1.5,
                ndviBase: 0.35,
                greenSpaceBase: 0.28,
                populationDensityFactor: 1.8
            },
            'industrial-zone': {
                tempIncrease: 4.2,
                ndviBase: 0.12,
                greenSpaceBase: 0.08,
                populationDensityFactor: 1.5
            },
            'tech-corridor': {
                tempIncrease: 2.2,
                ndviBase: 0.28,
                greenSpaceBase: 0.22,
                populationDensityFactor: 1.2
            },
            'heritage-district': {
                tempIncrease: 2.0,
                ndviBase: 0.20,
                greenSpaceBase: 0.15,
                populationDensityFactor: 2.8
            },
            'suburban-residential': {
                tempIncrease: 0.8,
                ndviBase: 0.45,
                greenSpaceBase: 0.35,
                populationDensityFactor: 1.0
            },
            'slum-settlement': {
                tempIncrease: 3.8,
                ndviBase: 0.10,
                greenSpaceBase: 0.05,
                populationDensityFactor: 5.5
            }
        };

        // Infrastructure quality mapping
        this.infrastructureMapping = {
            'metro-tier1': ['excellent', 'good', 'fair'],
            'metro-tier2': ['good', 'fair', 'developing'],
            'city-tier2': ['fair', 'developing', 'poor'],
            'city-tier3': ['developing', 'poor', 'basic']
        };
    }

    generateZonesForCity(cityName) {
        const city = getCityByName(cityName);
        if (!city) {
            throw new Error(`City ${cityName} not found`);
        }

        // Determine city tier and characteristics
        const cityTier = this.determineCityTier(city);
        const numberOfZones = this.calculateNumberOfZones(city.population);
        const zoneTypes = this.selectZoneTypes(city, cityTier, numberOfZones);
        
        const zones = [];
        const baseTemp = city.data.temperature;
        const baseNDVI = city.data.ndvi;

        for (let i = 0; i < numberOfZones; i++) {
            const zoneType = zoneTypes[i % zoneTypes.length];
            const zone = this.generateZone(city, zoneType, i + 1, baseTemp, baseNDVI, cityTier);
            zones.push(zone);
        }

        return {
            cityName: city.name,
            state: city.state,
            region: city.region,
            totalArea: this.calculateCityArea(city.population),
            totalPopulation: city.population,
            zones: zones,
            generatedAt: new Date().toISOString()
        };
    }

    determineCityTier(city) {
        const population = city.population;
        
        if (population >= 10000000) return 'metro-tier1'; // 10M+
        if (population >= 5000000) return 'metro-tier2';  // 5M-10M
        if (population >= 1000000) return 'city-tier2';   // 1M-5M
        return 'city-tier3';                               // <1M
    }

    calculateNumberOfZones(population) {
        if (population >= 10000000) return 8; // Large metros
        if (population >= 5000000) return 6;  // Medium metros
        if (population >= 2000000) return 5;  // Large cities
        if (population >= 1000000) return 4;  // Medium cities
        if (population >= 500000) return 3;   // Small cities
        return 2;                              // Towns
    }

    selectZoneTypes(city, cityTier, numberOfZones) {
        const availableTypes = Object.keys(this.zoneTypes);
        const selectedTypes = [];

        // Always include commercial and residential zones
        selectedTypes.push('commercial-district');
        selectedTypes.push('residential-dense');

        // Add zone types based on city characteristics
        if (city.region === 'Western' || city.region === 'Southern') {
            selectedTypes.push('tech-corridor');
        }

        if (cityTier === 'metro-tier1' || cityTier === 'metro-tier2') {
            selectedTypes.push('industrial-zone');
            selectedTypes.push('residential-planned');
        }

        if (city.population >= 2000000) {
            selectedTypes.push('suburban-residential');
        }

        // Add heritage district for cities with cultural significance
        if (this.hasHistoricalSignificance(city.name)) {
            selectedTypes.push('heritage-district');
        }

        // Fill remaining slots with appropriate types
        while (selectedTypes.length < numberOfZones) {
            const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            if (!selectedTypes.includes(randomType)) {
                selectedTypes.push(randomType);
            }
        }

        return selectedTypes.slice(0, numberOfZones);
    }

    generateZone(city, zoneType, index, baseTemp, baseNDVI, cityTier) {
        const typeConfig = this.zoneTypes[zoneType];
        const coordinates = this.generateCoordinatesNearCity(city.coordinates, index);
        
        // Calculate zone characteristics
        const temperature = baseTemp + typeConfig.tempIncrease + (Math.random() - 0.5) * 2;
        const ndvi = Math.max(0.05, Math.min(0.8, typeConfig.ndviBase + (Math.random() - 0.5) * 0.15));
        const greenSpaces = Math.max(0.02, Math.min(0.5, typeConfig.greenSpaceBase + (Math.random() - 0.5) * 0.1));
        
        // Calculate population for this zone
        const zonePopulation = this.calculateZonePopulation(
            city.population, 
            typeConfig.populationDensityFactor,
            index
        );

        // Determine infrastructure quality
        const infrastructureOptions = this.infrastructureMapping[cityTier];
        const infrastructure = infrastructureOptions[Math.floor(Math.random() * infrastructureOptions.length)];

        return {
            id: `${city.name.toLowerCase()}-zone-${index}`,
            name: `${this.generateZoneName(city.name, zoneType, index)}`,
            type: zoneType,
            coordinates: coordinates,
            area: this.calculateZoneArea(zonePopulation, typeConfig.populationDensityFactor),
            population: zonePopulation,
            lst: Math.round(temperature * 10) / 10,
            ndvi: Math.round(ndvi * 100) / 100,
            elevation: this.estimateElevation(city.coordinates, city.region),
            landUse: this.mapZoneTypeToLandUse(zoneType),
            infrastructure: infrastructure,
            greenSpaces: Math.round(greenSpaces * 100) / 100
        };
    }

    generateCoordinatesNearCity(centerCoords, index) {
        // Generate coordinates within ~15km radius of city center
        const radiusKm = 15;
        const radiusDegrees = radiusKm / 111; // Rough conversion

        const angle = (index * 45 + Math.random() * 45) * (Math.PI / 180);
        const distance = Math.random() * radiusDegrees;

        return {
            lat: Math.round((centerCoords.lat + distance * Math.cos(angle)) * 10000) / 10000,
            lng: Math.round((centerCoords.lng + distance * Math.sin(angle)) * 10000) / 10000
        };
    }

    calculateZonePopulation(totalPopulation, densityFactor, index) {
        // Distribute population with some variation
        const basePerZone = totalPopulation / 6; // Assume 6 zones on average
        const variation = (Math.random() - 0.5) * 0.6; // ±30% variation
        return Math.round(basePerZone * densityFactor * (1 + variation));
    }

    calculateZoneArea(population, densityFactor) {
        // Rough area calculation in sq km
        const baseDensity = 15000; // people per sq km
        return Math.round((population / (baseDensity * densityFactor)) * 100) / 100;
    }

    calculateCityArea(population) {
        // Rough city area estimation
        if (population >= 10000000) return 1500;
        if (population >= 5000000) return 800;
        if (population >= 2000000) return 500;
        if (population >= 1000000) return 300;
        if (population >= 500000) return 150;
        return 80;
    }

    generateZoneName(cityName, zoneType, index) {
        const prefixes = {
            'commercial-district': ['Central', 'Main Market', 'Business', 'Trade Center'],
            'residential-dense': ['Old City', 'Central', 'Dense Housing', 'Urban Core'],
            'residential-planned': ['New Town', 'Planned City', 'Modern', 'Garden City'],
            'industrial-zone': ['Industrial Area', 'Manufacturing Hub', 'Factory Zone', 'Production Center'],
            'tech-corridor': ['IT Hub', 'Tech City', 'Software Park', 'Cyber City'],
            'heritage-district': ['Old Quarter', 'Historic Center', 'Heritage Zone', 'Traditional'],
            'suburban-residential': ['Suburbs', 'Outer Ring', 'Residential Extension', 'New Development'],
            'slum-settlement': ['Dense Settlement', 'Urban Village', 'Informal Housing', 'Transit Camp']
        };

        const typeNames = prefixes[zoneType] || ['Zone'];
        const selectedName = typeNames[Math.floor(Math.random() * typeNames.length)];
        
        return `${selectedName} ${index}`;
    }

    mapZoneTypeToLandUse(zoneType) {
        const mapping = {
            'commercial-district': 'commercial-mixed',
            'residential-dense': 'residential-high-density',
            'residential-planned': 'residential-planned',
            'industrial-zone': 'industrial-manufacturing',
            'tech-corridor': 'commercial-tech',
            'heritage-district': 'heritage-commercial',
            'suburban-residential': 'residential-suburban',
            'slum-settlement': 'residential-informal'
        };
        return mapping[zoneType] || 'mixed-use';
    }

    estimateElevation(coordinates, region) {
        // Rough elevation estimates by region
        const regionElevations = {
            'Northern': 200 + Math.random() * 300,
            'Western': 400 + Math.random() * 200,
            'Southern': 600 + Math.random() * 400,
            'Eastern': 50 + Math.random() * 150,
            'Central': 300 + Math.random() * 200
        };
        
        return Math.round(regionElevations[region] || 200);
    }

    hasHistoricalSignificance(cityName) {
        const historicalCities = [
            'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Hyderabad', 
            'Bangalore', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow',
            'Varanasi', 'Agra', 'Jodhpur', 'Udaipur', 'Mysore',
            'Amritsar', 'Chandigarh', 'Bhopal', 'Indore', 'Nagpur'
        ];
        
        return historicalCities.some(city => 
            cityName.toLowerCase().includes(city.toLowerCase())
        );
    }
}

module.exports = { DynamicZoneGenerator };