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
      <div style={{ padding: '8px var(--screen-x) 12px', flexShrink: 0 }}>
        <h1 className="display" style={{ fontSize: 26, marginBottom: 14 }}>Library</h1>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--tm)' }}>⌕</span>
          <input
            className="input input--surface"
            style={{ paddingLeft: 38, fontSize: 15, padding: '14px 14px 14px 38px' }}
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
      <div className="screen__body screen__body--tab" style={{ padding: `0 var(--screen-x)` }}>
        {filtered.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => { setSelectedWord(w); navigate(`/library/${w.id}`); }}
            style={{ width: '100%', textAlign: 'left', background: 'var(--bg-s)', border: 'none', borderRadius: 12, padding: '12px 12px', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ width: 4, height: 44, borderRadius: 2, background: w.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="display" style={{ fontSize: 16, fontStyle: 'italic' }}>{w.word}</span>
                <span style={{ padding: '3px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600, color: w.color, background: `${w.color}1A` }}>{w.category}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--tm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.intention}</div>
            </div>
            <span style={{ fontSize: 16, color: 'var(--tm)' }}>›</span>
          </button>
        ))}
        <div style={{ height: 12 }} />
      </div>
    </>
  );
}
