import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkipNav } from './skip-nav';

function SkipNavContainer() {
  const mainId = 'main-content';
  return (
    <>
      <SkipNav mainId={mainId} />
      <main id={mainId} tabIndex={0} />
    </>
  );
}

describe(SkipNav.name, () => {
  it('should render an anchor element with expected text', () => {
    render(<SkipNavContainer />);

    const anchor = screen.getByRole('link', {
      name: 'Skip to main content',
    });

    expect(anchor).toBeInTheDocument();
  });

  // FIXME: This is not working. Active element is anchor after click.
  // it('should move focus to main element when clicked', async () => {
  //   const user = userEvent.setup();

  //   render(<SkipNavContainer />);

  //   const anchor = screen.getByRole('link');
  //   const main = screen.getByRole('main');

  //   await user.click(anchor);
  //   await waitFor(() => expect(document.activeElement).toEqual(main));
  // });
});
