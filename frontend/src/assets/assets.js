import milk from "../assets/milk.webp";
import milk2 from "../assets/milk2.webp";
import milk3 from "../assets/milk3.webp";
import milk4 from "../assets/milk4.webp";
import bread from "../assets/bread.jpg";
import chilli from "../assets/chilli.jpg";
import eggs from "../assets/eggs.jpg";
import ghee from "../assets/ghee.jpg";
import mango from "../assets/mango.jpg";
import onions from "../assets/onions.jpg";
import rice from "../assets/rice.jpg";
import fresh from "../assets/fresh.jpg";
import daily from "../assets/milk.jpg";
import grains from "../assets/grains.jpg";
import spices from "../assets/spices.jpg";
import snacks from "../assets/snacks.jpg";
import drinks from "../assets/drinks.jpg";
import sauce from "../assets/sauce.webp";

export const dummyProducts = [
  {
    _id: "pk01",
    name: "Alphonso Mangoes",
    category: "Fresh",
    price: 420,
    offerPrice: 349,
    image: [mango],
    description: [
      "Premium Ratnagiri mangoes",
      "Naturally sweet and juicy",
      "Seasonal and limited stock",
    ],
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-01T08:10:00.000Z",
    inStock: true,
  },
  {
    _id: "pk02",
    name: "Farm Fresh Eggs",
    category: "Fresh",
    price: 89,
    offerPrice: 89,
    image: [eggs],
    description: [
      "Free range, desi eggs",
      "Rich in protein",
      "Freshly sourced daily",
    ],
    createdAt: "2026-04-01T08:05:00.000Z",
    updatedAt: "2026-04-01T08:10:00.000Z",
    inStock: true,
  },
  {
    _id: "pk03",
    name: "Basmati Rice",
    category: "Grains",
    price: 220,
    offerPrice: 189,
    image: [rice],
    description: [
      "Extra long grain rice",
      "Aromatic and fluffy",
      "Ideal for biryani and pulao",
    ],
    createdAt: "2026-04-01T08:10:00.000Z",
    updatedAt: "2026-04-01T08:15:00.000Z",
    inStock: true,
  },
  {
    _id: "pk04",
    name: "Amul Taaza Milk",
    category: "Essentials",
    price: 68,
    offerPrice: 68,
    image: [milk, milk2, milk3, milk4],
    description: [
      "Full cream fresh milk",
      "Rich in calcium",
      "Perfect for daily consumption",
    ],
    createdAt: "2026-04-01T08:15:00.000Z",
    updatedAt: "2026-04-01T08:20:00.000Z",
    inStock: true,
  },
  {
    _id: "pk05",
    name: "Red Onions",
    category: "Fresh",
    price: 55,
    offerPrice: 39,
    image: [onions],
    description: [
      "Nashik medium onions",
      "Strong flavor and aroma",
      "Kitchen essential",
    ],
    createdAt: "2026-04-01T08:20:00.000Z",
    updatedAt: "2026-04-01T08:25:00.000Z",
    inStock: true,
  },
  {
    _id: "pk06",
    name: "Kashmiri Chilli",
    category: "Spices",
    price: 120,
    offerPrice: 120,
    image: [chilli],
    description: [
      "Bold and aromatic spice",
      "Adds vibrant color",
      "Perfect for Indian cooking",
    ],
    createdAt: "2026-04-01T08:25:00.000Z",
    updatedAt: "2026-04-01T08:30:00.000Z",
    inStock: true,
  },
  {
    _id: "pk07",
    name: "Sourdough Bread",
    category: "Essentials",
    price: 95,
    offerPrice: 95,
    image: [bread],
    description: [
      "Baked fresh every morning",
      "Crispy crust and soft inside",
      "Perfect for breakfast",
    ],
    createdAt: "2026-04-01T08:30:00.000Z",
    updatedAt: "2026-04-01T08:35:00.000Z",
    inStock: true,
  },
  {
    _id: "pk08",
    name: "Desi Ghee",
    category: "Essentials",
    price: 620,
    offerPrice: 540,
    image: [ghee],
    description: [
      "Pure cow ghee",
      "Traditional cultured method",
      "Rich aroma and taste",
    ],
    createdAt: "2026-04-01T08:35:00.000Z",
    updatedAt: "2026-04-01T08:40:00.000Z",
    inStock: true,
  },
];

