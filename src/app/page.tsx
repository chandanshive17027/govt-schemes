import Categories from "@/components/home/Categories";
import FAQ from "@/components/home/Faq";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/Navbar";
import Newsletter from "@/components/home/Newsletter";
import SchemeSpotlight from "@/components/home/SchemeCarousel";
import Image from "next/image";

export default function Home() {
  return (
    <div> 
      <Navbar/>
      <Hero/>
      <Categories/>
      <Features/>
      <SchemeSpotlight/>
      <FAQ/>
      <Newsletter/>
      <Footer/>
    </div>
  );
}
