export interface AtmData {
  id: string;
  currency: 'HNL' | 'USD';
  location: string;
  description: string;
  buyFee: number;
  sellFee: number;
  mapUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const atms: AtmData[] = [
  {
    id: 'atm-usd',
    currency: 'USD',
    location: 'Próspera, Duna Residences lobby',
    description: 'Bitcoin ↔ US Dollars. 24/7 access (building access required).',
    buyFee: 5,
    sellFee: 2,
    mapUrl: 'https://maps.app.goo.gl/vk4FMaWYrzHRzxpi8',
    coordinates: {
      lat: 16.367053,
      lng: -86.471717,
    },
  },
  {
    id: 'atm-hnl',
    currency: 'HNL',
    location: 'West End, inside Sundowners',
    description: 'Bitcoin ↔ Honduran Lempira. Walk-in during business hours.',
    buyFee: 5,
    sellFee: 2,
    mapUrl: 'https://maps.app.goo.gl/3Uscbega6nP5z3bP7',
    coordinates: {
      lat: 16.363314,
      lng: -86.458631,
    },
  },
];
