import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../src/ErrorBoundary';
import Inventory from '../src/Inventory';

const { findAllByTestId, getByTestId } = screen;

const MockErrorFallback = ({ error }) => (
  <div>
    <p>Something went wrong:</p>
    <pre data-testid="error-message" style={{ color: 'red' }}>
      {error.message}
    </pre>
  </div>
);

describe('Inventory', () => {
  let items;
  beforeEach(() => {
    const originalItems = [
      { id: 1, name: 'foo', quantity: 1 },
      { id: 2, name: 'bar', quantity: 0 },
      { id: 3, name: 'baz', quantity: 6 },
    ];
    items = originalItems.map((e) => ({ ...e }));
    jest.clearAllMocks();
    global.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: originalItems }),
    }));
    render(<Inventory url="http://www.example.com" />);
  });

  describe('fetching', () => {
    it('fetches data', () => {
      expect(global.fetch.mock.calls.length).toBe(1);
    });
  });

  describe('rendering', () => {
    it(
      'has an element with a \'data-testid="items"\'' +
        'attribute with items.length children',
      async () => {
        const actualItems = getByTestId('items');
        await waitFor(() =>
          expect(actualItems.children).toHaveLength(items.length)
        );
      }
    );

    test(
      'all items have \'data-testid="item-name"\'' + 'with correct names',
      async () => {
        const names = await findAllByTestId('item-name');
        expect(names).toHaveLength(items.length);
        const actualNames = names.map((e) => e.textContent);
        const expectedNames = items.map((e) => e.name);
        expect(actualNames).toEqual(expectedNames);
      }
    );

    test(
      'all items have \'data-testid="item-qty"\'' + 'with correct quantities',
      async () => {
        const qtys = await findAllByTestId('item-qty');
        expect(qtys).toHaveLength(items.length);
        const actualQtys = qtys.map((e) => +e.textContent);
        const expectedQtys = items.map((e) => e.quantity);
        expect(actualQtys).toEqual(expectedQtys);
      }
    );

    test('all items have data-testid="increment-qty"', async () => {
      expect(await findAllByTestId('increment-qty')).toHaveLength(items.length);
    });

    test('all items have data-testid="decrement-qty"', async () => {
      expect(await findAllByTestId('decrement-qty')).toHaveLength(items.length);
    });
  });

  describe('interactivity', () => {
    test('incrementing quantities works', async () => {
      const incs = await findAllByTestId('increment-qty');
      expect(incs).toHaveLength(items.length);
      const qtys = await findAllByTestId('item-qty');
      expect(qtys).toHaveLength(items.length);

      for (let i = 1; i < 4; i++) {
        incs.forEach((e) => fireEvent.click(e));
        const actualQtys = qtys.map((e) => +e.textContent);
        const expectedQtys = items.map((e) => e.quantity + i);
        expect(actualQtys).toEqual(expectedQtys);
      }
    });

    test('decrementing quantities works', async () => {
      const decs = await findAllByTestId('decrement-qty');
      expect(decs).toHaveLength(items.length);
      const qtys = await findAllByTestId('item-qty');
      expect(qtys).toHaveLength(items.length);

      for (let i = 1; i < 4; i++) {
        decs.forEach((e) => fireEvent.click(e));
        const actualQtys = qtys.map((e) => +e.textContent);
        const expectedQtys = items.map((e) => Math.max(0, e.quantity - i));
        expect(actualQtys).toEqual(expectedQtys);
      }
    });

    test('incrementing and decrementing together', async () => {
      const incs = await findAllByTestId('increment-qty');
      expect(incs).toHaveLength(items.length);
      const decs = await findAllByTestId('decrement-qty');
      expect(decs).toHaveLength(items.length);
      const qtys = await findAllByTestId('item-qty');
      expect(qtys).toHaveLength(items.length);
      let expectedQtys = items.map((e) => e.quantity);

      [1, -1, -1, 1, -1, 1, 1, -1, 1, -1, 1].forEach((step) => {
        [decs, null, incs][step + 1].forEach((e) => fireEvent.click(e));
        const actualQtys = qtys.map((e) => +e.textContent);
        expectedQtys = expectedQtys.map((e) => Math.max(0, e + step));
        expect(actualQtys).toEqual(expectedQtys);
      });
    });
  });

  describe('error behavior', () => {
    it('throws errors on not-ok statuses', async () => {
      jest.clearAllMocks();
      global.fetch = jest.fn(async () => ({
        ok: false,
        status: 401,
        json: async () => ({ data: [] }),
      }));
      const url = 'http://en.wikipedia.org/';
      const { findByTestId } = render(
        <ErrorBoundary FallbackComponent={MockErrorFallback}>
          <Inventory url={url} />
        </ErrorBoundary>
      );
      expect(global.fetch.mock.calls.length).toBe(1);
      expect(global.fetch).toHaveBeenCalledWith(url);
      const error = await findByTestId('error-message');
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(`Failed to fetch ${url}`);
    });

    it('works when fetch throws', async () => {
      jest.clearAllMocks();
      global.fetch = jest.fn(async () => {
        throw Error('Test 1 2');
      });
      const url = 'http://en.wikipedia.org/';
      const { findByTestId } = render(
        <ErrorBoundary FallbackComponent={MockErrorFallback}>
          <Inventory url={url} />
        </ErrorBoundary>
      );
      expect(global.fetch.mock.calls.length).toBe(1);
      expect(global.fetch).toHaveBeenCalledWith(url);
      const error = await findByTestId('error-message');
      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent('Test 1 2');
    });
  });
});
