import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { useCallback, useMemo, useState } from 'react';

import Input from 'src/components/interactive/Input';

export default function PasswordField({
  password,
  setPassword,
}: {
  password: string;
  setPassword: (password: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);

  const invertShowPassword = useCallback(
    () => setShowPassword(!showPassword),
    [showPassword],
  );

  const showWarning = useMemo(
    () => password.length < 10 && hasBeenFocused,
    [hasBeenFocused, password.length],
  );

  return (
    <div className="w-60 text-emerald-800">
      <div className="relative flex">
        <Input
          value={password}
          setValue={setPassword}
          placeholder="Password"
          className="flex-1"
          inputProps={{
            type: showPassword ? 'text' : 'password',
            onFocus: () => setHasBeenFocused(true),
          }}
        />
        <button
          type="button"
          onClick={invertShowPassword}
          className="absolute right-0 top-2.5 mx-2">
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5 fill-emerald-700 transition-all duration-300 hover:fill-emerald-600" />
          ) : (
            <EyeIcon className="h-5 w-5 fill-emerald-700 transition-all duration-300 hover:fill-emerald-600" />
          )}
        </button>
      </div>
      <p
        className={`mx-1 mt-1 text-xs transition-all ${
          showWarning ? 'h-4 opacity-100' : 'h-0 opacity-0'
        }`}>
        Must be at least 10 characters long.
      </p>
    </div>
  );
}
