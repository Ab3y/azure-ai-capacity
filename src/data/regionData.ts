export interface AzureRegion {
  name: string;
  displayName: string;
  geography: string;
  latitude: number;
  longitude: number;
  hasOpenAI: boolean;
}

export const AZURE_REGIONS: AzureRegion[] = [
  { name: 'eastus', displayName: 'East US', geography: 'United States', latitude: 37.3719, longitude: -79.8164, hasOpenAI: true },
  { name: 'eastus2', displayName: 'East US 2', geography: 'United States', latitude: 36.6681, longitude: -78.3889, hasOpenAI: true },
  { name: 'westus', displayName: 'West US', geography: 'United States', latitude: 37.783, longitude: -122.417, hasOpenAI: true },
  { name: 'westus3', displayName: 'West US 3', geography: 'United States', latitude: 33.4484, longitude: -112.0740, hasOpenAI: true },
  { name: 'centralus', displayName: 'Central US', geography: 'United States', latitude: 41.5908, longitude: -93.6208, hasOpenAI: true },
  { name: 'northcentralus', displayName: 'North Central US', geography: 'United States', latitude: 41.8819, longitude: -87.6278, hasOpenAI: true },
  { name: 'southcentralus', displayName: 'South Central US', geography: 'United States', latitude: 29.4167, longitude: -98.5, hasOpenAI: true },
  { name: 'canadaeast', displayName: 'Canada East', geography: 'Canada', latitude: 46.817, longitude: -71.217, hasOpenAI: true },
  { name: 'uksouth', displayName: 'UK South', geography: 'United Kingdom', latitude: 50.941, longitude: -0.799, hasOpenAI: true },
  { name: 'westeurope', displayName: 'West Europe', geography: 'Europe', latitude: 52.3667, longitude: 4.9, hasOpenAI: true },
  { name: 'northeurope', displayName: 'North Europe', geography: 'Europe', latitude: 53.3478, longitude: -6.2597, hasOpenAI: true },
  { name: 'francecentral', displayName: 'France Central', geography: 'France', latitude: 46.3772, longitude: 2.3730, hasOpenAI: true },
  { name: 'swedencentral', displayName: 'Sweden Central', geography: 'Sweden', latitude: 60.6749, longitude: 17.1413, hasOpenAI: true },
  { name: 'switzerlandnorth', displayName: 'Switzerland North', geography: 'Switzerland', latitude: 47.451542, longitude: 8.564572, hasOpenAI: true },
  { name: 'germanywestcentral', displayName: 'Germany West Central', geography: 'Germany', latitude: 50.110924, longitude: 8.682127, hasOpenAI: true },
  { name: 'norwayeast', displayName: 'Norway East', geography: 'Norway', latitude: 59.9139, longitude: 10.7522, hasOpenAI: true },
  { name: 'japaneast', displayName: 'Japan East', geography: 'Japan', latitude: 35.68, longitude: 139.77, hasOpenAI: true },
  { name: 'koreacentral', displayName: 'Korea Central', geography: 'South Korea', latitude: 37.5665, longitude: 126.978, hasOpenAI: true },
  { name: 'australiaeast', displayName: 'Australia East', geography: 'Australia', latitude: -33.86, longitude: 151.2094, hasOpenAI: true },
  { name: 'southeastasia', displayName: 'Southeast Asia', geography: 'Asia Pacific', latitude: 1.283, longitude: 103.833, hasOpenAI: true },
  { name: 'eastasia', displayName: 'East Asia', geography: 'Asia Pacific', latitude: 22.267, longitude: 114.188, hasOpenAI: true },
  { name: 'southafricanorth', displayName: 'South Africa North', geography: 'Africa', latitude: -25.73, longitude: 28.21, hasOpenAI: true },
  { name: 'brazilsouth', displayName: 'Brazil South', geography: 'South America', latitude: -23.55, longitude: -46.633, hasOpenAI: true },
  { name: 'uaenorth', displayName: 'UAE North', geography: 'Middle East', latitude: 25.2667, longitude: 55.3167, hasOpenAI: true },
  { name: 'indiacentral', displayName: 'Central India', geography: 'India', latitude: 18.5822, longitude: 73.9197, hasOpenAI: false },
  { name: 'indiasouth', displayName: 'South India', geography: 'India', latitude: 12.9822, longitude: 80.1636, hasOpenAI: false },
];

export const GEOGRAPHIES = [...new Set(AZURE_REGIONS.map(r => r.geography))];
