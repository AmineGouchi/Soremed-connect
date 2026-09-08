"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, FileText, Search } from "lucide-react";
import Link from "next/link";
import styles from "./PharmacyWorkflow.module.css";

const chapters = [
  { time: "09:00", title: "Retrouver. Ajouter. C’est prêt.", short: "Préparer le réassort", copy: "Vos références habituelles sont déjà à portée de main. Ajustez les quantités, sans recommencer votre recherche.", caption: "Les habitudes deviennent des raccourcis.", label: "Votre sélection", rows: ["Référence habituelle · 6 unités", "Favori de l’officine · 3 unités", "Dernière commande · À reprendre"] },
  { time: "11:30", title: "Savoir où vous en êtes.", short: "Garder la visibilité", copy: "Disponibilité, préparation, livraison : retrouvez le bon repère avant de décider de la suite.", caption: "Moins de relances. Des réponses à portée de regard.", label: "Commande SRM-24891", rows: ["Commande reçue · Confirmée", "Préparation · En cours", "Expédition · Prochaine étape"] },
  { time: "17:00", title: "Reprendre le fil, simplement.", short: "Retrouver l’essentiel", copy: "Une facture à retrouver ? Un réassort à refaire ? Votre historique reste organisé, même quand la journée s’accélère.", caption: "Chaque journée laisse des repères utiles.", label: "Votre historique", rows: ["Facture FAC-DEMO-10482 · Disponible", "Bon de livraison BL-DEMO-24871", "Sélection de favoris · Enregistrée"] },
];

function WorkflowVisual({ chapter, index }: { chapter: typeof chapters[number]; index: number }) {
  return <div className={styles.visual}><div className={styles.visualHead}><span>ESPACE PHARMACIE</span><span>{chapter.time}</span></div><div className={styles.sheet}><div className={styles.sheetTitle}>{index === 0 ? <Search size={18} /> : index === 1 ? <Check size={18} /> : <FileText size={18} />}<strong>{chapter.label}</strong></div>{chapter.rows.map((row,i)=><div className={styles.row} key={row}><span className={index === 1 && i === 1 ? styles.current : styles.marker}>{index === 1 ? i < 1 ? <Check size={12}/> : i+1 : <FileText size={14}/>}</span><span>{row}</span></div>)}<div className={styles.sheetFoot}>{index === 0 ? "3 repères, un seul espace" : index === 1 ? "Un statut lisible à chaque étape" : "Classé. Accessible. Retrouvable."}<ArrowRight size={16}/></div></div><p className={styles.visualCaption}>{chapter.caption}</p><span className={styles.demo}>Scénario illustratif · aucune donnée patient</span></div>;
}

export function PharmacyWorkflow() {
  const [active,setActive] = useState(0);
  const reduced = useReducedMotion();
  const chapter = chapters[active];
  return <section id="experience" className={styles.section} aria-labelledby="workflow-title"><div className="container"><header className={styles.header}><span>Au rythme de votre officine</span><h2 id="workflow-title">Une journée qui<br/>garde son <em>fil.</em></h2><p>Moins de gestes répétés.<br/>Plus d’attention pour ce qui compte.</p></header><div className={styles.layout}><div className={styles.chapters} role="tablist" aria-label="Une journée avec SOREMED" aria-orientation="vertical">{chapters.map((item,index)=><button key={item.time} type="button" role="tab" id={`workflow-tab-${index}`} aria-selected={active===index} aria-controls="workflow-panel" tabIndex={active===index?0:-1} className={active===index?styles.active:""} onClick={()=>setActive(index)} onKeyDown={event=>{let next=index;if(event.key==='ArrowDown')next=(index+1)%chapters.length;else if(event.key==='ArrowUp')next=(index+chapters.length-1)%chapters.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=chapters.length-1;else return;event.preventDefault();setActive(next);document.getElementById(`workflow-tab-${next}`)?.focus();}}><time>{item.time}</time><span>{item.short}</span><ArrowRight size={19}/></button>)}<Link href="/connexion" className={styles.link}>Découvrir votre espace <ArrowRight size={16}/></Link></div><div id="workflow-panel" role="tabpanel" aria-labelledby={`workflow-tab-${active}`} tabIndex={0}><AnimatePresence mode="wait" initial={false}><motion.div key={active} initial={{opacity:0,y:reduced?0:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-6}} transition={{duration:reduced?0:.22,ease:[.22,1,.36,1]}}><div className={styles.chapterCopy}><h3>{chapter.title}</h3><p>{chapter.copy}</p></div><WorkflowVisual chapter={chapter} index={active}/></motion.div></AnimatePresence></div></div></div></section>;
}
