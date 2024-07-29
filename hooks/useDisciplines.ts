import useSWR from "swr";
import { useEffect, useState } from "react";
import { fetcher } from "@/utils/fetcher";
import { Discipline } from "@/interfaces/Discipline";

export function useDisciplines(searchTerm: string) {
  const { data: disciplinesData } = useSWR<Discipline[]>(
    process.env.NEXT_PUBLIC_DISCIPLINES_API,
    fetcher
  );
  const [disciplines, setDisciplines] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (!disciplinesData) return;

    const filteredDisciplines = disciplinesData.filter(
      (discipline) =>
        searchTerm === "" ||
        discipline.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const uniqueDisciplinesMap = new Map<
      string,
      { value: string; label: string }
    >();
    filteredDisciplines.forEach((discipline) => {
      uniqueDisciplinesMap.set(discipline.description, {
        value: discipline.description,
        label: discipline.description,
      });
    });

    setDisciplines(Array.from(uniqueDisciplinesMap.values()));
  }, [disciplinesData, searchTerm]);

  return disciplines;
}
