import { DsaPage } from './app.po';

describe('dsa App', () => {
  let page: DsaPage;

  beforeEach(() => {
    page = new DsaPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
