# Notification System Documentation

## Overview
A real-time notification system using brand colors (coral `#d96857` and dark `#2e2e2e`) with small dots that appear next to navigation items and page headers.

## Features
- ✅ Brand-colored notification dots (coral/dark)
- ✅ Real-time updates via Supabase subscriptions
- ✅ Automatic marking as read when page is visited
- ✅ Pulse animation on new notifications
- ✅ Type-safe with TypeScript

## Notification Types
1. **cart** - Cart updates (new items added)
2. **chat** - New chat messages
3. **order** - Order status updates
4. **project** - Project updates (areas, files, renders)
5. **render** - New renders uploaded

## Implementation

### 1. Database Setup
Run the migration to create the notifications table:
```bash
cd supabase
npx supabase db push
```

This creates:
- `notifications` table with RLS policies
- Indexes for performance
- Automatic `updated_at` trigger

### 2. Components Created

#### NotificationDot Component
Location: `/components/NotificationDot.tsx`

```tsx
<NotificationDot 
  show={hasUnread('cart')} 
  color="coral"  // or "dark"
  size="sm"      // or "md"
/>
```

#### NotificationContext
Location: `/lib/contexts/notificationContext.tsx`

Provides:
- `notifications` - Array of all unread notifications
- `unreadCount` - Count by type
- `hasUnread(type, referenceId?)` - Check if unread exists
- `markAsRead(type, referenceId?)` - Mark as read
- `markAllAsRead(type)` - Mark all of type as read
- `refresh()` - Manually reload notifications

#### NotificationService
Location: `/lib/services/notificationService.ts`

Methods:
- `create(type, referenceId, userId?)` - Create notification
- `markAsRead(type, referenceId?, userId?)` - Mark as read
- `delete(type, referenceId?, userId?)` - Delete notification
- `getUnreadCount(type, userId?)` - Get count

### 3. Usage in Pages

#### Cart Page
```tsx
import { useNotifications } from '@/lib/contexts/notificationContext';
import { NotificationDot } from '@/components/NotificationDot';

export default function CartPage() {
  const { hasUnread, markAllAsRead } = useNotifications();
  
  useEffect(() => {
    markAllAsRead('cart'); // Mark as read when page loads
  }, []);
  
  return (
    <h1>
      Cart
      {hasUnread('cart') && <NotificationDot show color="coral" size="md" />}
    </h1>
  );
}
```

#### Header Navigation
```tsx
<Link href="/chat">
  Chat
  {hasUnread('chat') && <NotificationDot show color="coral" size="sm" />}
</Link>
```

## How to Trigger Notifications

### When a new cart item is added:
```tsx
import { notificationService } from '@/lib/services/notificationService';

// After adding item to cart
await notificationService.create('cart', 'cart-update');
```

### When a new chat message arrives:
```tsx
// After receiving message
await notificationService.create('chat', projectId);
```

### When an order is updated:
```tsx
// After order status change
await notificationService.create('order', orderId);
```

### When a new render is uploaded:
```tsx
// After render upload
await notificationService.create('render', projectId);
```

### When a project is updated:
```tsx
// After project change (area, file, etc.)
await notificationService.create('project', projectId);
```

## Where Notifications Should Be Added

### 1. Cart Notifications
**Trigger Location**: `/lib/services/cartService.ts` - `addToCart()` method
```tsx
await notificationService.create('cart', 'new-item');
```

### 2. Chat Notifications
**Trigger Location**: 
- `/app/(protected)/chat/page.tsx` - When message received
- `/app/(protected)/projects/[id]/page.tsx` - Project chat
```tsx
// Only notify if message is from another user (designer)
if (message.sender_id !== currentUser.id) {
  await notificationService.create('chat', projectId);
}
```

### 3. Order Notifications
**Trigger Location**: `/api/payment/verify/route.ts` - After payment success
```tsx
await notificationService.create('order', orderId);
```

### 4. Project Notifications
**Trigger Location**: 
- Area created: `/app/(protected)/projects/[id]/page.tsx`
- File uploaded: File upload handler
- Product added: Product addition handler
```tsx
await notificationService.create('project', projectId);
```

### 5. Render Notifications
**Trigger Location**: 
- `/app/(protected)/projects/[id]/page.tsx` - Render upload
- Backend render processing completion
```tsx
await notificationService.create('render', projectId);
```

## Notification Behavior

### Auto-clear on page visit:
Each page automatically marks its notifications as read:
```tsx
useEffect(() => {
  markAllAsRead('cart'); // Clear when cart page loads
}, []);
```

### Manual clearing:
```tsx
// Clear specific notification
await markAsRead('chat', projectId);

// Clear all of type
await markAllAsRead('chat');
```

## Styling

### Brand Colors:
- Coral: `#d96857` - Primary notification color
- Dark: `#2e2e2e` - Alternative notification color

### Sizes:
- `sm` - 8px (w-2 h-2) - For navigation links
- `md` - 10px (w-2.5 h-2.5) - For page headers

### Animation:
- Pulse effect on new notifications (600ms)
- Smooth fade in/out

## Best Practices

1. **Don't spam**: Only create notifications for meaningful updates
2. **Clear on view**: Always mark as read when user views the content
3. **Use referenceId**: Include specific IDs for targeted clearing
4. **Check before create**: Service automatically prevents duplicates
5. **Real-time updates**: Notifications sync across all tabs automatically

## Database Schema

```sql
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  type TEXT ('cart', 'chat', 'order', 'project', 'render'),
  reference_id TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Future Enhancements

Potential additions:
- Notification history page
- Notification preferences/settings
- Email/push notification integration
- Notification sound effects
- Grouped notifications
- Priority levels
