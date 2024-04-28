import { FirestoreError, doc, setDoc } from 'firebase/firestore';
import isMatch from 'lodash/isMatch';
import { ReactNode, createContext, useCallback } from 'react';
import { useIdToken } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { Profile } from 'functions/src/document-types/Profile';
import { Settings } from 'functions/src/document-types/Settings';

import { auth, firestore } from 'src/firebase/firebaseApp';

export type SettingsContextType = Partial<Settings> &
  Partial<Profile> & {
    loading?: boolean;
    updateSettings: (arg0: Partial<Settings>) => void;
    updateProfile: (arg0: Partial<Profile>) => void;
  };

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const SettingsContext = createContext<SettingsContextType>(undefined!);

const useSettingsProvider = (): SettingsContextType => {
  const [user, userLoading] = useIdToken(auth);

  const settingsRef = user && doc(firestore, 'settings', user.uid);
  const profileRef = user && doc(firestore, 'profiles', user.uid);

  const [settings, settingsLoading] =
    useDocumentData<Partial<Settings>>(settingsRef);
  const [profile, profileLoading] =
    useDocumentData<Partial<Profile>>(profileRef);

  const updateSettings = useCallback(
    (newSettings: Partial<Settings>) => {
      // Cannot save if no user or settings not yet loaded
      if (!settings || !settingsRef) return;

      // Does not call Firebase if no changes
      if (isMatch(settings, newSettings)) return;

      setDoc(settingsRef, newSettings, { merge: true }).catch(
        (error: FirestoreError) => console.error(error),
      );
    },
    [settings, settingsRef],
  );

  const updateProfile = useCallback(
    (newProfile: Partial<Profile>) => {
      // Cannot save if no user or profile not yet loaded
      if (!profile || !profileRef) return;

      // Does not call Firebase if no changes
      if (isMatch(profile, newProfile)) return;

      setDoc(profileRef, newProfile, { merge: true }).catch(
        (error: FirestoreError) => console.error(error),
      );
    },
    [profile, profileRef],
  );

  return {
    ...settings,
    ...profile,
    loading: settingsLoading || profileLoading || userLoading,
    updateSettings,
    updateProfile,
  };
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const value = useSettingsProvider();

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
