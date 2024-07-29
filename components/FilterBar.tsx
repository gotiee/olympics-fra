import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/ui/search-bar";

interface FilterBarProps {
  readonly initialSearchTerm: string;
  readonly disciplines: { value: string; label: string }[];
  readonly searchTerm: string;
  readonly setSearchTerm: (searchTerm: string) => void;
  readonly statusFilter: string;
  readonly setStatusFilter: (statusFilter: string) => void;
  readonly isFixed: boolean;
}

export function FilterBar({
  initialSearchTerm,
  disciplines,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  isFixed,
}: FilterBarProps) {
  return (
    <div
      className={`mb-4 flex gap-4 transition-all ${
        isFixed ? "fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4" : ""
      }`}
    >
      <SearchBar
        initialSearch={initialSearchTerm}
        disciplines={disciplines}
        handleSearchChange={setSearchTerm}
      />
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="All">Tous</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminée">Terminée</SelectItem>
            <SelectItem value="Programmée">Prévue</SelectItem>
            <SelectItem value="Victoire">Victoire</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
