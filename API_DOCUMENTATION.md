# Yoraa Clothing Shop - API Documentation

## Database Schemas

This document provides a comprehensive overview of all database schemas used in the Yoraa Clothing Shop backend application.

### Database Technology
- **Database**: MongoDB
- **ODM**: Mongoose
- **Connection**: MongoDB Atlas/Local MongoDB instance

---

## Core User Management Schemas

### 1. User Schema
**Collection**: `users`

```javascript
{
  name: {
    type: String,
    required: false,
    description: "User's display name"
  },
  phNo: {
    type: String,
    unique: false,
    required: false,
    default: "1234567890",
    description: "User's phone number"
  },
  password: {
    type: String,
    required: false,
    description: "Hashed password for login"
  },
  isVerified: {
    type: Boolean,
    default: false,
    description: "General verification status"
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
    description: "Phone number verification status"
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
    description: "Email verification status"
  },
  isAdmin: {
    type: Boolean,
    default: false,
    description: "Admin privileges flag"
  },
  isProfile: {
    type: Boolean,
    default: false,
    description: "Profile completion status"
  },
  email: {
    type: String,
    required: false,
    unique: false,
    default: "demo@example.com",
    description: "User's email address"
  },
  firebaseUid: {
    type: String,
    required: false,
    description: "Firebase authentication UID"
  },
  fcmToken: {
    type: String,
    unique: false,
    description: "Firebase Cloud Messaging token for push notifications"
  },
  platform: {
    type: String,
    enum: ["android", "ios"],
    default: null,
    description: "User's platform for analytics and notifications"
  },
  emailVerificationToken: {
    type: String,
    required: false,
    description: "Token for email verification"
  }
}
```

### 2. UserProfile Schema
**Collection**: `userprofiles`

```javascript
{
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
    description: "Reference to the associated User"
  },
  addresses: [{
    type: ObjectId,
    ref: "Address",
    required: false,
    description: "Array of user's saved addresses"
  }],
  email: {
    type: String,
    unique: false,
    required: false,
    description: "Profile email (may differ from User email)"
  },
  dob: {
    type: Date,
    required: false,
    description: "Date of birth"
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: false,
    description: "User's gender"
  },
  anniversary: {
    type: Date,
    description: "Anniversary date"
  },
  stylePreferences: [{
    type: String,
    description: "User's style preferences for recommendations"
  }],
  imageUrl: {
    type: String,
    required: false,
    description: "Profile picture URL"
  }
}
```

### 3. Address Schema
**Collection**: `addresses`

```javascript
{
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
    description: "Reference to the user who owns this address"
  },
  firstName: {
    type: String,
    required: true,
    description: "Recipient's first name"
  },
  lastName: {
    type: String,
    required: true,
    description: "Recipient's last name"
  },
  address: {
    type: String,
    required: true,
    description: "Street address or detailed address line"
  },
  city: {
    type: String,
    required: true,
    description: "City name"
  },
  state: {
    type: String,
    required: true,
    description: "State or province"
  },
  pinCode: {
    type: String,
    required: true,
    description: "Postal/ZIP code"
  },
  country: {
    type: String,
    required: true,
    description: "Country name"
  },
  phoneNumber: {
    type: String,
    required: true,
    description: "Contact phone number for delivery"
  },
  type: {
    type: String,
    enum: ["current", "new"],
    required: true,
    description: "Address type classification"
  }
}
```

---

## Product Catalog Schemas

### 4. Category Schema
**Collection**: `categories`

```javascript
{
  name: {
    type: String,
    required: true,
    unique: true,
    description: "Unique category name"
  },
  description: {
    type: String,
    description: "Optional category description"
  },
  imageUrl: {
    type: String,
    description: "Category image URL stored in S3"
  }
}
```

**Middleware**:
- Pre-deletion cleanup: Removes all subcategories, items, and S3 images when category is deleted

### 5. SubCategory Schema
**Collection**: `subcategories`

```javascript
{
  name: {
    type: String,
    required: true,
    description: "Subcategory name"
  },
  description: {
    type: String,
    description: "Optional subcategory description"
  },
  categoryId: {
    type: ObjectId,
    ref: "Category",
    required: true,
    description: "Parent category reference"
  },
  imageUrl: {
    type: String,
    description: "Subcategory image URL stored in S3"
  }
}
```

**Middleware**:
- Pre-deletion cleanup: Removes all items, item details, and S3 images when subcategory is deleted

