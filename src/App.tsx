import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppGuard, OnboardingGuard } from './components/Guards';
import { AppLayout } from './layouts/AppLayout';
import { SplashScreen } from './screens/onboarding/SplashScreen';
import { IntroScreen } from './screens/onboarding/IntroScreen';
import { IntentionsScreen } from './screens/onboarding/IntentionsScreen';
import { PersonalNumberScreen } from './screens/onboarding/PersonalNumberScreen';
import { RemindersScreen } from './screens/onboarding/RemindersScreen';
import { WelcomeScreen } from './screens/onboarding/WelcomeScreen';
import { HomeScreen } from './screens/app/HomeScreen';
import { LibraryScreen } from './screens/app/LibraryScreen';
import { WordDetailScreen } from './screens/app/WordDetailScreen';
import { SessionScreen } from './screens/app/SessionScreen';
import { ComboScreen } from './screens/app/ComboScreen';
import { SavedCombosScreen } from './screens/app/SavedCombosScreen';
import { ShareCardScreen } from './screens/app/ShareCardScreen';
import { MoodCheckinScreen } from './screens/app/MoodCheckinScreen';
import { MoodResultScreen } from './screens/app/MoodResultScreen';
import { JournalScreen } from './screens/app/JournalScreen';
import { AnalyticsScreen } from './screens/app/AnalyticsScreen';
import { SettingsScreen } from './screens/app/SettingsScreen';
import { DiscoverScreen } from './screens/app/DiscoverScreen';
import { SigilScreen } from './screens/app/SigilScreen';
import { MantraScreen } from './screens/app/MantraScreen';
import { WidgetScreen } from './screens/app/WidgetScreen';
import { DeleteDataScreen } from './screens/app/DeleteDataScreen';
import { PrivacyScreen } from './screens/legal/PrivacyScreen';
import { TermsScreen } from './screens/legal/TermsScreen';

function App() {
  return (
    <AppProvider>
      <div className="app-shell">
        <BrowserRouter>
          <Routes>
            <Route element={<OnboardingGuard />}>
              <Route path="/onboarding" element={<SplashScreen />} />
              <Route path="/onboarding/intro" element={<IntroScreen />} />
              <Route path="/onboarding/intentions" element={<IntentionsScreen />} />
              <Route path="/onboarding/number" element={<PersonalNumberScreen />} />
              <Route path="/onboarding/reminders" element={<RemindersScreen />} />
              <Route path="/onboarding/welcome" element={<WelcomeScreen />} />
            </Route>

            <Route element={<AppGuard />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/library" element={<LibraryScreen />} />
                <Route path="/combo" element={<ComboScreen />} />
                <Route path="/combos" element={<SavedCombosScreen />} />
                <Route path="/mood" element={<MoodCheckinScreen />} />
                <Route path="/journal" element={<JournalScreen />} />
              </Route>

              <Route path="/profile/number" element={<PersonalNumberScreen />} />

              <Route path="/library/:id" element={<WordDetailScreen />} />
              <Route path="/session/:id" element={<SessionScreen />} />
              <Route path="/share/:id" element={<ShareCardScreen />} />
              <Route path="/mood/result" element={<MoodResultScreen />} />
              <Route path="/analytics" element={<AnalyticsScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/settings/delete-data" element={<DeleteDataScreen />} />
              <Route path="/legal/privacy" element={<PrivacyScreen />} />
              <Route path="/legal/terms" element={<TermsScreen />} />
              <Route path="/discover" element={<DiscoverScreen />} />
              <Route path="/sigil/community/:id" element={<SigilScreen />} />
              <Route path="/sigil/:id" element={<SigilScreen />} />
              <Route path="/mantra/:id" element={<MantraScreen />} />
              <Route path="/widget" element={<WidgetScreen />} />
            </Route>

            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AppProvider>
  );
}

export default App;
