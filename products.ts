export interface ProductSpec {
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number; // original price
  price: number; // selling price
  images: string[];
  category: string;
  inStock: boolean;
  avgRating: number;
  numReviews: number;
  isAssured: boolean; // badge
  specs: ProductSpec;
  emiOption: string;
  bankOffer: string;
}

export const INDIAN_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Apple iPhone 15 Pro Max (256 GB) - Blue Titanium",
    description: "The ultimate iPhone. Featuring a strong and light aerospace-grade titanium design with textured matte-glass back. It also features an incredibly powerful A17 Pro chip and a versatile camera system.",
    mrp: 159900,
    price: 139900,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
      "https://images.unsplash.com/photo-1695048133206-8c90352efdf1?w=600&q=80"
    ],
    category: "Mobiles",
    inStock: true,
    avgRating: 4.8,
    numReviews: 1240,
    isAssured: true,
    specs: {
      "Display": "6.7-inch Super Retina XDR OLED",
      "Processor": "A17 Pro chip with 6-core GPU",
      "Camera": "48MP Main | 12MP Ultra Wide | 12MP 5x Telephoto",
      "Battery": "Up to 29 hours video playback",
      "Storage": "256 GB",
      "Weight": "221g"
    },
    emiOption: "₹6,778/month with No Cost EMI",
    bankOffer: "Flat ₹5,000 Instant Discount on HDFC Bank Credit Cards"
  },
  {
    id: "prod_2",
    name: "Samsung Galaxy S24 Ultra (512 GB) - Titanium Gray",
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility starting with the most important device in your life.",
    mrp: 144999,
    price: 129999,
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80"
    ],
    category: "Mobiles",
    inStock: true,
    avgRating: 4.7,
    numReviews: 980,
    isAssured: false,
    specs: {
      "Display": "6.8-inch Dynamic AMOLED 2X, QHD+",
      "Processor": "Snapdragon 8 Gen 3 for Galaxy",
      "Camera": "200MP Main | 50MP + 10MP Telephoto | 12MP Ultra Wide",
      "Battery": "5000 mAh with 45W fast charging",
      "Storage": "512 GB",
      "S-Pen": "Included in-box"
    },
    emiOption: "₹6,299/month with No Cost EMI",
    bankOffer: "Flat ₹4,500 Instant Discount on OneCard Credit Cards"
  },
  {
    id: "prod_3",
    name: "Apple MacBook Air M3 Laptop (13.6-inch, 8GB, 256GB SSD) - Starlight",
    description: "The M3 chip makes the super-portable MacBook Air even more capable. With up to 18 hours of battery life, you can take it anywhere and breeze through work, play and everything in between.",
    mrp: 114900,
    price: 99990,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80"
    ],
    category: "Laptops",
    inStock: true,
    avgRating: 4.6,
    numReviews: 420,
    isAssured: true,
    specs: {
      "Processor": "Apple M3 Chip (8-core CPU, 8-core GPU)",
      "RAM": "8 GB Unified Memory",
      "Storage": "256 GB superfast SSD",
      "Display": "13.6-inch Liquid Retina display with True Tone",
      "Battery Life": "Up to 18 hours",
      "OS": "macOS Sonoma"
    },
    emiOption: "₹4,847/month with No Cost EMI",
    bankOffer: "10% Instant Discount up to ₹3,000 on ICICI Bank Cards"
  },
  {
    id: "prod_4",
    name: "OnePlus 55 inches Y1S Pro 4K Ultra HD Smart LED TV",
    description: "Experience smart, cinematic visuals with OnePlus TV Y1S Pro. Smart cast, incredible Dolby Audio speakers, and oxygenPlay 2.0 give you the perfect family entertainment hub.",
    mrp: 49999,
    price: 37999,
    images: [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80",
      "https://images.unsplash.com/photo-1552533880-12f56d490819?w=600&q=80"
    ],
    category: "TVs",
    inStock: true,
    avgRating: 4.3,
    numReviews: 2340,
    isAssured: false,
    specs: {
      "Resolution": "4K Ultra HD (3840x2160) | 60Hz",
      "Sound": "24W Output with Dolby Audio, Dolby Atmos Decoding",
      "Connectivity": "3 HDMI | 2 USB | Dual-band Wi-Fi",
      "Smart TV": "Android TV 11 | OnePlus Connect 2.0",
      "Display Panel": "Bezel-less Design | HDR10+ | MEMC"
    },
    emiOption: "₹1,842/month with No Cost EMI",
    bankOffer: "10% Instant Discount up to ₹1,500 on SBI Credit Cards"
  },
  {
    id: "prod_5",
    name: "Levi's Men's 511 Slim Fit Premium Stretch Jeans",
    description: "A modern slim with room to move. The 511 Slim Fit Stretch Jeans are a classic since day one, perfect for casual outings paired with your favorite shirt or hoodie.",
    mrp: 4399,
    price: 2199,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80"
    ],
    category: "Fashion",
    inStock: true,
    avgRating: 4.1,
    numReviews: 1205,
    isAssured: true,
    specs: {
      "Material": "99% Cotton, 1% Elastane",
      "Fit": "Slim Fit, sits below waist",
      "Stretch": "Slight stretch for comfort",
      "Care Instructions": "Machine Wash Warm"
    },
    emiOption: "₹106/month EMI options available",
    bankOffer: "Extra 10% off on purchase of 2 or more fashion items"
  },
  {
    id: "prod_6",
    name: "Puma Unisex-Adult Smashic Low-Top Sneakers",
    description: "Puma Smashic is the latest update to the classic court style. Clean retro vibes meet ultimate comfort with premium soft cushioning for daily commutes.",
    mrp: 3999,
    price: 1899,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
    ],
    category: "Fashion",
    inStock: true,
    avgRating: 4.2,
    numReviews: 850,
    isAssured: false,
    specs: {
      "Upper Material": "Premium Synthetic Leather",
      "Sole": "Non-marking Rubber outsole",
      "Insole": "SoftFoam+ optimal comfort sockliner",
      "Warranty": "3 Months against manufacturing defects"
    },
    emiOption: "₹92/month EMI options available",
    bankOffer: "Extra 5% cashback on Flipkart Axis Bank Credit Card"
  },
  {
    id: "prod_7",
    name: "Dyson V12 Detect Slim Cordless Vacuum Cleaner",
    description: "Dyson's most powerful, lightweight cordless vacuum with laser illumination. Engineered for deep whole-home cleaning with advanced cyclonic filtration.",
    mrp: 55900,
    price: 45900,
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80"
    ],
    category: "Appliances",
    inStock: true,
    avgRating: 4.5,
    numReviews: 180,
    isAssured: true,
    specs: {
      "Suction Power": "150 Air Watts",
      "Weight": "2.2 kg lightweight design",
      "Run Time": "Up to 60 minutes",
      "Filtration": "99.99% efficiency down to 0.3 microns",
      "Bin Volume": "0.38 Litres"
    },
    emiOption: "₹2,225/month with No Cost EMI",
    bankOffer: "Flat ₹2,000 Instant Discount on HDFC Credit/Debit EMI"
  },
  {
    id: "prod_8",
    name: "The Alchemist by Paulo Coelho (Special Edition)",
    description: "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined.",
    mrp: 399,
    price: 299,
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80"
    ],
    category: "Books",
    inStock: true,
    avgRating: 4.6,
    numReviews: 45600,
    isAssured: false,
    specs: {
      "Author": "Paulo Coelho",
      "Language": "English",
      "Binding": "Paperback",
      "Pages": "172",
      "Publisher": "HarperCollins India"
    },
    emiOption: "No Cost EMI not applicable",
    bankOffer: "Buy 3 books and get 15% discount on checkout"
  },
  {
    id: "prod_9",
    name: "Happilo Premium California Almonds 500g Pack",
    description: "Happilo premium raw almonds are handpicked California almonds. Highly nutritious and loaded with healthy fats, antioxidants, vitamins, and minerals.",
    mrp: 675,
    price: 425,
    images: [
      "https://images.unsplash.com/photo-1508061253366-f7da158b6af9?w=600&q=80"
    ],
    category: "Grocery",
    inStock: true,
    avgRating: 4.4,
    numReviews: 8900,
    isAssured: true,
    specs: {
      "Weight": "500 Grams",
      "Type": "Raw Almonds (Badam)",
      "Dietary Claim": "Gluten Free, High Protein, Low Sodium",
      "Shelf Life": "12 Months"
    },
    emiOption: "EMI not available for grocery",
    bankOffer: "Flat 10% off on minimum purchase of ₹999 from Happilo"
  },
  {
    id: "prod_10",
    name: "Lakme Absolute Liquid Matte Lipstick - Pink Fantasy",
    description: "Get intense, weightless, and velvety matte lips that stay transfer-proof and gorgeous for up to 16 hours. Enriched with natural oils.",
    mrp: 850,
    price: 649,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80"
    ],
    category: "Beauty",
    inStock: true,
    avgRating: 4.0,
    numReviews: 430,
    isAssured: false,
    specs: {
      "Shade": "Pink Fantasy 05",
      "Finish": "Rich Matte",
      "Weight": "4.5 ml",
      "Waterproof": "Yes, Smudge proof"
    },
    emiOption: "EMI not available",
    bankOffer: "Buy beauty products worth ₹1,200, get a free pouch"
  },
  {
    id: "prod_11",
    name: "LEGO Technic Corvette ZR1 Supercar Building Set",
    description: "Build your own supercar with working steering, detailed V8 engine, moving pistons, and authentic high-contrast orange-black color scheme.",
    mrp: 5999,
    price: 4999,
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80"
    ],
    category: "Toys",
    inStock: true,
    avgRating: 4.7,
    numReviews: 310,
    isAssured: true,
    specs: {
      "Age Limit": "9 Years and Above",
      "Total Pieces": "579 pieces",
      "Model Type": "2-in-1 (Rebuilds into a Hot Rod)",
      "Dimensions": "3\" H x 11\" L x 4\" W"
    },
    emiOption: "₹242/month EMI option",
    bankOffer: "10% Instant Discount on Axis Bank Buzz Credit Card"
  },
  {
    id: "prod_12",
    name: "Nivia Storm Football - Match Size 5 (Yellow)",
    description: "Hand-stitched rubberized soccer football designed for maximum durability and training. High-bounce latex bladder provides excellent shape retention.",
    mrp: 699,
    price: 449,
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80"
    ],
    category: "Sports",
    inStock: true,
    avgRating: 4.1,
    numReviews: 12300,
    isAssured: false,
    specs: {
      "Size": "5 (Standard Match)",
      "Outer Material": "Heavy Duty Rubberized Core",
      "Panels": "32 panels hand sewn",
      "Suitable for": "Rough concrete, grass, astroturf"
    },
    emiOption: "EMI not available",
    bankOffer: "Get extra 5% off on Nivia training kits"
  }
];

