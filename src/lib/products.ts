import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

export type Gender = "male" | "female";
export type Category = "Shirt" | "T-Shirt" | "Pant" | "Kurti" | "Dress" | "Blouse" | "Blazer";

export interface Product {
  id: string;
  name: string;
  gender: Gender;
  category: Category;
  price: number;
  image: string;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Linen Oxford Shirt",
    gender: "male",
    category: "Shirt",
    price: 89,
    image: p1.src,
  },
  {
    id: "p2",
    name: "Essential Black Tee",
    gender: "male",
    category: "T-Shirt",
    price: 39,
    image: p2.src,
  },
  {
    id: "p3",
    name: "Camel Tailored Trouser",
    gender: "male",
    category: "Pant",
    price: 129,
    image: p3.src,
  },
  {
    id: "p8",
    name: "Navy Pique Polo",
    gender: "male",
    category: "T-Shirt",
    price: 59,
    image: p8.src,
  },
  {
    id: "p4",
    name: "Rose Garden Kurti",
    gender: "female",
    category: "Kurti",
    price: 79,
    image: p4.src,
  },
  {
    id: "p5",
    name: "Midnight Chiffon Gown",
    gender: "female",
    category: "Dress",
    price: 219,
    image: p5.src,
  },
  {
    id: "p6",
    name: "Ivory Silk Blouse",
    gender: "female",
    category: "Blouse",
    price: 99,
    image: p6.src,
  },
  {
    id: "p7",
    name: "Sand Tailored Blazer",
    gender: "female",
    category: "Blazer",
    price: 189,
    image: p7.src,
  },
];
