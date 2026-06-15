import type { Combo, CommunityCombo, JournalEntry, PersistedState, SynchronicityEntry } from '../types';
import { supabase } from './supabase';
import { formatDate } from './storage';
import { newId, isUuid } from './id';

function formatRowDate(iso: string): string {
  return formatDate(new Date(iso));
}

export async function pullRemoteState(userId: string): Promise<PersistedState | null> {
  if (!supabase) return null;

  const [profileRes, combosRes, journalRes, syncRes, wordsRes, upvotesRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('saved_combos').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('journal_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('synchronicity_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('saved_words').select('word').eq('user_id', userId),
    supabase.from('community_upvotes').select('combo_id').eq('user_id', userId),
  ]);

  if (profileRes.error) throw profileRes.error;
  if (!profileRes.data) return null;

  const p = profileRes.data;
  const savedCombos: Combo[] = (combosRes.data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    words: r.words ?? [],
    date: formatRowDate(r.created_at),
  }));
  const journalEntries: JournalEntry[] = (journalRes.data ?? []).map((r) => ({
    id: r.id,
    date: formatRowDate(r.created_at),
    word: r.word,
    moodBefore: r.mood_before as 1 | 2 | 3 | 4 | 5,
    moodAfter: r.mood_after as 1 | 2 | 3 | 4 | 5,
    note: r.note ?? '',
  }));
  const synchronicityEntries: SynchronicityEntry[] = (syncRes.data ?? []).map((r) => ({
    id: r.id,
    date: formatRowDate(r.created_at),
    word: r.word,
    sign: r.sign,
    note: r.note ?? '',
  }));

  return {
    profile: {
      userName: p.user_name ?? '',
      birthDate: p.birth_date ?? '',
      numerologySystem: p.numerology_system as 'chaldean' | 'pythagorean',
      personalNumber: p.personal_number,
      lifePathNumber: p.life_path_number,
      selectedIntentions: p.selected_intentions ?? [],
      onboardingComplete: p.onboarding_complete ?? false,
    },
    settings: {
      darkMode: p.dark_mode ?? false,
      notifEnabled: p.notif_enabled ?? true,
      reminderTime: p.reminder_time ?? '8:00 AM',
      mantraAmbient: p.mantra_ambient ?? false,
      mantraBinaural: p.mantra_binaural ?? false,
    },
    savedCombos,
    journalEntries,
    synchronicityEntries,
    communityUpvotes: (upvotesRes.data ?? []).map((r) => r.combo_id as string),
    streak: p.streak ?? 0,
    lastActiveDate: p.last_active_date,
    savedWords: (wordsRes.data ?? []).map((r) => r.word),
  };
}

export async function pushRemoteState(userId: string, state: PersistedState): Promise<void> {
  if (!supabase) return;

  const { profile, settings } = state;

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    user_name: profile.userName,
    birth_date: profile.birthDate || null,
    numerology_system: profile.numerologySystem,
    personal_number: profile.personalNumber,
    life_path_number: profile.lifePathNumber,
    selected_intentions: profile.selectedIntentions,
    onboarding_complete: profile.onboardingComplete,
    streak: state.streak,
    last_active_date: state.lastActiveDate,
    dark_mode: settings.darkMode,
    notif_enabled: settings.notifEnabled,
    reminder_time: settings.reminderTime,
    mantra_ambient: settings.mantraAmbient,
    mantra_binaural: settings.mantraBinaural,
  });
  if (profileError) throw profileError;

  await supabase.from('saved_combos').delete().eq('user_id', userId);
  if (state.savedCombos.length) {
    const { error } = await supabase.from('saved_combos').insert(
      state.savedCombos.map((c) => ({
        id: isUuid(c.id) ? c.id : newId(),
        user_id: userId,
        name: c.name,
        words: c.words,
      })),
    );
    if (error) throw error;
  }

  await supabase.from('journal_entries').delete().eq('user_id', userId);
  if (state.journalEntries.length) {
    const { error } = await supabase.from('journal_entries').insert(
      state.journalEntries.map((e) => ({
        id: isUuid(e.id) ? e.id : newId(),
        user_id: userId,
        word: e.word,
        mood_before: e.moodBefore,
        mood_after: e.moodAfter,
        note: e.note,
      })),
    );
    if (error) throw error;
  }

  await supabase.from('synchronicity_entries').delete().eq('user_id', userId);
  if (state.synchronicityEntries.length) {
    const { error } = await supabase.from('synchronicity_entries').insert(
      state.synchronicityEntries.map((e) => ({
        id: isUuid(e.id) ? e.id : newId(),
        user_id: userId,
        word: e.word,
        sign: e.sign,
        note: e.note,
      })),
    );
    if (error) throw error;
  }

  await supabase.from('saved_words').delete().eq('user_id', userId);
  if (state.savedWords.length) {
    const { error } = await supabase.from('saved_words').insert(
      state.savedWords.map((word) => ({ user_id: userId, word })),
    );
    if (error) throw error;
  }

  await supabase.from('community_upvotes').delete().eq('user_id', userId);
  if (state.communityUpvotes.length) {
    const { error } = await supabase.from('community_upvotes').insert(
      state.communityUpvotes.map((combo_id) => ({ user_id: userId, combo_id })),
    );
    if (error) throw error;
  }
}

export async function fetchCommunityCombos(): Promise<CommunityCombo[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('community_combos_with_votes')
    .select('*')
    .order('upvote_count', { ascending: false });

  if (error || !data) return [];

  return data.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    words: (r.words as string[]) ?? [],
    author: r.author_display as string,
    resonance: (r.resonance_number as number) ?? 0,
    upvotes: (r.upvote_count as number) ?? 0,
    tag: r.tag as string,
  }));
}

export async function deleteRemoteData(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.rpc('delete_my_data');
  if (error) throw error;
}

export async function toggleRemoteUpvote(userId: string, comboId: string, add: boolean): Promise<void> {
  if (!supabase) return;
  if (add) {
    await supabase.from('community_upvotes').upsert({ user_id: userId, combo_id: comboId });
  } else {
    await supabase.from('community_upvotes').delete().eq('user_id', userId).eq('combo_id', comboId);
  }
}
