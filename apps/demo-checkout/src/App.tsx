import { FormEvent, useEffect, useRef, useState } from 'react';

type Route = 'product' | 'checkout' | 'confirmation';

const routeFromPath = (): Route => {
  if (window.location.pathname === '/checkout') {
    return 'checkout';
  }

  if (window.location.pathname === '/confirmation') {
    return 'confirmation';
  }

  return 'product';
};

export function App() {
  const [route, setRoute] = useState<Route>(routeFromPath);
  const [cartCount, setCartCount] = useState(0);
  const pageHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const handlePopState = () => setRoute(routeFromPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    pageHeadingRef.current?.focus();
  }, [route]);

  const navigate = (nextRoute: Route) => {
    const path = nextRoute === 'product' ? '/' : `/${nextRoute}`;
    window.history.pushState({}, '', path);
    setRoute(nextRoute);
  };

  const submitCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate('confirmation');
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Controlled accessibility fixture</p>
          <p className="brand">Demo Supply</p>
        </div>
        <p className="cart-status" aria-live="polite">
          Cart: {cartCount} item{cartCount === 1 ? '' : 's'}
        </p>
      </header>

      <main>
        {route === 'product' && (
          <section className="page-grid" aria-labelledby="product-title">
            <div className="product-visual" aria-hidden="true">
              <span>DS</span>
            </div>
            <div className="product-copy">
              <p className="eyebrow">Everyday essentials</p>
              <h1 id="product-title" ref={pageHeadingRef} tabIndex={-1}>
                Insulated sample mug
              </h1>
              <p className="product-description">
                A compact 350 ml travel mug designed for simple daily routines.
              </p>
              <p className="price">€24.00</p>
              <div className="action-row">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setCartCount(1)}
                >
                  Add product to cart
                </button>
                {cartCount > 0 && (
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => navigate('checkout')}
                  >
                    Open checkout
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {route === 'checkout' && (
          <section className="checkout-layout" aria-labelledby="checkout-title">
            <div>
              <p className="eyebrow">Secure local fixture</p>
              <h1 id="checkout-title" ref={pageHeadingRef} tabIndex={-1}>
                Shipping and contact
              </h1>
              <p>
                Enter sample information to continue to the confirmation screen.
              </p>
            </div>

            <form
              className="checkout-form"
              aria-label="Shipping and contact form"
              aria-describedby="checkout-required-note"
              onSubmit={submitCheckout}
            >
              <p id="checkout-required-note" className="form-instruction">
                All fields are required.
              </p>

              <div className="field">
                <label htmlFor="full-name">Full name</label>
                <input
                  id="full-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="street-address">Street address</label>
                <input
                  id="street-address"
                  name="streetAddress"
                  type="text"
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="postal-code">Postal code</label>
                  <input
                    id="postal-code"
                    name="postalCode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  required
                >
                  <option>Germany</option>
                </select>
              </div>

              <div className="field">
                {/* Controlled Phase 1 fixture: visible text intentionally is not programmatically associated with this input. Do not copy this defect into production code. */}
                <span className="field-label">Email address</span>
                <input
                  id="email"
                  data-testid="checkout-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Controlled Phase 1 fixture: this primary action intentionally has no visible focus indicator. Do not copy this defect into production code. */}
              <button
                type="submit"
                className="button button-primary controlled-focus-defect"
              >
                Continue to confirmation
              </button>
            </form>
          </section>
        )}

        {route === 'confirmation' && (
          <section className="confirmation" aria-labelledby="confirmation-title">
            <p className="confirmation-mark" aria-hidden="true">
              ✓
            </p>
            <p className="eyebrow">Journey complete</p>
            <h1 id="confirmation-title" ref={pageHeadingRef} tabIndex={-1}>
              Order ready for review
            </h1>
            <p>
              The controlled checkout journey reached its confirmation state.
            </p>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setCartCount(0);
                navigate('product');
              }}
            >
              Return to product
            </button>
          </section>
        )}
      </main>

      <footer>
        Local demo fixture · No orders, payments, or personal data are stored.
      </footer>
    </div>
  );
}
