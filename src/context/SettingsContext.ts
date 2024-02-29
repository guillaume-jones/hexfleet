import { FirestoreError, doc, setDoc } from 'firebase/firestore';
import isMatch from 'lodash/isMatch';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { createContainer } from 'react-tracked';

import { initialSettings } from 'functions/src/constants/UserCreationDefaults';
import { Settings } from 'functions/src/types/Settings';

import { auth, firestore } from 'src/firebase/firebaseApp';

interface SettingsContextInterface extends Settings {
  settingsLoading: boolean;
}

const defaultSettings: SettingsContextInterface = {
  ...initialSettings,
  settingsLoading: true,
};

const useSettingsState = (): [
  SettingsContextInterface,
  (newSettings: Settings) => void,
] => {
  const [state, setState] = useState<SettingsContextInterface>(defaultSettings);
  const [user] = useAuthState(auth);

  const [settings] = useDocumentData<Partial<Settings>>(
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

  /* Clear settings on user logout */
  useEffect(() => {
    if (!user) {
      setState(defaultSettings);
    }
  }, [user]);

  /* Keeps track of settings */
  useEffect(() => {
    if (!settings) return;

    setState((prevState) => ({
      ...prevState,
      ...settings,
      settingsLoading: false,
    }));
  }, [settings]);

  return [state, updateSettings];
};

export const {
  Provider: SettingsContextProvider,
  useTracked: useSettingsContext,
} = createContainer(useSettingsState);
