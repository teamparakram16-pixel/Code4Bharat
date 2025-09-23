import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Button,
  Drawer,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
  Badge,
  Paper,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  FilterList,
  ShoppingCart,
  LocalOffer,
  Spa,
  LocalHospital,
  Favorite,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  doshas: string[];
  benefits: string[];
  ingredients: string[];
  stock: number;
  discount?: number;
}

interface Filter {
  doshas: string[];
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
}

const categories = [
  { name: 'Herbs & Supplements', icon: <Spa /> },
  { name: 'Body Care', icon: <Favorite /> },
  { name: 'Health Foods', icon: <LocalHospital /> },
  { name: 'Essential Oils', icon: <LocalOffer /> },
];

const doshaTypes = ['Vata', 'Pitta', 'Kapha'];

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ashwagandha Premium Supplement',
    description: 'Organic ashwagandha root powder for stress relief and immunity boost',
    price: 599,
    rating: 4.5,
    reviews: 128,
    image: '/images/products/ashwagandha.jpg',
    category: 'Herbs & Supplements',
    doshas: ['Vata', 'Kapha'],
    benefits: ['Stress Relief', 'Immunity Boost', 'Energy Enhancement'],
    ingredients: ['Organic Ashwagandha Root', 'Black Pepper Extract'],
    stock: 50,
    discount: 10,
  },
  // Add more mock products here
];

const MarketplacePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const products = mockProducts;
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filter>({
    doshas: [],
    categories: [],
    priceRange: [0, 5000],
    rating: null,
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDoshas = filters.doshas.length === 0 ||
                         filters.doshas.some(dosha => product.doshas.includes(dosha));
    
    const matchesCategories = filters.categories.length === 0 ||
                             filters.categories.includes(product.category);
    
    const matchesPrice = product.price >= filters.priceRange[0] &&
                        product.price <= filters.priceRange[1];
    
    const matchesRating = !filters.rating ||
                         product.rating >= filters.rating;

    return matchesSearch && matchesDoshas && matchesCategories && matchesPrice && matchesRating;
  });

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
    // Add cart logic here
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      maxWidth: '100%',
      bgcolor: 'background.default',
      overflow: 'hidden'
    }}>
      <Container maxWidth={false} sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ayurvedic Marketplace
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Discover authentic Ayurvedic products for holistic wellness
            </Typography>
          </motion.div>
        </Box>

        {/* Search and Filters Bar */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
            <Box>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterDrawerOpen(true)}
              >
                Filters
              </Button>
            </Box>
            <Box>
              <Button
                fullWidth
                variant="contained"
                startIcon={<ShoppingCart />}
              >
                <Badge badgeContent={cartCount} color="error">
                  Cart
                </Badge>
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Categories */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Categories
          </Typography>
          <Box display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }} gap={2}>
            {categories.map((category) => (
              <Box key={category.name}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      bgcolor: filters.categories.includes(category.name)
                        ? 'primary.light'
                        : 'background.paper',
                    }}
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        categories: prev.categories.includes(category.name)
                          ? prev.categories.filter(c => c !== category.name)
                          : [...prev.categories, category.name]
                      }));
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.icon}
                        <Typography variant="subtitle1">{category.name}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Product Grid */}
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={3}>
          {filteredProducts.map((product) => (
            <Box key={product.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  {product.discount && (
                    <Chip
                      label={`${product.discount}% OFF`}
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.description.substring(0, 100)}...
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      {product.doshas.map((dosha) => (
                        <Chip
                          key={dosha}
                          label={dosha}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Rating value={product.rating} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        ({product.reviews})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6" color="primary.main">
                        ₹{product.price}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>

        {/* Filter Drawer */}
        <Drawer
          anchor={isMobile ? 'bottom' : 'right'}
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          PaperProps={{
            sx: { width: isMobile ? '100%' : 320, p: 3 }
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Filters
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Doshas
          </Typography>
          <FormGroup>
            {doshaTypes.map((dosha) => (
              <FormControlLabel
                key={dosha}
                control={
                  <Checkbox
                    checked={filters.doshas.includes(dosha)}
                    onChange={(e) => {
                      setFilters(prev => ({
                        ...prev,
                        doshas: e.target.checked
                          ? [...prev.doshas, dosha]
                          : prev.doshas.filter(d => d !== dosha)
                      }));
                    }}
                  />
                }
                label={dosha}
              />
            ))}
          </FormGroup>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Price Range
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={filters.priceRange}
              onChange={(_, newValue) => {
                setFilters(prev => ({
                  ...prev,
                  priceRange: newValue as [number, number]
                }));
              }}
              min={0}
              max={5000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `₹${value}`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">₹0</Typography>
              <Typography variant="body2">₹5000</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Minimum Rating
          </Typography>
          <Rating
            value={filters.rating}
            onChange={(_, newValue) => {
              setFilters(prev => ({
                ...prev,
                rating: newValue
              }));
            }}
          />

          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setFilterDrawerOpen(false)}
            >
              Apply Filters
            </Button>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};

export default MarketplacePage;