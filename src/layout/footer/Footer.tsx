import { Twitter } from 'react-feather';

import StyledLink from 'src/components/interactive/StyledLink';

export default function Footer() {
  return (
    <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 px-4 py-3 text-sm text-white">
      <div className="flex justify-between">
        <p className="mr-1">© 2023 Instant Header, Inc. </p>
        <div className="flex gap-4">
          <a
            aria-label="twitter"
            href="https://twitter.com/instantheader"
            target="_blank"
            rel="noopener noreferrer">
            <Twitter
              size={24}
              className="tranasition-all fill-emerald-300 stroke-emerald-300 p-1 duration-150 hover:fill-emerald-400 hover:stroke-emerald-400"
            />
          </a>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col sm:flex-row sm:gap-1">
          <StyledLink
            light
            newTab
            href="https://instant-header.github.io/privacy-policy/">
            Our privacy policy
          </StyledLink>
          <p className="hidden sm:block">and</p>
          <StyledLink
            light
            newTab
            href="https://instant-header.github.io/terms-of-service/"
            className="flex">
            <p className="block sm:hidden">Our&nbsp;</p>
            terms of service
          </StyledLink>
        </div>
        <StyledLink
          className="w-40 break-normal text-right sm:w-auto"
          light
          href="mailto:contact@instantheader.com">
          contact@<span className="sm:hidden"> </span>instantheader.com
        </StyledLink>
      </div>
    </div>
  );
}
