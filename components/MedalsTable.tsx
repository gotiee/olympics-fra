"use client";

import React, { useState } from "react";
import { useMedalsTable } from "@/hooks/useMedalsTable";
import { Medal } from "lucide-react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

const getFlagUrl = (countryCode: string) => {
  if (!countryCode) return "";
  return process.env.NEXT_PUBLIC_FLAG_API + countryCode.toLowerCase() + ".png";
};

const MedalsTable: React.FC = () => {
  const [all, setAll] = useState(false);
  const medals = useMedalsTable(all);

  const totalMedals = (medals: {
    type: string;
    gold: number;
    silver: number;
    bronze: number;
    total: number;
  }[]) => medals.find((entry:any) => entry.type === "Total")
  

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Tableau des Médailles</h2>
        <div className="flex items-center space-x-2">
          <Switch
            id="allCountry"
            checked={all}
            onCheckedChange={() => setAll(!all)}
          />
          <Label htmlFor="allCountry" className="text-sm">
            Afficher tous les pays
          </Label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="p-2 text-left w-12">Rang</th>
              <th className="p-2 text-left w-48">Pays</th>
              <th className="p-2 text-center w-16">
                <div className="flex justify-center items-center">
                  <Medal className="text-yellow-400 lg:size-10 size-6" />
                </div>
              </th>
              <th className="p-2 text-center w-16">
                <div className="flex justify-center items-center">
                  <Medal className="text-gray-400 lg:size-10 size-6" />
                </div>
              </th>
              <th className="p-2 text-center w-16">
                <div className="flex justify-center items-center">
                  <Medal className="text-amber-900 lg:size-10 size-6" />
                </div>
              </th>
              <th className="p-2 text-center w-20">Total</th>
            </tr>
          </thead>
          <tbody>
            {medals.map((entry, index) => (
              <tr
                key={entry.organisation}
                className={`border-b ${
                  entry.organisation === "FRA" ? "bg-green-200" : ""
                }`}
              >
                <td className="p-2 text-center">{entry.rank}</td>
                <td className="p-2 flex items-center">
                  <picture>
                    <img
                      src={getFlagUrl(entry.organisation)}
                      alt={entry.description}
                      className="w-8 mr-2"
                    />
                  </picture>
                  <p className="hidden lg:inline">{entry.description}</p>
                </td>
                <td className="p-2 text-center">{totalMedals(entry.medalsNumber)?.gold}</td>
                <td className="p-2 text-center">{totalMedals(entry.medalsNumber)?.silver}</td>
                <td className="p-2 text-center">{totalMedals(entry.medalsNumber)?.bronze}</td>
                <td className="p-2 text-center">{totalMedals(entry.medalsNumber)?.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedalsTable;