### 6. Item Schema (Current Product Model)
**Collection**: `items`

```javascript
{
  productId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    description: "Unique product identifier"
  },
  name: {
    type: String,
    required: true,
    index: true,
    description: "Product name"
  },
  description: {
    type: String,
    description: "Product description"
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    description: "Base price of the product"
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    description: "Available stock quantity"
  },
  subCategoryId: {
    type: ObjectId,
    ref: "SubCategory",
    required: true,
    description: "Reference to subcategory"
  },
  categoryId: {
    type: ObjectId,
    ref: "Category",
    required: true,
    description: "Reference to main category"
  },
  imageUrl: {
    type: String,
    description: "Main product image URL"
  },
  filters: [{
    key: {
      type: String,
      required: true,
      index: true,
      description: "Filter attribute name (e.g., 'color', 'size')"
    },
    value: {
      type: String,
      required: true,
      index: true,
      description: "Filter attribute value (e.g., 'red', 'medium')"
    },
    code: {
      type: String,
      description: "Optional filter code (e.g., hex color)"
    }
  }],
  brand: {
    type: String,
    index: true,
    description: "Product brand"
  },
  style: [{
    type: String,
    index: true,
    description: "Style tags for the product"
  }],
  occasion: [{
    type: String,
    index: true,
    description: "Occasion tags (e.g., 'casual', 'formal')"
  }],
  fit: [{
    type: String,
    description: "Fit information (e.g., 'slim fit', 'regular')"
  }],
  material: [{
    type: String,
    description: "Material composition"
  }],
  discountPrice: {
    type: Number,
    min: 0,
    description: "Discounted price if applicable"
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    description: "Average customer rating"
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0,
    description: "Total number of reviews"
  },
  discountPercentage: {
    type: Number,
    default: 0,
    description: "Auto-calculated discount percentage"
  },
  isItemDetail: {
    type: Boolean,
    default: false,
    description: "Flag indicating if item has detailed information"
  }
}
```

**Middleware**:
- Pre-save: Auto-calculates discount percentage
- Pre-deletion: Removes associated item details and S3 images

### 7. ItemDetails Schema (Product Variations & Details)
**Collection**: `itemdetails`

```javascript
{
  descriptionAndReturns: {
    type: String,
    required: true,
    description: "Detailed product description and return policy"
  },
  fitDetails: [{
    type: String,
    required: false,
    description: "Fit information and sizing details"
  }],
  careInstructions: {
    type: String,
    required: false,
    description: "Product care and maintenance instructions"
  },
  size: {
    modelHeight: {
      type: String,
      required: false,
      description: "Model's height for reference"
    },
    modelMeasurements: {
      type: String,
      required: false,
      description: "Model's measurements"
    },
    modelWearingSize: {
      type: String,
      required: false,
      description: "Size worn by the model"
    }
  },
  colors: [{
    colorId: {
      type: String,
      required: true,
      description: "Unique identifier for the color variant"
    },
    color: {
      type: String,
      required: true,
      description: "Color name or description"
    },
    images: [{
      url: {
        type: String,
        required: true,
        description: "Image or video URL"
      },
      type: {
        type: String,
        enum: ["image", "video"],
        required: true,
        description: "Media type"
      },
      priority: {
        type: Number,
        default: 0,
        description: "Display priority for sorting"
      }
    }],
    sizes: [{
      size: {
        type: String,
        required: true,
        description: "Size label (e.g., 'S', 'M', 'L', '32', '34')"
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
        description: "Available stock for this size"
      },
      sku: {
        type: String,
        required: true,
        description: "Unique SKU for this color-size combination"
      }
    }]
  }],
  manufacturerDetails: {
    name: {
      type: String,
      required: true,
      description: "Manufacturer name"
    },
    address: {
      type: String,
      required: true,
      description: "Manufacturer address"
    },
    countryOfOrigin: {
      type: String,
      required: true,
      description: "Country where product is manufactured"
    },
    contactDetails: {
      phone: {
        type: String,
        required: true,
        description: "Manufacturer contact phone"
      },
      email: {
        type: String,
        required: true,
        description: "Manufacturer contact email"
      }
    }
  },
  shippingAndReturns: {
    shippingDetails: [{
      type: String,
      required: false,
      description: "Shipping information and policies"
    }],
    returnPolicy: [{
      type: String,
      required: false,
      description: "Return and exchange policies"
    }]
  },
  sizeChartInch: [{
    measurements: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
      description: "Size measurements in inches"
    }
  }],
  sizeChartCm: [{
    measurements: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
      description: "Size measurements in centimeters"
    }
  }],
  sizeMeasurement: {
    type: String,
    required: false,
    description: "General sizing information"
  },
  dimensions: {
    length: {
      type: Number,
      required: false,
      description: "Product length"
    },
    breadth: {
      type: Number,
      required: false,
      description: "Product breadth"
    },
    height: {
      type: Number,
      required: false,
      description: "Product height"
    },
    width: {
      type: Number,
      required: false,
      description: "Product width"
    },
    weight: {
      type: Number,
      required: false,
      description: "Product weight"
    }
  },
  items: {
    type: ObjectId,
    ref: "Item",
    required: true,
    description: "Reference to the main item"
  },
  productId: {
    type: String,
    required: true,
    description: "Product identifier matching the Item"
  },
  reviews: [{
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
      description: "User who wrote the review"
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      description: "Rating given by the user (1-5 stars)"
    },
    reviewText: {
      type: String,
      required: false,
      trim: true,
      description: "Written review text"
    },
    createdAt: {
      type: Date,
      default: Date.now,
      description: "Review creation timestamp"
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      description: "Review last update timestamp"
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    description: "Auto-calculated average rating"
  },
  isReviewDisplayEnabled: {
    type: Boolean,
    default: true,
    description: "Flag to show/hide reviews"
  },
  isReviewSubmissionEnabled: {
    type: Boolean,
    default: true,
    description: "Flag to enable/disable review submission"
  }
}
```