// --- DYNAMIC EXPANDER FOR 100+ PRODUCTS ---
const extraCategories = [
  {
    category: "Mobiles",
    names: [
      "Realme Narzo 70 Pro 5G", "Redmi Note 13 5G", "OnePlus Nord CE4 5G", "Nothing Phone (2a) 5G",
      "Vivo T3 5G (Crystal Flake)", "POCO X6 Neo 5G", "Motorola Edge 50 Fusion", "IQOO Z9 5G",
      "Samsung Galaxy M35 5G", "Honor X9b 5G Dual SIM"
    ],
    mrp: [24999, 20999, 27999, 29999, 22999, 19999, 25999, 24999, 24499, 32999],
    price: [19999, 16999, 24999, 23999, 19999, 15999, 22999, 19999, 19999, 25999],
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80"
    ],
    specs: {
      "Display": "6.67-inch FHD+ 120Hz AMOLED",
      "Processor": "MediaTek Dimensity 7200 / Snapdragon 7s Gen 2",
      "Camera": "50MP Sony LYT-600 OIS Main Camera",
      "Battery": "5000 mAh Battery with 45W/80W charging",
      "Storage": "8 GB RAM | 128 GB ROM",
      "OS": "Latest Android with custom UI skin"
    }
  },
  {
    category: "Laptops",
    names: [
      "Lenovo IdeaPad Slim 3 Intel Core i3", "HP Laptop 15s Ryzen 5 5500U", "Dell 15 Thin & Light Core i5",
      "ASUS Vivobook 15 Core i3 12th Gen", "Acer Aspire Lite Core i5 12th Gen", "Xiaomi Notebook Ultra 3K Display",
      "Infinix INBook Y1 Plus Ryzen 3", "Apple MacBook Pro M3 Pro (16-inch)", "MSI Thin GF63 Gaming Laptop",
      "Samsung Galaxy Book4 Intel Core i5"
    ],
    mrp: [45990, 54990, 68990, 49990, 59990, 76999, 35999, 249900, 78990, 84990],
    price: [33990, 42490, 49990, 36990, 44990, 56999, 24999, 219900, 54990, 69990],
    images: [
      "https://images.unsplash.com/photo-1496181130204-755241524eab?w=600&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80",
      "https://images.unsplash.com/photo-1603302576837-37561b2fe536?w=600&q=80"
    ],
    specs: {
      "Processor": "Intel Core / AMD Ryzen High-Speed CPU",
      "RAM": "8GB / 16GB DDR4 High Speed",
      "Storage": "512 GB PCIe NVMe M.2 SSD",
      "Display": "15.6-inch FHD Antiglare Display",
      "Battery": "Up to 7 hours of standard workspace usage",
      "OS": "Windows 11 Home"
    }
  },
  {
    category: "TVs",
    names: [
      "Xiaomi 32 inches A Series HD Smart Google TV", "Samsung 43 inches Crystal 4K Vivid Ultra HD TV",
      "LG 32 inches HD Ready Smart LED TV", "TCL 55 inches Metallic 4K Google TV",
      "Sony Bravia 55 inches 4K Ultra HD Smart LED TV", "Acer 40 inches Advanced I Series Full HD TV",
      "Kodak 43 inches Matrix Series 4K Google TV", "iFFALCON 50 inches Ultra HD 4K LED TV",
      "Vu 55 inches GloLED Series 4K Smart TV", "Hisense 43 inches Bezel-Less 4K Google TV"
    ],
    mrp: [24999, 44900, 21990, 65990, 84900, 29999, 33999, 47990, 49990, 39990],
    price: [12999, 29990, 14990, 31990, 57990, 16999, 19999, 23999, 33999, 22990],
    images: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80",
      "https://images.unsplash.com/photo-1552533880-12f56d490819?w=600&q=80"
    ],
    specs: {
      "Resolution": "UHD 4K (3840 x 2160) screen panel",
      "Sound Output": "24 Watts Dolby Audio Speaker setup",
      "Smart Interface": "Google TV OS with App Store",
      "Ports": "3 HDMI | 2 USB | Dual-band WiFi",
      "Refresh Rate": "60 Hertz refresh rate"
    }
  },
  {
    category: "Fashion",
    names: [
      "Peter England Men's Slim Fit Formal Shirt", "US Polo Assn Men's Cotton Polo T-Shirt",
      "Allen Solly Men's Cotton Chino Trousers", "Van Heusen Men's Solid Cotton Boxer Pack",
      "Biba Women's Printed Cotton Kurta Palazzo Set", "W for Woman Printed Straight Fit Kurta",
      "Adidas Men's running Standard Shorts", "Woodland Men's Premium Leather Casual Shoes",
      "Red Tape Men's High-Top Air Cushion Sneakers", "Lavie Women's Premium Faux Leather Tote Handbag"
    ],
    mrp: [1999, 1799, 2999, 1199, 4999, 3299, 1899, 4595, 5999, 3999],
    price: [999, 899, 1499, 699, 2399, 1499, 949, 2999, 1799, 1299],
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80"
    ],
    specs: {
      "Material": "Premium Breathable Fine Cotton Blend",
      "Fit Type": "Regular / Slim fit design",
      "Style Variant": "Classic design",
      "Washing Care": "Gentle Machine Wash"
    }
  },
  {
    category: "Appliances",
    names: [
      "LG 8 Kg 5 Star Smart Inverter Washing Machine", "Samsung 236 L 3 Star Double Door Refrigerator",
      "Philips HD9200/90 Air Fryer 4.1 Litre", "Bajaj New Majesty 16-Litre Oven Toaster Griller",
      "Havells Instanio 3-Litre Instant Water Heater", "Kent Grand+ Alkaline RO Water Purifier",
      "Crompton SilentPro Enso Smart Ceiling Fan", "Panasonic 1.5 Ton 5 Star Split AC (Copper)",
      "Morphy Richards 20 L Solo Microwave Oven", "Prestige Iris Plus 750 W Mixer Grinder (3 Jars)"
    ],
    mrp: [28990, 32990, 9999, 6999, 5890, 21000, 9490, 55000, 8999, 5995],
    price: [19990, 25490, 5999, 3999, 3499, 14999, 5999, 36990, 5499, 3199],
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80"
    ],
    specs: {
      "Capacity": "Standard family sizing specs",
      "Power Rating": "Energy efficient Star ratings",
      "Body Material": "Rust-proof durable exterior",
      "Warranty Details": "1 Year Manufacturer Protection"
    }
  },
  {
    category: "Books",
    names: [
      "Atomic Habits by James Clear", "Rich Dad Poor Dad by Robert Kiyosaki",
      "The Psychology of Money by Morgan Housel", "Ikigai: The Japanese Secret to a Long Life",
      "Sapiens: A Brief History of Humankind", "Do It Today by Darius Foroux",
      "Man's Search for Meaning by Viktor Frankl", "The Power of Your Subconscious Mind",
      "Think and Grow Rich by Napoleon Hill", "Quiet: The Power of Introverts in a World"
    ],
    mrp: [799, 599, 499, 550, 699, 399, 450, 299, 350, 650],
    price: [499, 349, 299, 320, 449, 249, 280, 149, 199, 399],
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80"
    ],
    specs: {
      "Format": "Paperback / Soft Cover prints",
      "Publishers": "Penguin / HarperCollins Books",
      "Language": "English International Edition",
      "Genre": "Self-Help / Business / Philosophy"
    }
  },
  {
    category: "Grocery",
    names: [
      "Tata Salt Lite 1kg Pack (Low Sodium)", "Aashirvaad Shudh Chakki Atta 5kg Pack",
      "Fortune Soya Health Refined Oil 1L", "Dettol Liquid Handwash Refill 1500ml",
      "Surf Excel Easy Wash Detergent Powder 3kg", "Taj Mahal Tea 1kg Carton Pack",
      "Nescafe Classic Instant Coffee Powder 100g Jar", "Amul Cow Ghee 1L Tin Pack",
      "Cadbury Dairy Milk Silk Chocolate 150g", "Disano Extra Virgin Olive Oil 1L Bottle"
    ],
    mrp: [50, 275, 175, 349, 650, 850, 350, 750, 180, 1299],
    price: [44, 245, 135, 279, 499, 649, 289, 625, 150, 749],
    images: [
      "https://images.unsplash.com/photo-1610832958506-ee5633619144?w=600&q=80"
    ],
    specs: {
      "Item Weight": "Packaged premium standard volumes",
      "Storage Info": "Store in dry hygienic location",
      "Dietary Specs": "100% Vegetarian standard",
      "Shelf Life": "6 to 12 months"
    }
  },
  {
    category: "Beauty",
    names: [
      "Nivea Soft Light Moisturizing Cream 300ml", "L'Oreal Paris Extraordinary Hair Serum 100ml",
      "Maybelline New York Fit Me Foundation", "Mamaearth Onion Hair Fall Control Shampoo",
      "Cetaphil Gentle Skin Cleanser 250ml", "The Derma Co 10% Niacinamide Serum 30ml",
      "Plum Green Tea Pore Cleansing Face Wash", "MCaffeine Coffee Face Scrub 100g Pack",
      "Minimalist 2% Salicylic Acid Serum", "Vaseline Intensive Care Deep Moisture Body Lotion"
    ],
    mrp: [449, 649, 699, 399, 425, 599, 349, 399, 549, 399],
    price: [315, 499, 489, 339, 360, 499, 279, 299, 499, 299],
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"
    ],
    specs: {
      "Product Form": "Dermatologically tested",
      "Skin/Hair Type": "Suitable for all common skin variants",
      "Benefits": "Instantly nourishes and deeply cleanses",
      "Scent": "Pleasant fragrance extract"
    }
  },
  {
    category: "Toys",
    names: [
      "Hot Wheels 5-Car Gift Pack Assortment", "Fisher-Price Baby's First Blocks Shape Sorter",
      "Funskool Giggles Nesting Eggs Toy Set", "Monopoly Deluxe Board Game Classic Edition",
      "Smartivity Hydraulic Crane STEM Toy Builder", "Einstein Box Science Experiments Kit for Kids",
      "Nerf Elite 2.0 Commander RD-6 Blaster", "Shumee Wooden Activity Triangle Maze",
      "Soft Plush Jumbo Teddy Bear 3 Feet", "Rubik's Classic 3x3 Magnetic Speed Cube"
    ],
    mrp: [849, 599, 399, 1499, 1299, 999, 1299, 1999, 1499, 699],
    price: [699, 499, 299, 1199, 999, 749, 999, 1499, 899, 499],
    images: [
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&q=80"
    ],
    specs: {
      "Material": "100% Non-Toxic Child Safe Plastic/Wood",
      "Age Grade": "Recommended for kids aged 3 years and above",
      "Skills Learnt": "Cognitive development, motor skills",
      "Included Items": "Full set complete guide"
    }
  },
  {
    category: "Sports",
    names: [
      "Decathlon Quechua Hiking Backpack 10L", "Yonex ZR 100 Light Aluminium Badminton Racket",
      "Strauss Yoga Mat Premium Double-Sided 6mm", "Nivia Heavy Tennis Ball Box (Pack of 6)",
      "SG Scorer Classic Kashmir Willow Cricket Bat", "Vector X Dynamo Skipping Rope with Counter",
      "Spalding NBA Highlight Outdoor Basketball Size 7", "Nivia Orthopaedic Knee Support Sleeve Pack",
      "Kore 20 Kg Home Gym Kettlebell Dumbbell Set", "Firefox Bad Attitude 26T Hardtail Cycle"
    ],
    mrp: [399, 1200, 1199, 540, 3199, 399, 1899, 499, 4999, 15000],
    price: [249, 799, 599, 399, 1899, 249, 1199, 299, 2199, 10999],
    images: [
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=80"
    ],
    specs: {
      "Material Composition": "High structural durability core material",
      "Suitability": "Designed for indoor & outdoor professional use",
      "Grip & Finish": "Non-slip ergonomic grip comfort texture",
      "Warranty Policy": "6 Months standard brand replacement guarantee"
    }
  }
];

