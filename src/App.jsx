import React, { useState, useRef, useCallback } from 'react';
import Tilt from 'react-parallax-tilt';
import {
  Search, Shield, Zap, Sword, Download, RotateCw,
  Calendar, Award, Star, GitBranch, Users, BookOpen, AlertCircle, Scroll
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from 'recharts';
import html2canvas from 'html2canvas';

// ─── Helpers ────────────────────────────────────────────────────────────────

const getAccountAge = (createdAt) =>
  (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24 * 365.25);

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const langTitles = {
  JavaScript: 'JS Knight',    Python: 'Python Sorcerer', TypeScript: 'Type Mage',
  Java: 'Java Warrior',       'C++': 'C++ Barbarian',    C: 'C Warlock',
  Ruby: 'Ruby Rogue',         Go: 'Go Golem',            Rust: 'Rust Paladin',
  HTML: 'Markup Monk',        CSS: 'Style Druid',        Kotlin: 'Kotlin Crusader',
  Swift: 'Swift Ranger',      Dart: 'Dart Duelist',
};

const weaponMap = {
  Python: 'Serpent Staff',    JavaScript: 'Void Scripts',  TypeScript: 'Strict Blade',
  Java: 'Heavy Hammer',       'C++': 'Memory Blade',       C: 'Ancient Codex',
  Ruby: 'Gem Dagger',         Rust: 'Iron Shield',         Go: 'Concurrent Bow',
  Kotlin: 'JVM Lance',        Swift: 'Apple Crossbow',     Dart: 'Flutter Wand',
};

const rarityFromLevel = (level) => {
  if (level >= 80) return { label: '✦ LEGENDARY', color: '#f59e0b', glow: '#f59e0b99' };
  if (level >= 55) return { label: '✦ EPIC',      color: '#8b5cf6', glow: '#8b5cf699' };
  if (level >= 30) return { label: '✦ RARE',      color: '#3b82f6', glow: '#60a5fa99' };
  if (level >= 10) return { label: '✦ UNCOMMON',  color: '#10b981', glow: '#34d39999' };
  return               { label: '✦ COMMON',    color: '#9ca3af', glow: '#9ca3af66' };
};

// New simple level formula
const calcLevel = (repos, followers) => {
  const raw = Math.floor(repos / 2) + Math.floor(followers / 10);
  return clamp(raw, 1, 99);
};

// Deterministic XP progress within current level for the bar
const xpProgress = (level) => clamp(((level * 37) % 100), 8, 92);

const getSpecialMoves = (age, topLang, followers, level) => {
  const moves = [];
  if (age >= 10)       moves.push('Ancient Commit');
  else if (age >= 3)   moves.push('Legacy Strike');
  else                 moves.push('Junior Sprint');
  if (followers > 5000)      moves.push('Influence Wave');
  else if (followers > 500)  moves.push('Community Pulse');
  const langMoves = {
    Python: 'List Comprehension', JavaScript: 'Callback Chaos', Rust: 'Safe Blast',
    C: 'Pointer Storm', 'C++': 'Pointer Storm', TypeScript: 'Type Inference',
    Go: 'Goroutine Rush', Ruby: 'Gem Summon',
  };
  moves.push(langMoves[topLang] || 'Code Refactor');
  if (level >= 80) moves.push('Open Source Avalanche');
  return [...new Set(moves)].slice(0, 3);
};

// ─── Particles ──────────────────────────────────────────────────────────────
function Particles({ active }) {
  if (!active) return null;
  return (
    <div className="particles-wrap" aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => (
        <span key={i} className="particle" style={{ '--i': i }} />
      ))}
    </div>
  );
}