export const picks = [
  {
    _id: 1,
    name: "Alphonso Mangoes",
    subtitle: "Premium Ratnagiri",
    price: 349,
    offerPrice: 420,
    unit: "per dozen",
    tag: "Seasonal",
    tagColor: "bg-[#EAF3DE] text-[#3F7D3A]",
    rating: 4.8,
    image: [mango],
    category: "fresh",
  },
  {
    _id: 2,
    name: "Farm Fresh Eggs",
    subtitle: "Free range, desi",
    price: 89,
    offerPrice: null,
    unit: "per dozen",
    tag: "Fresh Today",
    tagColor: "bg-[#EAF3DE] text-[#3F7D3A]",
    rating: 4.9,
    image: [eggs],
    category: "fresh",
  },
  {
    _id: 3,
    name: "Basmati Rice",
    subtitle: "Extra long grain",
    price: 189,
    offerPrice: 220,
    unit: "per kg",
    tag: "Best Value",
    tagColor: "bg-[#FAEEDA] text-[#854F0B]",
    rating: 4.7,
    image: [rice],
    category: "grains",
  },
  {
    _id: 4,
    name: "Amul Taaza Milk",
    subtitle: "Full cream, fresh",
    price: 68,
    offerPrice: null,
    unit: "per litre",
    tag: "Popular",
    tagColor: "bg-[#F5E6C8] text-[#8A6010]",
    rating: 4.6,
    image: [milk, milk2, milk3, milk4],
    category: "essentials",
  },
  {
    _id: 5,
    name: "Red Onions",
    subtitle: "Nashik, medium",
    price: 39,
    offerPrice: 55,
    unit: "per kg",
    tag: "Fresh Today",
    tagColor: "bg-[#EAF3DE] text-[#3F7D3A]",
    rating: 4.5,
    image: [onions],
    category: "fresh",
  },
  {
    _id: 6,
    name: "Kashmiri Chilli",
    subtitle: "Bold & aromatic",
    price: 120,
    offerPrice: null,
    unit: "per 200g",
    tag: "Best Value",
    tagColor: "bg-[#FAEEDA] text-[#854F0B]",
    rating: 4.8,
    image: [chilli],
    category: "spices",
  },
  {
    _id: 7,
    name: "Sourdough Bread",
    subtitle: "Baked this morning",
    price: 95,
    offerPrice: null,
    unit: "per loaf",
    tag: "Fresh Today",
    tagColor: "bg-[#EAF3DE] text-[#3F7D3A]",
    rating: 4.9,
    image: [bread],
    category: "essentials",
  },
  {
    _id: 8,
    name: "Desi Ghee",
    subtitle: "Pure cow, cultured",
    price: 540,
    offerPrice: 620,
    unit: "per 500g",
    tag: "Popular",
    tagColor: "bg-[#F5E6C8] text-[#8A6010]",
    rating: 4.9,
    image: [ghee],
    category: "essentials",
  },
];

export const sellerCategories = [
  "Fresh from the Bazaar",
  "Daily Essentials",
  "Grains & Staples",
  "Spices & Masalas",
  "Snacks & Quick Bites",
  "Drinks & Beverages",
  "Sauces & Spreads",
];

