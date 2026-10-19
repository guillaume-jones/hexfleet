import Image from 'next/image';
import { useCallback } from 'react';

import Button from 'src/components/interactive/Button';

export default function ProviderButton({
  provider,
  loginFunction,
  loading,
}: {
  provider: string;
  loginFunction: () => Promise<unknown>;
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
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/login/${provider}.svg`}
          width={24}
          height={24}
          className="h-auto"
          alt={`${provider} logo`}
        />
        <p>Log in with {provider}</p>
      </div>
    </Button>
  );
}
