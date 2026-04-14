export interface User {
  id: number; name: string; email: string;
  phone?: string; city?: string; avatar?: string; role?: string;
}
export interface AuthResponse {
  token: string; type: string; userId: number;
  name: string; email: string; role: string;
}
export interface Destination {
  id: number; name: string; state: string; country: string;
  type: string; description: string; imageUrl: string; thumbnailUrl: string;
  rating: number; reviewCount: number; latitude: number; longitude: number;
  bestSeason: string; climate: string; language: string;
  famousPlaces: string; localFood: string; hotels: string;
  festivals: string; weatherByMonth: string; recommendedDresses: string;
  transportOptions: string; lowBudgetPerDay: number;
  midBudgetPerDay: number; luxuryBudgetPerDay: number; tags: string;
}
export interface TripPlan {
  id: number; source: string; destination: string;
  startDate: string; endDate: string; durationDays: number;
  numberOfPeople: number; budgetType: string; totalBudget: number;
  transportMode: string; status: string; dayWisePlan: string;
  notes: string; createdAt: string;
}
export interface Booking {
  id: number; bookingType: string; bookingReference: string;
  fromLocation: string; toLocation: string; travelDate: string;
  departureTime: string; arrivalTime: string; operatorName: string;
  seatClass: string; passengers: number; totalAmount: number;
  paymentStatus: string; status: string; bookedAt: string;
}
export interface Review {
  id: number; destinationName: string; rating: number;
  title: string; content: string; verified: boolean;
  createdAt: string; user?: { name: string };
}
export interface ChatResponse {
  reply: string;
  context: any;
  quickReplies?: string[];
  transportOptions?: any[];
  hotelOptions?: string[];
  requiresLogin?: boolean;
}
export interface Payment {
  id: number; transactionId: string; amount: number;
  paymentMethod: string; status: string; completedAt: string;
}
export interface ApiResponse<T> {
  success: boolean; message: string; data: T;
}
export interface TransportOption {
  id: string; operator: string; type: string;
  from: string; to: string; date: string;
  departure: string; arrival: string; duration: string;
  classes: { name: string; price: number; available: number }[];
  rating: number; amenities: string[];
}
