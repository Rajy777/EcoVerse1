// Advanced Environmental Analysis Algorithms
// Based on NASA MODIS satellite data and scientific research

/**
 * Statistical utility functions
 */
function calculateMean(values) {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function calculateStandardDeviation(values, mean) {
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function calculateZScore(value, mean, stdDev) {
  return stdDev === 0 ? 0 : (value - mean) / stdDev;
}

/**
 * 1. Hotspot Detection Algorithm
 * Formula: Score = z(LST) (standardized Land Surface Temperature)
 * Uses NASA MODIS satellite data simulation with 1km resolution
 */
class HotspotDetection {
  constructor(cityZones) {
    this.cityZones = cityZones;
    this.temperatures = cityZones.map(zone => zone.lst);
    this.meanLST = calculateMean(this.temperatures);
    this.stdDevLST = calculateStandardDeviation(this.temperatures, this.meanLST);
  }

  detectHotspots() {
    return this.cityZones.map(zone => {
      const zLST = calculateZScore(zone.lst, this.meanLST, this.stdDevLST);
      
      // Determine hotspot category based on z-score
      let category = 'normal';
      let priority = 'low';
      let interventionNeeded = false;
      
      if (zLST >= 2.0) {
        category = 'extreme-hotspot';
        priority = 'critical';
        interventionNeeded = true;
      } else if (zLST >= 1.5) {
        category = 'severe-hotspot';
        priority = 'high';
        interventionNeeded = true;
      } else if (zLST >= 1.0) {
        category = 'moderate-hotspot';
        priority = 'medium';
        interventionNeeded = true;
      } else if (zLST >= 0.5) {
        category = 'mild-hotspot';
        priority = 'low';
        interventionNeeded = false;
      }

      return {
        ...zone,
        hotspot: {
          zScore: Math.round(zLST * 100) / 100,
          category,
          priority,
          interventionNeeded,
          temperatureDifferential: Math.round((zone.lst - this.meanLST) * 10) / 10,
          coolingPotential: interventionNeeded ? Math.round(Math.min(zLST * 1.2, 2.5) * 10) / 10 : 0
        }
      };
    });
  }
}

/**
 * 2. Park Recommendation Algorithm  
 * Formula: Score = (z(LST) + (-z(NDVI))) × (1 + log₁₀(population))
 * Combines temperature, vegetation, and population density
 */
class ParkRecommendation {
  constructor(cityZones) {
    this.cityZones = cityZones;
    this.temperatures = cityZones.map(zone => zone.lst);
    this.ndviValues = cityZones.map(zone => zone.ndvi);
    this.populations = cityZones.map(zone => zone.population);
    
    this.meanLST = calculateMean(this.temperatures);
    this.stdDevLST = calculateStandardDeviation(this.temperatures, this.meanLST);
    this.meanNDVI = calculateMean(this.ndviValues);
    this.stdDevNDVI = calculateStandardDeviation(this.ndviValues, this.meanNDVI);
  }

  generateRecommendations() {
    const recommendations = this.cityZones.map(zone => {
      const zLST = calculateZScore(zone.lst, this.meanLST, this.stdDevLST);
      const zNDVI = calculateZScore(zone.ndvi, this.meanNDVI, this.stdDevNDVI);
      
      // Population weighting with logarithmic scaling
      const populationWeight = 1 + Math.log10(Math.max(zone.population, 1));
      
      // Combined score: high temperature + low vegetation + high population = high score
      const score = (zLST + (-zNDVI)) * populationWeight;
      
      // Determine recommendation category
      let category = 'not-recommended';
      let parkType = 'none';
      let treesNeeded = 0;
      
      if (score >= 3.0) {
        category = 'highest-priority';
        parkType = 'large-urban-forest';
        treesNeeded = Math.floor(zone.area * 0.4); // 40% tree coverage
      } else if (score >= 2.0) {
        category = 'high-priority';
        parkType = 'community-park';
        treesNeeded = Math.floor(zone.area * 0.3); // 30% tree coverage
      } else if (score >= 1.0) {
        category = 'medium-priority';
        parkType = 'pocket-park';
        treesNeeded = Math.floor(zone.area * 0.2); // 20% tree coverage
      } else if (score >= 0.5) {
        category = 'low-priority';
        parkType = 'green-corridor';
        treesNeeded = Math.floor(zone.area * 0.1); // 10% tree coverage
      }

      return {
        ...zone,
        parkRecommendation: {
          score: Math.round(score * 100) / 100,
          category,
          parkType,
          treesNeeded,
          projectedCooling: treesNeeded > 0 ? Math.round((treesNeeded / zone.area) * 5 * 10) / 10 : 0,
          estimatedCost: treesNeeded * 150, // $150 per tree including planting
          timeframe: treesNeeded > 100 ? '2-3 years' : treesNeeded > 0 ? '1-2 years' : 'N/A'
        }
      };
    });

    return recommendations.sort((a, b) => b.parkRecommendation.score - a.parkRecommendation.score);
  }
}

/**
 * 3. Clinic Placement Algorithm
 * Formula: Score = z(population) (standardized population density)
 * Uses WorldPop data simulation for precise population mapping
 */
class ClinicPlacement {
  constructor(cityZones) {
    this.cityZones = cityZones;
    this.populations = cityZones.map(zone => zone.population);
    this.meanPopulation = calculateMean(this.populations);
    this.stdDevPopulation = calculateStandardDeviation(this.populations, this.meanPopulation);
  }

  recommendPlacements() {
    return this.cityZones.map(zone => {
      const zPopulation = calculateZScore(zone.population, this.meanPopulation, this.stdDevPopulation);
      
      // Determine clinic recommendation based on population z-score
      let clinicType = 'none';
      let priority = 'not-needed';
      let capacity = 0;
      let servicingPopulation = 0;
      
      if (zPopulation >= 2.0) {
        clinicType = 'regional-hospital';
        priority = 'critical';
        capacity = Math.floor(zone.population / 1000); // 1 bed per 1000 people
        servicingPopulation = zone.population + (zone.population * 0.3); // 30% overflow
      } else if (zPopulation >= 1.5) {
        clinicType = 'specialty-clinic';
        priority = 'high';
        capacity = Math.floor(zone.population / 2000); // 1 bed per 2000 people
        servicingPopulation = zone.population + (zone.population * 0.2); // 20% overflow
      } else if (zPopulation >= 1.0) {
        clinicType = 'primary-health-center';
        priority = 'medium';
        capacity = Math.floor(zone.population / 3000); // 1 bed per 3000 people
        servicingPopulation = zone.population + (zone.population * 0.1); // 10% overflow
      } else if (zPopulation >= 0.5) {
        clinicType = 'community-health-post';
        priority = 'low';
        capacity = Math.floor(zone.population / 5000); // 1 bed per 5000 people
        servicingPopulation = zone.population;
      }

      return {
        ...zone,
        clinicRecommendation: {
          zScore: Math.round(zPopulation * 100) / 100,
          clinicType,
          priority,
          capacity,
          servicingPopulation,
          estimatedCost: capacity > 0 ? capacity * 50000 : 0, // $50,000 per bed capacity
          staffNeeded: Math.ceil(capacity / 10), // 1 staff per 10 beds
          constructionTime: capacity > 50 ? '18-24 months' : capacity > 0 ? '6-12 months' : 'N/A'
        }
      };
    });
  }
}

/**
 * Comprehensive Zone Analysis
 * Combines all three algorithms for complete urban planning insights
 */
class ZoneAnalysis {
  constructor(cityZones) {
    this.cityZones = cityZones;
    this.hotspotDetector = new HotspotDetection(cityZones);
    this.parkRecommendor = new ParkRecommendation(cityZones);
    this.clinicPlacer = new ClinicPlacement(cityZones);
  }

  performCompleteAnalysis() {
    const hotspots = this.hotspotDetector.detectHotspots();
    const parkRecommendations = this.parkRecommendor.generateRecommendations();
    const clinicPlacements = this.clinicPlacer.recommendPlacements();

    // Merge all analyses
    const completeAnalysis = this.cityZones.map((zone, index) => {
      return {
        ...zone,
        analysis: {
          hotspot: hotspots[index].hotspot,
          parkRecommendation: parkRecommendations.find(p => p.id === zone.id).parkRecommendation,
          clinicRecommendation: clinicPlacements[index].clinicRecommendation,
          overallPriority: this.calculateOverallPriority(
            hotspots[index].hotspot,
            parkRecommendations.find(p => p.id === zone.id).parkRecommendation,
            clinicPlacements[index].clinicRecommendation
          )
        }
      };
    });

    return {
      zones: completeAnalysis,
      summary: this.generateSummary(completeAnalysis),
      recommendations: this.generateActionPlan(completeAnalysis)
    };
  }

  calculateOverallPriority(hotspot, park, clinic) {
    const weights = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
      'not-needed': 0,
      'not-recommended': 0
    };

    const hotspotWeight = weights[hotspot.priority] || 0;
    const parkWeight = weights[park.category.includes('priority') ? park.category.split('-')[0] : 'not-recommended'] || 0;
    const clinicWeight = weights[clinic.priority] || 0;

    const totalScore = (hotspotWeight * 0.4) + (parkWeight * 0.4) + (clinicWeight * 0.2);

    if (totalScore >= 3) return 'critical';
    if (totalScore >= 2) return 'high';
    if (totalScore >= 1) return 'medium';
    return 'low';
  }

  generateSummary(zones) {
    return {
      totalZones: zones.length,
      hotspots: {
        extreme: zones.filter(z => z.analysis.hotspot.category === 'extreme-hotspot').length,
        severe: zones.filter(z => z.analysis.hotspot.category === 'severe-hotspot').length,
        moderate: zones.filter(z => z.analysis.hotspot.category === 'moderate-hotspot').length,
        mild: zones.filter(z => z.analysis.hotspot.category === 'mild-hotspot').length
      },
      parkRecommendations: {
        highest: zones.filter(z => z.analysis.parkRecommendation.category === 'highest-priority').length,
        high: zones.filter(z => z.analysis.parkRecommendation.category === 'high-priority').length,
        medium: zones.filter(z => z.analysis.parkRecommendation.category === 'medium-priority').length,
        low: zones.filter(z => z.analysis.parkRecommendation.category === 'low-priority').length
      },
      clinicRecommendations: {
        regional: zones.filter(z => z.analysis.clinicRecommendation.clinicType === 'regional-hospital').length,
        specialty: zones.filter(z => z.analysis.clinicRecommendation.clinicType === 'specialty-clinic').length,
        primary: zones.filter(z => z.analysis.clinicRecommendation.clinicType === 'primary-health-center').length,
        community: zones.filter(z => z.analysis.clinicRecommendation.clinicType === 'community-health-post').length
      }
    };
  }

  generateActionPlan(zones) {
    const criticalZones = zones.filter(z => z.analysis.overallPriority === 'critical');
    const highPriorityZones = zones.filter(z => z.analysis.overallPriority === 'high');
    
    return {
      immediate: criticalZones.map(zone => ({
        zoneName: zone.name,
        actions: [
          zone.analysis.hotspot.interventionNeeded ? 'Deploy cooling interventions' : null,
          zone.analysis.parkRecommendation.score >= 2 ? `Create ${zone.analysis.parkRecommendation.parkType}` : null,
          zone.analysis.clinicRecommendation.priority === 'critical' ? `Establish ${zone.analysis.clinicRecommendation.clinicType}` : null
        ].filter(Boolean)
      })),
      shortTerm: highPriorityZones.map(zone => ({
        zoneName: zone.name,
        actions: [
          zone.analysis.hotspot.interventionNeeded ? 'Plan heat mitigation strategies' : null,
          zone.analysis.parkRecommendation.score >= 1 ? `Develop ${zone.analysis.parkRecommendation.parkType}` : null,
          zone.analysis.clinicRecommendation.priority === 'high' ? `Plan ${zone.analysis.clinicRecommendation.clinicType}` : null
        ].filter(Boolean)
      }))
    };
  }
}

module.exports = {
  HotspotDetection,
  ParkRecommendation,
  ClinicPlacement,
  ZoneAnalysis
};