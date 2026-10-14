import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { IntroSection } from '@/components/sections/IntroSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { MotionEnhancer } from '@/components/motion/MotionEnhancer';
import { profile, navigation } from '@/data/portfolio';
import { isContactConfigured } from '@/services/server/contact-delivery';

export default function Home() {
  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Header fullName={profile.fullName} profession={profile.profession} links={navigation} />
    <main id="contenido"><IntroSection /><SkillsSection /><ProjectsSection /><ContactSection enabled={isContactConfigured()} /></main>
    <Footer /><MotionEnhancer />
  </>;
}
