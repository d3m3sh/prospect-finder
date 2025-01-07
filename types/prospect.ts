import { Business } from './business';

export type ContactStatus = 'No Call' | 'Accepted' | 'Refused';

export interface Prospect extends Business {
  status: ContactStatus;
  comments: string;
  notes: string;
  lastUpdated: string;
}

export interface ProspectStore {
  prospects: Prospect[];
  lastUpdated: string;
}