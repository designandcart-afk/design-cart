// Database models and types for real user data

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  phone?: string;
  address?: Address;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  notifications: boolean;
  newsletter: boolean;
  theme: 'light' | 'dark';
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  scope: string;
  budget?: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  areas: ProjectArea[];
}

export interface ProjectArea {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  products: ProjectProduct[];
}

export interface ProjectProduct {
  id: string;
  areaId: string;
  productId: string;
  quantity: number;
  notes?: string;
  addedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  projectId?: string;
  area?: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  projectId?: string;
  area?: string;
  addedAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  projectId: string;
  sender: 'user' | 'agent';
  message: string;
  attachments?: ChatAttachment[];
  createdAt: Date;
}

export interface ChatAttachment {
  id: string;
  messageId: string;
  type: 'image' | 'file';
  fileName: string;
  fileUrl: string;
  fileSize: number;
}