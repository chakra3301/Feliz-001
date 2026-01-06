import {type MappedProductOptions} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {VariantSelector} from './VariantSelector';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const {open} = useAside();
  const isAvailable = selectedVariant?.availableForSale ?? false;

  return (
    <div className="space-y-6">
      <VariantSelector
        productOptions={productOptions}
        selectedVariant={selectedVariant}
      />
      <AddToCartButton
        disabled={!selectedVariant || !isAvailable}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        <span className="w-full rounded-md bg-gray-900 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400">
          {isAvailable ? 'Add to cart' : 'Sold out'}
        </span>
      </AddToCartButton>
    </div>
  );
}
