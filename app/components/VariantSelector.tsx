import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import type {ProductFragment} from 'storefrontapi.generated';

interface VariantSelectorProps {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}

export function VariantSelector({
  productOptions,
  selectedVariant,
}: VariantSelectorProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div key={option.name} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {option.name}
            </label>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const isSelected = selected;
                const isDisabled = !exists || !available;

                if (isDifferentProduct) {
                  // SEO: When the variant is a combined listing child product
                  // that leads to a different url, render it as an anchor tag
                  return (
                    <Link
                      key={option.name + name}
                      to={`/products/${handle}?${variantUriQuery}`}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      className={`
                        relative flex h-10 min-w-[60px] items-center justify-center rounded-md border-2 px-3 text-sm font-medium transition-all
                        ${
                          isSelected
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }
                        ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  // SEO: When the variant is an update to the search param,
                  // render it as a button with javascript navigating to the variant
                  return (
                    <button
                      type="button"
                      key={option.name + name}
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isSelected && exists) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                      className={`
                        relative flex h-10 min-w-[60px] items-center justify-center rounded-md border-2 px-3 text-sm font-medium transition-all
                        ${
                          isSelected
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }
                        ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) {
    return <span>{name}</span>;
  }

  return (
    <div
      aria-label={name}
      className="h-6 w-6 rounded-full border border-gray-300"
      style={{
        backgroundColor: color || 'transparent',
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      title={name}
    />
  );
}

