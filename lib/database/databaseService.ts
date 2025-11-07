// Database service for handling real user data
// This would integrate with your chosen database (PostgreSQL, MySQL, MongoDB, etc.)

import { User, UserProfile, Project, Order, CartItem, ChatMessage } from './models';

// Mock database implementation - replace with actual database queries
class DatabaseService {
  private users: Map<string, User> = new Map();
  private projects: Map<string, Project> = new Map();
  private orders: Map<string, Order> = new Map();
  private cartItems: Map<string, CartItem[]> = new Map();
  private chatMessages: Map<string, ChatMessage[]> = new Map();

  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false,
      ...userData,
    };
    
    this.users.set(user.id, user);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Project operations
  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'areas'>): Promise<Project> {
    const project: Project = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      areas: [],
      ...projectData,
    };
    
    this.projects.set(project.id, project);
    return project;
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.userId === userId);
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.projects.get(id) || null;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const project = this.projects.get(id);
    if (!project) return null;

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Order operations
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const order: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...orderData,
    };
    
    this.orders.set(order.id, order);
    return order;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.userId === userId);
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    const order = this.orders.get(id);
    if (!order) return null;

    const updatedOrder = {
      ...order,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    return this.cartItems.get(userId) || [];
  }

  async addToCart(cartItem: Omit<CartItem, 'id' | 'addedAt'>): Promise<CartItem> {
    const item: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: new Date(),
      ...cartItem,
    };

    const userCart = this.cartItems.get(cartItem.userId) || [];
    userCart.push(item);
    this.cartItems.set(cartItem.userId, userCart);
    
    return item;
  }

  async updateCartItem(id: string, updates: Partial<CartItem>): Promise<CartItem | null> {
    for (const [userId, cart] of this.cartItems.entries()) {
      const itemIndex = cart.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        cart[itemIndex] = { ...cart[itemIndex], ...updates };
        this.cartItems.set(userId, cart);
        return cart[itemIndex];
      }
    }
    return null;
  }

  async removeFromCart(userId: string, itemId: string): Promise<boolean> {
    const cart = this.cartItems.get(userId) || [];
    const filteredCart = cart.filter(item => item.id !== itemId);
    this.cartItems.set(userId, filteredCart);
    return filteredCart.length < cart.length;
  }

  async clearCart(userId: string): Promise<void> {
    this.cartItems.set(userId, []);
  }

  // Chat operations
  async getChatMessages(userId: string, projectId: string): Promise<ChatMessage[]> {
    const userMessages = this.chatMessages.get(userId) || [];
    return userMessages.filter(msg => msg.projectId === projectId);
  }

  async addChatMessage(messageData: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      ...messageData,
    };

    const userMessages = this.chatMessages.get(messageData.userId) || [];
    userMessages.push(message);
    this.chatMessages.set(messageData.userId, userMessages);
    
    return message;
  }
}

export const databaseService = new DatabaseService();

// For production, you would replace the mock implementation with actual database queries:
/*
import { Pool } from 'pg'; // for PostgreSQL
import { MongoClient } from 'mongodb'; // for MongoDB
import { createConnection } from 'mysql2/promise'; // for MySQL

class ProductionDatabaseService {
  private pool: Pool; // or your database connection

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const query = `
      INSERT INTO users (email, name, password_hash, is_verified)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      userData.email,
      userData.name,
      userData.passwordHash,
      userData.isVerified
    ]);
    return result.rows[0];
  }

  // ... other database methods
}
*/