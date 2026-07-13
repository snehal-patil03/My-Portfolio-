import Hero from '@/components/Hero';
import ProfileSummary from '@/components/ProfileSummary';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import HairlineRule from '@/components/HairlineRule';
import LenisProvider from '@/components/LenisProvider';

export default function Home() {
  return (
    <LenisProvider>
      <main className="w-full relative selection:bg-brass/20 selection:text-ink">
        <Hero />
        <ProfileSummary />
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
        <Footer />
      </main>
    </LenisProvider>
  );
}
