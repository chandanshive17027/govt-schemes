// components/home/SchemeSpotlight.tsx
"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Scheme {
  id: string;
  name: string;
  description: string;
  link: string;
}

const featuredSchemes: Scheme[] = [
  {
    id: "1",
    name: "Pradhan Mantri Awas Yojana",
    description: "Affordable housing scheme for all sections of society.",
    link: "#",
  },
  {
    id: "2",
    name: "MGNREGA",
    description: "Employment guarantee scheme for rural households.",
    link: "#",
  },
  {
    id: "3",
    name: "Ayushman Bharat",
    description: "Health insurance coverage for economically weaker sections.",
    link: "#",
  },
];

const SchemeSpotlight = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold text-blue-900 mb-8">
          Scheme Spotlight
        </h2>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 5000 }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {featuredSchemes.map((scheme) => (
            <SwiperSlide key={scheme.id}>
              <div className="p-6 rounded-xl shadow-lg bg-white hover:shadow-2xl transition duration-300">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  {scheme.name}
                </h3>
                <p className="text-blue-800 mb-4">{scheme.description}</p>
                <a
                  href={scheme.link}
                  className="text-blue-700 font-medium hover:underline"
                >
                  Learn More →
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SchemeSpotlight;
