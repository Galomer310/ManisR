/**
 * Global types used in the frontend application.
 */

// User information returned after login.
export interface User {
    id: string;
    username: string;
    phone: string;
  }
  
  /**
   * Data for a food item as entered by a giver.
   * (Used when uploading food.)
   */
  export interface FoodData {
    itemDescription: string;
    pickupAddress: string;
    boxOption: "need" | "noNeed";
    foodTypes: string[];
    ingredients: string[];
    specialNotes: string;
    imageUrl?: string; // May be undefined if no image was uploaded
  }
  
  /**
   * Food item record returned from the backend.
   * Note the backend returns snake_case keys.
   */
  export interface FoodItem {
    id: number;
    item_description: string;
    pickup_address: string;
    box_option: "need" | "noNeed";
    food_types: string;       // Comma-separated string
    ingredients: string;      // Comma-separated string
    special_notes: string;
    image_url: string | null;
  }
  
  /**
   * User location preferences.
   */
  export interface LocationPreferences {
    city: string;
    radius: number;
  }
  
  /**
   * User food preferences.
   */
  export interface FoodPreferences {
    foodPreference: string;
    allergies: string[];
  }
  