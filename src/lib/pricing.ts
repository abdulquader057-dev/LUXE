import { supabaseAdmin } from "@/lib/supabase";

export interface ServerOrderItemInput {
  id: string;
  quantity: number;
}

export interface PriceCalculationResult {
  subtotal: number;
  discountRate: number;
  discountAmount: number;
  discountedSubtotal: number;
  couponDiscountAmount: number;
  postCouponSubtotal: number;
  deliveryFee: number;
  cgstAmount: number;
  sgstAmount: number;
  gstAmount: number;
  grandTotal: number;
  dbProducts: Record<string, { name: string; price: number }>;
}

export async function calculateOrderPriceServerSide(
  items: ServerOrderItemInput[],
  activePlan: string | null,
  couponDiscountPercent: number,
  distance: number | null
): Promise<PriceCalculationResult> {
  if (!items || items.length === 0) {
    throw new Error("Order items list cannot be empty");
  }

  const productIds = items.map((it) => it.id);
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("id, name, price, is_active")
    .in("id", productIds);

  if (error || !products) {
    throw new Error(`Database lookup failed: ${error?.message || "No products found"}`);
  }

  // Create lookup dictionary and verify all products exist and are active
  const dbProducts: Record<string, { name: string; price: number }> = {};
  for (const item of items) {
    const dbProd = products.find((p) => p.id === item.id);
    if (!dbProd) {
      throw new Error(`Product not found in catalog: ${item.id}`);
    }
    if (!dbProd.is_active) {
      throw new Error(`Product is no longer active: ${dbProd.name}`);
    }
    dbProducts[item.id] = {
      name: dbProd.name,
      price: Number(dbProd.price) || 0,
    };
  }

  // 1. Calculate raw subtotal based on DB prices
  let rawSubtotal = 0;
  for (const item of items) {
    const qty = Number(item.quantity) || 0;
    if (qty <= 0) throw new Error("Item quantity must be greater than zero");
    rawSubtotal += dbProducts[item.id].price * qty;
  }

  // 2. Membership Discount
  let discountRate = 0;
  if (activePlan === "Luxe Insider") discountRate = 0.05;
  else if (activePlan === "Luxe Elite") discountRate = 0.15;
  else if (activePlan === "Neural Vanguard") discountRate = 0.25;

  const discountAmount = Math.round(rawSubtotal * discountRate);
  const discountedSubtotal = rawSubtotal - discountAmount;

  // 3. Coupon Discount
  const couponDiscountRate = Number(couponDiscountPercent) || 0;
  if (couponDiscountRate < 0 || couponDiscountRate > 1) {
    throw new Error("Invalid coupon discount percentage");
  }
  const couponDiscountAmount = Math.round(discountedSubtotal * couponDiscountRate);
  const postCouponSubtotal = discountedSubtotal - couponDiscountAmount;

  // 4. Delivery Fee Calculation
  let deliveryFee = 45; // Default standard
  if (postCouponSubtotal > 1999) {
    deliveryFee = 0;
  } else if (distance !== null && distance !== undefined) {
    const distNum = Number(distance) || 0;
    if (distNum <= 5) {
      deliveryFee = 0;
    } else {
      deliveryFee = Math.round(distNum * 7.5);
    }
  }

  // 5. Item-by-item GST (based on discounted prices)
  let cgstAmount = 0;
  let sgstAmount = 0;

  for (const item of items) {
    const itemPrice = dbProducts[item.id].price;
    const itemQty = Number(item.quantity) || 0;
    
    // Apply membership discount and coupon discount to get net item price for tax calculations
    const discountedItemPrice = itemPrice * (1 - discountRate) * (1 - couponDiscountRate);
    
    const rate = discountedItemPrice <= 1000 ? 0.05 : 0.12;
    const itemCgst = Math.round((discountedItemPrice * (rate / 2)) * itemQty);
    const itemSgst = Math.round((discountedItemPrice * (rate / 2)) * itemQty);
    
    cgstAmount += itemCgst;
    sgstAmount += itemSgst;
  }

  const gstAmount = cgstAmount + sgstAmount;
  const grandTotal = postCouponSubtotal + gstAmount + deliveryFee;

  return {
    subtotal: rawSubtotal,
    discountRate,
    discountAmount,
    discountedSubtotal,
    couponDiscountAmount,
    postCouponSubtotal,
    deliveryFee,
    cgstAmount,
    sgstAmount,
    gstAmount,
    grandTotal,
    dbProducts,
  };
}
