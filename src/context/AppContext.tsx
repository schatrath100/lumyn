import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  Combo,
  CommunityCombo,
  JournalEntry,
  MoodCheckin,
  MoodSelection,
  NumerologySystem,
  PersistedState,
  SubscriptionPlanId,
  SynchronicityEntry,
  SwitchWord,
} from '../types';
import { loadState, saveState, formatDate, todayKey, resetAllData } from '../lib/storage';
import { getWordByName } from '../data/switch-words';
import { newId } from '../lib/id';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  deleteRemoteData,
  publishCommunityCombo,
  pullRemoteState,
  pushRemoteState,
  toggleRemoteUpvote,
} from '../lib/supabase-sync';
import { USER_ERROR_MESSAGE } from '../lib/errors';
import { ensureSupabaseSession } from '../lib/supabase-session';
import { getDisplayName } from '../lib/profile';
import { getResonanceNumber } from '../lib/numerology';
import { syncDailyReminders } from '../lib/reminder-scheduler';

export type CloudSyncStatus = 'off' | 'connecting' | 'synced' | 'error';

interface AppContextValue {
  state: PersistedState;
  selectedWord: SwitchWord | null;
  selectedMood: MoodSelection | null;
  comboWords: SwitchWord[];
  comboName: string;
  sessionCount: number;
  cloudUserId: string | null;
  cloudSyncStatus: CloudSyncStatus;
  cloudSyncError: string | null;
  isCloudAvailable: boolean;
  setSelectedWord: (word: SwitchWord | null) => void;
  setSelectedMood: (mood: MoodSelection | null) => void;
  setComboName: (name: string) => void;
  addToCombo: (word: SwitchWord) => void;
  removeFromCombo: (id: number) => void;
  clearCombo: () => void;
  saveCombo: () => void;
  deleteCombo: (id: string) => void;
  importCommunityCombo: (name: string, words: string[]) => void;
  pickMood: (mood: MoodSelection) => SwitchWord;
  toggleIntention: (id: string) => void;
  setUserName: (name: string) => void;
  setBirthDate: (date: string) => void;
  setNumerologySystem: (system: NumerologySystem) => void;
  setPersonalNumber: (n: number | null) => void;
  setLifePathNumber: (n: number | null) => void;
  completeOnboarding: () => void;
  grantSubscription: (planId: SubscriptionPlanId) => void;
  toggleDarkMode: () => void;
  toggleNotif: () => void;
  setReminderTime: (time: string) => void;
  toggleMantraAmbient: () => void;
  toggleMantraBinaural: () => void;
  saveJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  saveSynchronicityEntry: (entry: Omit<SynchronicityEntry, 'id' | 'date'>) => void;
  toggleCommunityUpvote: (id: string) => void;
  hasUpvoted: (id: string) => boolean;
  toggleSavedWord: (word: string) => void;
  isWordSaved: (word: string) => boolean;
  incrementSession: () => void;
  resetSession: () => void;
  recordActivity: () => void;
  updateProfile: (partial: Partial<PersistedState['profile']>) => void;
  enableCloudSync: () => Promise<void>;
  disableCloudSync: () => Promise<void>;
  deleteAllData: () => Promise<void>;
  publishComboToCommunity: (comboId: string, tag: string) => Promise<CommunityCombo>;
}

const AppContext = createContext<AppContextValue | null>(null);

