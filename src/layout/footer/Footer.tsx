import StyledLink from 'src/components/interactive/StyledLink';

export default function Footer() {
  return (
    <div className="flex h-14 items-center justify-between bg-gradient-to-r from-violet-950 to-violet-900 p-4 text-sm text-white sm:h-10">
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
          <p className="text-nowrap">terms of service</p>
        </StyledLink>
      </div>
      <StyledLink
        className="w-40 break-normal text-right sm:w-auto"
        light
        href="mailto:contact@hexfleet.com">
        contact@hexfleet.com
      </StyledLink>
    </div>
  );
}