let generatedCount = 0;
extraCategories.forEach((catObj) => {
  catObj.names.forEach((name, idx) => {
    generatedCount++;
    const mrp = catObj.mrp[idx];
    const price = catObj.price[idx];
    const isAssured = generatedCount % 2 === 0;
    const avgRating = parseFloat((4.0 + (idx % 10) * 0.1).toFixed(1));
    const numReviews = (idx + 1) * 312 + 54;
    
    const customSpecs = { ...catObj.specs };
    customSpecs["Model Number"] = `SB-${catObj.category.slice(0,3).toUpperCase()}-${100 + idx}`;
    
    INDIAN_PRODUCTS.push({
      id: `generated_prod_${generatedCount}`,
      name,
      description: `${name} is a top-tier retail offering curated specifically for value and high performance. Built under rigorous standards to ensure quality, it matches active Indian household budgets beautifully with robust material and reliable support.`,
      mrp,
      price,
      images: [catObj.images[idx % catObj.images.length]],
      category: catObj.category,
      inStock: true,
      avgRating,
      numReviews,
      isAssured,
      specs: customSpecs,
      emiOption: price > 3000 ? `₹${Math.round(price / 12)}/month with No Cost EMI` : "EMI not applicable",
      bankOffer: `Flat 10% off up to ₹1,500 on major credit cards`
    });
  });
});

