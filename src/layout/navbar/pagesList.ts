type Page = {
  title: string;
  path: string;
  hideWhenLoggedOut: boolean;
};

export const pagesList: Page[] = [
  {
    title: 'Campaign',
    path: '/campaign',
    hideWhenLoggedOut: true,
  },
  {
    title: 'Multiplayer',
    path: '/games',
    hideWhenLoggedOut: true,
  },
  {
    title: 'Stats',
    path: '/stats',
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
