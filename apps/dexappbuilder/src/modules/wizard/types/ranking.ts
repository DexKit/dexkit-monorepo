import { GamificationPoint } from '.';

export interface AppRanking {
  id: number;
  title: string;
  createdAt: number;
  description: string;
  from: string;
  to: string;
  settings: GamificationPoint[];
}
