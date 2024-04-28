import { useMemo, useState } from 'react';

import Input from 'src/components/interactive/Input';

export default function EmailField({
  email,
  setEmail,
}: {
  email: string;
  setEmail: (password: string) => void;
}) {
  const [hasBeenBlurred, setHasBeenBlurred] = useState(false);

  const showWarning = useMemo(
    () => !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && hasBeenBlurred,
    [email, hasBeenBlurred],
  );

  return (
    <div className="w-60 text-violet-800">
      <div className="flex">
        <Input
          value={email}
          setValue={setEmail}
          placeholder="Email"
          className="flex-1"
          inputProps={{
            onBlur: () => setHasBeenBlurred(true),
          }}
        />
      </div>
      <p
        className={`mx-1 mt-1 text-sm text-red-600 transition-all ${
          showWarning ? 'h-6 opacity-100' : 'h-0 opacity-0'
        }`}>
        Please enter a valid email address.
      </p>
    </div>
  );
}
