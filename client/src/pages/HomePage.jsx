import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import AboutSection from "../components/AboutSection.jsx";
import ApplicationForm from "../components/ApplicationForm.jsx";
import OpenJobs from "../components/OpenJobs.jsx";
import ContactSection from "../components/ContactSection.jsx";
import Footer from "../components/Footer.jsx";
import FloatingWhatsApp from "../components/FloatingWhatsApp.jsx";

export default function HomePage({ theme, toggleTheme }) {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <AboutSection />
        <ApplicationForm />
        <OpenJobs />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
