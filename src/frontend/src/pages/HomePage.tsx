import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  Clock,
  Facebook,
  Heart,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  Upload,
  Wheat,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiSwiggy, SiZomato } from "react-icons/si";
import type { DailySpecial, MenuItem } from "../backend";
import { backend } from "../backendClient";

const FALLBACK_SPECIALS = [
  {
    id: BigInt(1),
    name: "Butter Croissants",
    description:
      "Flaky, golden layers made with European-style butter. Best enjoyed warm.",
    imageUrl:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
    isAvailable: true,
  },
  {
    id: BigInt(2),
    name: "Fudgy Brownies",
    description:
      "Dense, chocolatey squares with a crispy top and gooey centre.",
    imageUrl:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
    isAvailable: true,
  },
  {
    id: BigInt(3),
    name: "Blueberry Muffins",
    description:
      "Bursting with fresh blueberries, baked in classic muffin tins every morning.",
    imageUrl:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80",
    isAvailable: true,
  },
  {
    id: BigInt(4),
    name: "Pain au Chocolat",
    description: "Buttery puff pastry wrapped around premium dark chocolate.",
    imageUrl:
      "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400&q=80",
    isAvailable: true,
  },
];

const REVIEWS = [
  {
    name: "Priya S.",
    stars: 5,
    text: "The best chocolate cake I've ever had! Ordered for my daughter's birthday and everyone loved it. The fondant detailing was absolutely stunning.",
    avatar: "PS",
  },
  {
    name: "Rahul M.",
    stars: 5,
    text: "Fresh croissants every morning. This bakery has ruined me for all other bread forever. I drive 20 minutes just to get here every weekend.",
    avatar: "RM",
  },
  {
    name: "Ananya K.",
    stars: 5,
    text: "Custom cake was exactly what I envisioned. Beautiful and delicious! They captured every detail of my inspiration photo perfectly.",
    avatar: "AK",
  },
  {
    name: "Vikram T.",
    stars: 4,
    text: "Amazing pastries and super friendly staff. My go-to weekend spot for years now. The almond danish is to die for!",
    avatar: "VT",
  },
];

