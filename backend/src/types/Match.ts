export interface Match {
  id: number;
  home: string;
  away: string;
  score: string; // "1-0"
  scorer?: string | null;
}
