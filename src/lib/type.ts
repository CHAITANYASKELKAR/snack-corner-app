export interface AuthRequestDTO {
  phoneNumber: string;
}

export interface AuthVerifyDTO {
  phoneNumber: string;
  otp: string;
}

export interface UserDTO {
  id: string;
  phoneNumber: string;
  name?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderItemDTO {
  menuItemId: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface OrderDTO {
  items: OrderItemDTO[];
}

export interface PaymentDTO {
  orderId: string;
  amount: number;
  paymentMethod: "UPI" | "CASH";
}

export enum OrderStatus {
  CREATED = "CREATED",
  PREPARING = "PREPARING",
  READY = "READY",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  UPI = "UPI",
  CASH = "CASH",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  VERIFIED = "VERIFIED",
}
