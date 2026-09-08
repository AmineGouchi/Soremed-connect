"use client";

import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "./AuthProvider";
import { Button, Eyebrow, Wordmark } from "./ui";

type AuthMode = "login" | "register";

const authCopy = {
  login: { kicker: "Connexion · Espace client", title: "Votre espace, prêt quand vous l’êtes.", intro: "Retrouvez vos commandes, vos documents et vos habitudes de réassort au même endroit." },
  register: { kicker: "Créer votre espace", title: "Un espace à la mesure de votre officine.", intro: "Créez vos identifiants. Votre demande reste ensuite entre vos mains et celles de l’équipe SOREMED." },
};

export function AuthPage({ mode }: { mode: AuthMode }) {
  const isLogin = mode === "login";
  const copy = authCopy[mode];
  const { login, loginDemo, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responsible, setResponsible] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [created, setCreated] = useState(false);
  const [nextPath, setNextPath] = useState("/connect");
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedPath = params.get("next");
    if (requestedPath?.startsWith("/")) setNextPath(requestedPath);
    if (isLogin) {
      const emailFromUrl = params.get("email");
      if (emailFromUrl) setEmail(emailFromUrl);
    }
  }, [isLogin]);

  const strength = useMemo(() => [password.length >= 8, /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length, [password]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!email.trim() || !password) return setError("Renseignez votre email et votre mot de passe.");
    if (!isLogin && (!responsible.trim() || !pharmacy.trim() || !phone.trim())) return setError("Complétez les informations de votre officine.");
    if (!isLogin && password.length < 8) return setError("Le mot de passe doit contenir au moins 8 caractères.");
    if (!isLogin && password !== confirmation) return setError("Les deux mots de passe ne correspondent pas.");

    setLoading(true);
    const result = isLogin ? await login(email, password) : await register({ email, password, responsible, pharmacy, phone });
    setLoading(false);
    if (!result.ok) return setError(result.error ?? "Une erreur est survenue.");
    if (isLogin) router.push(nextPath);
    else setCreated(true);
  }

  function demoAccess() {
    loginDemo();
    router.push(nextPath);
  }

  if (created) {
    return <main className="auth-page"><div className="auth-shell"><section className="auth-art"><AuthArt mode="register" /></section><section className="auth-form-panel"><div className="auth-form auth-success"><span className="auth-success-mark"><Check size={25} /></span><span className="auth-kicker">COMPTE CRÉÉ</span><h2>Votre espace est prêt.</h2><p className="auth-form-intro">Vos identifiants ont été enregistrés. Connectez-vous pour poursuivre votre demande et retrouver votre nouvel espace.</p><Link href={`/connexion?email=${encodeURIComponent(email)}`} className="btn btn-primary auth-submit">Se connecter <ArrowRight size={15} /></Link></div></section></div></main>;
  }

  return <main className="auth-page"><div className="auth-shell"><section className="auth-art"><AuthArt mode={mode} /></section><section className="auth-form-panel"><div className="auth-form"><span className="auth-kicker">{copy.kicker}</span><h2>{copy.title}</h2><p className="auth-form-intro">{copy.intro}</p><form onSubmit={submit} noValidate><div className="auth-fields">{!isLogin && <><label className="auth-field"><span>Nom responsable</span><input className="auth-input" value={responsible} onChange={(event) => setResponsible(event.target.value)} placeholder="Ex. Dr. Amine Berrada" autoComplete="name" /></label><label className="auth-field"><span>Nom de la pharmacie</span><input className="auth-input" value={pharmacy} onChange={(event) => setPharmacy(event.target.value)} placeholder="Ex. Pharmacie Al Amal" autoComplete="organization" /></label><label className="auth-field"><span>Téléphone professionnel</span><input className="auth-input" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+212 5 22 00 00 00" autoComplete="tel" /></label></>}<label className="auth-field"><span>Email professionnel</span><input className="auth-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@pharmacie.ma" autoComplete="email" aria-invalid={Boolean(error && !email)} /></label><label className="auth-field"><span>Mot de passe</span><span className="auth-input-wrap"><input className="auth-input" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isLogin ? "Votre mot de passe" : "8 caractères minimum"} autoComplete={isLogin ? "current-password" : "new-password"} /><button type="button" className="auth-password-toggle" aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span>{!isLogin && <span className="auth-password-strength" aria-label={`${strength} critères de mot de passe remplis`}>{[0, 1, 2, 3].map((item) => <span className={item < strength ? "on" : ""} key={item} />)}</span>}</label>{!isLogin && <label className="auth-field"><span>Confirmer le mot de passe</span><span className="auth-input-wrap"><input className="auth-input" type={showConfirmation ? "text" : "password"} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Répétez votre mot de passe" autoComplete="new-password" /><button type="button" className="auth-password-toggle" aria-label={showConfirmation ? "Masquer la confirmation" : "Afficher la confirmation"} onClick={() => setShowConfirmation((value) => !value)}>{showConfirmation ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>}</div>{error && <p className="auth-error" role="alert">{error}</p>}{notice && <p className="auth-notice" role="status">{notice}</p>}<Button type="submit" className="auth-submit" disabled={loading}>{loading ? "Vérification en cours…" : isLogin ? "Se connecter" : "Créer mon compte"} {!loading && <ArrowRight size={15} />}</Button></form>{isLogin ? <><div className="auth-form-links"><button type="button" className="text-button" onClick={() => setNotice("Un lien de réinitialisation sera envoyé à cette adresse.")}>Mot de passe oublié ?</button><Link href="/inscription">Créer un compte</Link></div><div className="auth-divider"><span>OU</span></div><Button variant="secondary" className="auth-demo" onClick={demoAccess}><span>Explorer un compte de démonstration</span><MoveUpRight size={14} /></Button><p className="auth-demo-note"><LockKeyhole size={12} /> Démo locale · données fictives SOREMED</p></> : <div className="auth-form-links"><Link href="/connexion">Déjà un compte ? Se connecter</Link><Link href="/devenir-client">Voir le parcours client</Link></div>}</div></section></div></main>;
}

function AuthArt({ mode }: { mode: AuthMode }) {
  return <><div className="auth-art-top"><Link href="/"><Wordmark light /></Link><span>Espace professionnel</span></div><div className="auth-art-copy"><Eyebrow>{mode === "login" ? "ACCÈS SÉCURISÉ" : "NOUVELLE OFFICINE"}</Eyebrow><h1>{mode === "login" ? <>La précision commence par un espace clair.</> : <>Votre prochaine routine commence ici.</>}</h1><p>{mode === "login" ? "Une interface conçue pour que votre équipe retrouve l’essentiel, sans détour." : "Un premier accès simple, puis un parcours SOREMED adapté à votre quotidien."}</p></div><div className="auth-art-foot"><i className="signal-dot" /> Données protégées · accès professionnel</div></>;
}
