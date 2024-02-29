import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useRouter } from 'next/router';

import AccountButton from 'src/layout/navbar/AccountButton';
import PageLink from 'src/layout/navbar/PageLink';
import { pagesList } from 'src/layout/pagesList';

export default function Navbar() {
  const { pathname } = useRouter();

  return (
    <div className="fixed w-full">
      <div className="flex h-14 w-full items-center bg-gradient-to-r from-emerald-900 to-emerald-700 pl-2 pr-4 shadow-md">
        <PageLink
          className="ml-2 flex w-20 items-center gap-2 text-xl leading-none sm:w-full sm:text-2xl"
          href={'/'}
          currentPath={pathname}>
          <Image
            src="/logo/android-chrome-192x192.webp"
            width={192}
            height={192}
            alt="logo"
            className="h-10 w-10"
          />
          <h1>Instant Header</h1>
        </PageLink>
        <div className="flex-1" />
        <div className="mr-6 hidden space-x-6 sm:flex">
          {pagesList.map(({ title, path }) => {
            return (
              <PageLink
                href={path}
                currentPath={pathname}
                key={path}
                className="text-xl">
                {title}
              </PageLink>
            );
          })}
        </div>
        <AccountButton pathName={pathname} />
        <Menu>
          <div className="flex outline-none sm:hidden">
            <Menu.Button
              className="ml-2 h-10 w-10 rounded-md p-1 text-stone-50 outline-none transition hover:text-emerald-300 active:text-emerald-500"
              aria-label="menu">
              <Bars3Icon />
            </Menu.Button>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 translate-x-20 "
              enterTo="transform opacity-100  translate-x-0 "
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 translate-x-0 "
              leaveTo="transform opacity-0 translate-x-20 ">
              <Menu.Items className="absolute -right-4 top-12 w-36 rounded-bl-2xl bg-gradient-to-tr from-emerald-800 to-emerald-700 px-1 shadow-lg outline-none">
                <div className="flex w-full flex-col divide-y divide-stone-50 divide-opacity-50">
                  {pagesList.map(({ title, path }) => {
                    return (
                      <Menu.Item key={path}>
                        {({ close }) => (
                          <PageLink
                            href={path}
                            currentPath={pathname}
                            className="py-3 pr-3 text-right text-lg"
                            onClick={close}>
                            {title}
                          </PageLink>
                        )}
                      </Menu.Item>
                    );
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </div>
        </Menu>
      </div>
    </div>
  );
}
