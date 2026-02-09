import useSWR from "swr";
import { useEffect, useState } from "react";
import { fetcher } from "@/utils/fetcher";
import { Discipline } from "@/interfaces/Discipline";

export function useDisciplines(searchTerm: string) {
  const { data: disciplinesData } = useSWR<{ disciplines: Discipline[] }>(
    process.env.NEXT_PUBLIC_DISCIPLINES_API,
    fetcher
  );
  const [disciplines, setDisciplines] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (!disciplinesData) return;

    const filteredDisciplines = disciplinesData.disciplines.filter(
      (discipline) =>
        searchTerm === "" ||
        discipline.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const uniqueDisciplinesMap = new Map<
      string,
      { value: string; label: string }
    >();
    filteredDisciplines.forEach((discipline) => {
      uniqueDisciplinesMap.set(discipline.name, {
        value: discipline.name,
        label: discipline.name,
      });
    });

    setDisciplines(Array.from(uniqueDisciplinesMap.values()));
  }, [disciplinesData, searchTerm]);

  return disciplines;
}