export const categories = [
  {
    name: "Fresh from the Bazaar",
    subtitle: "Fresh & seasonal",
    path: "fresh",
    tag: "Fresh Today",
    tagColor: "bg-[#EAF3DE] text-[#3F7D3A]",
    image: fresh,
  },
  {
    name: "Daily Essentials",
    subtitle: "Daily must-haves",
    path: "essentials",
    tag: "Popular",
    tagColor: "bg-[#F5E6C8] text-[#8A6010]",
    image: daily,
  },
  {
    name: "Grains & Staples",
    subtitle: "Your kitchen backbone",
    path: "grains",
    tag: null,
    image: grains,
  },
  {
    name: "Spices & Masalas",
    subtitle: "Bold & aromatic",
    path: "spices",
    tag: "Best Value",
    tagColor: "bg-[#FAEEDA] text-[#854F0B]",
    image: spices,
  },
  {
    name: "Snacks & Quick Bites",
    subtitle: "For every craving",
    path: "snacks",
    tag: "Popular",
    tagColor: "bg-[#F5E6C8] text-[#8A6010]",
    image: snacks,
  },
  {
    name: "Drinks & Beverages",
    subtitle: "Refresh & energize",
    path: "drinks",
    tag: null,
    tagColor: "bg-[#F5E6C8] text-[#8A6010]",
    image: drinks,
  },
  {
    name: "Sauces & Spreads",
    subtitle: "Flavorful companions",
    path: "sauces",
    tag: null,
    tagColor: "bg-[#FAEEDA] text-[#854F0B]",
    image: sauce,
  },
];

export const dummyAddress = [
  {
    _id: "67b5b9e54ea97f71bbc196a0",
    userId: "67b5880e4d09769c5ca61644",
    firstName: "Great",
    lastName: "Stack",
    email: "user.greatstack@gmail.com",
    street: "Street 123",
    city: "Main City",
    state: "New State",
    zipcode: 123456,
    country: "IN",
    phone: "1234567890",
  },
];

export const dummyOrders = [
  {
    _id: "order_001",
    userId: "user_001",
    items: [
      {
        product: dummyProducts[0], // Alphonso Mangoes
        quantity: 1,
        _id: "item_001",
      },
      {
        product: dummyProducts[4], // Red Onions
        quantity: 2,
        _id: "item_002",
      },
    ],
    amount: 427, // 349 + (39*2)
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "Online",
    isPaid: true,
    createdAt: "2026-04-01T10:12:30.000Z",
    updatedAt: "2026-04-01T10:15:00.000Z",
  },
  {
    _id: "order_002",
    userId: "user_001",
    items: [
      {
        product: dummyProducts[1], // Eggs
        quantity: 2,
        _id: "item_003",
      },
      {
        product: dummyProducts[3], // Milk
        quantity: 1,
        _id: "item_004",
      },
    ],
    amount: 246, // (89*2) + 68
    address: dummyAddress[0],
    status: "Out for Delivery",
    paymentType: "COD",
    isPaid: false,
    createdAt: "2026-04-02T08:20:10.000Z",
    updatedAt: "2026-04-02T09:00:00.000Z",
  },
  {
    _id: "order_003",
    userId: "user_002",
    items: [
      {
        product: dummyProducts[2], // Rice
        quantity: 3,
        _id: "item_005",
      },
    ],
    amount: 567, // 189 * 3
    address: dummyAddress[1],
    status: "Delivered",
    paymentType: "Online",
    isPaid: true,
    createdAt: "2026-03-28T14:05:45.000Z",
    updatedAt: "2026-03-29T11:30:00.000Z",
  },
  {
    _id: "order_004",
    userId: "user_003",
    items: [
      {
        product: dummyProducts[5], // Chilli
        quantity: 1,
        _id: "item_006",
      },
      {
        product: dummyProducts[6], // Bread
        quantity: 2,
        _id: "item_007",
      },
      {
        product: dummyProducts[7], // Ghee
        quantity: 1,
        _id: "item_008",
      },
    ],
    amount: 850, // 120 + (95*2) + 540
    address: dummyAddress[0],
    status: "Processing",
    paymentType: "Online",
    isPaid: true,
    createdAt: "2026-04-03T16:40:00.000Z",
    updatedAt: "2026-04-03T17:10:00.000Z",
  },
];