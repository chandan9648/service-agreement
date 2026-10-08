"use client";

import type { ChangeEvent } from "react";

import type { ServiceAgreementData } from "@/app/types/service-agreement";

interface PaymentFormProps {
  data: ServiceAgreementData;
  onChange: (field: keyof ServiceAgreementData, value: string) => void;
}

export default function PaymentForm({ data, onChange }: PaymentFormProps) {
  const handleChange =
    (field: keyof ServiceAgreementData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {/* Payment Reference / UTR */}
      <div>
        <label
          htmlFor="utr"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Payment Reference / UTR
        </label>

        <input
          id="utr"
          type="text"
          value={data.utr}
          onChange={handleChange("utr")}
          placeholder="Enter payment reference / UTR"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Payment Date */}
      <div>
        <label
          htmlFor="paymentDate"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Payment Date
        </label>

        <input
          id="paymentDate"
          type="date"
          value={data.paymentDate}
          onChange={handleChange("paymentDate")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Payment Time */}
      <div>
        <label
          htmlFor="paymentTime"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Payment Time
        </label>

        <input
          id="paymentTime"
          type="time"
          value={data.paymentTime}
          onChange={handleChange("paymentTime")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Payment Mode */}
      <div>
        <label
          htmlFor="paymentMode"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Payment Mode
        </label>

        <select
          id="paymentMode"
          value={data.paymentMode}
          onChange={handleChange("paymentMode")}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        >
          <option value="">Select payment mode</option>

          <option value="UPI">UPI</option>

          <option value="NEFT">NEFT</option>

          <option value="RTGS">RTGS</option>

          <option value="IMPS">IMPS</option>

          <option value="Bank Transfer">Bank Transfer</option>

          <option value="Debit Card">Debit Card</option>

          <option value="Credit Card">Credit Card</option>

          <option value="Other">Other</option>
        </select>
      </div>

      {/* Payee */}
      <div className="md:col-span-2">
        <label
          htmlFor="payee"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Payee
        </label>

        <input
          id="payee"
          type="text"
          value={data.payee}
          onChange={handleChange("payee")}
          placeholder="Enter payee name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />

        <p className="mt-1.5 text-xs text-gray-500">
          Enter the payee exactly as applicable to the official payment record.
        </p>
      </div>
    </div>
  );
}
