import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

interface ProductCardProps {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}

export function ProductCard({product, loading}: ProductCardProps) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const price = product.priceRange.minVariantPrice;

  return (
    <Link
      to={variantUrl}
      prefetch="intent"
      className="group relative block overflow-hidden"
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-neutral-100">
        {image ? (
          <>
            <Image
              alt={image.altText || product.title}
              aspectRatio="3/4"
              data={image}
              loading={loading}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Quick view button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <span className="block w-full py-3 bg-neutral-900 text-white text-xs tracking-[0.2em] uppercase text-center hover:bg-violet-600 transition-colors">
                Quick View
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-200">
            <span className="text-neutral-400 text-sm">No Image</span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-2">
        <h3 className="text-sm tracking-wide font-medium text-neutral-900">{product.title}</h3>
        <div className="flex items-center">
          <Money
            data={price}
            className="text-sm text-neutral-600"
          />
        </div>
      </div>
    </Link>
  );
}