**Middleware**:
- Post-save: Auto-calculates average rating from reviews
- Post-update: Updates average rating when reviews are modified

### 8. Product Schema (Legacy)
**Collection**: `products`

```javascript
{
  title: {
    type: String,
    required: true,
    description: "Product title"
  },
  description: {
    type: String,
    required: true,
    description: "Product description"
  },
  price: {
    type: Number,
    required: true,
    description: "Product price"
  },
  discountPercentage: {
    type: Number,
    default: 0,
    description: "Discount percentage"
  },
  category: {
    type: ObjectId,
    ref: "Category",
    required: true,
    description: "Product category reference"
  },
  brand: {
    type: ObjectId,
    ref: "Brand",
    required: false,
    description: "Product brand reference"
  },
  stockQuantity: {
    type: Number,
    required: false,
    description: "Available stock"
  },
  prodSize: {
    type: String,
    required: false,
    description: "Product size"
  },
  thumbnail: {
    type: String,
    required: true,
    description: "Thumbnail image URL"
  },
  images: [{
    type: String,
    required: true,
    description: "Product image URLs"
  }],
  isDeleted: {
    type: Boolean,
    default: false,
    description: "Soft delete flag"
  }
}
```

---

## Shopping & Order Management Schemas

### 9. Cart Schema
**Collection**: `carts`

```javascript
{
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
    description: "Reference to the user who owns this cart item"
  },
  item: {
    type: ObjectId,
    ref: "Item",
    required: true,
    description: "Reference to the main item/product"
  },
  itemDetails: {
    type: ObjectId,
    ref: "ItemDetails",
    required: true,
    description: "Reference to item details (color, size variations)"
  },
  sku: {
    type: String,
    required: true,
    description: "SKU representing unique variation (color-size combination)"
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
    description: "Quantity of the item in cart"
  }
}
```

**Middleware**:
- Pre-save: Validates that SKU exists in the associated ItemDetails

### 10. Wishlist Schema
**Collection**: `wishlists`

```javascript
{
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
    description: "Reference to the user who owns the wishlist"
  },
  item: {
    type: ObjectId,
    ref: "Item",
    required: true,
    description: "Reference to the item in the wishlist"
  }
}
```

### 11. Order Schema (Comprehensive Order Management)
**Collection**: `orders`

