## Hero Price Check

Server-rendered Next.js experience for surfacing live vehicle pricing. Two model pages are available today:

- `/hero-splendor-plus/price-in-delhi` – commuter bike pricing, specs, reviews, and comparison tools.
- `/maruti-alto-k10/price-in-delhi` – compact hatchback pricing with matching feature set.

A dedicated comparison flow lives at `/compare/hero-splendor-plus-vs-maruti-alto-k10` for a side-by-side look.

## Requirements

- Node.js 18+
- MongoDB cluster with read access to a `prices` collection
- The following environment variables:
  - `MONGODB_URI` – connection string with credentials
  - `MONGODB_DB_NAME` – optional, defaults to `hero_price_check`

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file and set the MongoDB variables:

   ```bash
   MONGODB_URI="mongodb+srv://<user>:<password>@cluster.example.mongodb.net"
   MONGODB_DB_NAME="hero_price_check"
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Visit:
   - [http://localhost:3000/hero-splendor-plus/price-in-delhi](http://localhost:3000/hero-splendor-plus/price-in-delhi)
   - [http://localhost:3000/maruti-alto-k10/price-in-delhi](http://localhost:3000/maruti-alto-k10/price-in-delhi)
   - [http://localhost:3000/compare/hero-splendor-plus-vs-maruti-alto-k10](http://localhost:3000/compare/hero-splendor-plus-vs-maruti-alto-k10)

## Data Shape

Documents in the `prices` collection drive all pages. Fields marked optional can be omitted; the UI hides missing data gracefully.

```json
{
  "modelSlug": "hero-splendor-plus",
  "citySlug": "delhi",
  "city": "Delhi",
  "vehicleType": "bike",
  "brandName": "Hero",
  "modelName": "Splendor Plus",
  "currency": "INR",
  "priceDetails": [
    {
      "variant": "Drum Self Alloy",
      "exShowroomPrice": 78900,
      "registration": 4800,
      "insurance": 5200,
      "otherCharges": 1000,
      "onRoadPrice": 95600,
      "engineCc": 97.2,
      "power": "7.9 PS",
      "torque": "8.05 Nm",
      "mileage": "70 kmpl",
      "fuelType": "Petrol",
      "transmission": "4 Speed Manual",
      "colorOptions": ["Black with Red", "Matte Axis Grey"],
      "features": ["i3S idle stop-start", "Tubeless tyres", "Alloy wheels"],
      "kerbWeight": "112 kg",
      "fuelTankCapacity": "9.8 L",
      "brakeType": {
        "front": "130 mm Drum",
        "rear": "130 mm Drum"
      }
    },
    {
      "variant": "Drum Kick Alloy",
      "exShowroomPrice": 77200,
      "registration": 4500,
      "insurance": 5100,
      "otherCharges": 900,
      "onRoadPrice": 93800,
      "engineCc": 97.2,
      "power": "7.9 PS",
      "torque": "8.05 Nm",
      "mileage": "70 kmpl",
      "fuelType": "Petrol",
      "transmission": "4 Speed Manual",
      "colorOptions": ["Black with Purple", "Heavy Grey"],
      "features": ["Alloy wheels", "i3S idle stop-start"],
      "kerbWeight": "111 kg",
      "fuelTankCapacity": "9.8 L",
      "brakeType": {
        "front": "130 mm Drum",
        "rear": "130 mm Drum"
      }
    }
  ],
  "cityPrices": [
    { "citySlug": "delhi", "city": "Delhi", "onRoadPrice": 95600, "exShowroomPrice": 78900 },
    { "citySlug": "mumbai", "city": "Mumbai", "onRoadPrice": 98400 },
    { "citySlug": "bangalore", "city": "Bengaluru", "onRoadPrice": 100200 }
  ],
  "reviews": [
    {
      "author": "Abhishek Sharma",
      "rating": 4.5,
      "title": "Still the mileage king",
      "comment": "Daily commute of 45 km and the Splendor Plus is still delivering 65-70 kmpl. Suspension is soft but perfect for city roads.",
      "source": "Owner survey",
      "createdAt": "2024-09-15T05:30:00.000Z"
    },
    {
      "author": "Nidhi Verma",
      "rating": 4.0,
      "comment": "Lightweight and easy to park anywhere in Delhi traffic. Could use a disc brake option.",
      "source": "Dealership feedback",
      "createdAt": "2024-08-30T08:00:00.000Z"
    }
  ],
  "lastUpdatedAt": "2024-09-20T10:00:00.000Z",
  "sourceUrl": "https://www.heromotocorp.com"
}
```

Example document for the Maruti Alto K10 car page:

```json
{
  "modelSlug": "maruti-alto-k10",
  "citySlug": "delhi",
  "city": "Delhi",
  "vehicleType": "car",
  "brandName": "Maruti",
  "modelName": "Alto K10",
  "currency": "INR",
  "priceDetails": [
    {
      "variant": "VXi Plus AMT",
      "exShowroomPrice": 588000,
      "registration": 40000,
      "insurance": 26500,
      "otherCharges": 4500,
      "onRoadPrice": 659000,
      "engineCc": 998,
      "power": "66.6 bhp",
      "torque": "89 Nm",
      "mileage": "24.4 kmpl",
      "fuelType": "Petrol",
      "transmission": "5 Speed AMT",
      "colorOptions": ["Solid White", "Speedy Blue"],
      "features": ["7-inch SmartPlay Studio", "Dual airbags", "ABS with EBD"],
      "kerbWeight": "755 kg",
      "fuelTankCapacity": "27 L"
    },
    {
      "variant": "VXi Plus AMT CNG",
      "exShowroomPrice": 613000,
      "registration": 41000,
      "insurance": 27900,
      "otherCharges": 4500,
      "onRoadPrice": 682400,
      "engineCc": 998,
      "power": "55.9 bhp",
      "torque": "82.1 Nm",
      "mileage": "33.85 km/kg",
      "fuelType": "Petrol+CNG",
      "transmission": "5 Speed AMT",
      "colorOptions": ["Granite Grey", "Sizzling Red"],
      "features": ["Dual fuel selector", "Rear parking sensors", "Hill-hold assist"],
      "kerbWeight": "785 kg",
      "fuelTankCapacity": "55 L (CNG)"
    }
  ],
  "cityPrices": [
    { "citySlug": "delhi", "city": "Delhi", "onRoadPrice": 659000, "exShowroomPrice": 588000 },
    { "citySlug": "mumbai", "city": "Mumbai", "onRoadPrice": 684500 },
    { "citySlug": "bangalore", "city": "Bengaluru", "onRoadPrice": 697800 }
  ],
  "reviews": [
    {
      "author": "Ravi Kulkarni",
      "rating": 4.2,
      "title": "Efficient city runabout",
      "comment": "Automatic gearbox is smooth for traffic and the CNG kit keeps running costs low.",
      "source": "Owner review",
      "createdAt": "2024-09-10T06:00:00.000Z"
    },
    {
      "author": "Sneha Patel",
      "rating": 3.9,
      "comment": "Cabin plastics are basic but you get a touchscreen with Android Auto which is rare at this price.",
      "source": "Dealer follow-up",
      "createdAt": "2024-08-22T09:30:00.000Z"
    }
  ],
  "lastUpdatedAt": "2024-09-25T09:00:00.000Z",
  "sourceUrl": "https://www.marutisuzuki.com"
}
```

## Deployment

- Push changes to GitHub and connect the repository to Vercel.
- Configure the MongoDB environment variables in the Vercel project settings.
- Trigger a deploy; all dynamic routes are rendered server-side using `dynamic = "force-dynamic"` to keep pricing fresh.
