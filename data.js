/* ==========================================================================
   Recipe Jar — Recipe Dataset (js/data.js)
   Each recipe object holds metadata used across the Home, Browse, Saved,
   and Recipe detail pages.
   ========================================================================== */

const recipes = [
  {
    id: 1,
    name: "Chicken Karahi",
    category: "Desi",
    time: 45,
    rating: 4.9,
    image: "images/chicken-karahi.jpg",
    alt: "Sizzling Chicken Karahi garnished with fresh ginger juliennes and coriander in a wok",
    ingredients: ["chicken", "tomatoes", "ginger", "garlic", "green chillies", "coriander"]
  },
  {
    id: 2,
    name: "Masala Omelette",
    category: "Breakfast",
    time: 15,
    rating: 4.7,
    image: "images/masala-omelette.jpg",
    alt: "Golden spiced Masala Omelette folded with diced onions, tomatoes, and fresh coriander",
    ingredients: ["eggs", "onion", "tomato", "green chillies", "turmeric", "coriander"]
  },
  {
    id: 3,
    name: "Lamb Biryani",
    category: "Desi",
    time: 75,
    rating: 4.9,
    image: "images/lamb-biryani.jpg",
    alt: "Fragrant layered Lamb Biryani with saffron basmati rice and caramelized onions",
    ingredients: ["lamb", "basmati rice", "yogurt", "onions", "saffron", "mint", "garam masala"]
  },
  {
    id: 4,
    name: "Daal Chawal",
    category: "Desi",
    time: 40,
    rating: 4.8,
    image: "images/daal-chawal.jpg",
    alt: "Comforting yellow lentil curry served over steamed white basmati rice with cumin tarka",
    ingredients: ["lentils", "rice", "garlic", "cumin", "turmeric", "ghee"]
  },
  {
    id: 5,
    name: "Aloo Paratha",
    category: "Breakfast",
    time: 30,
    rating: 4.8,
    image: "images/aloo-paratha.jpg",
    alt: "Crispy pan-fried Aloo Paratha stuffed with spiced mashed potatoes beside a bowl of yogurt",
    ingredients: ["wheat flour", "potatoes", "green chillies", "coriander", "butter", "cumin"]
  },
  {
    id: 6,
    name: "Chicken Shawarma",
    category: "Quick Meals",
    time: 25,
    rating: 4.7,
    image: "images/chicken-shawarma.jpg",
    alt: "Warm flatbread wrap filled with spiced grilled chicken, crisp lettuce, and garlic sauce",
    ingredients: ["chicken", "pita bread", "garlic sauce", "cucumber", "lettuce", "paprika"]
  },
  {
    id: 7,
    name: "Date & Nut Brownies",
    category: "Desserts",
    time: 50,
    rating: 4.9,
    image: "images/date-nut-brownies.jpg",
    alt: "Fudgy dark chocolate Date and Nut Brownies topped with toasted walnuts",
    ingredients: ["dates", "walnuts", "cocoa powder", "dark chocolate", "eggs", "butter"]
  },
  {
    id: 8,
    name: "Gajar Ka Halwa",
    category: "Desserts",
    time: 65,
    rating: 4.8,
    image: "images/gajar-ka-halwa.jpg",
    alt: "Warm carrot pudding Gajar Ka Halwa garnished with sliced pistachios and almonds",
    ingredients: ["carrots", "milk", "sugar", "cardamom", "ghee", "almonds", "pistachios"]
  },
  {
    id: 9,
    name: "Vegetable Pulao",
    category: "Desi",
    time: 40,
    rating: 4.6,
    image: "images/vegetable-pulao.jpg",
    alt: "Aromatic Vegetable Pulao cooked with basmati rice, green peas, carrots, and whole spices",
    ingredients: ["basmati rice", "peas", "carrots", "potatoes", "onion", "whole spices"]
  },
  {
    id: 10,
    name: "Chana Chaat",
    category: "Quick Meals",
    time: 15,
    rating: 4.7,
    image: "images/chana-chaat.jpg",
    alt: "Tangy Chana Chaat bowl with chickpeas, diced tomatoes, red onions, and tamarind chutney",
    ingredients: ["chickpeas", "onion", "tomato", "tamarind", "chaat masala", "coriander"]
  },
  {
    id: 11,
    name: "Shahi Tukray",
    category: "Desserts",
    time: 25,
    rating: 4.8,
    image: "images/shahi-tukray.jpg",
    alt: "Crisp golden bread pudding soaked in cardamom milk syrup and topped with slivered nuts",
    ingredients: ["bread", "milk", "sugar", "cardamom", "saffron", "pistachios"]
  },
  {
    id: 12,
    name: "Halwa Puri",
    category: "Breakfast",
    time: 55,
    rating: 4.9,
    image: "images/halwa-puri.jpg",
    alt: "Traditional weekend breakfast platter of puffed golden puris, sweet suji halwa, and chana",
    ingredients: ["flour", "semolina", "chickpeas", "sugar", "cardamom", "oil"]
  }
];
