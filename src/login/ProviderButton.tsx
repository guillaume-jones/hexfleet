import { UserCredential } from 'firebase/auth';
import Image from 'next/image';
import { useCallback } from 'react';

import Button from 'src/components/interactive/Button';

export default function ProviderButton({
  provider,
  loginFunction,
  loading,
}: {
  provider: string;
  loginFunction: () => Promise<UserCredential | undefined>;
  loading: boolean;
}) {
  const onClick = useCallback(() => {
    loginFunction().catch((e) => console.error(e));
  }, [loginFunction]);

  return (
    <Button
      light
      onClick={onClick}
      fixedActive={loading}
      className="border border-zinc-300">
      <div className="flex h-10 w-52 items-center gap-4">
        <Image
          src={`/login/${provider}.svg`}
          width={24}
          height={24}
          className="h-auto"
          alt={`${provider} logo`}
        />
        <p>Sign in with {provider}</p>
      </div>
    </Button>
  );
}
