import { create } from 'zustand';

export interface ShippingDetails {
  email: string;
  keepUpdated: boolean;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface DeliveryEstimate {
  serviceable: boolean;
  estimatedDays?: string;
  cost?: number;
  currency?: string;
  message?: string;
}

interface CheckoutState {
  shippingDetails: Partial<ShippingDetails>;
  deliveryEstimate: DeliveryEstimate | null;
  isCheckingPincode: boolean;
  setShippingDetails: (details: Partial<ShippingDetails>) => void;
  setDeliveryEstimate: (estimate: DeliveryEstimate | null) => void;
  setIsCheckingPincode: (isChecking: boolean) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shippingDetails: {
    keepUpdated: true,
  },
  deliveryEstimate: null,
  isCheckingPincode: false,
  setShippingDetails: (details) =>
    set((state) => ({
      shippingDetails: { ...state.shippingDetails, ...details },
    })),
  setDeliveryEstimate: (estimate) => set({ deliveryEstimate: estimate }),
  setIsCheckingPincode: (isChecking) => set({ isCheckingPincode: isChecking }),
}));
