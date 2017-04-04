import { TLOG16AngularCliPage } from './app.po';

describe('tlog16-angular-cli App', () => {
  let page: TLOG16AngularCliPage;

  beforeEach(() => {
    page = new TLOG16AngularCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
