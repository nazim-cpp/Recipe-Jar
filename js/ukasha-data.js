/* ==========================================================================
   Recipe Jar — Recipe & Category Dataset (js/data.js)
   Each recipe object holds metadata used across the Home, Categories, Browse,
   Saved, and Recipe detail pages.
   ========================================================================== */

const recipes = [
  {
    id: 1,
    name: "Chicken Karahi",
    category: "Desi",
    cuisine: "Pakistani",
    time: 45,
    rating: 4.9,
    image: "images/chicken-karahi.png",
    alt: "Sizzling Chicken Karahi garnished with fresh ginger juliennes and coriander in a wok",
    ingredients: ["chicken", "tomatoes", "ginger", "garlic", "green chillies", "coriander"]
  },
  {
    id: 2,
    name: "Masala Omelette",
    category: "Breakfast",
    cuisine: "Pakistani",
    time: 15,
    rating: 4.7,
    image: "images/masala-omelette.png",
    alt: "Golden spiced Masala Omelette folded with diced onions, tomatoes, and fresh coriander",
    ingredients: ["eggs", "onion", "tomato", "green chillies", "turmeric", "coriander"]
  },
  {
    id: 3,
    name: "Lamb Biryani",
    category: "Desi",
    cuisine: "Pakistani",
    time: 75,
    rating: 4.9,
    image: "images/lamb-biryani.png",
    alt: "Fragrant layered Lamb Biryani with saffron basmati rice and caramelized onions",
    ingredients: ["lamb", "basmati rice", "yogurt", "onions", "saffron", "mint", "garam masala"]
  },
  {
    id: 4,
    name: "Daal Chawal",
    category: "Desi",
    cuisine: "Pakistani",
    time: 40,
    rating: 4.8,
    image: "images/daal-chawal.png",
    alt: "Comforting yellow lentil curry served over steamed white basmati rice with cumin tarka",
    ingredients: ["lentils", "rice", "garlic", "cumin", "turmeric", "ghee"]
  },
  {
    id: 5,
    name: "Aloo Paratha",
    category: "Breakfast",
    cuisine: "Pakistani",
    time: 30,
    rating: 4.8,
    image: "images/aloo-paratha.png",
    alt: "Crispy pan-fried Aloo Paratha stuffed with spiced mashed potatoes beside a bowl of yogurt",
    ingredients: ["wheat flour", "potatoes", "green chillies", "coriander", "butter", "cumin"]
  },
  {
    id: 6,
    name: "Chicken Shawarma",
    category: "Quick Meals",
    cuisine: "Middle Eastern",
    time: 25,
    rating: 4.7,
    image: "images/chicken-shawarma.png",
    alt: "Warm flatbread wrap filled with spiced grilled chicken, crisp lettuce, and garlic sauce",
    ingredients: ["chicken", "pita bread", "garlic sauce", "cucumber", "lettuce", "paprika"]
  },
  {
    id: 7,
    name: "Date & Nut Brownies",
    category: "Desserts",
    cuisine: "Continental",
    time: 50,
    rating: 4.9,
    image: "images/date-nut-brownies.png",
    alt: "Fudgy dark chocolate Date and Nut Brownies topped with toasted walnuts",
    ingredients: ["dates", "walnuts", "cocoa powder", "dark chocolate", "eggs", "butter"]
  },
  {
    id: 8,
    name: "Gajar Ka Halwa",
    category: "Desserts",
    cuisine: "Pakistani",
    time: 65,
    rating: 4.8,
    image: "images/gajar-ka-halwa.png",
    alt: "Warm carrot pudding Gajar Ka Halwa garnished with sliced pistachios and almonds",
    ingredients: ["carrots", "milk", "sugar", "cardamom", "ghee", "almonds", "pistachios"]
  },
  {
    id: 9,
    name: "Vegetable Pulao",
    category: "Desi",
    cuisine: "Pakistani",
    time: 40,
    rating: 4.6,
    image: "images/vegetable-pulao.png",
    alt: "Aromatic Vegetable Pulao cooked with basmati rice, green peas, carrots, and whole spices",
    ingredients: ["basmati rice", "peas", "carrots", "potatoes", "onion", "whole spices"]
  },
  {
    id: 10,
    name: "Chana Chaat",
    category: "Quick Meals",
    cuisine: "Pakistani",
    time: 15,
    rating: 4.7,
    image: "images/chana-chaat.png",
    alt: "Tangy Chana Chaat bowl with chickpeas, diced tomatoes, red onions, and tamarind chutney",
    ingredients: ["chickpeas", "onion", "tomato", "tamarind", "chaat masala", "coriander"]
  },
  {
    id: 11,
    name: "Shahi Tukray",
    category: "Desserts",
    cuisine: "Pakistani",
    time: 25,
    rating: 4.8,
    image: "images/shahi-tukray.png",
    alt: "Crisp golden bread pudding soaked in cardamom milk syrup and topped with slivered nuts",
    ingredients: ["bread", "milk", "sugar", "cardamom", "saffron", "pistachios"]
  },
  {
    id: 12,
    name: "Halwa Puri",
    category: "Breakfast",
    cuisine: "Pakistani",
    time: 55,
    rating: 4.9,
    image: "images/halwa-puri.png",
    alt: "Traditional weekend breakfast platter of puffed golden puris, sweet suji halwa, and chana",
    ingredients: ["flour", "semolina", "chickpeas", "sugar", "cardamom", "oil"]
  },
  {
    id: 13,
    name: "Nihari",
    category: "Desi",
    cuisine: "Pakistani",
    time: 120,
    rating: 4.9,
    image: "images/nihari.png",
    alt: "Slow-simmered beef Nihari in a rich spiced gravy topped with fresh ginger and lemon",
    ingredients: ["beef", "ginger", "garlic", "fennel", "garam masala", "wheat flour"]
  },
  {
    id: 14,
    name: "Haleem",
    category: "Desi",
    cuisine: "Pakistani",
    time: 90,
    rating: 4.8,
    image: "images/haleem.png",
    alt: "Velvety slow-cooked lentil and meat Haleem garnished with fried onions and coriander",
    ingredients: ["wheat", "lentils", "beef", "onions", "ginger", "chaat masala"]
  },
  {
    id: 15,
    name: "Shami Kebab",
    category: "Quick Meals",
    cuisine: "Pakistani",
    time: 35,
    rating: 4.7,
    image: "images/shami-kebab.png",
    alt: "Pan-seared spiced beef and chana daal Shami Kebabs served with mint chutney",
    ingredients: ["minced beef", "chana daal", "egg", "cumin", "coriander", "ginger"]
  },
  {
    id: 16,
    name: "Shish Tawook",
    category: "Quick Meals",
    cuisine: "Middle Eastern",
    time: 25,
    rating: 4.8,
    image: "images/shish-tawook.png",
    alt: "Char-grilled marinated chicken skewers served with flatbread and garlic dip",
    ingredients: ["chicken breast", "yogurt", "lemon", "garlic", "paprika", "olive oil"]
  },
  {
    id: 17,
    name: "Hummus Bowl",
    category: "Quick Meals",
    cuisine: "Middle Eastern",
    time: 10,
    rating: 4.6,
    image: "images/hummus-bowl.png",
    alt: "Creamy chickpea Hummus Bowl drizzled with olive oil, paprika, and warm pita wedges",
    ingredients: ["chickpeas", "tahini", "lemon", "garlic", "olive oil", "paprika"]
  },
  {
    id: 18,
    name: "Za'atar Manakish",
    category: "Breakfast",
    cuisine: "Middle Eastern",
    time: 25,
    rating: 4.7,
    image: "images/zaatar-manakish.png",
    alt: "Warm baked flatbread topped with fragrant za'atar herb blend and olive oil",
    ingredients: ["flour", "za'atar", "olive oil", "sesame seeds", "yeast", "salt"]
  },
  {
    id: 19,
    name: "Club Sandwich",
    category: "Quick Meals",
    cuisine: "Continental",
    time: 15,
    rating: 4.6,
    image: "images/club-sandwich.png",
    alt: "Triple-decker toasted Club Sandwich layered with grilled chicken, egg, and crisp lettuce",
    ingredients: ["bread", "chicken", "eggs", "lettuce", "tomato", "mayonnaise"]
  },
  {
    id: 20,
    name: "Pasta Alfredo",
    category: "Quick Meals",
    cuisine: "Continental",
    time: 25,
    rating: 4.7,
    image: "images/pasta-alfredo.png",
    alt: "Creamy fettuccine Pasta Alfredo tossed with garlic parmesan sauce and black pepper",
    ingredients: ["fettuccine", "cream", "parmesan", "butter", "garlic", "black pepper"]
  },
  {
    id: 21,
    name: "Pancakes",
    category: "Breakfast",
    cuisine: "Continental",
    time: 20,
    rating: 4.8,
    image: "images/pancakes.png",
    alt: "Stack of fluffy golden Pancakes topped with butter, berries, and maple syrup",
    ingredients: ["flour", "milk", "eggs", "butter", "sugar", "baking powder"]
  },
  {
    id: 22,
    name: "Chocolate Lava Cake",
    category: "Desserts",
    cuisine: "Continental",
    time: 25,
    rating: 4.9,
    image: "images/chocolate-lava-cake.png",
    alt: "Warm Chocolate Lava Cake dusted with powdered sugar and flowing molten center",
    ingredients: ["dark chocolate", "butter", "eggs", "sugar", "flour", "vanilla"]
  }
];