```javascript
{
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
    description: "Reference to the user who placed the order"
  },
  items: [{
    type: ObjectId,
    ref: "Item",
    required: true,
    description: "Array of ordered items"
  }],
  item_quantities: [{
    item_id: {
      type: ObjectId,
      ref: "Item",
      required: true,
      description: "Reference to the specific item"
    },
    sku: {
      type: String,
      required: true,
      description: "SKU of the ordered variation"
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      description: "Quantity ordered"
    },
    desiredSize: {
      type: String,
      description: "Requested size for the item"
    }
  }],
  total_price: {
    type: Number,
    required: true,
    description: "Total order amount"
  },
  payment_status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
    description: "Payment processing status"
  },
  razorpay_order_id: {
    type: String,
    description: "Razorpay order identifier"
  },
  razorpay_payment_id: {
    type: String,
    description: "Razorpay payment identifier"
  },
  razorpay_signature: {
    type: String,
    description: "Razorpay signature for verification"
  },
  order_status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
    description: "Overall order status"
  },
  shipping_status: {
    type: String,
    enum: ["Pending", "Shipped", "In Transit", "Delivered", "Cancelled"],
    default: "Pending",
    description: "Shipping and delivery status"
  },
  address: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    country: String,
    pinCode: String,
    phoneNumber: String,
    description: "Delivery address details"
  },
  
  // Shiprocket Integration Fields
  shiprocket_orderId: {
    type: String,
    description: "Shiprocket order ID"
  },
  shiprocket_shipment_id: {
    type: String,
    description: "Shiprocket shipment ID"
  },
  awb_code: {
    type: String,
    description: "Air Waybill code for tracking"
  },
  tracking_url: {
    type: String,
    description: "Tracking URL for the shipment"
  },
  courier_company_id: {
    type: String,
    description: "Courier company identifier"
  },
  courier_name: {
    type: String,
    description: "Name of the courier company"
  },
  freight_charges: {
    type: Number,
    description: "Shipping charges"
  },
  applied_weight: {
    type: Number,
    description: "Applied weight for shipping calculation"
  },
  routing_code: {
    type: String,
    description: "Routing code for shipment"
  },
  invoice_no: {
    type: String,
    description: "Invoice number"
  },
  transporter_id: {
    type: String,
    description: "Transporter identifier"
  },
  transporter_name: {
    type: String,
    description: "Transporter company name"
  },
  shipped_by: {
    shipper_company_name: String,
    shipper_address_1: String,
    shipper_address_2: String,
    shipper_city: String,
    shipper_state: String,
    shipper_country: String,
    shipper_postcode: String,
    shipper_phone: String,
    shipper_email: String,
    description: "Shipper company details"
  },
  
  // Refund Management
  refund: {
    requestDate: Date,
    status: String,
    rmaNumber: String,
    amount: Number,
    reason: String,
    returnAwbCode: String,
    returnTrackingUrl: String,
    returnLabelUrl: String,
    shiprocketReturnId: String,
    returnShipmentId: String,
    refundTransactionId: String,
    refundStatus: String,
    notes: String,
    images: [String],
    description: "Refund request and processing details"
  },
  
  // Exchange Management
  exchange: {
    requestDate: Date,
    status: String,
    rmaNumber: String,
    newItemId: String,
    desiredSize: String,
    reason: String,
    returnAwbCode: String,
    returnTrackingUrl: String,
    returnLabelUrl: String,
    shiprocketReturnId: String,
    returnShipmentId: String,
    forwardAwbCode: String,
    forwardTrackingUrl: String,
    shiprocketForwardOrderId: String,
    forwardShipmentId: String,
    notes: String,
    images: [String],
    description: "Exchange request and processing details"
  },
  
  // Promo Code Support
  promoCode: {
    type: String,
    trim: true,
    description: "Applied promo code"
  },
  promoDiscount: {
    type: Number,
    default: 0,
    min: 0,
    description: "Discount amount from promo code"
  },
  created_at: {
    type: Date,
    default: Date.now,
    description: "Order creation timestamp"
  }
}
```

---

## Marketing & Promotion Schemas

### 12. PromoCodes Schema
**Collection**: `promocodes`

```javascript
{
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    description: "Unique promo code (auto-converted to uppercase)"
  },
  discountType: {
    type: String,
    required: true,
    enum: ["percentage", "fixed", "free_shipping", "bogo"],
    description: "Type of discount offered"
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
    description: "Discount value (percentage or fixed amount)"
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: 0,
    description: "Minimum order value required to use this promo"
  },
  startDate: {
    type: Date,
    required: true,
    description: "Promo code activation date"
  },
  endDate: {
    type: Date,
    required: true,
    description: "Promo code expiration date"
  },
  maxUses: {
    type: Number,
    default: 0,
    min: 0,
    description: "Maximum number of uses (0 = unlimited)"
  },
  currentUses: {
    type: Number,
    default: 0,
    min: 0,
    description: "Current number of times used"
  },
  isActive: {
    type: Boolean,
    default: true,
    description: "Whether the promo code is currently active"
  },
  createdAt: {
    type: Date,
    default: Date.now,
    description: "Promo code creation timestamp"
  }
}
```

