type Page = {
  title: string;
  path: string;
  hideWhenLoggedOut?: boolean;
};

export const pagesList: Page[] = [
  {
    title: 'Past Games',
    path: '/pastgames',
    hideWhenLoggedOut: true,
  },
];
