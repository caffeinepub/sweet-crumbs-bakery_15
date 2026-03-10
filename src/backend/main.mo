import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

actor {
  type MenuItem = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    price : Text;
    imageUrl : Text;
    isActive : Bool;
  };

  module MenuItem {
    public func compareByCategory(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      switch (Text.compare(item1.category, item2.category)) {
        case (#equal) { Nat.compare(item1.id, item2.id) };
        case (order) { order };
      };
    };

    public func compareByName(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      Text.compare(item1.name, item2.name);
    };
  };

  type DailySpecial = {
    id : Nat;
    name : Text;
    description : Text;
    imageUrl : Text;
    isAvailable : Bool;
  };

  module DailySpecial {
    public func compareByName(special1 : DailySpecial, special2 : DailySpecial) : Order.Order {
      Text.compare(special1.name, special2.name);
    };
  };

  // Persistent Storage
  let menuItems = Map.empty<Nat, MenuItem>();
  let dailySpecials = Map.empty<Nat, DailySpecial>();

  let persistentStore = Map.empty<Text, Bool>();

  // CRUD Menu Items
  public shared ({ caller }) func addMenuItem(id : Nat, name : Text, category : Text, description : Text, price : Text, imageUrl : Text, isActive : Bool) : async () {
    let menuItem : MenuItem = {
      id;
      name;
      category;
      description;
      price;
      imageUrl;
      isActive;
    };
    menuItems.add(id, menuItem);
  };

  public shared ({ caller }) func updateMenuItem(id : Nat, name : Text, category : Text, description : Text, price : Text, imageUrl : Text, isActive : Bool) : async () {
    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item does not exist");
    };
    let updatedItem : MenuItem = {
      id;
      name;
      category;
      description;
      price;
      imageUrl;
      isActive;
    };
    menuItems.add(id, updatedItem);
  };

  public shared ({ caller }) func removeMenuItem(id : Nat) : async () {
    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item does not exist");
    };
    menuItems.remove(id);
  };

  public query ({ caller }) func getMenuItems() : async [MenuItem] {
    menuItems.values().toArray().sort(MenuItem.compareByCategory);
  };

  public query ({ caller }) func getMenuItemsByCategory(category : Text) : async [MenuItem] {
    menuItems.values().toArray().filter(
      func(item) { item.category == category }
    ).sort(MenuItem.compareByName);
  };

  // CRUD Daily Specials
  public shared ({ caller }) func addDailySpecial(id : Nat, name : Text, description : Text, imageUrl : Text, isAvailable : Bool) : async () {
    let dailySpecial : DailySpecial = {
      id;
      name;
      description;
      imageUrl;
      isAvailable;
    };
    dailySpecials.add(id, dailySpecial);
  };

  public shared ({ caller }) func updateDailySpecial(id : Nat, name : Text, description : Text, imageUrl : Text, isAvailable : Bool) : async () {
    if (not dailySpecials.containsKey(id)) {
      Runtime.trap("Daily special does not exist");
    };
    let updatedSpecial : DailySpecial = {
      id;
      name;
      description;
      imageUrl;
      isAvailable;
    };
    dailySpecials.add(id, updatedSpecial);
  };

  public shared ({ caller }) func removeDailySpecial(id : Nat) : async () {
    if (not dailySpecials.containsKey(id)) {
      Runtime.trap("Daily special does not exist");
    };
    dailySpecials.remove(id);
  };

  public query ({ caller }) func getDailySpecials() : async [DailySpecial] {
    dailySpecials.values().toArray().sort(DailySpecial.compareByName);
  };

  // Seed Default Data
  public shared ({ caller }) func seedDefaultData() : async () {
    let isSeeded = switch (persistentStore.get("isSeeded")) {
      case (null) { false };
      case (?value) { value };
    };

    if (isSeeded) {
      return;
    };

    // Seed Menu Items (2-3 per category)
    // Cakes
    let cake1 : MenuItem = {
      id = 1;
      name = "Red Velvet Cake";
      category = "Cakes";
      description = "Classic red velvet cake with cream cheese frosting.";
      price = "350";
      imageUrl = "/images/red-velvet.jpg";
      isActive = true;
    };

    let cake2 : MenuItem = {
      id = 2;
      name = "Chocolate Fudge Cake";
      category = "Cakes";
      description = "Rich chocolate cake with layers of fudge.";
      price = "400";
      imageUrl = "/images/chocolate-fudge.jpg";
      isActive = true;
    };

    menuItems.add(1, cake1);
    menuItems.add(2, cake2);

    // Cupcakes
    let cupcake1 : MenuItem = {
      id = 6;
      name = "Vanilla Sprinkle Cupcake";
      category = "Cupcakes";
      description = "Vanilla cupcakes with colorful sprinkles.";
      price = "70";
      imageUrl = "/images/cupcake-vanilla.jpg";
      isActive = true;
    };

    let cupcake2 : MenuItem = {
      id = 7;
      name = "Strawberry Cream Cupcake";
      category = "Cupcakes";
      description = "Strawberry flavored cupcake with whipped cream.";
      price = "80";
      imageUrl = "/images/cupcake-strawberry.jpg";
      isActive = true;
    };

    menuItems.add(6, cupcake1);
    menuItems.add(7, cupcake2);

    // Daily Specials (4)
    let DS1 : DailySpecial = {
      id = 1;
      name = "Croissants";
      description = "Buttery and flaky French croissants.";
      imageUrl = "/images/croissants.jpg";
      isAvailable = true;
    };

    let DS2 : DailySpecial = {
      id = 2;
      name = "Brownies";
      description = "Fudgy chocolate brownies.";
      imageUrl = "/images/brownies.jpg";
      isAvailable = true;
    };

    let DS3 : DailySpecial = {
      id = 3;
      name = "Muffins";
      description = "Moist muffins in assorted flavors.";
      imageUrl = "/images/muffins.jpg";
      isAvailable = true;
    };

    let DS4 : DailySpecial = {
      id = 4;
      name = "Pain au Chocolat";
      description = "Chocolate-filled pastry.";
      imageUrl = "/images/pain-au-chocolat.jpg";
      isAvailable = true;
    };

    dailySpecials.add(1, DS1);
    dailySpecials.add(2, DS2);
    dailySpecials.add(3, DS3);
    dailySpecials.add(4, DS4);

    persistentStore.add("isSeeded", true);
  };
};