const SYNC_DEBOUNCE_MS = 1200;

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState);
  const [selectedWord, setSelectedWord] = useState<SwitchWord | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodSelection | null>(null);
  const [comboWords, setComboWords] = useState<SwitchWord[]>([]);
  const [comboName, setComboName] = useState('');
  const [sessionCount, setSessionCount] = useState(0);
  const [cloudUserId, setCloudUserId] = useState<string | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('off');
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);
  const stateRef = useRef(state);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  stateRef.current = state;

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.settings.darkMode ? 'dark' : 'light');
  }, [state.settings.darkMode]);

  useEffect(() => {
    void syncDailyReminders(state.settings.notifEnabled, state.settings.reminderTime, state.profile);
  }, [
    state.settings.notifEnabled,
    state.settings.reminderTime,
    state.profile.personalNumber,
    state.profile.lifePathNumber,
  ]);

  const scheduleCloudPush = useCallback((userId: string) => {
    if (!supabase) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(async () => {
      try {
        await pushRemoteState(userId, stateRef.current);
        setCloudSyncStatus('synced');
        setCloudSyncError(null);
      } catch {
        setCloudSyncStatus('error');
        setCloudSyncError(USER_ERROR_MESSAGE);
      }
    }, SYNC_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    if (!supabase || !cloudUserId) return;
    scheduleCloudPush(cloudUserId);
  }, [state, cloudUserId, scheduleCloudPush]);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCloudUserId(session.user.id);
        setCloudSyncStatus('connecting');
        pullRemoteState(session.user.id)
          .then((remote) => {
            if (remote) setState(remote);
            setCloudSyncStatus('synced');
          })
          .catch(() => {
            setCloudSyncStatus('error');
            setCloudSyncError(USER_ERROR_MESSAGE);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCloudUserId(session.user.id);
      } else {
        setCloudUserId(null);
        setCloudSyncStatus('off');
        setCloudSyncError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const enableCloudSync = useCallback(async () => {
    if (!supabase) return;
    setCloudSyncStatus('connecting');
    setCloudSyncError(null);
    try {
      const session = await ensureSupabaseSession(supabase);
      const userId = session.user.id;

      const remote = await pullRemoteState(userId);
      if (remote) {
        setState(remote);
      } else {
        await pushRemoteState(userId, stateRef.current);
      }
      setCloudUserId(userId);
      setCloudSyncStatus('synced');
    } catch {
      setCloudSyncStatus('error');
      setCloudSyncError(USER_ERROR_MESSAGE);
    }
  }, []);

  const disableCloudSync = useCallback(async () => {
    if (!supabase) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    await supabase.auth.signOut();
    setCloudUserId(null);
    setCloudSyncStatus('off');
    setCloudSyncError(null);
  }, []);

  const updateProfile = useCallback((partial: Partial<PersistedState['profile']>) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...partial } }));
  }, []);

  const pickMood = useCallback((mood: MoodSelection): SwitchWord => {
    const word = getWordByName(mood.matchWord) ?? getWordByName('ELATE')!;
    const source: MoodCheckin['source'] = 'sym' in mood ? 'tile' : 'color_grid';
    const checkin: MoodCheckin = {
      id: newId(),
      date: formatDate(),
      moodId: mood.id,
      moodLabel: mood.label,
      matchWord: mood.matchWord,
      source,
    };
    setState((prev) => ({
      ...prev,
      moodCheckins: [checkin, ...prev.moodCheckins].slice(0, 200),
    }));
    setSelectedMood(mood);
    setSelectedWord(word);
    return word;
  }, []);

  const toggleIntention = useCallback((id: string) => {
    setState((prev) => {
      const has = prev.profile.selectedIntentions.includes(id);
      if (has) {
        return {
          ...prev,
          profile: {
            ...prev.profile,
            selectedIntentions: prev.profile.selectedIntentions.filter((i) => i !== id),
          },
        };
      }
      if (prev.profile.selectedIntentions.length >= 3) return prev;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          selectedIntentions: [...prev.profile.selectedIntentions, id],
        },
      };
    });
  }, []);

  const addToCombo = useCallback((word: SwitchWord) => {
    setComboWords((prev) => (prev.some((w) => w.id === word.id) ? prev : [...prev, word]));
  }, []);

  const removeFromCombo = useCallback((id: number) => {
    setComboWords((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const clearCombo = useCallback(() => {
    setComboWords([]);
    setComboName('');
  }, []);

  const saveCombo = useCallback(() => {
    if (!comboWords.length) return;
    const combo: Combo = {
      id: newId(),
      name: comboName || 'My Combo',
      words: comboWords.map((w) => w.word),
      date: formatDate(),
    };
    setState((prev) => ({ ...prev, savedCombos: [combo, ...prev.savedCombos] }));
    setComboWords([]);
    setComboName('');
  }, [comboWords, comboName]);

  const importCommunityCombo = useCallback((name: string, words: string[]) => {
    const combo: Combo = { id: newId(), name, words, date: formatDate() };
    setState((prev) => ({ ...prev, savedCombos: [combo, ...prev.savedCombos] }));
  }, []);

  const deleteCombo = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      savedCombos: prev.savedCombos.filter((c) => c.id !== id),
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    updateProfile({ onboardingComplete: true });
  }, [updateProfile]);

  const grantSubscription = useCallback(
    (planId: SubscriptionPlanId) => {
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          isSubscribed: true,
          trialStartDate: prev.profile.trialStartDate ?? new Date().toISOString(),
          subscriptionPlan: planId,
          onboardingComplete: true,
        },
      }));
    },
    [],
  );

  const toggleDarkMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, darkMode: !prev.settings.darkMode },
    }));
  }, []);

  const toggleNotif = useCallback(() => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, notifEnabled: !prev.settings.notifEnabled },
    }));
  }, []);

  const setReminderTime = useCallback((time: string) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, reminderTime: time },
    }));
  }, []);

  const toggleMantraAmbient = useCallback(() => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, mantraAmbient: !prev.settings.mantraAmbient },
    }));
  }, []);

  const toggleMantraBinaural = useCallback(() => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, mantraBinaural: !prev.settings.mantraBinaural },
    }));
  }, []);

  const saveJournalEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const full: JournalEntry = { ...entry, id: newId(), date: formatDate() };
    setState((prev) => ({
      ...prev,
      journalEntries: [full, ...prev.journalEntries],
    }));
  }, []);

  const saveSynchronicityEntry = useCallback((entry: Omit<SynchronicityEntry, 'id' | 'date'>) => {
    const full: SynchronicityEntry = { ...entry, id: newId(), date: formatDate() };
    setState((prev) => ({
      ...prev,
      synchronicityEntries: [full, ...prev.synchronicityEntries],
    }));
  }, []);

  const toggleCommunityUpvote = useCallback((id: string) => {
    setState((prev) => {
      const has = prev.communityUpvotes.includes(id);
      const next = has
        ? prev.communityUpvotes.filter((x) => x !== id)
        : [...prev.communityUpvotes, id];
      if (cloudUserId) {
        void toggleRemoteUpvote(cloudUserId, id, !has);
      }
      return { ...prev, communityUpvotes: next };
    });
  }, [cloudUserId]);

  const hasUpvoted = useCallback(
    (id: string) => state.communityUpvotes.includes(id),
    [state.communityUpvotes],
  );

  const toggleSavedWord = useCallback((word: string) => {
    setState((prev) => {
      const has = prev.savedWords.includes(word);
      return {
        ...prev,
        savedWords: has
          ? prev.savedWords.filter((w) => w !== word)
          : [...prev.savedWords, word],
      };
    });
  }, []);

  const isWordSaved = useCallback(
    (word: string) => state.savedWords.includes(word),
    [state.savedWords],
  );

  const recordActivity = useCallback(() => {
    const today = todayKey();
    setState((prev) => {
      if (prev.lastActiveDate === today) return prev;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().slice(0, 10);
      const streak =
        prev.lastActiveDate === yesterdayKey ? prev.streak + 1 : 1;
      return { ...prev, streak, lastActiveDate: today };
    });
  }, []);

  const publishComboToCommunity = useCallback(async (comboId: string, tag: string) => {
    if (!supabase) throw new Error('Community publishing requires cloud connection.');
    const combo = stateRef.current.savedCombos.find((c) => c.id === comboId);
    if (!combo) throw new Error('Combo not found.');
    if (combo.communityPublishedId) throw new Error('This combo is already in the exchange.');

    const session = await ensureSupabaseSession(supabase);
    const profile = stateRef.current.profile;
    const published = await publishCommunityCombo(session.user.id, {
      name: combo.name,
      words: combo.words,
      authorDisplay: getDisplayName(profile),
      tag,
      resonanceNumber: getResonanceNumber(profile.personalNumber, profile.lifePathNumber),
    });

    setState((prev) => ({
      ...prev,
      savedCombos: prev.savedCombos.map((c) =>
        c.id === comboId ? { ...c, communityPublishedId: published.id } : c,
      ),
    }));

    return published;
  }, []);

  const deleteAllData = useCallback(async () => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    if (supabase && cloudUserId) {
      try {
        await deleteRemoteData();
      } catch {
        /* local wipe still proceeds */
      }
      await supabase.auth.signOut();
    }
    const fresh = resetAllData();
    setState(fresh);
    setSelectedWord(null);
    setSelectedMood(null);
    setComboWords([]);
    setComboName('');
    setSessionCount(0);
    setCloudUserId(null);
    setCloudSyncStatus('off');
    setCloudSyncError(null);
  }, [cloudUserId]);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      selectedWord,
      selectedMood,
      comboWords,
      comboName,
      sessionCount,
      cloudUserId,
      cloudSyncStatus,
      cloudSyncError,
      isCloudAvailable: isSupabaseConfigured,
      setSelectedWord,
      setSelectedMood,
      setComboName,
      addToCombo,
      removeFromCombo,
      clearCombo,
      saveCombo,
      deleteCombo,
      importCommunityCombo,
      pickMood,
      toggleIntention,
      setUserName: (name) => updateProfile({ userName: name }),
      setBirthDate: (date) => updateProfile({ birthDate: date }),
      setNumerologySystem: (system) => updateProfile({ numerologySystem: system }),
      setPersonalNumber: (n) => updateProfile({ personalNumber: n }),
      setLifePathNumber: (n) => updateProfile({ lifePathNumber: n }),
      completeOnboarding,
      grantSubscription,
      toggleDarkMode,
      toggleNotif,
      setReminderTime,
      toggleMantraAmbient,
      toggleMantraBinaural,
      saveJournalEntry,
      saveSynchronicityEntry,
      toggleCommunityUpvote,
      hasUpvoted,
      toggleSavedWord,
      isWordSaved,
      incrementSession: () => setSessionCount((c) => c + 1),
      resetSession: () => setSessionCount(0),
      recordActivity,
      updateProfile,
      enableCloudSync,
      disableCloudSync,
      deleteAllData,
      publishComboToCommunity,
    }),
    [
      state,
      selectedWord,
      selectedMood,
      comboWords,
      comboName,
      sessionCount,
      cloudUserId,
      cloudSyncStatus,
      cloudSyncError,
      addToCombo,
      removeFromCombo,
      clearCombo,
      saveCombo,
      deleteCombo,
      importCommunityCombo,
      pickMood,
      toggleIntention,
      completeOnboarding,
      grantSubscription,
      toggleDarkMode,
      toggleNotif,
      setReminderTime,
      toggleMantraAmbient,
      toggleMantraBinaural,
      saveJournalEntry,
      saveSynchronicityEntry,
      toggleCommunityUpvote,
      hasUpvoted,
      toggleSavedWord,
      isWordSaved,
      recordActivity,
      updateProfile,
      enableCloudSync,
      disableCloudSync,
      deleteAllData,
      publishComboToCommunity,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
