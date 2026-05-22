export interface RegisterInput {
    email: string;
    password: string;
    name: string;
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface RestaurantInput {
    name: string;
    cuisine: string;
    location: string;
    priceRange: string;
    imageUrl?: string;
    status: string;
    rating?: number;
    review?: string;
    visitedDate?: Date;
    whatIOrdered?: string;
    recommendedDish?: string;
    pricePaid?: number;
  }
  