"use client";
import { LegacyRef, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";
import { useMeasure } from "react-use";

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function SearchBar({
  initialSearch,
  disciplines,
  handleSearchChange,
}: {
  readonly initialSearch: string;
  readonly disciplines: { value: string; label: string }[];
  readonly handleSearchChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialSearch);
  const [filteredDisciplines, setFilteredDisciplines] = useState(disciplines);
  const [ref, { width }] = useMeasure();

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (value === initialSearch) return setFilteredDisciplines(disciplines);
      handleSearchChange(value);
      if (value === "") return setFilteredDisciplines(disciplines);
      setFilteredDisciplines(
        disciplines.filter((discipline) => {
          const regex = new RegExp(escapeRegExp(value), "i");
          const matchesSearch = regex.test(discipline.label.toLowerCase());
          return matchesSearch;
        })
      );
    }, 300);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [value, disciplines, handleSearchChange, initialSearch]);

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <Input
          onMouseDown={() => setOpen(true)}
          placeholder="Rechercher un sport..."
          type="text"
          ref={ref as LegacyRef<HTMLInputElement>}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      </PopoverTrigger>
      {filteredDisciplines.length !== 0 && (
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          autoFocus={false}
          className="w-full p-2 mt-1 overflow-y-scroll max-h-96"
          onPointerDownOutside={() => setOpen(false)}
        >
          {filteredDisciplines.map((discipline: any) => (
            <div
              key={discipline.value}
              style={{ width: width - 8 }}
              className="flex items-center w-full hover:bg-gray-100 rounded"
            >
              <button
                onClick={() => {
                  setValue(discipline.label);
                  setOpen(false);
                }}
                className="size-full text-start p-2"
              >
                {discipline.label}
              </button>
            </div>
          ))}
        </PopoverContent>
      )}
    </Popover>
  );
}