// --- SPECIFIC TRENDING GADGET PRODUCTS FOR SCREENSHOT LAYOUT ---
export const TRENDING_DEALS_PRODUCTS: Product[] = [
  {
    id: "trending_gadget_1",
    name: "Oppo Enco Air3 True Wireless Earbuds",
    description: "Experience professional acoustic quality with 13.4mm dynamic drivers, Bluetooth 5.3 ultra-low latency, and up to 25 hours of battery life with high-speed flash charging. Engineered in a stunning semi-translucent jelly case design.",
    mrp: 3999,
    price: 1999,
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80"],
    category: "Mobiles",
    inStock: true,
    avgRating: 4.4,
    numReviews: 1420,
    isAssured: true,
    specs: {
      "Driver Size": "13.4 mm Dynamic Driver",
      "Connectivity": "Bluetooth 5.3 with dual-device connection",
      "Battery Life": "Up to 25 hours total playback time",
      "Water Resistance": "IP54 Dust and Water Resistant rating"
    },
    emiOption: "EMI not applicable",
    bankOffer: "Flat 10% instant discount with Federal Bank Card"
  },
  {
    id: "trending_gadget_2",
    name: "OnePlus Bullets Wireless Z2 Bluetooth Neckband",
    description: "The ultimate neckband with a massive 12.4mm bass driver, bombastic sound, and 10 minutes of charge for 20 hours of pure immersive acoustic playback. Styled in deep obsidian black with magnetic instant-control buds.",
    mrp: 2299,
    price: 1499,
    images: ["https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=600&q=80"],
    category: "Mobiles",
    inStock: true,
    avgRating: 4.3,
    numReviews: 3200,
    isAssured: true,
    specs: {
      "Driver": "12.4mm Super Bass Driver",
      "Playback": "Up to 30 hours total life on a single charge",
      "Fast Charge": "10-minute charge delivers 20 hours play",
      "Water Resistance": "IP55 Sweat and Water Resistant"
    },
    emiOption: "EMI not applicable",
    bankOffer: "Flat ₹150 off with SBI Pay UPI transactions"
  },
  {
    id: "trending_gadget_3",
    name: "Fire-Boltt Phoenix Smartwatch with BT Calling",
    description: "Keep tracking your life with a vibrant 1.43\" AMOLED display, stainless steel bezel body, over 120 custom sports modes, precise heart-rate monitoring, and crystal-clear direct Bluetooth calling speaker and microphone setup.",
    mrp: 4999,
    price: 1799,
    images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80"],
    category: "Mobiles",
    inStock: true,
    avgRating: 4.5,
    numReviews: 890,
    isAssured: true,
    specs: {
      "Screen Size": "1.43-inch High Contrast AMOLED Panel",
      "Calling": "Direct Bluetooth calling with speaker and mic",
      "Sensors": "Heart Rate, SpO2, Sleep, Step Counter trackers",
      "Battery": "Up to 7 days standard standby duration"
    },
    emiOption: "EMI not applicable",
    bankOffer: "Extra 5% off on HDFC Cards"
  },
  {
    id: "trending_gadget_4",
    name: "Philips Multi-Grooming Cordless Beard Trimmer",
    description: "Perfect grooming companion with self-sharpening skin-friendly steel blades, 12 length lock-in settings, cordless run time of up to 60 minutes, and washable attachments for effortless cleanliness and maintenance.",
    mrp: 2499,
    price: 1199,
    images: ["https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&q=80"],
    category: "Appliances",
    inStock: true,
    avgRating: 4.2,
    numReviews: 1104,
    isAssured: true,
    specs: {
      "Blades": "Self-sharpening skin-safe titanium steel blades",
      "Length Settings": "0.5mm to 10mm settings with 12 steps",
      "Run Time": "Up to 60 minutes of cord-free runtime",
      "Cleanliness": "Rinsable and fully washable dynamic attachments"
    },
    emiOption: "EMI not applicable",
    bankOffer: "Save 10% up to ₹500 using IDFC First cards"
  }
];

TRENDING_DEALS_PRODUCTS.forEach(p => {
  // Check to avoid duplicates just in case
  if (!INDIAN_PRODUCTS.some(existing => existing.id === p.id)) {
    INDIAN_PRODUCTS.push(p);
  }
});

