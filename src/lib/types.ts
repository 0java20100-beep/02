export interface MenuCategory {
  id: string;
  name: string;
  emoji: string;
}

export interface Dish {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  ingredients: string[];
  calories: number;
  cookTime: number; // minutes
  price: number; // so'm
  rating: number; // 0-5
  image: string;
  popular?: boolean;
  chefPick?: boolean;
  spicy?: boolean;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  phone: string;
  address: string;
  hours: string;
}

export type OrderStatus = "pending" | "cooking" | "ready" | "delivered";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}
