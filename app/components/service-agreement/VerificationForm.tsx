"use client";

import type { ChangeEvent } from "react";

import type { ServiceAgreementData } from "@/app/types/service-agreement";

interface VerificationFormProps {
  data: ServiceAgreementData;
  onChange: (field: keyof ServiceAgreementData, value: string) => void;
}

export default function VerificationForm({
  data,
  onChange,
}: VerificationFormProps) {
  const handleChange =
    (field: keyof ServiceAgreementData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {/* Language */}
      <div>
        <label
          htmlFor="language"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Language of Explanation
        </label>

        <input
          id="language"
          type="text"
          value={data.language}
          onChange={handleChange("language")}
          placeholder="e.g. Hindi, English"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Agent Name */}
      <div>
        <label
          htmlFor="agentName"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Agent / Authorized Representative
        </label>

        <input
          id="agentName"
          type="text"
          value={data.agentName}
          onChange={handleChange("agentName")}
          placeholder="Enter agent name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Call Date */}
      <div>
        <label
          htmlFor="callDate"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Welcome / Verification Call Date
        </label>

        <input
          id="callDate"
          type="date"
          value={data.callDate}
          onChange={handleChange("callDate")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Call Time */}
      <div>
        <label
          htmlFor="callTime"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Welcome / Verification Call Time
        </label>

        <input
          id="callTime"
          type="time"
          value={data.callTime}
          onChange={handleChange("callTime")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Verifier Name */}
      <div className="md:col-span-2">
        <label
          htmlFor="verifierName"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Verifier Name
        </label>

        <input
          id="verifierName"
          type="text"
          value={data.verifierName}
          onChange={handleChange("verifierName")}
          placeholder="Enter verifier name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Acceptance Date */}
      <div>
        <label
          htmlFor="acceptanceDate"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Acceptance Date
        </label>

        <input
          id="acceptanceDate"
          type="date"
          value={data.acceptanceDate}
          onChange={handleChange("acceptanceDate")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Acceptance Time */}
      <div>
        <label
          htmlFor="acceptanceTime"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Acceptance Time
        </label>

        <input
          id="acceptanceTime"
          type="time"
          value={data.acceptanceTime}
          onChange={handleChange("acceptanceTime")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Documents Sent */}
      <div>
        <label
          htmlFor="documentSent"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Documents Sent
        </label>

        <select
          id="documentSent"
          value={data.documentSent}
          onChange={handleChange("documentSent")}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        >
          <option value="">Select option</option>

          <option value="Yes">Yes</option>

          <option value="No">No</option>
        </select>
      </div>

      {/* Sending Platform */}
      <div>
        <label
          htmlFor="typeOfSendingPlatform"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Type of Sending Platform
        </label>

        <select
          id="typeOfSendingPlatform"
          value={data.typeOfSendingPlatform}
          onChange={handleChange("typeOfSendingPlatform")}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        >
          <option value="">Select platform</option>

          <option value="Email">Email</option>

          <option value="WhatsApp">WhatsApp</option>

          <option value="Email & WhatsApp">Email & WhatsApp</option>

          <option value="Physical Copy">Physical Copy</option>

          <option value="Other">Other</option>
        </select>
      </div>

      {/* Sent Date */}
      <div>
        <label
          htmlFor="sentDate"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Document Sent Date
        </label>

        <input
          id="sentDate"
          type="date"
          value={data.sentDate}
          onChange={handleChange("sentDate")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Sent Time */}
      <div>
        <label
          htmlFor="sentTime"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Document Sent Time
        </label>

        <input
          id="sentTime"
          type="time"
          value={data.sentTime}
          onChange={handleChange("sentTime")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Effective Date */}
      <div>
        <label
          htmlFor="effectiveDate"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Effective Date
        </label>

        <input
          id="effectiveDate"
          type="date"
          value={data.effectiveDate}
          onChange={handleChange("effectiveDate")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Execution Date */}
      <div>
        <label
          htmlFor="executionDate"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Execution / Signing Date
        </label>

        <input
          id="executionDate"
          type="date"
          value={data.executionDate}
          onChange={handleChange("executionDate")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* Execution Time */}
      <div>
        <label
          htmlFor="executionTime"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Execution / Signing Time
        </label>

        <input
          id="executionTime"
          type="time"
          value={data.executionTime}
          onChange={handleChange("executionTime")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>

      {/* AM / PM */}
      <div>
        <label
          htmlFor="executionAmPm"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          AM / PM
        </label>

        <select
          id="executionAmPm"
          value={data.executionAmPm}
          onChange={handleChange("executionAmPm")}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        >
          <option value="">Select</option>

          <option value="AM">AM</option>

          <option value="PM">PM</option>
        </select>
      </div>

      {/* Current Date */}
      <div>
        <label
          htmlFor="currentDate"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Current / Document Date
        </label>

        <input
          id="currentDate"
          type="date"
          value={data.currentDate}
          onChange={handleChange("currentDate")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-gray-900"
        />
      </div>
    </div>
  );
}
