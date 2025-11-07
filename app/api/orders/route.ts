// API routes for user orders
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/authService';
import { databaseService } from '@/lib/database/databaseService';

async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const user = await authService.getUserFromToken(token);
  if (!user) {
    throw new Error('Invalid token');
  }
  
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const orders = await databaseService.getOrdersByUserId(user.id);
    
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    
    if (error instanceof Error && error.message.includes('authenticated')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to get orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    const body = await request.json();
    const { items, shippingAddress, billingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const order = await databaseService.createOrder({
      userId: user.id,
      items: items.map((item: any) => ({
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId: '', // Will be set after order creation
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        projectId: item.projectId,
        area: item.area,
      })),
      subtotal,
      tax,
      total,
      status: 'pending',
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
    });

    // Clear user's cart after successful order
    await databaseService.clearCart(user.id);

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Create order error:', error);
    
    if (error instanceof Error && error.message.includes('authenticated')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}