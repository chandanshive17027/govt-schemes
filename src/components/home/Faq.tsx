"use client"
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    question: "How can I find schemes relevant to me?",
    answer:
      "Our AI-powered recommendation engine suggests schemes based on your profile, location, and preferences.",
  },
  {
    question: "Are all government schemes included?",
    answer:
      "Yes, we aim to include all central and state government schemes to provide complete access.",
  },
  {
    question: "Is my personal data safe?",
    answer:
      "Absolutely! All personal data is securely stored and encrypted. We never share your information without consent.",
  },
  {
    question: "Can I share schemes with my community?",
    answer:
      "Yes, you can share, discuss, and rate schemes to help your community access benefits easily.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-12">FAQs</h2>

        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-5 cursor-pointer transition-all duration-300"
              onClick={() => toggle(idx)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-800">{faq.question}</h3>
                {openIndex === idx ? (
                  <FaChevronUp className="text-blue-600" />
                ) : (
                  <FaChevronDown className="text-blue-600" />
                )}
              </div>
              {openIndex === idx && (
                <p className="mt-3 text-gray-700 text-sm">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
