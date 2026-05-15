export type Currency = "INR" | "USD" | "EUR" | "GBP";

export interface ExchangeRates {
  [key: string]: number;
}

export class CommerceService {
  private static instance: CommerceService;
  private rates: ExchangeRates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0094,
  };

  private constructor() {}

  public static getInstance(): CommerceService {
    if (!CommerceService.instance) {
      CommerceService.instance = new CommerceService();
    }
    return CommerceService.instance;
  }

  public formatPrice(amount: number, currency: Currency = "INR"): string {
    const converted = amount * (this.rates[currency] || 1);
    
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: currency === "INR" ? 0 : 2,
    }).format(converted);
  }

  public generateWhatsAppOrderMessage(cartItems: any[], userPersona?: any): string {
    let message = "🚀 *LUXE NEW ORDER INQUIRY*\n\n";
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Size: ${item.selectedSize || "N/A"} | Qty: ${item.quantity}\n`;
      message += `   Price: ${this.formatPrice(item.price * item.quantity)}\n\n`;
    });

    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    message += `*Total Amount:* ${this.formatPrice(total)}\n\n`;
    
    if (userPersona?.preferredCategories) {
      message += `_Style Profile: ${Object.keys(userPersona.preferredCategories).join(", ")}_\n`;
    }

    message += "\n*Payment Method:* COD / Prepaid\n";
    message += "*Request:* Please help me complete this checkout.";

    return message;
  }

  public getWhatsAppLink(message: string): string {
    const phone = "91XXXXXXXXXX"; // Replace with actual business number
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
}

export const commerceService = CommerceService.getInstance();
