## Hero Price Check

Server-rendered Next.js experience for surfacing live Hero Splendor Plus pricing in Delhi. The `/hero-splendor-plus/price-in-delhi` route performs an SSR MongoDB lookup and renders a responsive, Tailwind-styled pricing dashboard with SEO-friendly metadata.

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

4. Visit [http://localhost:3000/hero-splendor-plus/price-in-delhi](http://localhost:3000/hero-splendor-plus/price-in-delhi).

## Data Shape

The page expects documents shaped like below in the `prices` collection:

```json
{
  "modelSlug": "hero-splendor-plus",
  "citySlug": "delhi",
  "city": "Delhi",
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
      "colorOptions": ["Black with Red", "Matte Axis Grey"] ,
      "features": ["i3S idle stop-start", "Tubeless tyres", "Alloy wheels"],
      "kerbWeight": "112 kg",
      "fuelTankCapacity": "9.8 L",
      "brakeType": {
        "front": "130 mm Drum",
        "rear": "130 mm Drum"
      }
    }
  ],
  "lastUpdatedAt": "2024-09-20T10:00:00.000Z",
  "sourceUrl": "https://www.heromotocorp.com"
}
```

Fields such as registration, insurance, other charges, kerb weight, fuel tank capacity, brake details, and colour options are optional. Omit them if the data is unavailable and the UI will hide the corresponding sections.

## Deployment

- Push changes to GitHub and connect the repository to Vercel.
- Configure the MongoDB environment variables in the Vercel project settings.
- Trigger a deploy; the `/hero-splendor-plus/price-in-delhi` page renders server-side on every request via `dynamic = "force-dynamic"`.
