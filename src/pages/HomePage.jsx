import React from "react";
import Hero from "../components/Hero/Hero";

export default function HomePage({ navigateToSection }) {
  return (
    <>
      <Hero navigateToSection={navigateToSection} />
    </>
  );
}
