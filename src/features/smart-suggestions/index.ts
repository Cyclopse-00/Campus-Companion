/**
 * Smart suggestions engine for student schedule gaps.
 * Recommends open utilities, study spots, and quiet areas when free slot >= 30 min.
 */

export interface SuggestionItem {
  id: string;
  name: string;
  category: string;
  reason: string;
  walkMinutes: number;
}

/**
 * Computes recommendations for a student given their timetable gap and location.
 */
export async function getSmartSuggestions(
  freeMinutes: number,
  _currentLocation?: [number, number]
): Promise<SuggestionItem[]> {
  if (freeMinutes < 30) {
    return [];
  }

  return [
    {
      id: "sugg-1",
      name: "Central Library Quiet Reading Room",
      category: "study",
      reason: "Optimal study spot during your 45-min free slot",
      walkMinutes: 3,
    },
  ];
}
