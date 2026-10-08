"use client";

import type { ChangeEvent } from "react";

import type { ServiceAgreementData } from "@/app/types/service-agreement";

interface WitnessFormProps {
  data: ServiceAgreementData;
  onChange: (field: keyof ServiceAgreementData, value: string) => void;
}

/*
 * Witness details appear only in the WITNESSES block of the
 * master DOCX, which applies to Part B (physical execution).
 *
 * They are optional and may be left blank for an agreement
 * that is executed electronically.
 */
export default function WitnessForm({ data, onChange }: WitnessFormProps) {
  const handleChange =
    (field: keyof ServiceAgreementData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {/* Witness 1 Name */}
      <div>
        <label
          htmlFor="witness1Name"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Witness 1 Name (optional)
        </label>

        <input
          id="witness1Name"
          type="text"
          value={data.witness1Name}
          onChange={handleChange("witness1Name")}
          placeholder="Enter witness 1 full name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Witness 2 Name */}
      <div>
        <label
          htmlFor="witness2Name"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Witness 2 Name (optional)
        </label>

        <input
          id="witness2Name"
          type="text"
          value={data.witness2Name}
          onChange={handleChange("witness2Name")}
          placeholder="Enter witness 2 full name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Witness 1 Address */}
      <div>
        <label
          htmlFor="witness1Address"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Witness 1 Address (optional)
        </label>

        <textarea
          id="witness1Address"
          value={data.witness1Address}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            onChange("witness1Address", event.target.value)
          }
          placeholder="Enter witness 1 address"
          rows={3}
          className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Witness 2 Address */}
      <div>
        <label
          htmlFor="witness2Address"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Witness 2 Address (optional)
        </label>

        <textarea
          id="witness2Address"
          value={data.witness2Address}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            onChange("witness2Address", event.target.value)
          }
          placeholder="Enter witness 2 address"
          rows={3}
          className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Witness 1 Mobile */}
      <div>
        <label
          htmlFor="witness1Mobile"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Witness 1 Mobile Number (optional)
        </label>

        <input
          id="witness1Mobile"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={data.witness1Mobile}
          onChange={handleChange("witness1Mobile")}
          placeholder="10-digit mobile number"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Witness 2 Mobile */}
      <div>
        <label
          htmlFor="witness2Mobile"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Witness 2 Mobile Number (optional)
        </label>

        <input
          id="witness2Mobile"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={data.witness2Mobile}
          onChange={handleChange("witness2Mobile")}
          placeholder="10-digit mobile number"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Witness 1 Date */}
      <div>
        <label
          htmlFor="witness1Date"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Witness 1 Date (optional)
        </label>

        <input
          id="witness1Date"
          type="date"
          value={data.witness1Date}
          onChange={handleChange("witness1Date")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Witness 2 Date */}
      <div>
        <label
          htmlFor="witness2Date"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Witness 2 Date (optional)
        </label>

        <input
          id="witness2Date"
          type="date"
          value={data.witness2Date}
          onChange={handleChange("witness2Date")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>
    </div>
  );
}