/* Category metadata for the Explorer page */
const categories = [
  {
    name: "Breakfast",
    description: "Warm morning classics from crispy parathas to fluffy pancakes.",
    image: "images/pancakes.png",
    alt: "Stack of fluffy golden Pancakes with butter and maple syrup"
  },
  {
    name: "Desi",
    description: "Rich home-style curries, fragrant biryanis, and slow-cooked favourites.",
    image: "images/lamb-biryani.png",
    alt: "Fragrant layered Lamb Biryani with saffron basmati rice and caramelized onions"
  },
  {
    name: "Desserts",
    description: "Traditional mithai and warm chocolate bakes for every sweet tooth.",
    image: "images/gajar-ka-halwa.png",
    alt: "Warm Gajar Ka Halwa dessert topped with almonds and pistachios"
  },
  {
    name: "Quick Meals",
    description: "Tasty wraps, chaat, and skillet dinners ready in minimal time.",
    image: "images/club-sandwich.png",
    alt: "Triple-decker toasted Club Sandwich layered with chicken and crisp lettuce"
  }
];

/* Cuisine metadata for the Explorer page */
const cuisines = [
  {
    name: "Pakistani",
    description: "Aromatic spices, comforting lentils, and celebratory rice dishes.",
    image: "images/lamb-biryani.png",
    alt: "Fragrant Pakistani Lamb Biryani with saffron rice"
  },
  {
    name: "Middle Eastern",
    description: "Char-grilled skewers, creamy tahini dips, and herb-baked breads.",
    image: "images/shish-tawook.png",
    alt: "Middle Eastern Shish Tawook grilled chicken skewers"
  },
  {
    name: "Continental",
    description: "Creamy pastas, cafe-style sandwiches, and rich baked treats.",
    image: "images/pasta-alfredo.png",
    alt: "Creamy Continental Pasta Alfredo in a bowl"
  }
];
