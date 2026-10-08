"use client";

import type { ChangeEvent } from "react";

import type { ServiceAgreementData } from "@/app/types/service-agreement";

interface PlanFormProps {
  data: ServiceAgreementData;
  onChange: (field: keyof ServiceAgreementData, value: string) => void;
}

export default function PlanForm({ data, onChange }: PlanFormProps) {
  const handleChange =
    (field: keyof ServiceAgreementData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {/* Plan Name */}
      <div>
        <label
          htmlFor="planName"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Plan Name
        </label>

        <input
          id="planName"
          type="text"
          value={data.planName}
          onChange={handleChange("planName")}
          placeholder="Enter plan name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Plan Number */}
      <div>
        <label
          htmlFor="planNumber"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Plan Number
        </label>

        <input
          id="planNumber"
          type="text"
          value={data.planNumber}
          onChange={handleChange("planNumber")}
          placeholder="Enter plan number"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Issue Date */}
      <div>
        <label
          htmlFor="issueDate"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Issue Date
        </label>

        <input
          id="issueDate"
          type="date"
          value={data.issueDate}
          onChange={handleChange("issueDate")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Validity Date */}
      <div>
        <label
          htmlFor="validityDate"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Validity Date
        </label>

        <input
          id="validityDate"
          type="date"
          value={data.validityDate}
          onChange={handleChange("validityDate")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Fees Without Tax */}
      <div>
        <label
          htmlFor="feesWithoutTax"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Fees (Excluding Taxes)
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            ₹
          </span>

          <input
            id="feesWithoutTax"
            type="number"
            min="0"
            step="0.01"
            value={data.feesWithoutTax}
            onChange={handleChange("feesWithoutTax")}
            placeholder="0.00"
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
          />
        </div>
      </div>

      {/* Tax */}
      <div>
        <label
          htmlFor="tax"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Taxes
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            ₹
          </span>

          <input
            id="tax"
            type="number"
            min="0"
            step="0.01"
            value={data.tax}
            onChange={handleChange("tax")}
            placeholder="0.00"
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
          />
        </div>
      </div>

      {/* Total Payable */}
      <div className="md:col-span-2">
        <label
          htmlFor="totalPayable"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Total Amount Payable
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            ₹
          </span>

          <input
            id="totalPayable"
            type="number"
            min="0"
            step="0.01"
            value={data.totalPayable}
            onChange={handleChange("totalPayable")}
            placeholder="0.00"
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 text-sm font-medium outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
          />
        </div>

        <p className="mt-1.5 text-xs text-gray-500">
          Total amount payable can be calculated from Fees + Taxes.
        </p>
      </div>
    </div>
  );
}
