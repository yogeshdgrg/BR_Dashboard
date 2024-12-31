 interface Product {
    _id: number;
    name: string;
    description: string;
    img: string;
    category: string;
    sizes:string[];
    dimensions: string[];
    images: Images[];
    feature:string[]
  }
  
  
  interface Images {
    _id: number;
    image: string;
  }
export interface IOrder  {
  name: string
  email: string
  phone: string
  product: Product
  color: string
  quantity: number
  message: string
  status: string
  createdAt: Date // Add createdAt field
}