// ─── Card Front ─────────────────────────────────────────────────────────────
function CardFront({ data, rarity, visible, cardRef }) {
  const xpPct = xpProgress(data.rpgLevel);
  return (
    <div className={`face face-front ${visible ? 'face-visible' : 'face-hidden'}`} ref={cardRef}>
      <div className="card-inner">

        {/* Top bar: LVL pill + rarity */}
        <div className="card-topbar">
          <div className="level-pill" style={{ color: rarity.color, borderColor: rarity.color + '77' }}>
            LVL {data.rpgLevel}
          </div>
          <div className="rarity-badge" style={{ color: rarity.color, borderColor: rarity.color + '44' }}>
            {rarity.label}
          </div>
        </div>

        {/* Avatar */}
        <div className="avatar-wrap">
          <img
            src={data.avatar_url}
            crossOrigin="anonymous"
            alt={`${data.login} avatar`}
            className="avatar-img"
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${data.login}&background=5c3a21&color=fdf6e3`; }}
          />
          <svg className="avatar-ring" viewBox="0 0 104 104" aria-hidden="true">
            <circle cx="52" cy="52" r="49" fill="none" stroke={rarity.color}
              strokeWidth="2.5" strokeDasharray="8 4" strokeLinecap="round" />
          </svg>
        </div>

        {/* Identity */}
        <p className="specialty-title">{data.specialtyTitle}</p>
        <h2 className="hero-name">{data.name || data.login}</h2>
        <p className="hero-handle">@{data.login}</p>
        <div className="hero-class-badge">⚔ {data.rpgClass}</div>

        <div className="account-age">
          <Calendar size={10} />
          <span>Born {data.accountCreated} · {data.accountAge}yr veteran</span>
        </div>

        {/* XP progress bar */}
        <div className="xp-section">
          <div className="xp-track">
            <div className="xp-fill" style={{ width: `${xpPct}%`, background: rarity.color }} />
          </div>
        </div>

        <div className="divider" />

        {/* HP / Mana */}
        <div className="bars">
          <div className="bar-row">
            <Shield size={11} className="bar-icon green" />
            <span className="bar-label">HP</span>
            <div className="bar-track">
              <div className="bar-fill green" style={{ width: `${data.hpPercent}%` }} />
            </div>
            <span className="bar-val">{data.hp.toLocaleString()}</span>
          </div>
          <div className="bar-row">
            <Zap size={11} className="bar-icon blue" />
            <span className="bar-label">MP</span>
            <div className="bar-track">
              <div className="bar-fill blue" style={{ width: `${data.manaPercent}%` }} />
            </div>
            <span className="bar-val">{data.mana.toLocaleString()}</span>
          </div>
        </div>

        {/* Weapon */}
        <div className="weapon-row">
          <Sword size={12} style={{ color: '#b91c1c' }} />
          <span>{data.primaryWeapon}</span>
        </div>

        {/* Badges */}
        {data.badges.length > 0 && (
          <div className="badges">
            {data.badges.map((b, i) => {
              const Icon = b.icon;
              return (
                <span key={i} className="badge" style={{ color: b.color, borderColor: b.color + '44' }}>
                  <Icon size={9} /> {b.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Special moves */}
        <div className="moves-box">
          <div className="moves-title"><Scroll size={10} /> Special Moves</div>
          {data.specialMoves.map((m, i) => (
            <div key={i} className="move-item">✧ {m}</div>
          ))}
        </div>

        <p className="flip-hint">Click card to reveal stats →</p>
      </div>
    </div>
  );
}

// ─── Card Back ───────────────────────────────────────────────────────────────
function CardBack({ data, visible, cardRef }) {
  return (
    <div className={`face face-back ${visible ? 'face-visible' : 'face-hidden'}`} ref={cardRef}>
      <div className="card-inner">

        {/* Back top bar */}
        <div className="card-topbar" style={{ marginBottom: 4 }}>
          <div className="level-pill" style={{ color: data.rarity.color, borderColor: data.rarity.color + '77' }}>
            LVL {data.rpgLevel}
          </div>
          <span className="back-title">Language Mastery</span>
        </div>

        {/* Radar */}
        <ResponsiveContainer width="100%" height={185}>
          <RadarChart data={data.radarData} margin={{ top: 6, right: 16, bottom: 6, left: 16 }}>
            <PolarGrid stroke="#a8956a44" />
            <PolarAngleAxis
              dataKey="language"
              tick={{ fill: '#7a5c38', fontSize: 8, fontFamily: 'Caveat Brush, cursive' }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Mastery" dataKey="repos" stroke="#b45309" fill="#d97706"
              fillOpacity={0.45} animationBegin={0} animationDuration={700} />
          </RadarChart>
        </ResponsiveContainer>

        <div className="divider" />

        {/* Class + weapon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '12px 0', width: '100%', padding: '0 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Caveat Brush', cursive", fontSize: '13px' }}>
            <span style={{ color: 'var(--ink-mid)' }}>Class:</span>
            <span style={{ color: 'var(--ink)', fontWeight: 'bold', letterSpacing: '0.5px' }}>{data.rpgClass}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Caveat Brush', cursive", fontSize: '13px' }}>
            <span style={{ color: 'var(--ink-mid)' }}>Weapon:</span>
            <span style={{ color: 'var(--ink)', fontWeight: 'bold', letterSpacing: '0.5px' }}>{data.primaryWeapon}</span>
          </div>
        </div>

        <div className="divider" />

        {/* Stats grid */}
        <div className="stats-grid">
          <div className="stat-cell">
            <BookOpen size={12} className="stat-icon" />
            <span className="stat-num">{data.public_repos}</span>
            <span className="stat-lbl">Repos</span>
          </div>
          <div className="stat-cell">
            <Users size={12} className="stat-icon" />
            <span className="stat-num">{data.followers.toLocaleString()}</span>
            <span className="stat-lbl">Followers</span>
          </div>
          <div className="stat-cell">
            <Star size={12} className="stat-icon" />
            <span className="stat-num">{data.totalStars.toLocaleString()}</span>
            <span className="stat-lbl">Stars</span>
          </div>
          <div className="stat-cell">
            <GitBranch size={12} className="stat-icon" />
            <span className="stat-num">{data.totalForks.toLocaleString()}</span>
            <span className="stat-lbl">Forks</span>
          </div>
        </div>

        <p className="flip-hint">Click to return ←</p>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [username,   setUsername]   = useState('');
  const [userData,   setUserData]   = useState(null);
  const [cardState,  setCardState]  = useState('idle');
  const [flipped,    setFlipped]    = useState(false);
  const [error,      setError]      = useState('');
  const [particles,  setParticles]  = useState(false);

  const frontRef = useRef(null);
  const backRef  = useRef(null);
  const inputRef = useRef(null);

  const fetchAndPull = useCallback(async (user) => {
    const trimmed = (user || username).trim();
    if (!trimmed) { inputRef.current?.focus(); return; }
    setError('');

    if (cardState === 'landed' || cardState === 'flipped') {
      setCardState('exiting');
      await new Promise(r => setTimeout(r, 420));
    }

    setCardState('fetching');
    setFlipped(false);
    setUserData(null);

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${trimmed}`),
        fetch(`https://api.github.com/users/${trimmed}/repos?per_page=100&sort=updated`),
      ]);
      if (!userRes.ok) throw new Error(
        userRes.status === 404
          ? `Hero "${trimmed}" not found in the scrolls.`
          : 'GitHub API error — try again shortly.'
      );
      const ghUser = await userRes.json();
      const repos  = reposRes.ok ? await reposRes.json() : [];

      const langCount = {};
      repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
      const sortedLangs    = Object.entries(langCount).sort((a, b) => b[1] - a[1]);
      const topLanguage    = sortedLangs[0]?.[0] || 'Mixed';
      const totalLangRepos = sortedLangs.slice(0, 5).reduce((s, [, c]) => s + c, 0) || 1;
      const radarData      = sortedLangs.slice(0, 5).map(([lang, count]) => ({
        language: lang,
        repos: Math.round((count / totalLangRepos) * 100),
      }));

      const totalStars   = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
      const totalForks   = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
      const maxRepoStars = repos.length > 0 ? Math.max(...repos.map(r => r.stargazers_count || 0)) : 0;

      const ageYears   = getAccountAge(ghUser.created_at);
      const accountAge = Math.floor(ageYears);

      // ─── New simple level calculation ───
      const level = calcLevel(ghUser.public_repos, ghUser.followers);
      // ────────────────────────────────────

      const rarity     = rarityFromLevel(level);

      let characterClass = 'Novice Coder';
      if (ghUser.public_repos > 100 && ghUser.followers > 1000) characterClass = 'Legendary Sorcerer';
      else if (ghUser.followers > 500)   characterClass = 'Guild Leader';
      else if (ghUser.public_repos > 50) characterClass = 'Master Architect';
      else if (ghUser.public_repos > 20) characterClass = 'Code Artisan';

      const hp          = ghUser.followers * 10 + 100;
      const mana        = ghUser.public_repos * 5 + 50;
      const hpPercent   = clamp(Math.log2(hp + 1) / Math.log2(100001) * 100, 2, 100);
      const manaPercent = clamp(Math.log2(mana + 1) / Math.log2(5051) * 100, 2, 100);

      const badges = [];
      if (maxRepoStars >= 1000)              badges.push({ icon: Star,      label: '1k+ Stars',  color: '#f59e0b' });
      else if (maxRepoStars >= 100)          badges.push({ icon: Star,      label: '100+ Stars', color: '#f59e0b' });
      if (accountAge >= 5)                   badges.push({ icon: Award,     label: 'Veteran',    color: '#3b82f6' });
      if (ghUser.public_repos >= 20)         badges.push({ icon: GitBranch, label: 'Builder',    color: '#10b981' });
      if (Object.keys(langCount).length >= 4)badges.push({ icon: Shield,    label: 'Polyglot',   color: '#8b5cf6' });
      if (ghUser.followers >= 1000)          badges.push({ icon: Users,     label: 'Influencer', color: '#ec4899' });

      setUserData({
        ...ghUser,
        rpgLevel: level,
        rpgClass: characterClass,
        rarity,
        hp, mana, hpPercent, manaPercent,
        topLanguage,
        specialtyTitle: langTitles[topLanguage] || `${topLanguage} Adept`,
        accountAge,
        accountCreated: new Date(ghUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        specialMoves: getSpecialMoves(accountAge, topLanguage, ghUser.followers, level),
        primaryWeapon: weaponMap[topLanguage] || 'Basic Mace',
        badges, radarData, totalStars, totalForks,
      });

      setCardState('pulling');
      setTimeout(() => {
        setCardState('landed');
        setParticles(true);
        setTimeout(() => setParticles(false), 900);
      }, 650);

    } catch (err) {
      setCardState('idle');
      setError(err.message || 'Something went wrong.');
    }
  }, [username, cardState]);

  const handleFlip = () => {
    if (cardState !== 'landed' && cardState !== 'flipped') return;
    setFlipped(f => !f);
    setCardState(s => s === 'flipped' ? 'landed' : 'flipped');
  };

  const handleDownload = async () => {
    const target = flipped ? backRef.current : frontRef.current;
    if (!target) return;
    try {
      const canvas = await html2canvas(target, {
        useCORS: true, backgroundColor: '#fdf6e3', scale: 2, allowTaint: false,
        ignoreElements: el => el.classList?.contains('flip-hint'),
      });
      const a = document.createElement('a');
      a.download = `${userData.login}-rpg-card.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch {
      setError('Download failed — try again.');
    }
  };

  const isTiltActive = cardState === 'landed' || cardState === 'flipped';

  return (
    <div className="app-root">
      <div className="bg-texture" aria-hidden="true" />

      <div className="app-header">
        <h1 className="app-title">GitHub RPG</h1>
        <p className="app-subtitle">Pull your character card</p>
      </div>

      <div className="search-row">
        <input
          ref={inputRef}
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchAndPull()}
          className="search-input"
          placeholder="Enter hero name..."
          disabled={cardState === 'fetching'}
          aria-label="GitHub username"
        />
        <button
          onClick={() => fetchAndPull()}
          className="search-btn"
          disabled={cardState === 'fetching'}
        >
          {cardState === 'fetching'
            ? <RotateCw size={15} className="spin" />
            : <Search size={15} />}
          <span>{cardState === 'fetching' ? 'Summoning...' : 'Summon'}</span>
        </button>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="card-stage">
        <Particles active={particles} />

        {userData && cardState !== 'idle' && (
          <div className={`card-animator state-${cardState}`}>
            <Tilt
              glareEnable={isTiltActive}
              glareMaxOpacity={0.1}
              glareColor="#f5e6c8"
              tiltMaxAngleX={isTiltActive ? 10 : 0}
              tiltMaxAngleY={isTiltActive ? 10 : 0}
              perspective={900}
              transitionSpeed={isTiltActive ? 400 : 0}
              className="tilt-wrapper"
            >
              <div
                className="rpg-card"
                onClick={handleFlip}
                role="button"
                aria-label={flipped ? 'Flip card to front' : 'Flip card to see stats'}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleFlip()}
                style={{ '--glow-color': userData.rarity.glow }}
              >
                <div className="holo-sheen" aria-hidden="true" />
                <CardFront data={userData} rarity={userData.rarity} visible={!flipped} cardRef={frontRef} />
                <CardBack  data={userData} visible={flipped} cardRef={backRef} />
              </div>
            </Tilt>
          </div>
        )}
      </div>

      {(cardState === 'landed' || cardState === 'flipped') && (
        <div className="action-row">
          <button onClick={handleFlip} className="action-btn">
            <RotateCw size={13} />
            <span>{flipped ? 'Front' : 'Stats'}</span>
          </button>
          <button onClick={handleDownload} className="action-btn">
            <Download size={13} />
            <span>Download</span>
          </button>
        </div>
      )}
    </div>
  );
}