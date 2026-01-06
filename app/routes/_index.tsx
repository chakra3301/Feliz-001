import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {getPaginationVariables} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {ProductCard} from '~/components/ProductCard';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Home'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const [{products}] = await Promise.all([
    context.storefront.query(ALL_PRODUCTS_QUERY, {
      variables: paginationVariables,
    }),
  ]);

  return {
    products,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden w-full">
        {/* Banner Image Background */}
        <img
          src="/head.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Top fade gradient - seamless white fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        
        {/* Bottom fade gradient - seamless white fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
        
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/20 z-0" />

        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto pt-32 lg:pt-40">
          <p className="text-xs tracking-[0.5em] uppercase text-yellow-300/90 mb-8 font-medium animate-fade-up" style={{animationDelay: '0.1s'}}>
            AHHHHHHHHHHHHH
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-normal leading-[0.95] mb-8 text-white animate-fade-up" style={{animationDelay: '0.2s'}}>
            <span className="text-white">FELIZ</span>{' '}
            <span className="text-yellow-300">NAVIDAD</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto mb-12 font-light leading-relaxed animate-fade-up" style={{animationDelay: '0.3s'}}>
            Blah blah blah blah blah
            blah blah Swag Swag Feliz NAVI-SWAG
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{animationDelay: '0.4s'}}>
            <Link
              to="/collections"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#069ef2] text-white text-sm tracking-[0.2em] uppercase font-medium hover:bg-yellow-500 transition-all duration-500"
            >
              <span>Shop Collection</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/collections"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/50 text-white text-sm tracking-[0.2em] uppercase font-medium hover:border-yellow-300 hover:text-yellow-300 transition-all duration-500"
            >
              <span>View All</span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20">
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/70">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-white/70 to-transparent" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <PaginatedResourceSection<ProductItemFragment>
            connection={data.products}
            resourcesClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {({node: product, index}) => (
              <ProductCard
                key={product.id}
                product={product}
                loading={index < 4 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>

          <div className="mt-8 flex justify-center md:hidden">
            <Link 
              to="/collections" 
              className="btn-secondary"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

const ALL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
` as const;
