import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/StatusBar';
import { CATEGORIES, SWITCH_WORDS } from '../../data/switch-words';
import { useApp } from '../../context/AppContext';

export function LibraryScreen() {
  const navigate = useNavigate();
  const { setSelectedWord } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = useMemo(
    () =>
      SWITCH_WORDS.filter((w) => {
        const sq = searchQuery.toLowerCase();
        const matchesSearch =
          !sq ||
          w.word.toLowerCase().includes(sq) ||
          w.intention.toLowerCase().includes(sq) ||
          w.category.toLowerCase().includes(sq) ||
          w.description.toLowerCase().includes(sq);
        const matchesCat = selectedCategory === 'All' || w.category === selectedCategory;
        return matchesSearch && matchesCat;
      }),
    [searchQuery, selectedCategory],
  );

  return (
    <>
      <StatusBar />
      <div style={{ padding: '4px 18px 10px', flexShrink: 0 }}>
        <div className="display" style={{ fontSize: 18, marginBottom: 12 }}>Library</div>
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'var(--tm)' }}>⌕</span>
          <input
            className="input input--surface"
            style={{ paddingLeft: 36, fontSize: 14, padding: '12px 14px 12px 36px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words, categories, or descriptions…"
          />
        </div>
        <div className="chip-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip${selectedCategory === cat ? ' chip--active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="screen__body" style={{ padding: '0 18px' }}>
        {filtered.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => { setSelectedWord(w); navigate(`/library/${w.id}`); }}
            style={{ width: '100%', textAlign: 'left', background: 'var(--bg-s)', border: 'none', borderRadius: 10, padding: '9px 10px', marginBottom: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <div style={{ width: 4, height: 40, borderRadius: 2, background: w.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span className="display" style={{ fontSize: 13, fontStyle: 'italic' }}>{w.word}</span>
                <span style={{ padding: '3px 8px', borderRadius: 10, fontSize: 9, fontWeight: 600, color: w.color, background: `${w.color}1A` }}>{w.category}</span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--tm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.intention}</div>
            </div>
            <span style={{ fontSize: 13, color: 'var(--tm)' }}>›</span>
          </button>
        ))}
        <div style={{ height: 12 }} />
      </div>
    </>
  );
}
