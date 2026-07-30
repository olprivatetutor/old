import { proxy } from '../proxy';
import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn((url: URL) => ({ type: 'redirect', url })),
    next: jest.fn(() => ({ type: 'next' })),
  },
}));

function makeRequest(pathname: string, authToken?: string) {
  return {
    nextUrl: { pathname },
    cookies: {
      get: (name: string) => {
        if (name === 'auth-token' && authToken) return { value: authToken };
        return undefined;
      },
    },
    url: `http://localhost${pathname}`,
  } as never;
}

beforeEach(() => jest.clearAllMocks());

describe('proxy middleware', () => {
  it('redirects unauthenticated user from protected route to login', () => {
    proxy(makeRequest('/admin'));

    expect(NextResponse.redirect).toHaveBeenCalled();
    const url = (NextResponse.redirect as jest.Mock).mock.calls[0][0] as URL;
    expect(url.pathname).toBe('/login');
  });

  it('calls next() when authenticated user accesses protected route', () => {
    proxy(makeRequest('/admin', 'token123'));
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('calls next() when unauthenticated user accesses the landing page', () => {
    proxy(makeRequest('/'));
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('calls next() when authenticated user accesses the landing page', () => {
    proxy(makeRequest('/', 'token123'));
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('redirects authenticated user from login to languages', () => {
    proxy(makeRequest('/login', 'token123'));

    expect(NextResponse.redirect).toHaveBeenCalled();
    const url = (NextResponse.redirect as jest.Mock).mock.calls[0][0] as URL;
    expect(url.pathname).toBe('/languages');
    expect(url.search).toBe('');
  });

  it('calls next() when unauthenticated user accesses login', () => {
    proxy(makeRequest('/login'));
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('calls next() when unauthenticated user accesses the pricing page', () => {
    proxy(makeRequest('/price'));
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('calls next() when authenticated user accesses the pricing page', () => {
    proxy(makeRequest('/price', 'token123'));
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('calls next() when unauthenticated user accesses the about page', () => {
    proxy(makeRequest('/about'));
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('calls next() when authenticated user accesses the about page', () => {
    proxy(makeRequest('/about', 'token123'));
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('redirects unauthenticated user from languages to login', () => {
    proxy(makeRequest('/languages'));

    expect(NextResponse.redirect).toHaveBeenCalled();
    const url = (NextResponse.redirect as jest.Mock).mock.calls[0][0] as URL;
    expect(url.pathname).toBe('/login');
  });

  it('redirects unauthenticated user from removed dashboard route to login', () => {
    proxy(makeRequest('/dashboard'));

    expect(NextResponse.redirect).toHaveBeenCalled();
    const url = (NextResponse.redirect as jest.Mock).mock.calls[0][0] as URL;
    expect(url.pathname).toBe('/login');
  });

  it.each(['/dashboard', '/dashboard/settings'])(
    'redirects authenticated user from removed route %s to languages',
    (route) => {
      proxy(makeRequest(route, 'token123'));

      expect(NextResponse.redirect).toHaveBeenCalled();
      const url = (NextResponse.redirect as jest.Mock).mock.calls[0][0] as URL;
      expect(url.pathname).toBe('/languages');
      expect(url.search).toBe('');
    },
  );

  it('does not treat a route that starts with the dashboard name as removed', () => {
    proxy(makeRequest('/dashboard-preview', 'token123'));

    expect(NextResponse.next).toHaveBeenCalled();
  });

  it('calls next() when authenticated user accesses languages', () => {
    proxy(makeRequest('/languages', 'token123'));
    expect(NextResponse.next).toHaveBeenCalled();
  });
});
