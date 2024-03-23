import { FirestoreError, doc, setDoc } from 'firebase/firestore';
import isMatch from 'lodash/isMatch';
import { ReactNode, createContext, useCallback, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { Settings } from 'functions/src/document-types/Settings';

import { auth, firestore } from 'src/firebase/firebaseApp';

export type SettingsContextType = Settings & {
  loading?: boolean;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const SettingsContext = createContext<SettingsContextType>(undefined!);

const useSettingsProvider = (): SettingsContextType => {
  const [user] = useAuthState(auth);

  const [settings, loading] = useDocumentData<Partial<Settings>>(
    user && doc(firestore, 'settings', user.uid),
  );

  const updateSettings = useCallback(
    (newSettings: Partial<Settings>) => {
      // Cannot save if no user
      if (!user) return;

      // Does not call Firebase if no changes
      if (settings && isMatch(settings, newSettings)) return;

      const settingsRef = doc(firestore, 'settings', user.uid);
      setDoc(settingsRef, newSettings, { merge: true }).catch(
        (error: FirestoreError) => console.error(error),
      );
    },
    [user, settings],
  );

  return useMemo(
    () => ({
      ...settings,
      loading,
      updateSettings,
    }),
    [settings, loading, updateSettings],
  );
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const value = useSettingsProvider();

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
