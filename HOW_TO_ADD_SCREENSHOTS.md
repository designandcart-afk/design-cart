# 📸 How to Add Screenshots to Tutorial Page

## File Location:
`/app/tutorial/page.tsx`

## Where to Add Screenshots:

Each tutorial section has a placeholder area. Look for these blocks in the code:

### 1. **Getting Started Section** (Line ~45)
```tsx
<div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border border-[#2e2e2e]/10">
  // REPLACE THIS ENTIRE DIV WITH:
  <img 
    src="/screenshots/getting-started.png" 
    alt="Getting Started"
    className="w-full h-full object-cover rounded-xl"
  />
</div>
```

### 2. **Create Project Section** (Line ~90)
```tsx
<div className="bg-white rounded-xl p-8 border-2 border-dashed border-[#2e2e2e]/20">
  // REPLACE THIS ENTIRE DIV WITH:
  <img 
    src="/screenshots/create-project.png" 
    alt="Create Project Form"
    className="w-full rounded-xl border border-[#2e2e2e]/10"
  />
</div>
```

### 3. **Add Products Section** (Line ~150)
```tsx
<div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
  // REPLACE THIS ENTIRE DIV WITH:
  <img 
    src="/screenshots/add-products.png" 
    alt="Product Catalog"
    className="w-full rounded-xl border border-[#2e2e2e]/10"
  />
</div>
```

### 4. **Review & Approve Section** (Line ~210)
```tsx
<div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
  // REPLACE THIS ENTIRE DIV WITH:
  <img 
    src="/screenshots/review-approve.png" 
    alt="Review and Approve Designs"
    className="w-full rounded-xl border border-[#2e2e2e]/10"
  />
</div>
```

### 5. **View Renders Section** (Line ~260)
```tsx
<div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
  // REPLACE THIS ENTIRE DIV WITH:
  <img 
    src="/screenshots/view-renders.png" 
    alt="3D Renders Gallery"
    className="w-full rounded-xl border border-[#2e2e2e]/10"
  />
</div>
```

### 6. **Add to Cart Section** (Line ~310)
```tsx
<div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
  // REPLACE THIS ENTIRE DIV WITH:
  <img 
    src="/screenshots/add-to-cart.png" 
    alt="Add Products to Cart"
    className="w-full rounded-xl border border-[#2e2e2e]/10"
  />
</div>
```

### 7. **Checkout Section** (Line ~360)
```tsx
<div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
  // REPLACE THIS ENTIRE DIV WITH:
  <img 
    src="/screenshots/checkout.png" 
    alt="Checkout Page"
    className="w-full rounded-xl border border-[#2e2e2e]/10"
  />
</div>
```

### 8. **Track Orders Section** (Line ~410)
```tsx
<div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
  // REPLACE THIS ENTIRE DIV WITH:
  <img 
    src="/screenshots/track-orders.png" 
    alt="Order Tracking"
    className="w-full rounded-xl border border-[#2e2e2e]/10"
  />
</div>
```

### 9. **Bills & Invoices Section** (Line ~460)
```tsx
<div className="bg-white rounded-xl p-6 border-2 border-dashed border-[#2e2e2e]/20">
  // REPLACE THIS ENTIRE DIV WITH:
  <img 
    src="/screenshots/bills-invoices.png" 
    alt="Bills and Invoices"
    className="w-full rounded-xl border border-[#2e2e2e]/10"
  />
</div>
```

---

## 📁 Where to Save Your Screenshots:

Create a folder: `/public/screenshots/`

Save your screenshots with these exact names:
- `getting-started.png` (or .jpg)
- `create-project.png`
- `add-products.png`
- `review-approve.png`
- `view-renders.png`
- `add-to-cart.png`
- `checkout.png`
- `track-orders.png`
- `bills-invoices.png`

---

## ⚡ Quick Steps:

1. **Take 9 screenshots** of your actual app pages
2. **Save them** in `/public/screenshots/` folder
3. **Tell me when ready** - I'll update the code to show your real screenshots
4. Or **do it yourself** - replace each dashed border div with the `<img>` tag shown above

---

## 💡 Tip:
If your screenshots are .jpg instead of .png, just change the file extension in the code:
```tsx
src="/screenshots/create-project.jpg"
```

Ready to add them? Just share your screenshots or tell me when you've placed them in the folder!
