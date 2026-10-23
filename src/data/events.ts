export interface EventData {
  id: string;
  titleKey: string;
  descriptionKey: string;
  detailKey?: string;
  schedule: 'weekly' | 'monthly' | 'once';
  url?: string;
}

export const events: EventData[] = [
  {
    id: 'coworking-tuesday',
    titleKey: 'events.coworking.title',
    descriptionKey: 'events.coworking.desc',
    detailKey: 'events.coworking.detail',
    schedule: 'weekly',
  },
  {
    id: 'satoshi-saturday',
    titleKey: 'events.satoshi.title',
    descriptionKey: 'events.satoshi.desc',
    detailKey: 'events.satoshi.detail',
    schedule: 'monthly',
  },
  {
    id: 'bitchill-s02',
    titleKey: 'events.bitchill.title',
    descriptionKey: 'events.bitchill.desc',
    detailKey: 'events.bitchill.detail',
    schedule: 'once',
    url: 'https://thebitcoindistrict.com/bitchill',
  },
];

export const eventsPageUrl = 'https://thebitcoindistrict.com/events';
