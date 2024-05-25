type Page = {
  title: string;
  path: string;
  hideWhenLoggedOut?: boolean;
};

export const pagesList: Page[] = [
  {
    title: 'Games',
    path: '/games',
    hideWhenLoggedOut: true,
  },
];

export const hasPagesForLoggedOut = pagesList.some(
  (page) => !page.hideWhenLoggedOut,
);
