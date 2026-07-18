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