### 13. Notifications Schema
**Collection**: `notifications`

```javascript
{
  title: {
    type: String,
    required: true,
    description: "Notification title (e.g., 'Sale Alert!')"
  },
  body: {
    type: String,
    required: true,
    description: "Notification message body"
  },
  imageUrl: {
    type: String,
    default: null,
    description: "Optional image URL for rich notifications"
  },
  deepLink: {
    type: String,
    default: null,
    description: "Optional deep link (e.g., app://product/123)"
  },
  platform: {
    type: String,
    enum: ["both", "android", "ios"],
    default: "both",
    description: "Target platform for the notification"
  },
  sentAt: {
    type: Date,
    default: Date.now,
    description: "Timestamp when notification was sent"
  }
}
```

---

## Utility & Support Schemas

### 14. Filter Schema
**Collection**: `filters`

```javascript
{
  key: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    description: "Filter category key (e.g., 'color', 'size', 'brand')"
  },
  priority: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
    description: "Priority for filter ordering (lower number = higher priority)"
  },
  values: [{
    name: {
      type: String,
      required: true,
      trim: true,
      description: "Display name of the filter value (e.g., 'Red', 'Medium', 'Nike')"
    },
    code: {
      type: String,
      description: "Optional code (e.g., hex color code '#FF0000')"
    },
    priority: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
      description: "Priority for value ordering within the filter"
    }
  }]
}
```

### 15. OTP Schema
**Collection**: `otps`

```javascript
{
  phNo: {
    type: String,
    required: true,
    description: "Phone number for OTP verification"
  },
  otp: {
    type: String,
    required: true,
    description: "One-time password (consider hashing for security)"
  },
  expiresAt: {
    type: Date,
    required: true,
    description: "OTP expiration timestamp"
  }
}
```

**Features**:
- TTL index for auto-deletion of expired OTPs
- Automatic cleanup after expiration

### 16. PrivacyPolicy Schema
**Collection**: `privacypolicies`

```javascript
{
  privacyPolicy: [{
    question: {
      type: String,
      required: true,
      description: "Privacy policy question or section title"
    },
    answer: [{
      type: String,
      required: true,
      description: "Answer or content for the privacy policy section"
    }]
  }]
}
```

---

## Database Features & Middleware

### Automatic Timestamps
Most schemas include automatic `createdAt` and `updatedAt` timestamps via:
```javascript
{ timestamps: true }
```

### Reference Relationships
Extensive use of ObjectId references for data normalization:
- Users ↔ Orders, Cart, Wishlist, Addresses
- Categories ↔ SubCategories ↔ Items
- Items ↔ ItemDetails
- Orders ↔ Items via item_quantities

### Pre/Post Middleware
1. **Category/SubCategory Deletion**: Cascading delete of related items and S3 cleanup
2. **Item Deletion**: Cleanup of ItemDetails and S3 images
3. **Cart Validation**: SKU validation against ItemDetails
4. **Rating Calculation**: Auto-calculation of average ratings
5. **Discount Calculation**: Auto-calculation of discount percentages

### Indexing Strategy
- `productId` (unique, indexed)
- `name` (indexed for search)
- Filter `key` and `value` (indexed for filtering)
- `brand`, `style`, `occasion` (indexed for categorization)

### S3 Integration
- Automatic S3 file cleanup on document deletion
- Image and video storage support
- URL-based media references

### Advanced Features
1. **Multi-variant Products**: Color and size combinations with unique SKUs
2. **Review System**: Built-in rating and review functionality
3. **Shipping Integration**: Comprehensive Shiprocket integration
4. **Return/Exchange Management**: Complete RMA workflow
5. **Promo Code System**: Flexible discount and promotion management
6. **Push Notifications**: FCM integration for user engagement
7. **OTP Verification**: Secure phone number verification with TTL

### Data Validation
- Enum constraints for status fields
- Minimum/maximum value constraints
- Required field validation
- Unique constraints where appropriate
- Custom validation middleware

---

## Usage Notes

1. **Environment Variables**: Configure `MONGO_URI` for database connection
2. **S3 Configuration**: Required for image storage and cleanup
3. **Shiprocket API**: Needed for shipping and tracking functionality
4. **Razorpay Integration**: Required for payment processing
5. **Firebase**: Used for authentication and push notifications

This schema design supports a full-featured e-commerce platform with advanced inventory management, order processing, customer management, and marketing capabilities.