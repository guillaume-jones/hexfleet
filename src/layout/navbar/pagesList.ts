type Page = {
  title: string;
  path: string;
  hideWhenLoggedOut: boolean;
};

export const pagesList: Page[] = [
  {
    title: 'Games',
    path: '/games',
    hideWhenLoggedOut: true,
  },
  {
    title: 'Leaderboard',
    path: '/leaderboard',
    hideWhenLoggedOut: false,
  },
];

export const hasPagesForLoggedOut = pagesList.some(
  (page) => !page.hideWhenLoggedOut,
);
