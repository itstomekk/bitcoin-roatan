export interface CommunityLink {
  id: string;
  titleKey: string;
  descriptionKey: string;
  url: string;
  isPrimary?: boolean;
}

export const communityLinks: CommunityLink[] = [
  {
    id: 'whatsapp-group',
    titleKey: 'community.whatsapp.title',
    descriptionKey: 'community.whatsapp.desc',
    url: 'https://chat.whatsapp.com/FQ9Uu5WR6VOGgh5sPaSuFK',
    isPrimary: true,
  },
  {
    id: 'events-page',
    titleKey: 'community.events.title',
    descriptionKey: 'community.events.desc',
    url: 'https://thebitcoindistrict.com/events',
  },
];
