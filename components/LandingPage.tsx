"use client";

import { ArrowRight, Check, ChevronRight, Clock3, FileText, PackageCheck, ShieldCheck, Sparkles, Waypoints } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { PharmacyWorkflow } from "./PharmacyWorkflow";
import { NetworkField } from "./NetworkField";
import { PageZero } from "./PageZero";
import { StudioCursor } from "./StudioCursor";
import { Button, Eyebrow, OfficialLogo, Wordmark } from "./ui";

const logistics = [
  { number: "01", title: "Pharmacie", copy: "Votre besoin est capté en quelques secondes, depuis un espace pensé pour l’officine." },
  { number: "02", title: "Commande", copy: "Les références habituelles remontent immédiatement. Moins de recherche, plus d’action." },
  { number: "03", title: "SOREMED", copy: "La commande est prise en charge par nos équipes avec une visibilité à chaque étape." },
  { number: "04", title: "Préparation", copy: "Le stock est vérifié et préparé avec la rigueur attendue d’un partenaire santé." },
  { number: "05", title: "Livraison", copy: "Vous savez quand votre commande arrive, sans relance ni zone grise." },
];

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: .7, ease: "easeOut" } },
};

export function LandingPage() {
  const [entryState, setEntryState] = useState<"locked" | "revealing" | "entered">("locked");
  const heroHeading = useRef<HTMLHeadingElement>(null);
  const [activeLogistic, setActiveLogistic] = useState(2);
  const [activeOnboarding, setActiveOnboarding] = useState(1);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (entryState === "entered") heroHeading.current?.focus({ preventScroll: true });
  }, [entryState]);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="site-shell">
      {entryState !== "entered" && <PageZero onEntering={() => setEntryState("revealing")} onEntered={() => setEntryState("entered")} />}
      <StudioCursor />
      <div className="landing-content" data-entry-state={entryState} inert={entryState !== "entered"} aria-hidden={entryState !== "entered"}>
      <header className={`landing-header ${hasScrolled ? "is-scrolled" : ""}`}>
        <div className="container landing-header-inner">
          <Link href="/" aria-label="SOREMED Connect, accueil"><Wordmark /></Link>
          <nav className="landing-nav" aria-label="Navigation principale">
            <a href="#experience">L’expérience</a>
            <a href="#reseau">Le réseau</a>
            <a href="#client">Devenir client</a>
          </nav>
          <Link href="/connexion" className="btn btn-primary btn-small" data-cursor="VOIR">Accéder à mon espace <ArrowRight size={14} className="arrow" /></Link>
        </div>
      </header>

      <section className="hero">
        <div className="container-wide hero-grid">
          <motion.div className="hero-copy" initial="hidden" animate="visible" variants={reveal}>
            <Eyebrow>La nouvelle interface SOREMED</Eyebrow>
            <h1 ref={heroHeading} tabIndex={-1}>La distribution pharmaceutique, <em>réinventée.</em></h1>
            <p className="hero-subtitle">Un espace B2B qui aide les pharmacies à commander plus vite, suivre chaque livraison et garder le contrôle sur leur activité.</p>
            <div className="hero-actions">
              <Link href="/connexion" className="btn btn-primary" data-cursor="VOIR">Accéder à mon espace <ArrowRight size={15} className="arrow" /></Link>
              <Link href="/devenir-client" className="btn btn-secondary" data-cursor="VOIR">Devenir client</Link>
            </div>
            <div className="hero-meta">
              <span><strong>24/7</strong> accès sécurisé</span><span className="meta-divider" /><span><strong>1 espace</strong> pour tout piloter</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: .96, x: 24 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1, delay: .15, ease: "easeOut" }} data-cursor="EXPLORER">
            <NetworkField active={entryState === "entered"} />
          </motion.div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Bénéfices">
        <div className="container-wide trust-grid">
          {[{ icon: Clock3, title: "Commander rapidement", copy: "Les essentiels de votre officine, à portée de recherche." }, { icon: FileText, title: "Tout retrouver", copy: "Factures, BL et relevés centralisés au même endroit." }, { icon: PackageCheck, title: "Suivre sans relancer", copy: "Une vision claire de chaque commande, du départ à l’arrivée." }, { icon: ShieldCheck, title: "Échanger en confiance", copy: "Un environnement sécurisé, conçu pour les professionnels." }].map(({ icon: Icon, title, copy }, index) => (
            <motion.div className="trust-item" key={title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .3 }} variants={reveal} transition={{ delay: index * .07 }}>
              <span className="trust-index">0{index + 1}</span><Icon size={16} color="var(--green)" style={{ float: "right" }} />
              <h3>{title}</h3><p>{copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <PharmacyWorkflow />

      <section className="section logistics" id="reseau">
        <div className="container logistics-wrap">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .3 }} variants={reveal}><Eyebrow>Du besoin à la livraison</Eyebrow><h2 className="section-title">La visibilité comme nouveau réflexe.</h2><p className="section-copy">Une commande ne disparaît plus dans un tunnel. Chaque étape est lisible, rassurante, et connectée à la suivante.</p></motion.div>
          <div className="logistics-track" aria-hidden="true"><div className="logistics-progress" style={{ width: `${activeLogistic * 25}%` }} /></div>
          <div className="logistics-nodes" style={{ "--logistics-progress": `${activeLogistic * 25}%` } as CSSProperties} role="tablist" aria-label="Étapes de distribution">
            {logistics.map((item, index) => <button key={item.title} data-cursor="VOIR" className={`logistics-node ${index < activeLogistic ? "state-completed" : index === activeLogistic ? "state-active" : "state-upcoming"}`} onClick={() => setActiveLogistic(index)} role="tab" aria-selected={index === activeLogistic} aria-current={index === activeLogistic ? "step" : undefined}><span className="font-mono">{item.number}</span><strong>{item.title}</strong><span>{item.copy}</span></button>)}
          </div>
          <motion.div className="logistics-detail" key={activeLogistic} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}><p>{logistics[activeLogistic].copy}</p><span className="font-mono">SOREMED / CONNECT / 0{activeLogistic + 1}</span></motion.div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container showcase-grid">
          <motion.div className="showcase-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .3 }} variants={reveal}><Eyebrow>Votre espace, enfin à votre mesure</Eyebrow><h2 className="section-title">L’essentiel. Au même endroit.</h2><p className="section-copy">Un tableau de bord clair pour piloter les priorités de la journée et garder le fil sur les commandes qui comptent.</p><div className="showcase-list"><div className="showcase-list-item"><span>01</span><div><h4>Une commande en deux temps</h4><p>Retrouvez vos produits courants avant même de commencer à chercher.</p></div></div><div className="showcase-list-item"><span>02</span><div><h4>Des statuts qui parlent</h4><p>Une progression concrète, de la préparation jusqu’à la livraison.</p></div></div><div className="showcase-list-item"><span>03</span><div><h4>Un historique exploitable</h4><p>Vos documents et votre activité restent faciles à retrouver.</p></div></div></div></motion.div>
          <motion.div className="mockup-wrap" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .8, ease: "easeOut" }}>
            <div className="mockup"><div className="mockup-screen"><div className="mockup-topbar"><div className="mini-brand"><OfficialLogo decorative /></div><div className="mini-top-actions"><span /><span /><i /></div></div><div className="mockup-body"><aside className="mini-sidebar"><small /><div className="mini-side-line active">Vue d’ensemble</div><div className="mini-side-line">Commander</div><div className="mini-side-line">Commandes</div><div className="mini-side-line">Documents</div><div className="mini-side-line">Favoris</div></aside><div className="mini-content"><div className="mini-greeting" /><div className="mini-sub" /><div className="mini-actions"><i className="mini-pill" /><div className="mini-filters"><i /><i /></div></div><div className="mini-stats"><div className="mini-stat"><span /><b /></div><div className="mini-stat"><span /><b /></div><div className="mini-stat"><span /><b /></div></div><div className="mini-lower"><div className="mini-chart"><span /></div><div className="mini-order"><span /><div className="mini-order-row"><i /><b /></div><div className="mini-order-row"><i /><b /></div><div className="mini-order-row"><i /><b /></div></div></div></div></div></div></div>
          </motion.div>
        </div>
      </section>

      <section className="section onboarding" id="client">
        <div className="container onboarding-grid">
          <div><Eyebrow>OUVRIR SON ESPACE EN QUELQUES ÉTAPES</Eyebrow><h2 className="section-title">Devenir client, sans paperasse oubliée.</h2><div className="stepper">{[{ number: "01", title: "Créer la demande", copy: "Quelques informations pour démarrer." }, { number: "02", title: "Renseigner la pharmacie", copy: "Vos coordonnées et votre activité." }, { number: "03", title: "Transmettre les documents", copy: "Un dépôt simple et sécurisé." }, { number: "04", title: "Recevoir la confirmation", copy: "SOREMED vous accompagne jusqu’à l’activation." }].map((step, index) => <button key={step.number} className={`step ${activeOnboarding === index ? "active" : ""}`} onClick={() => setActiveOnboarding(index)}><span className="step-number">{step.number}</span><span><h4>{step.title}</h4><p>{step.copy}</p></span><span className="step-check">{activeOnboarding > index ? <Check size={10} /> : <ChevronRight size={10} />}</span></button>)}</div></div>
          <motion.div className="onboarding-card" key={activeOnboarding} initial={{ opacity: .4, x: 16 }} whileInView={{ opacity: 1, x: 0 }} animate={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .45 }}><Eyebrow>ÉTAPE 0{activeOnboarding + 1}</Eyebrow><h3>{["Dites-nous qui vous êtes.", "Votre pharmacie, en confiance.", "Les bons documents, au bon endroit.", "C’est parti pour une nouvelle routine."][activeOnboarding]}</h3><p>{["Laissez vos coordonnées. Notre équipe prendra rapidement contact avec vous pour la suite.", "Partagez les informations qui nous permettront de vous proposer un espace adapté à votre officine.", "Déposez vos justificatifs en quelques clics. Le parcours sauvegarde votre progression.", "Votre espace SOREMED Connect est prêt à vous faire gagner du temps, chaque jour."][activeOnboarding]}</p><Button variant="secondary" className="btn" onClick={() => setActiveOnboarding(Math.min(activeOnboarding + 1, 3))}>{activeOnboarding === 3 ? "Parler à SOREMED" : "Continuer"} <ArrowRight size={14} className="arrow" /></Button><span className="card-corner-meta">ONBOARDING / SÉCURISÉ / MAROC</span></motion.div>
        </div>
      </section>

      <section className="final-cta"><div className="container"><Eyebrow>LA PROCHAINE COMMANDE COMMENCE ICI</Eyebrow><h2>Plus de clarté. Plus de temps pour l’essentiel.</h2><p>SOREMED Connect donne à chaque pharmacie un espace à la hauteur de son quotidien.</p><Link href="/connexion" className="btn btn-primary">Découvrir mon espace <ArrowRight size={15} className="arrow" /></Link></div></section>
      <footer className="site-footer"><div className="container site-footer-inner"><Wordmark light /><small>© 2026 SOREMED Connect · Expérience démo confidentielle</small></div></footer>
      </div>
    </main>
  );
}
