import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { storeCategories } from "@/data/categories";
import siteLogo from "@/assets/logo-tudespensa25.png";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/preguntas", label: "FAQ" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
];

function CategoryMegaMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="px-3 py-2 text-sm text-muted-foreground">
            Tienda
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <div className="w-[min(900px,calc(100vw-2rem))] p-4">
              <div className="grid gap-6 md:grid-cols-3">
                {storeCategories.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/tienda?cat=${encodeURIComponent(section.id)}`}
                        className={cn(
                          "block rounded-md px-2 py-1 text-sm font-medium hover:bg-accent hover:text-foreground",
                        )}
                      >
                        {section.label}
                      </Link>
                    </NavigationMenuLink>

                    {section.children?.length ? (
                      <ul className="grid gap-1">
                        {section.children.map((child) => (
                          <li key={child.id}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/tienda?cat=${encodeURIComponent(child.id)}`}
                                className={cn(
                                  "block rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
                                )}
                              >
                                {child.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function SiteHeader() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={siteLogo}
              alt="Logo de TuDespensa25"
              className="h-8 w-8 shrink-0 rounded-md object-contain"
              loading="eager"
              decoding="async"
            />
            <span className="font-serif text-lg">TuDespensa25</span>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Envíos locales
            </Badge>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <CategoryMegaMenu />
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeClassName="bg-accent text-foreground"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="cta" size="sm" className="hidden sm:inline-flex">
            <Link to="/tienda">Comprar en la tienda</Link>
          </Button>

          <Button asChild variant="outline" size="icon" aria-label="Ir al carrito">
            <Link to="/carrito" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>

      <nav className="border-t md:hidden">
        <div className="container flex items-center justify-between gap-2 overflow-x-auto py-2">
          <NavLink
            to="/tienda"
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            activeClassName="bg-accent text-foreground"
          >
            Tienda
          </NavLink>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeClassName="bg-accent text-foreground"
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
