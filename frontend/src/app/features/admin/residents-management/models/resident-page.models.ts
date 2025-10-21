import { ResidentPayload } from './resident.models';

export interface ResidentPage {
  content: ResidentPayload[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

