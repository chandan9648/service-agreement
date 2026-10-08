"use client";

import type { ChangeEvent } from "react";

import type { ServiceAgreementData } from "@/app/types/service-agreement";

interface CustomerFormProps {
  data: ServiceAgreementData;
  onChange: (field: keyof ServiceAgreementData, value: string) => void;
}

export default function CustomerForm({ data, onChange }: CustomerFormProps) {
  const handleChange =
    (field: keyof ServiceAgreementData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {/* Agreement Number */}
      <div>
        <label
          htmlFor="agreementNumber"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Agreement Number
        </label>

        <input
          id="agreementNumber"
          type="text"
          value={data.agreementNumber}
          onChange={handleChange("agreementNumber")}
          placeholder="Enter agreement number"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900 "
        />
      </div>

      {/* Customer Name */}
      <div>
        <label
          htmlFor="customerName"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Customer Name
        </label>

        <input
          id="customerName"
          type="text"
          value={data.customerName}
          onChange={handleChange("customerName")}
          placeholder="Enter customer name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Customer Age */}
      <div>
        <label
          htmlFor="customerAge"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Customer Age
        </label>

        <input
          id="customerAge"
          type="number"
          min="18"
          value={data.customerAge}
          onChange={handleChange("customerAge")}
          placeholder="Enter customer age"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Date of Birth */}
      <div>
        <label
          htmlFor="customerDateOfBirth"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Date of Birth
        </label>

        <input
          id="customerDateOfBirth"
          type="date"
          value={data.customerDateOfBirth}
          onChange={handleChange("customerDateOfBirth")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Aadhaar Last Four Digits */}
      <div>
        <label
          htmlFor="customerAadharLastFour"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Aadhaar Last 4 Digits
        </label>

        <input
          id="customerAadharLastFour"
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={data.customerAadharLastFour}
          onChange={handleChange("customerAadharLastFour")}
          placeholder="XXXX"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Customer Phone */}
      <div>
        <label
          htmlFor="customerPhone"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Mobile Number
        </label>

        <input
          id="customerPhone"
          type="tel"
          inputMode="numeric"
          value={data.customerPhone}
          onChange={handleChange("customerPhone")}
          placeholder="Enter 10-digit mobile number"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Customer Email */}
      <div>
        <label
          htmlFor="customerMail"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>

        <input
          id="customerMail"
          type="email"
          value={data.customerMail}
          onChange={handleChange("customerMail")}
          placeholder="customer@example.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Customer Place */}
      <div>
        <label
          htmlFor="customerPlace"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Customer Place
        </label>

        <input
          id="customerPlace"
          type="text"
          value={data.customerPlace}
          onChange={handleChange("customerPlace")}
          placeholder="Enter place"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Customer Date */}
      <div>
        <label
          htmlFor="customerDate"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Customer Date
        </label>

        <input
          id="customerDate"
          type="date"
          value={data.customerDate}
          onChange={handleChange("customerDate")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Full Residential Address */}
      <div className="md:col-span-2">
        <label
          htmlFor="fullAddressCustomer"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Full Residential Address
        </label>

        <textarea
          id="fullAddressCustomer"
          value={data.fullAddressCustomer}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            onChange("fullAddressCustomer", event.target.value)
          }
          placeholder="Enter complete residential address"
          rows={3}
          className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Payer Name */}
      <div>
        <label
          htmlFor="payerName"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Payer Name
        </label>

        <input
          id="payerName"
          type="text"
          value={data.payerName}
          onChange={handleChange("payerName")}
          placeholder="Enter payer name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Relationship */}
      <div>
        <label
          htmlFor="relationship"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Relationship
        </label>

        <input
          id="relationship"
          type="text"
          value={data.relationship}
          onChange={handleChange("relationship")}
          placeholder="e.g. Father, Mother, Spouse"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>
    </div>
  );
}
