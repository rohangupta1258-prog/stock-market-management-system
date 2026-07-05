-- Seed stocks (only if table is empty)
INSERT INTO stocks (stock_name, stock_symbol, current_price, previous_price, market_cap, sector, description)
SELECT 'Apple Inc.', 'AAPL', 189.30, 185.20, 2950000000000.00, 'Technology', 'Consumer electronics and software'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE stock_symbol = 'AAPL');

INSERT INTO stocks (stock_name, stock_symbol, current_price, previous_price, market_cap, sector, description)
SELECT 'Microsoft Corp.', 'MSFT', 415.50, 410.80, 3090000000000.00, 'Technology', 'Cloud computing and enterprise software'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE stock_symbol = 'MSFT');

INSERT INTO stocks (stock_name, stock_symbol, current_price, previous_price, market_cap, sector, description)
SELECT 'Amazon.com Inc.', 'AMZN', 178.25, 175.60, 1850000000000.00, 'E-Commerce', 'E-commerce and cloud services'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE stock_symbol = 'AMZN');

INSERT INTO stocks (stock_name, stock_symbol, current_price, previous_price, market_cap, sector, description)
SELECT 'Alphabet Inc.', 'GOOGL', 140.93, 138.50, 1780000000000.00, 'Technology', 'Search engine and advertising'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE stock_symbol = 'GOOGL');

INSERT INTO stocks (stock_name, stock_symbol, current_price, previous_price, market_cap, sector, description)
SELECT 'NVIDIA Corp.', 'NVDA', 875.40, 850.20, 2160000000000.00, 'Semiconductors', 'GPUs and AI computing'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE stock_symbol = 'NVDA');

INSERT INTO stocks (stock_name, stock_symbol, current_price, previous_price, market_cap, sector, description)
SELECT 'Tesla Inc.', 'TSLA', 248.50, 255.30, 790000000000.00, 'Automotive', 'Electric vehicles and energy storage'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE stock_symbol = 'TSLA');

INSERT INTO stocks (stock_name, stock_symbol, current_price, previous_price, market_cap, sector, description)
SELECT 'Meta Platforms', 'META', 505.80, 498.40, 1290000000000.00, 'Technology', 'Social media and virtual reality'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE stock_symbol = 'META');

INSERT INTO stocks (stock_name, stock_symbol, current_price, previous_price, market_cap, sector, description)
SELECT 'JPMorgan Chase', 'JPM', 198.70, 195.30, 572000000000.00, 'Finance', 'Global investment banking'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE stock_symbol = 'JPM');

INSERT INTO stocks (stock_name, stock_symbol, current_price, previous_price, market_cap, sector, description)
SELECT 'Johnson & Johnson', 'JNJ', 158.40, 160.20, 382000000000.00, 'Healthcare', 'Pharmaceuticals and medical devices'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE stock_symbol = 'JNJ');

INSERT INTO stocks (stock_name, stock_symbol, current_price, previous_price, market_cap, sector, description)
SELECT 'Exxon Mobil', 'XOM', 112.30, 110.80, 449000000000.00, 'Energy', 'Oil and natural gas production'
WHERE NOT EXISTS (SELECT 1 FROM stocks WHERE stock_symbol = 'XOM');

-- Demo user: password is "password123"
INSERT INTO users (username, email, password, balance, role)
SELECT 'demo_user', 'demo@stockmarket.com',
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       50000.00, 'USER'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'demo@stockmarket.com');