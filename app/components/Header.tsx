import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue, Link, useLocation} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);
  const {open} = useAside();

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isHome
            ? 'bg-transparent hover:bg-white/90 hover:backdrop-blur-xl'
            : 'bg-white/90 backdrop-blur-xl border-b border-neutral-200/50'
        }`}
        onMouseEnter={() => setIsHoveringHeader(true)}
        onMouseLeave={() => setIsHoveringHeader(false)}
      >
        <div className="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 max-w-full overflow-hidden">
          {/* Top row - Cart icon on right */}
          <div className="flex items-center justify-end mb-1 sm:mb-2 lg:mb-0 lg:absolute lg:right-6 lg:top-4 lg:z-10">
            <div className="flex items-center gap-2">
              {/* Cart */}
              <CartCount cart={cart} openCart={() => open('cart')} />
            </div>
          </div>

          {/* Centered Logo with characters */}
          <div className="flex flex-col items-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 lg:gap-12 xl:gap-16 max-w-full"
              prefetch="intent"
            >
              <img 
                src="/left.png" 
                alt="" 
                className="h-12 sm:h-16 md:h-20 lg:h-28 xl:h-36 w-auto max-w-[30%] object-contain"
              />
              <img 
                src="/feliz_.png" 
                alt={shop.name} 
                className="h-5 sm:h-6 md:h-7 lg:h-10 xl:h-12 w-auto max-w-[25%] object-contain"
              />
              <img 
                src="/right.png" 
                alt="" 
                className="h-12 sm:h-16 md:h-20 lg:h-28 xl:h-36 w-auto max-w-[30%] object-contain"
              />
            </Link>

            {/* Navigation below logo - hidden on mobile, shown on tablet+ */}
            <nav className="hidden sm:flex items-center gap-4 md:gap-6 lg:gap-10 mt-2 sm:mt-3 md:mt-4 flex-wrap justify-center">
              <Link
                to="/"
                prefetch="intent"
                className={`font-display text-sm sm:text-base md:text-lg tracking-[0.15em] uppercase text-neutral-800 hover:text-violet-600 transition-all duration-300 relative group whitespace-nowrap ${
                  !isHoveringHeader ? 'drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]' : ''
                }`}
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                to="/collections"
                prefetch="intent"
                className={`font-display text-sm sm:text-base md:text-lg tracking-[0.15em] uppercase text-neutral-800 hover:text-violet-600 transition-all duration-300 relative group whitespace-nowrap ${
                  !isHoveringHeader ? 'drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]' : ''
                }`}
              >
                Collections
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                to="/universe"
                prefetch="intent"
                className={`font-display text-sm sm:text-base md:text-lg tracking-[0.15em] uppercase text-neutral-800 hover:text-violet-600 transition-all duration-300 relative group whitespace-nowrap ${
                  !isHoveringHeader ? 'drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]' : ''
                }`}
              >
                Universe
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </nav>
          </div>
        </div>
      </header>
      {/* Spacer for fixed header */}
      {!isHome && <div className="h-24 sm:h-28 md:h-32 lg:h-36 xl:h-44" />}
    </>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  // Custom navigation items
  const navItems = [
    {id: 'home', title: 'Home', to: '/'},
    {id: 'collections', title: 'Collections', to: '/collections'},
    {id: 'universe', title: 'Universe', to: '/universe'},
  ];

  return (
    <nav className="grid gap-6 p-6">
      {navItems.map((item, index) => (
        <Link
          key={item.id}
          to={item.to}
          onClick={close}
          className="text-2xl font-display tracking-[0.1em] uppercase text-neutral-900 hover:text-violet-600 transition-colors"
          style={{animationDelay: `${index * 50}ms`}}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

function CartCount({
  cart,
  openCart,
}: {
  cart: Promise<CartApiQueryFragment | null>;
  openCart: () => void;
}) {
  return (
    <Suspense fallback={<CartBadge count={0} openCart={openCart} />}>
      <Await resolve={cart}>
        {(cart) => (
          <CartBadge count={cart?.totalQuantity || 0} openCart={openCart} />
        )}
      </Await>
    </Suspense>
  );
}

function CartBadge({
  count,
  openCart,
}: {
  count: number;
  openCart: () => void;
}) {
  const {publish, shop, cart, prevCart} = useAnalytics();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openCart();
    publish('cart_viewed', {
      cart,
      prevCart,
      shop,
      url: window.location.href || '',
    } as CartViewPayload);
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex items-center justify-center w-10 h-10 text-neutral-500 hover:text-violet-600 transition-colors"
      aria-label={`Cart (${count} items)`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-violet-600 text-white text-[10px] font-medium rounded-full">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
