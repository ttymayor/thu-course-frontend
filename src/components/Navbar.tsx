import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

// 導航配置
const NAVBAR_CONFIG = {
  brand: "東海選課資訊",
  navigation: {
    items: [
      {
        label: "課程查詢",
        href: "/course-info",
      },
    ],
  },
  mobile: {
    quickLinks: [
      {
        label: "課程",
        href: "/course-info",
      },
    ],
  },
};

export default function Navbar() {
  return (
    <div className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center">
        {/* 手機版品牌 */}
        <div className="flex md:hidden">
          <a className="flex items-center space-x-2" href="/">
            <span className="font-bold text-sm">{NAVBAR_CONFIG.brand}</span>
          </a>
        </div>

        {/* 桌面版導航 */}
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">{NAVBAR_CONFIG.brand}</span>
          </a>
          <NavigationMenu>
            <NavigationMenuList>
              {NAVBAR_CONFIG.navigation.items.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    href={item.href}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* 手機版快速連結 */}
        <div className="ml-auto flex md:hidden gap-2">
          {NAVBAR_CONFIG.mobile.quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-xs px-2 py-1 rounded hover:bg-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

const ListItem = ({ className, title, children, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
};
