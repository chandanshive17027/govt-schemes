import { FaLightbulb, FaUsers, FaShieldAlt, FaRocket } from "react-icons/fa";

const features = [
  {
    icon: <FaLightbulb className="w-8 h-8 text-blue-600" />,
    title: "AI-Powered Recommendations",
    description:
      "Get personalized scheme suggestions based on your profile and needs.",
  },
  {
    icon: <FaUsers className="w-8 h-8 text-blue-600" />,
    title: "Community Engagement",
    description:
      "Users can discuss, share, and rate schemes to improve accessibility.",
  },
  {
    icon: <FaShieldAlt className="w-8 h-8 text-blue-600" />,
    title: "Secure Data Access",
    description:
      "Your data and preferences are private and fully encrypted.",
  },
  {
    icon: <FaRocket className="w-8 h-8 text-blue-600" />,
    title: "Quick Scheme Lookup",
    description:
      "Instant search and easy access to all government schemes in one place.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-12">
          Our Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-blue-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
