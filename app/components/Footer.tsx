import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

type ChildMenuItem = {
  id: string;
  title: string;
  to: string;
  target?: string;
};

type ParentMenuItem = {
  id: string;
  title: string;
  items: ChildMenuItem[];
};

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => {
          // Process menu items similar to shopi-feliz
          const processedMenu = processMenu(footer?.menu, header.shop.primaryDomain?.url, publicStoreDomain);
          
          return (
            <footer className="bg-neutral-50 border-t border-neutral-200">
              <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                  {/* Brand column */}
                  <div className="lg:col-span-1">
                    <Link to="/" className="font-display text-2xl tracking-wide text-neutral-900">
                      Feliz Navidad Store
                    </Link>
                    <p className="mt-4 text-sm text-neutral-500 leading-relaxed">
                      Experimental silhouettes for those who move differently. 
                      Sustainably crafted, ethically produced.
                    </p>
                    <div className="flex gap-4 mt-6">
                      <a 
                        href="https://www.instagram.com/c_feliz_navidad?igsh=MThsempqN2g4MWY0MQ==" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-violet-600 transition-colors" 
                        aria-label="Instagram"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                        </svg>
                      </a>
                      <a 
                        href="https://x.com/feliz_navidad_c?s=21" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-violet-600 transition-colors" 
                        aria-label="X (Twitter)"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                        </svg>
                      </a>
                      <a 
                        href="https://www.tiktok.com/@feliz.navidad.c?_r=1&_t=ZN-934P5Twgbry" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-violet-600 transition-colors" 
                        aria-label="TikTok"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </a>
                      <a 
                        href="https://youtube.com/@feliz-navidad-c?si=65e_Z6enTSeU4FHh" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-violet-600 transition-colors" 
                        aria-label="YouTube"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Menu columns */}
                  {(processedMenu?.items || [])
                    .filter((item) => {
                      const title = item.title?.toLowerCase() || '';
                      return !title.includes('search') && !title.includes('privacy') && !title.includes('your choice');
                    })
                    .slice(0, 3)
                    .map((item) => (
                      <div key={item.id}>
                        <h3 className="text-sm tracking-[0.2em] uppercase text-neutral-900 mb-4">
                          {item.title}
                        </h3>
                        {item.items && item.items.length > 0 && (
                          <ul className="space-y-3">
                            {item.items
                              .filter((subItem) => {
                                const title = subItem.title?.toLowerCase() || '';
                                return !title.includes('search') && !title.includes('privacy') && !title.includes('your choice');
                              })
                              .map((subItem) => (
                                <li key={subItem.id}>
                                  <Link
                                    to={subItem.to}
                                    target={subItem.target}
                                    className="text-sm text-neutral-500 hover:text-violet-600 transition-colors"
                                  >
                                    {subItem.title}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-xs text-neutral-400">
                    © {new Date().getFullYear()} Feliz Navidad Store. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          );
        }}
      </Await>
    </Suspense>
  );
}

function processMenu(
  menu: FooterQuery['menu'] | null | undefined,
  primaryDomainUrl?: string | null,
  publicStoreDomain?: string
): {items: ParentMenuItem[]} | null {
  if (!menu) return null;

  const items: ParentMenuItem[] = menu.items.map((item) => {
    const url = item.url
      ? item.url.includes('myshopify.com') ||
        item.url.includes(publicStoreDomain || '') ||
        item.url.includes(primaryDomainUrl || '')
        ? new URL(item.url).pathname
        : item.url
      : '#';
    
    const isExternal = !url.startsWith('/');
    
    return {
      id: item.id,
      title: item.title,
      items: (item.items || []).map((childItem) => {
        const childUrl = childItem.url
          ? childItem.url.includes('myshopify.com') ||
            childItem.url.includes(publicStoreDomain || '') ||
            childItem.url.includes(primaryDomainUrl || '')
            ? new URL(childItem.url).pathname
            : childItem.url
          : '#';
        const childIsExternal = !childUrl.startsWith('/');
        
        return {
          id: childItem.id,
          title: childItem.title,
          to: childUrl,
          target: childIsExternal ? '_blank' : undefined,
        };
      }),
    };
  });

  return {items};
}
