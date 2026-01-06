import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';

interface CollectionCardProps {
  collection: CollectionFragment;
  index?: number;
}

export function CollectionCard({collection, index}: CollectionCardProps) {
  return (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group relative block overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        {collection.image ? (
          <>
            <Image
              alt={collection.image.altText || collection.title}
              aspectRatio="1/1"
              data={collection.image}
              loading={index !== undefined && index < 4 ? 'eager' : undefined}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-700">
          {collection.title}
        </h3>
      </div>
    </Link>
  );
}

