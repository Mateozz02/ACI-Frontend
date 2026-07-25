"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";

type SidebarProps = {
  slug: string;
  storeName: string;
};

const icons = {
  orders: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  products: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  stores: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  logout: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  test: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M9 9h6" />
      <path d="M9 13h4" />
    </svg>
  ),
};

export function Sidebar({ slug, storeName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const base = `/stores/${slug}`;
  const navItems = [
    { href: `${base}/orders`, label: "Pedidos", icon: icons.orders },
    { href: `${base}/products`, label: "Productos", icon: icons.products },
    { href: `${base}/test`, label: "Test", icon: icons.test },
    { href: `${base}/settings`, label: "Configuración", icon: icons.settings },
  ];

  const isActive = (href: string) => {
    if (href === `${base}/orders`) {
      return pathname === href || pathname.startsWith(`${base}/orders/`);
    }
    return pathname === href;
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/login");
  };

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-yellow-200 sticky top-0 z-20">
        <Link href="/" className="font-semibold text-yellow-950 truncate">
          {storeName}
        </Link>
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="store-sidebar"
          className="p-2 rounded-lg text-yellow-800 hover:bg-yellow-100 transition-colors"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        id="store-sidebar"
        className={`${
          open ? "block" : "hidden"
        } md:block flex-col w-full md:w-64 bg-white md:bg-transparent border-b md:border-b-0 md:border-r border-yellow-200 shrink-0`}
      >
        <div className="p-4 md:p-6">
          <Link href="/" className="flex items-center gap-2 text-yellow-950 mb-6 md:mb-8">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-400 text-yellow-950 font-bold text-sm">
              OF
            </span>
            <span className="font-semibold tracking-tight">OrderFlow</span>
          </Link>

          <div className="mb-6">
            <p className="text-xs font-medium text-yellow-800/70 uppercase tracking-wide mb-2">Tienda</p>
            <div className="px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-100">
              <span className="font-medium text-yellow-950 truncate block">{storeName}</span>
            </div>
          </div>

          <nav aria-label="Navegación de tienda">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-yellow-100 text-yellow-950"
                          : "text-yellow-800/80 hover:bg-yellow-50 hover:text-yellow-950"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className={active ? "text-yellow-700" : "text-yellow-600/70"}>{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-6 pt-6 border-t border-yellow-100">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-yellow-800/80 hover:bg-yellow-50 hover:text-yellow-950 transition-colors"
            >
              <span className="text-yellow-600/70">{icons.stores}</span>
              Todas las tiendas
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600/80 hover:bg-red-50 hover:text-red-700 transition-colors mt-1"
            >
              <span className="text-red-500/70">{icons.logout}</span>
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
