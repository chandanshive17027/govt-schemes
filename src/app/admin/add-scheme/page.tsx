"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SchemeForm {
  name: string;
  state?: string;
  ministry?: string;
  tags: string[];
  details?: string;
  eligibility?: string;
  benefits?: string;
  application_process?: string;
  documents_required?: string;
  faqs: string[];
  sources_and_resources: string[];
  link: string;
  detailsFetched?: boolean;
  eligible?: any[];
}

export default function AddSchemePage() {
  const router = useRouter();
  const [form, setForm] = useState<SchemeForm>({
    name: "",
    state: "",
    ministry: "",
    tags: [],
    details: "",
    eligibility: "",
    benefits: "",
    application_process: "",
    documents_required: "",
    faqs: [],
    sources_and_resources: [],
    link: "",
    detailsFetched: true,
    eligible: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle array fields (comma separated)
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof SchemeForm) => {
    const { value } = e.target;
    const arr = value.split(",").map((item) => item.trim()).filter((item) => item.length > 0);
    setForm((prev) => ({ ...prev, [key]: arr }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/schemes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Scheme added successfully!");
        // Optional: Redirect to admin schemes page
        // router.push("/admin/schemes");
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Scheme</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Link */}
        <div>
          <label className="block font-medium mb-1">Link *</label>
          <input
            type="text"
            name="link"
            value={form.link}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* State */}
        <div>
          <label className="block font-medium mb-1">State</label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Ministry */}
        <div>
          <label className="block font-medium mb-1">Ministry</label>
          <input
            type="text"
            name="ministry"
            value={form.ministry}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={form.tags.join(", ")}
            onChange={(e) => handleArrayChange(e, "tags")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Details */}
        <div>
          <label className="block font-medium mb-1">Details</label>
          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>

        {/* Eligibility */}
        <div>
          <label className="block font-medium mb-1">Eligibility</label>
          <textarea
            name="eligibility"
            value={form.eligibility}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={2}
          />
        </div>

        {/* Benefits */}
        <div>
          <label className="block font-medium mb-1">Benefits</label>
          <textarea
            name="benefits"
            value={form.benefits}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={2}
          />
        </div>

        {/* Application Process */}
        <div>
          <label className="block font-medium mb-1">Application Process</label>
          <textarea
            name="application_process"
            value={form.application_process}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={2}
          />
        </div>

        {/* Documents Required */}
        <div>
          <label className="block font-medium mb-1">Documents Required</label>
          <textarea
            name="documents_required"
            value={form.documents_required}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={2}
          />
        </div>

        {/* FAQs */}
        <div>
          <label className="block font-medium mb-1">FAQs (comma separated)</label>
          <input
            type="text"
            value={form.faqs.join(", ")}
            onChange={(e) => handleArrayChange(e, "faqs")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Sources & Resources */}
        <div>
          <label className="block font-medium mb-1">Sources & Resources (comma separated)</label>
          <input
            type="text"
            value={form.sources_and_resources.join(", ")}
            onChange={(e) => handleArrayChange(e, "sources_and_resources")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow"
          >
            {loading ? "Adding..." : "Add Scheme"}
          </button>
        </div>

        {/* Message */}
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
}
