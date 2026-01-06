import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartDrawerProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * Enhanced cart drawer component with modern UI
 * Displays cart items and summary with inventory awareness
 */
export function CartDrawer({layout, cart: originalCart}: CartDrawerProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);
  const {close} = useAside();

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className="flex h-full flex-col">
      <CartEmpty hidden={linesCount} layout={layout} />
      {cartHasItems && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-4">
              {(cart?.lines?.nodes ?? []).map((line) => (
                <li
                  key={line.id}
                  className="flex gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <CartLineItem key={line.id} line={line} layout={layout} />
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-gray-200 bg-white px-4 py-6">
            <CartSummary cart={cart} layout={layout} />
          </div>
        </>
      )}
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartDrawerProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="flex flex-col items-center justify-center p-8 text-center">
      <p className="mb-4 text-gray-600">
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        Continue shopping →
      </Link>
    </div>
  );
}