const CATEGORIES = [
  "All",
  "Cakes",
  "Pastries",
  "Cupcakes",
  "Artisan Breads",
  "Cookies & Desserts",
];

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [specials, setSpecials] = useState<DailySpecial[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Order form state
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderFlavor, setOrderFlavor] = useState("");
  const [orderSize, setOrderSize] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [items, dailySpecials] = await Promise.all([
          backend.getMenuItems(),
          backend.getDailySpecials(),
        ]);

        if (items.length === 0) {
          await backend.seedDefaultData();
          const seeded = await backend.getMenuItems();
          setMenuItems(seeded);
        } else {
          setMenuItems(items);
        }

        setSpecials(dailySpecials.filter((s) => s.isAvailable));
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setMenuLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? menuItems.filter((i) => i.isActive)
      : menuItems.filter((i) => i.isActive && i.category === activeCategory);

  const displayedSpecials = specials.length > 0 ? specials : FALLBACK_SPECIALS;

  const today = new Date().toISOString().split("T")[0];

  function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = [
      "🎂 *Custom Cake Order - Sweet Crumbs Bakery*",
      "",
      `👤 Name: ${orderName}`,
      `📞 Phone: ${orderPhone}`,
      `🍰 Flavor: ${orderFlavor}`,
      `⚖️ Size: ${orderSize}`,
      `📅 Pickup Date: ${orderDate}`,
      uploadedFileName ? `🖼️ Reference Image: ${uploadedFileName}` : "",
      orderMessage ? `💬 Special Message: ${orderMessage}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/1234567890?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  }

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Menu", href: "#menu" },
    { label: "Order Cake", href: "#order" },
    { label: "Specials", href: "#specials" },
    { label: "Reviews", href: "#reviews" },
    { label: "Visit Us", href: "#visit" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Nav */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navScrolled
            ? "bg-card/95 backdrop-blur-md shadow-warm border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Wheat className="w-5 h-5 text-primary" />
              </div>
              <span
                className={`font-display font-bold text-lg leading-tight transition-colors ${
                  navScrolled ? "text-foreground" : "text-white"
                }`}
              >
                Sweet Crumbs
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  data-ocid="nav.link"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    navScrolled ? "text-foreground/80" : "text-white/90"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Mobile hamburger */}
            <button
              className={`md:hidden p-2 transition-colors ${
                navScrolled ? "text-foreground" : "text-white"
              }`}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-border shadow-warm">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  data-ocid="nav.link"
                  className="text-foreground/80 hover:text-primary font-medium py-1 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&q=80"
          alt="Sweet Crumbs Bakery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-white/90 text-xs font-medium tracking-widest uppercase">
              Artisan Bakery Since 1987
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight">
            Sweet Crumbs
            <br />
            <span className="text-amber-300">Bakery</span>
          </h1>

          <p className="text-white/85 text-lg md:text-2xl font-light mb-10 tracking-wide">
            Freshly Baked Happiness Every Day
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hero.whatsapp_button"
            >
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white gap-2 rounded-full px-6 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Order on WhatsApp
              </Button>
            </a>
            <a
              href="https://zomato.com"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hero.zomato_button"
            >
              <Button
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white gap-2 rounded-full px-6 shadow-lg"
              >
                <SiZomato className="w-4 h-4" />
                Order on Zomato
              </Button>
            </a>
            <a
              href="https://swiggy.com"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hero.swiggy_button"
            >
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white gap-2 rounded-full px-6 shadow-lg"
              >
                <SiSwiggy className="w-4 h-4" />
                Order on Swiggy
              </Button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-px w-10 bg-primary/40" />
                <span className="text-primary text-sm font-medium tracking-widest uppercase">
                  Our Story
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Baked with Love,
                <br />
                <span className="text-primary">Since 1987</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                What started as my grandmother Maria's weekend ritual — waking
                before dawn to knead dough by hand — has grown into Bangalore's
                most beloved neighbourhood bakery. Rooted in the traditions of
                European patisseries, we bring the soul of a Parisian
                boulangerie to every loaf, every cake, every croissant we bake.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Three generations later, we still use her original sourdough
                starter, still hand-fold every croissant, and still wake before
                sunrise so your morning starts with something truly special. No
                preservatives, no shortcuts — just honest, handcrafted baking.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: <Leaf className="w-5 h-5" />,
                    label: "Fresh Ingredients",
                  },
                  {
                    icon: <Heart className="w-5 h-5" />,
                    label: "Handmade Cakes",
                  },
                  {
                    icon: <Clock className="w-5 h-5" />,
                    label: "Daily Baked Breads",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 bg-secondary/60 rounded-xl px-4 py-3"
                  >
                    <div className="text-primary shrink-0">{item.icon}</div>
                    <span className="text-sm font-semibold text-foreground">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -right-4 w-full h-full bg-primary/8 rounded-3xl" />
              <img
                src="https://images.unsplash.com/photo-1556217477-d325251ece38?w=800&q=80"
                alt="Baker at work"
                className="relative rounded-3xl w-full object-cover aspect-[4/5] shadow-warm-lg"
              />
              <div className="absolute -bottom-5 -left-5 bg-card border border-border rounded-2xl px-5 py-4 shadow-warm">
                <p className="font-display text-2xl font-bold text-primary">
                  35+
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  Years of Baking Joy
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-10 bg-primary/40" />
              <span className="text-primary text-sm font-medium tracking-widest uppercase">
                What We Bake
              </span>
              <div className="h-px w-10 bg-primary/40" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Our Menu
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="overflow-x-auto pb-2 mb-10">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="bg-card border border-border gap-1 h-auto p-1.5 flex-nowrap w-max mx-auto">
                {CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    data-ocid="menu.tab"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {menuLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="menu.loading_state"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16" data-ocid="menu.empty_state">
              <p className="text-muted-foreground text-lg">
                No items in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => (
                <Card
                  key={item.id.toString()}
                  data-ocid={`menu.item.${idx + 1}`}
                  className="overflow-hidden border-border hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1 bg-card"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&q=80";
                      }}
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-semibold text-lg text-foreground leading-snug">
                        {item.name}
                      </h3>
                      <Badge className="bg-primary/10 text-primary border-none shrink-0 font-semibold">
                        ₹{item.price}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-3 text-xs border-border"
                    >
                      {item.category}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ORDER CAKE */}
      <section id="order" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-10 bg-primary/40" />
              <span className="text-primary text-sm font-medium tracking-widest uppercase">
                Custom Orders
              </span>
              <div className="h-px w-10 bg-primary/40" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Order a Custom Cake
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Tell us your dream cake — we'll make it a reality. Orders placed
              via WhatsApp.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto border-border shadow-warm">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleOrderSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="order-name" className="font-medium">
                      Your Name
                    </Label>
                    <Input
                      id="order-name"
                      placeholder="Maria Fernandez"
                      value={orderName}
                      onChange={(e) => setOrderName(e.target.value)}
                      required
                      data-ocid="order.name_input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order-phone" className="font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="order-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={orderPhone}
                      onChange={(e) => setOrderPhone(e.target.value)}
                      required
                      data-ocid="order.phone_input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="font-medium">Cake Flavor</Label>
                    <Select
                      value={orderFlavor}
                      onValueChange={setOrderFlavor}
                      required
                    >
                      <SelectTrigger data-ocid="order.flavor_select">
                        <SelectValue placeholder="Choose flavor" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Chocolate",
                          "Vanilla",
                          "Red Velvet",
                          "Strawberry",
                          "Lemon",
                          "Black Forest",
                          "Butterscotch",
                        ].map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-medium">Cake Size</Label>
                    <Select
                      value={orderSize}
                      onValueChange={setOrderSize}
                      required
                    >
                      <SelectTrigger data-ocid="order.size_select">
                        <SelectValue placeholder="Choose size" />
                      </SelectTrigger>
                      <SelectContent>
                        {["0.5kg", "1kg", "2kg", "3kg+"].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Reference Image (optional)
                  </Label>
                  <button
                    type="button"
                    className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-secondary/30"
                    onClick={() => fileInputRef.current?.click()}
                    data-ocid="order.dropzone"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      data-ocid="order.upload_button"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setUploadedFileName(f ? f.name : "");
                      }}
                    />
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {uploadedFileName ? (
                        <span className="text-primary font-medium">
                          {uploadedFileName}
                        </span>
                      ) : (
                        "Click to upload reference image"
                      )}
                    </p>
                  </button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order-date" className="font-medium">
                    Pickup Date
                  </Label>
                  <Input
                    id="order-date"
                    type="date"
                    min={today}
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    required
                    data-ocid="order.date_input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order-message" className="font-medium">
                    Special Message (optional)
                  </Label>
                  <Textarea
                    id="order-message"
                    placeholder="Any special decorations, allergies, or notes..."
                    rows={3}
                    value={orderMessage}
                    onChange={(e) => setOrderMessage(e.target.value)}
                    data-ocid="order.textarea"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 rounded-xl"
                  data-ocid="order.submit_button"
                >
                  <MessageCircle className="w-5 h-5" />
                  Place Order via WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* DAILY SPECIALS */}
      <section
        id="specials"
        className="py-20 md:py-28"
        style={{ background: "oklch(0.93 0.05 70)" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-10 bg-primary/40" />
              <span className="text-primary text-sm font-medium tracking-widest uppercase">
                Today's Bake
              </span>
              <div className="h-px w-10 bg-primary/40" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Fresh From the Oven Today
            </h2>
            <p className="text-foreground/60 mt-3 max-w-md mx-auto">
              Made every morning. Gone by evening. Don't miss them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedSpecials.slice(0, 4).map((special, idx) => (
              <div
                key={special.id.toString()}
                data-ocid={`specials.item.${idx + 1}`}
                className="bg-card rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={special.imageUrl}
                    alt={special.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&q=80";
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-green-600 font-semibold">
                      Fresh Today
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-1">
                    {special.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {special.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-10 bg-primary/40" />
              <span className="text-primary text-sm font-medium tracking-widest uppercase">
                Testimonials
              </span>
              <div className="h-px w-10 bg-primary/40" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((review, idx) => (
              <Card
                key={review.name}
                data-ocid={`reviews.item.${idx + 1}`}
                className="border-border bg-card hover:shadow-warm transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }, (_, starIdx) => (
                      <Star
                        // biome-ignore lint/suspicious/noArrayIndexKey: star ratings use position index intentionally
                        key={starIdx}
                        className={`w-4 h-4 ${
                          starIdx < review.stars
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed mb-5 italic">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                      <span className="text-primary text-xs font-bold">
                        {review.avatar}
                      </span>
                    </div>
                    <span className="font-semibold text-sm text-foreground">
                      {review.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* VISIT US */}
      <section id="visit" className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-10 bg-primary/40" />
              <span className="text-primary text-sm font-medium tracking-widest uppercase">
                Find Us
              </span>
              <div className="h-px w-10 bg-primary/40" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Visit Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="rounded-2xl overflow-hidden shadow-warm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Sweet Crumbs Bakery Location"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                  Sweet Crumbs Bakery
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-foreground/80">
                      42 Baker Street, Indiranagar,
                      <br />
                      Bangalore — 560038
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <a
                      href="tel:+919876543210"
                      className="text-foreground/80 hover:text-primary transition-colors"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <a
                      href="mailto:hello@sweetcrumbsbakery.com"
                      className="text-foreground/80 hover:text-primary transition-colors"
                    >
                      hello@sweetcrumbsbakery.com
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-display font-bold text-lg text-foreground mb-3">
                  Opening Hours
                </h4>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        { day: "Monday – Friday", hours: "7:00 AM – 9:00 PM" },
                        { day: "Saturday", hours: "7:00 AM – 10:00 PM" },
                        { day: "Sunday", hours: "8:00 AM – 8:00 PM" },
                      ].map((row, i) => (
                        <tr
                          key={row.day}
                          className={i % 2 === 0 ? "bg-secondary/40" : ""}
                        >
                          <td className="px-4 py-3 font-medium text-foreground">
                            {row.day}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            {row.hours}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wheat className="w-6 h-6 text-amber-300" />
                <span className="font-display text-xl font-bold">
                  Sweet Crumbs Bakery
                </span>
              </div>
              <p className="text-background/60 text-sm leading-relaxed mb-5">
                Freshly Baked Happiness Every Day. Artisan baking since 1987,
                rooted in European tradition.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="footer.instagram_link"
                  className="w-9 h-9 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="footer.facebook_link"
                  className="w-9 h-9 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="footer.whatsapp_link"
                  className="w-9 h-9 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-bold text-lg mb-4">Contact</h4>
              <div className="space-y-2 text-background/70 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-amber-300" />
                  <span>42 Baker Street, Indiranagar, Bangalore — 560038</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-300" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-300" />
                  <span>hello@sweetcrumbsbakery.com</span>
                </div>
              </div>
            </div>

            {/* Quick Order */}
            <div>
              <h4 className="font-display font-bold text-lg mb-4">
                Quick Order
              </h4>
              <div className="flex flex-col gap-2">
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Order on WhatsApp
                </a>
                <a
                  href="https://zomato.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  <SiZomato className="w-4 h-4" /> Order on Zomato
                </a>
                <a
                  href="https://swiggy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  <SiSwiggy className="w-4 h-4" /> Order on Swiggy
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-background/50 text-sm">
            <span>
              © {new Date().getFullYear()} Sweet Crumbs Bakery. All rights
              reserved.
            </span>
            <span>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 transition-colors"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
