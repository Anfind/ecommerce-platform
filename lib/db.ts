import mysql from "mysql2/promise";

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "210506",
  database: "ecommerce_platform",
  charset: "utf8mb4",
};

// Create connection pool
export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to initialize database
export async function initializeDatabase() {
  console.log("🔄 Bắt đầu khởi tạo database...");

  try {
    // Connect without database first
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log("✅ Kết nối MySQL thành công!");

    // Drop database if exists
    await tempConnection.execute(
      `DROP DATABASE IF EXISTS ${dbConfig.database}`
    );
    console.log("🗑️ Đã xóa database cũ (nếu có)");

    // Create new database
    await tempConnection.execute(
      `CREATE DATABASE ${dbConfig.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Đã tạo database mới: ${dbConfig.database}`);

    await tempConnection.end();

    // Now connect to the new database and create tables
    console.log("🔄 Tạo bảng users...");
    await pool.execute(`
      CREATE TABLE users (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'seller', 'buyer') NOT NULL DEFAULT 'buyer',
        store_name VARCHAR(255) NULL,
        phone VARCHAR(20) NULL,
        address TEXT NULL,
        status ENUM('active', 'suspended', 'pending') NOT NULL DEFAULT 'active',
        verified BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_status (status)
      ) ENGINE=InnoDB
    `);
    console.log("✅ Đã tạo bảng users");

    console.log("🔄 Tạo bảng user_sessions...");
    await pool.execute(`
      CREATE TABLE user_sessions (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token_hash (token_hash),
        INDEX idx_user_id (user_id),
        INDEX idx_expires_at (expires_at)      ) ENGINE=InnoDB
    `);
    console.log("✅ Đã tạo bảng user_sessions");

    // Create categories table
    console.log("🔄 Tạo bảng categories...");
    await pool.execute(`
      CREATE TABLE categories (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image VARCHAR(500),
        parent_id VARCHAR(36) NULL,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_slug (slug),
        INDEX idx_parent_id (parent_id),
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB
    `);
    console.log("✅ Đã tạo bảng categories");    // Create Orders table - Enhanced for comprehensive order management
    console.log("🔄 Tạo bảng orders...");
    await pool.execute(`
      CREATE TABLE orders (
        id VARCHAR(50) PRIMARY KEY,
        buyer_id VARCHAR(36) NOT NULL,
        seller_id VARCHAR(36) NOT NULL,
        buyer_name VARCHAR(255) NOT NULL,
        buyer_email VARCHAR(255) NOT NULL,
        seller_name VARCHAR(255) NOT NULL,
        subtotal DECIMAL(15, 0) NOT NULL,
        shipping_fee DECIMAL(15, 0) DEFAULT 0,
        tax DECIMAL(15, 0) DEFAULT 0,
        total DECIMAL(15, 0) NOT NULL,
        status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
        payment_method ENUM('cod', 'bank_transfer', 'credit_card', 'e_wallet') DEFAULT 'cod',
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
        shipping_method ENUM('standard', 'express', 'same_day') DEFAULT 'standard',
        order_notes TEXT,
        tracking_number VARCHAR(100),
        confirmed_at TIMESTAMP NULL,
        shipped_at TIMESTAMP NULL,
        delivered_at TIMESTAMP NULL,
        cancelled_at TIMESTAMP NULL,
        cancel_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_buyer_id (buyer_id),
        INDEX idx_seller_id (seller_id),
        INDEX idx_status (status),
        INDEX idx_payment_status (payment_status),
        INDEX idx_created_at (created_at),
        
        FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
    console.log("✅ Đã tạo bảng orders với thông tin đầy đủ");

    // Create order_items table for products in each order
    console.log("🔄 Tạo bảng order_items...");
    await pool.execute(`
      CREATE TABLE order_items (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        order_id VARCHAR(50) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_image VARCHAR(500),
        quantity INT NOT NULL,
        unit_price DECIMAL(15, 0) NOT NULL,
        total_price DECIMAL(15, 0) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_order_id (order_id),
        INDEX idx_product_id (product_id),
        
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB
    `);
    console.log("✅ Đã tạo bảng order_items");

    // Create shipping_addresses table for order shipping info
    console.log("🔄 Tạo bảng shipping_addresses...");
    await pool.execute(`
      CREATE TABLE shipping_addresses (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        order_id VARCHAR(50) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        address VARCHAR(500) NOT NULL,
        ward VARCHAR(100),
        district VARCHAR(100),
        city VARCHAR(100) NOT NULL,
        zip_code VARCHAR(20),
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE KEY unique_order (order_id),
        INDEX idx_order_id (order_id),
        
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
    console.log("✅ Đã tạo bảng shipping_addresses");

    // Create products table
    console.log("🔄 Tạo bảng products...");
    await pool.execute(`
      CREATE TABLE products (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(500) NOT NULL,
        slug VARCHAR(500) UNIQUE NOT NULL,
        description TEXT,
        long_description LONGTEXT,
        price DECIMAL(15,0) NOT NULL,
        original_price DECIMAL(15,0) NULL,
        cost_price DECIMAL(15,0) NULL,
        sku VARCHAR(100) UNIQUE,
        stock_quantity INT NOT NULL DEFAULT 0,
        low_stock_threshold INT DEFAULT 10,
        weight DECIMAL(8,2) NULL,
        dimensions VARCHAR(100) NULL,
        category_id VARCHAR(36) NOT NULL,
        seller_id VARCHAR(36) NOT NULL,
        brand VARCHAR(255),
        status ENUM('draft', 'pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
        is_featured BOOLEAN DEFAULT FALSE,
        is_digital BOOLEAN DEFAULT FALSE,
        meta_title VARCHAR(255),
        meta_description TEXT,
        sort_order INT DEFAULT 0,
        views_count INT DEFAULT 0,
        sales_count INT DEFAULT 0,
        rating_average DECIMAL(3,2) DEFAULT 0.00,
        rating_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_slug (slug),
        INDEX idx_category_id (category_id),
        INDEX idx_seller_id (seller_id),
        INDEX idx_status (status),
        INDEX idx_price (price),
        INDEX idx_is_featured (is_featured),
        INDEX idx_rating_average (rating_average),
        INDEX idx_sales_count (sales_count),
        FULLTEXT idx_search (name, description)
      ) ENGINE=InnoDB
    `);
    console.log("✅ Đã tạo bảng products");

    // Create product_images table
    console.log("🔄 Tạo bảng product_images...");
    await pool.execute(`
      CREATE TABLE product_images (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        product_id VARCHAR(36) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        alt_text VARCHAR(255),
        is_primary BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_id (product_id),
        INDEX idx_is_primary (is_primary)
      ) ENGINE=InnoDB
    `);
    console.log("✅ Đã tạo bảng product_images");

    // Create product_attributes table
    console.log("🔄 Tạo bảng product_attributes...");
    await pool.execute(`
      CREATE TABLE product_attributes (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        product_id VARCHAR(36) NOT NULL,
        attribute_name VARCHAR(255) NOT NULL,
        attribute_value TEXT NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_id (product_id),
        INDEX idx_attribute_name (attribute_name)
      ) ENGINE=InnoDB
    `);
    console.log("✅ Đã tạo bảng product_attributes");

    // Create product_reviews table
    console.log("🔄 Tạo bảng product_reviews...");
    await pool.execute(`
      CREATE TABLE product_reviews (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        product_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        comment TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        is_approved BOOLEAN DEFAULT TRUE,
        helpful_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id),
        INDEX idx_product_id (product_id),
        INDEX idx_user_id (user_id),
        INDEX idx_rating (rating),
        INDEX idx_is_approved (is_approved)
      ) ENGINE=InnoDB
    `);
    console.log("✅ Đã tạo bảng product_reviews"); // Insert sample data
    console.log("🔄 Thêm dữ liệu mẫu...");
    const bcrypt = require("bcryptjs");
    // Insert sample users
    const sampleUsers = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      },
      {
        name: "Người Bán Tech Store",
        email: "seller@example.com",
        password: "seller123",
        role: "seller",
        store_name: "Tech Store VN",
      },
      {
        name: "Samsung Official",
        email: "samsung@example.com",
        password: "samsung123",
        role: "seller",
        store_name: "Samsung Official Store",
      },
      {
        name: "Apple Store VN",
        email: "apple@example.com",
        password: "apple123",
        role: "seller",
        store_name: "Apple Store VN",
      },
      {
        name: "Sony Official Store",
        email: "sony@example.com",
        password: "sony123",
        role: "seller",
        store_name: "Sony Official Store",
      },
      {
        name: "Fashion House VN",
        email: "fashion@example.com",
        password: "fashion123",
        role: "seller",
        store_name: "Fashion House VN",
      },
      {
        name: "Nike Official Store",
        email: "nike@example.com",
        password: "nike123",
        role: "seller",
        store_name: "Nike Official Store",
      },
      {
        name: "Khách Hàng John",
        email: "buyer@example.com",
        password: "buyer123",
        role: "buyer",
      },
    ];

    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      await pool.execute(
        `INSERT INTO users (name, email, password_hash, role, store_name) VALUES (?, ?, ?, ?, ?)`,
        [
          user.name,
          user.email,
          hashedPassword,
          user.role,
          user.store_name || null,
        ]
      );
      console.log(`✅ Đã thêm user: ${user.email}`);
    }

    // Get seller IDs for foreign key references
    const [sellersResult] = await pool.execute(
      'SELECT id, email FROM users WHERE role = "seller"'
    );
    const sellers = sellersResult as any[];
    const sellerMap = sellers.reduce((map, seller) => {
      map[seller.email] = seller.id;
      return map;
    }, {} as Record<string, string>);

    // Insert sample categories
    console.log("🔄 Thêm categories...");
    const sampleCategories = [
      {
        name: "Điện Tử",
        slug: "dien-tu",
        description:
          "Khám phá thế giới công nghệ với các sản phẩm điện tử hàng đầu",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        name: "Thời Trang",
        slug: "thoi-trang",
        description: "Quần áo, giày dép, phụ kiện thời trang",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        name: "Nhà Cửa & Vườn",
        slug: "nha-cua-vuon",
        description: "Đồ gia dụng, nội thất, dụng cụ làm vườn",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        name: "Thể Thao",
        slug: "the-thao",
        description: "Dụng cụ thể thao, trang phục thể thao",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        name: "Sách",
        slug: "sach",
        description: "Sách học thuật, tiểu thuyết, truyện tranh và hơn thế nữa",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        name: "Đồ Chơi",
        slug: "do-choi",
        description: "Đồ chơi cho trẻ em, mô hình, xếp hình, đồ chơi giáo dục",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        name: "Ô Tô & Xe Máy",
        slug: "o-to-xe-may",
        description: "Phụ kiện, bảo dưỡng và thiết bị dành cho ô tô & xe máy",
        image: "/placeholder.svg?height=300&width=300",
      },
      {
        name: "Làm Đẹp",
        slug: "lam-dep",
        description: "Mỹ phẩm, chăm sóc da, trang điểm và sản phẩm làm đẹp",
        image: "/placeholder.svg?height=300&width=300",
      },
    ];

    for (const category of sampleCategories) {
      await pool.execute(
        `INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)`,
        [category.name, category.slug, category.description, category.image]
      );
      console.log(`✅ Đã thêm category: ${category.name}`);
    }

    // Get category IDs for foreign key references
    const [categoriesResult] = await pool.execute(
      "SELECT id, slug FROM categories"
    );
    const categories = categoriesResult as any[];
    const categoryMap = categories.reduce((map, cat) => {
      map[cat.slug] = cat.id;
      return map;
    }, {} as Record<string, string>); // Insert subcategories
    const subcategories = [
      {
        name: "Điện Thoại",
        slug: "dien-thoai",
        parent_id: categoryMap["dien-tu"],
        description: "Điện thoại thông minh từ các thương hiệu hàng đầu",
      },
      {
        name: "Laptop",
        slug: "laptop",
        parent_id: categoryMap["dien-tu"],
        description: "Máy tính xách tay cho mọi nhu cầu",
      },
      {
        name: "Tai Nghe",
        slug: "tai-nghe",
        parent_id: categoryMap["dien-tu"],
        description: "Tai nghe chất lượng cao cho âm thanh tuyệt vời",
      },
      {
        name: "Quần Áo Nam",
        slug: "quan-ao-nam",
        parent_id: categoryMap["thoi-trang"],
        description: "Thời trang nam phong cách và hiện đại",
      },
      {
        name: "Quần Áo Nữ",
        slug: "quan-ao-nu",
        parent_id: categoryMap["thoi-trang"],
        description: "Thời trang nữ xu hướng và thanh lịch",
      },
      {
        name: "Giày Dép",
        slug: "giay-dep",
        parent_id: categoryMap["thoi-trang"],
        description: "Giày dép thời trang cho mọi hoàn cảnh",
      },
      {
        name: "Phụ Kiện",
        slug: "phu-kien",
        parent_id: categoryMap["thoi-trang"],
        description: "Phụ kiện thời trang và trang sức",
      },
    ];

    for (const subcat of subcategories) {
      await pool.execute(
        `INSERT INTO categories (name, slug, description, parent_id) VALUES (?, ?, ?, ?)`,
        [subcat.name, subcat.slug, subcat.description, subcat.parent_id]
      );
      console.log(`✅ Đã thêm subcategory: ${subcat.name}`);
    }

    // Get updated category list with subcategories
    const [allCategoriesResult] = await pool.execute(
      "SELECT id, slug FROM categories"
    );
    const allCategories = allCategoriesResult as any[];
    const allCategoryMap = allCategories.reduce((map, cat) => {
      map[cat.slug] = cat.id;
      return map;
    }, {} as Record<string, string>); // Insert sample products
    console.log("🔄 Thêm products...");
    const sampleProducts = [
      {
        name: "iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        description: "Điện thoại thông minh cao cấp với chip A17 Pro",
        long_description:
          "iPhone 15 Pro Max mang đến trải nghiệm smartphone đỉnh cao với chip A17 Pro được sản xuất trên tiến trình 3nm tiên tiến nhất.",
        price: 29990000,
        original_price: 32990000,
        sku: "IP15PM-256GB",
        stock_quantity: 25,
        category_id: allCategoryMap["dien-tu"],
        seller_id: sellerMap["apple@example.com"],
        brand: "Apple",
        status: "approved",
        is_featured: true,
        rating_average: 4.8,
        rating_count: 256,
        sales_count: 128,
        views_count: 2500,
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        description: "Flagship Android với S Pen và camera 200MP",
        long_description:
          "Galaxy S24 Ultra là đỉnh cao của công nghệ Samsung với camera chính 200MP, zoom quang học 10x và AI photography tiên tiến.",
        price: 26990000,
        original_price: 29990000,
        sku: "SM-S928B",
        stock_quantity: 18,
        category_id: allCategoryMap["dien-tu"],
        seller_id: sellerMap["samsung@example.com"],
        brand: "Samsung",
        status: "approved",
        is_featured: true,
        rating_average: 4.7,
        rating_count: 189,
        sales_count: 95,
        views_count: 1890,
      },
      {
        name: "MacBook Air M3",
        slug: "macbook-air-m3",
        description: "Laptop siêu mỏng với chip M3 mạnh mẽ",
        long_description:
          "MacBook Air M3 mang đến hiệu năng vượt trội với chip M3 thế hệ mới, thiết kế siêu mỏng và thời lượng pin ấn tượng.",
        price: 28990000,
        original_price: 31990000,
        sku: "MBA-M3-256GB",
        stock_quantity: 15,
        category_id: allCategoryMap["dien-tu"],
        seller_id: sellerMap["apple@example.com"],
        brand: "Apple",
        status: "approved",
        is_featured: true,
        rating_average: 4.9,
        rating_count: 145,
        sales_count: 67,
        views_count: 1450,
      },
      {
        name: "Sony WH-1000XM5",
        slug: "sony-wh-1000xm5",
        description: "Tai nghe chống ồn hàng đầu thế giới",
        long_description:
          "Sony WH-1000XM5 với công nghệ chống ồn tiên tiến nhất, chất lượng âm thanh Hi-Res và thời lượng pin lên đến 30 giờ.",
        price: 7990000,
        original_price: 8990000,
        sku: "WH-1000XM5-BK",
        stock_quantity: 20,
        category_id: allCategoryMap["dien-tu"],
        seller_id: sellerMap["sony@example.com"],
        brand: "Sony",
        status: "approved",
        is_featured: false,
        rating_average: 4.6,
        rating_count: 324,
        sales_count: 156,
        views_count: 3240,
      },
      {
        name: "iPad Pro 12.9 inch M4",
        slug: "ipad-pro-129-m4",
        description: "Máy tính bảng chuyên nghiệp với chip M4",
        long_description:
          "iPad Pro 12.9 inch M4 với hiệu năng máy tính để bàn trong thiết kế siêu mỏng, màn hình Liquid Retina XDR stunning.",
        price: 25990000,
        original_price: 28990000,
        sku: "IPADPRO-M4-256GB",
        stock_quantity: 12,
        category_id: allCategoryMap["dien-tu"],
        seller_id: sellerMap["apple@example.com"],
        brand: "Apple",
        status: "approved",
        is_featured: true,
        rating_average: 4.8,
        rating_count: 98,
        sales_count: 45,
        views_count: 980,
      },
      // Thời trang sản phẩm
      {
        name: "Áo Thun Nam Basic Premium",
        slug: "ao-thun-nam-basic-premium",
        description: "Áo thun nam chất liệu cotton cao cấp, form dáng chuẩn",
        long_description:
          "Áo thun nam được làm từ 100% cotton cao cấp, co giãn 4 chiều, thấm hút mồ hôi tốt. Thiết kế basic dễ phối đồ với nhiều outfit khác nhau.",
        price: 299000,
        original_price: 399000,
        sku: "ATNAM-BASIC-001",
        stock_quantity: 50,
        category_id: allCategoryMap["thoi-trang"],
        seller_id: sellerMap["fashion@example.com"],
        brand: "Fashion House",
        status: "approved",
        is_featured: true,
        rating_average: 4.5,
        rating_count: 127,
        sales_count: 89,
        views_count: 1540,
      },
      {
        name: "Váy Midi Hoa Nhí Vintage",
        slug: "vay-midi-hoa-nhi-vintage",
        description: "Váy midi họa tiết hoa nhí phong cách vintage thanh lịch",
        long_description:
          "Váy midi với họa tiết hoa nhí tinh tế, thiết kế A-line tôn dáng. Chất liệu voan mềm mại, thoáng mát, phù hợp cho mùa hè.",
        price: 550000,
        original_price: 750000,
        sku: "VAY-MIDI-HN-001",
        stock_quantity: 30,
        category_id: allCategoryMap["thoi-trang"],
        seller_id: sellerMap["fashion@example.com"],
        brand: "Fashion House",
        status: "approved",
        is_featured: true,
        rating_average: 4.7,
        rating_count: 89,
        sales_count: 56,
        views_count: 1230,
      },
      {
        name: "Nike Air Force 1 White",
        slug: "nike-air-force-1-white",
        description: "Giày thể thao Nike Air Force 1 màu trắng classic",
        long_description:
          "Nike Air Force 1 - biểu tượng giày thể thao với thiết kế timeless. Đế cao su bền chắc, đệm khí Air mang lại sự thoải mái tối đa.",
        price: 2690000,
        original_price: 2990000,
        sku: "NIKE-AF1-WHITE",
        stock_quantity: 25,
        category_id: allCategoryMap["thoi-trang"],
        seller_id: sellerMap["nike@example.com"],
        brand: "Nike",
        status: "approved",
        is_featured: true,
        rating_average: 4.8,
        rating_count: 245,
        sales_count: 167,
        views_count: 2890,
      },
      {
        name: "Túi Xách Tay Nữ Da Thật",
        slug: "tui-xach-tay-nu-da-that",
        description: "Túi xách tay nữ da thật cao cấp, thiết kế sang trọng",
        long_description:
          "Túi xách da thật 100% được thuộn theo công nghệ Ý, bền đẹp theo thời gian. Thiết kế tối giản, thanh lịch phù hợp cho công sở và dạo phố.",
        price: 1490000,
        original_price: 1890000,
        sku: "TUI-DA-NU-001",
        stock_quantity: 15,
        category_id: allCategoryMap["thoi-trang"],
        seller_id: sellerMap["fashion@example.com"],
        brand: "Fashion House",
        status: "approved",
        is_featured: false,
        rating_average: 4.6,
        rating_count: 67,
        sales_count: 34,
        views_count: 890,
      },
      {
        name: "Quần Jeans Slim Fit Nam",
        slug: "quan-jeans-slim-fit-nam",
        description: "Quần jeans nam form slim fit, chất liệu denim cao cấp",
        long_description:
          "Quần jeans nam form slim fit ôm vừa phải, tôn dáng. Chất liệu denim cotton co giãn nhẹ, bền màu và không phai sau nhiều lần giặt.",
        price: 790000,
        original_price: 990000,
        sku: "JEANS-SLIM-NAM",
        stock_quantity: 40,
        category_id: allCategoryMap["thoi-trang"],
        seller_id: sellerMap["fashion@example.com"],
        brand: "Fashion House",
        status: "approved",
        is_featured: false,
        rating_average: 4.4,
        rating_count: 156,
        sales_count: 98,
        views_count: 1670,
      },
      {
        name: "Blazer Nữ Công Sở",
        slug: "blazer-nu-cong-so",
        description: "Áo blazer nữ lịch sự cho môi trường công sở",
        long_description:
          "Blazer nữ thiết kế hiện đại với đường cắt tinh tế. Chất liệu polyester cao cấp, không nhăn, dễ bảo quản. Phù hợp cho môi trường công sở chuyên nghiệp.",
        price: 850000,
        original_price: 1150000,
        sku: "BLAZER-NU-CS",
        stock_quantity: 20,
        category_id: allCategoryMap["thoi-trang"],
        seller_id: sellerMap["fashion@example.com"],
        brand: "Fashion House",
        status: "approved",
        is_featured: true,
        rating_average: 4.5,
        rating_count: 78,
        sales_count: 45,
        views_count: 1120,
      },
    ];

    for (const product of sampleProducts) {
      const [result] = await pool.execute(
        `INSERT INTO products (name, slug, description, long_description, price, original_price, sku, stock_quantity, category_id, seller_id, brand, status, is_featured, rating_average, rating_count, sales_count, views_count) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.slug,
          product.description,
          product.long_description,
          product.price,
          product.original_price,
          product.sku,
          product.stock_quantity,
          product.category_id,
          product.seller_id,
          product.brand,
          product.status,
          product.is_featured,
          product.rating_average,
          product.rating_count,
          product.sales_count,
          product.views_count,
        ]
      );
      console.log(`✅ Đã thêm product: ${product.name}`);
    }

    // Get product IDs for images and attributes
    const [productsResult] = await pool.execute(
      "SELECT id, slug FROM products"
    );
    const products = productsResult as any[];
    const productMap = products.reduce((map, prod) => {
      map[prod.slug] = prod.id;
      return map;
    }, {} as Record<string, string>); // Insert product images
    console.log("🔄 Thêm product images...");
    const productImages = [
      {
        product_slug: "iphone-15-pro-max",
        image_url: "/images/iphone-15-pro.jpg",
        is_primary: true,
      },
      {
        product_slug: "samsung-galaxy-s24-ultra",
        image_url: "/images/samsung-s24.jpg",
        is_primary: true,
      },
      {
        product_slug: "macbook-air-m3",
        image_url: "/images/macbook-air.jpg",
        is_primary: true,
      },
      {
        product_slug: "sony-wh-1000xm5",
        image_url: "/images/sony-headphones.jpg",
        is_primary: true,
      },
      {
        product_slug: "ipad-pro-129-m4",
        image_url: "/images/ipad-pro.jpg",
        is_primary: true,
      },
      // Thời trang images
      {
        product_slug: "ao-thun-nam-basic-premium",
        image_url: "/placeholder.svg?height=400&width=400&text=Áo+Thun+Nam",
        is_primary: true,
      },
      {
        product_slug: "vay-midi-hoa-nhi-vintage",
        image_url: "/placeholder.svg?height=400&width=400&text=Váy+Midi",
        is_primary: true,
      },
      {
        product_slug: "nike-air-force-1-white",
        image_url: "/images/nike-shoes.jpg",
        is_primary: true,
      },
      {
        product_slug: "tui-xach-tay-nu-da-that",
        image_url: "/placeholder.svg?height=400&width=400&text=Túi+Xách+Nữ",
        is_primary: true,
      },
      {
        product_slug: "quan-jeans-slim-fit-nam",
        image_url: "/placeholder.svg?height=400&width=400&text=Quần+Jeans+Nam",
        is_primary: true,
      },
      {
        product_slug: "blazer-nu-cong-so",
        image_url: "/placeholder.svg?height=400&width=400&text=Blazer+Nữ",
        is_primary: true,
      },
    ];

    for (const image of productImages) {
      await pool.execute(
        `INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)`,
        [productMap[image.product_slug], image.image_url, image.is_primary]
      );
    } // Insert product attributes
    console.log("🔄 Thêm product attributes...");
    const productAttributes = [
      // iPhone 15 Pro Max
      {
        product_slug: "iphone-15-pro-max",
        name: "Màn hình",
        value: "6.7 inch Super Retina XDR",
      },
      { product_slug: "iphone-15-pro-max", name: "Chip", value: "A17 Pro" },
      {
        product_slug: "iphone-15-pro-max",
        name: "Camera",
        value: "48MP + 12MP + 12MP",
      },
      { product_slug: "iphone-15-pro-max", name: "Bộ nhớ", value: "256GB" },
      { product_slug: "iphone-15-pro-max", name: "Pin", value: "4441 mAh" },

      // Samsung Galaxy S24 Ultra
      {
        product_slug: "samsung-galaxy-s24-ultra",
        name: "Màn hình",
        value: "6.8 inch Dynamic AMOLED 2X",
      },
      {
        product_slug: "samsung-galaxy-s24-ultra",
        name: "Chip",
        value: "Snapdragon 8 Gen 3",
      },
      {
        product_slug: "samsung-galaxy-s24-ultra",
        name: "Camera",
        value: "200MP + 50MP + 12MP + 10MP",
      },
      { product_slug: "samsung-galaxy-s24-ultra", name: "RAM", value: "12GB" },
      {
        product_slug: "samsung-galaxy-s24-ultra",
        name: "Bộ nhớ",
        value: "256GB",
      },

      // MacBook Air M3
      {
        product_slug: "macbook-air-m3",
        name: "Màn hình",
        value: "13.6 inch Liquid Retina",
      },
      { product_slug: "macbook-air-m3", name: "Chip", value: "Apple M3" },
      { product_slug: "macbook-air-m3", name: "RAM", value: "8GB" },
      { product_slug: "macbook-air-m3", name: "SSD", value: "256GB" },
      { product_slug: "macbook-air-m3", name: "Pin", value: "Lên đến 18 giờ" },

      // Thời trang attributes
      // Áo thun nam
      {
        product_slug: "ao-thun-nam-basic-premium",
        name: "Chất liệu",
        value: "100% Cotton",
      },
      {
        product_slug: "ao-thun-nam-basic-premium",
        name: "Size",
        value: "S, M, L, XL, XXL",
      },
      {
        product_slug: "ao-thun-nam-basic-premium",
        name: "Màu sắc",
        value: "Trắng, Đen, Xám, Navy",
      },
      {
        product_slug: "ao-thun-nam-basic-premium",
        name: "Form dáng",
        value: "Regular Fit",
      },
      {
        product_slug: "ao-thun-nam-basic-premium",
        name: "Xuất xứ",
        value: "Việt Nam",
      },

      // Váy midi
      {
        product_slug: "vay-midi-hoa-nhi-vintage",
        name: "Chất liệu",
        value: "Voan lụa",
      },
      {
        product_slug: "vay-midi-hoa-nhi-vintage",
        name: "Size",
        value: "S, M, L, XL",
      },
      {
        product_slug: "vay-midi-hoa-nhi-vintage",
        name: "Màu sắc",
        value: "Hoa nhí trắng nền xanh",
      },
      {
        product_slug: "vay-midi-hoa-nhi-vintage",
        name: "Chiều dài",
        value: "85cm",
      },
      {
        product_slug: "vay-midi-hoa-nhi-vintage",
        name: "Kiểu dáng",
        value: "A-line",
      },

      // Nike Air Force 1
      {
        product_slug: "nike-air-force-1-white",
        name: "Chất liệu",
        value: "Da thật + Synthetic",
      },
      {
        product_slug: "nike-air-force-1-white",
        name: "Size",
        value: "36, 37, 38, 39, 40, 41, 42, 43",
      },
      {
        product_slug: "nike-air-force-1-white",
        name: "Màu sắc",
        value: "Trắng",
      },
      {
        product_slug: "nike-air-force-1-white",
        name: "Công nghệ",
        value: "Nike Air",
      },
      {
        product_slug: "nike-air-force-1-white",
        name: "Xuất xứ",
        value: "Việt Nam",
      },

      // Túi xách
      {
        product_slug: "tui-xach-tay-nu-da-that",
        name: "Chất liệu",
        value: "Da bò thật 100%",
      },
      {
        product_slug: "tui-xach-tay-nu-da-that",
        name: "Kích thước",
        value: "30 x 25 x 12 cm",
      },
      {
        product_slug: "tui-xach-tay-nu-da-that",
        name: "Màu sắc",
        value: "Đen, Nâu, Beige",
      },
      {
        product_slug: "tui-xach-tay-nu-da-that",
        name: "Ngăn chứa",
        value: "1 ngăn chính + 2 ngăn phụ",
      },
      {
        product_slug: "tui-xach-tay-nu-da-that",
        name: "Xuất xứ",
        value: "Việt Nam",
      },

      // Quần jeans
      {
        product_slug: "quan-jeans-slim-fit-nam",
        name: "Chất liệu",
        value: "98% Cotton + 2% Spandex",
      },
      {
        product_slug: "quan-jeans-slim-fit-nam",
        name: "Size",
        value: "28, 29, 30, 31, 32, 33, 34, 36",
      },
      {
        product_slug: "quan-jeans-slim-fit-nam",
        name: "Màu sắc",
        value: "Xanh đậm, Xanh nhạt, Đen",
      },
      {
        product_slug: "quan-jeans-slim-fit-nam",
        name: "Form dáng",
        value: "Slim Fit",
      },
      {
        product_slug: "quan-jeans-slim-fit-nam",
        name: "Xuất xứ",
        value: "Việt Nam",
      },

      // Blazer nữ
      {
        product_slug: "blazer-nu-cong-so",
        name: "Chất liệu",
        value: "65% Polyester + 35% Viscose",
      },
      { product_slug: "blazer-nu-cong-so", name: "Size", value: "S, M, L, XL" },
      {
        product_slug: "blazer-nu-cong-so",
        name: "Màu sắc",
        value: "Đen, Navy, Xám",
      },
      { product_slug: "blazer-nu-cong-so", name: "Kiểu dáng", value: "Fitted" },
      { product_slug: "blazer-nu-cong-so", name: "Xuất xứ", value: "Việt Nam" },
    ];

    for (const attr of productAttributes) {
      await pool.execute(
        `INSERT INTO product_attributes (product_id, attribute_name, attribute_value) VALUES (?, ?, ?)`,
        [productMap[attr.product_slug], attr.name, attr.value]
      );
    }

    // Insert sample reviews
    console.log("🔄 Thêm product reviews...");
    const [buyerResult] = await pool.execute(
      'SELECT id FROM users WHERE email = "buyer@example.com"'
    );
    const buyerId = (buyerResult as any[])[0]?.id;

    if (buyerId) {
      const sampleReviews = [
        {
          product_slug: "iphone-15-pro-max",
          rating: 5,
          title: "Sản phẩm tuyệt vời!",
          comment:
            "Chất lượng vượt mong đợi. Camera rất sắc nét, pin trâu và hiệu năng mượt mà.",
        },
        {
          product_slug: "samsung-galaxy-s24-ultra",
          rating: 4,
          title: "Đáng tiền",
          comment: "Sản phẩm chất lượng, đúng như mô tả. S Pen rất tiện dụng.",
        },
        {
          product_slug: "macbook-air-m3",
          rating: 5,
          title: "Laptop tuyệt vời!",
          comment: "Thiết kế đẹp, hiệu năng mạnh mẽ, pin rất lâu.",
        },
      ];

      for (const review of sampleReviews) {
        await pool.execute(
          `INSERT INTO product_reviews (product_id, user_id, rating, title, comment, is_verified) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            productMap[review.product_slug],
            buyerId,
            review.rating,
            review.title,
            review.comment,
            true,
          ]
        );
      }    }

    // Create sample orders
    await createSampleOrders();

    console.log("🎉 Khởi tạo database hoàn tất!");
    return true;
  } catch (error) {
    console.error("❌ Lỗi khởi tạo database:", error);
    throw error;
  }
}

// Helper functions for user operations
export async function getUserByEmail(email: string) {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export async function getUserById(id: string) {
  const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export async function createUser(userData: {
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "seller" | "buyer";
  store_name?: string;
}) {
  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password_hash, role, store_name, verified, status) 
     VALUES (?, ?, ?, ?, ?, TRUE, 'active')`,
    [
      userData.name,
      userData.email,
      userData.password_hash,
      userData.role,
      userData.store_name || null,
    ]
  );
  return result;
}

export async function updateLastLogin(userId: string) {
  await pool.execute(
    "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
    [userId]
  );
}

// Helper functions for categories
export async function getAllCategories() {
  const [rows] = await pool.execute(`
    SELECT c.*, 
           COUNT(p.id) as product_count,
           parent.name as parent_name
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.status = 'approved'
    LEFT JOIN categories parent ON c.parent_id = parent.id
    GROUP BY c.id
    ORDER BY c.parent_id IS NULL DESC, c.sort_order, c.name
  `);
  return rows;
}

export async function getCategoryBySlug(slug: string) {
  const [rows] = await pool.execute(
    `
    SELECT c.*, 
           COUNT(p.id) as product_count,
           parent.name as parent_name,
           parent.slug as parent_slug
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.status = 'approved'
    LEFT JOIN categories parent ON c.parent_id = parent.id
    WHERE c.slug = ?
    GROUP BY c.id
  `,
    [slug]
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export async function getCategoryTree() {
  const [rows] = await pool.execute(`
    SELECT c.*, 
           COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.status = 'approved'
    GROUP BY c.id
    ORDER BY c.parent_id IS NULL DESC, c.sort_order, c.name
  `);

  const categories = rows as any[];
  const parentCategories = categories.filter((cat) => !cat.parent_id);
  const childCategories = categories.filter((cat) => cat.parent_id);

  return parentCategories.map((parent) => ({
    ...parent,
    subcategories: childCategories.filter(
      (child) => child.parent_id === parent.id
    ),
  }));
}

// Helper functions for products
export async function getAllProducts(
  options: {
    limit?: number;
    offset?: number;
    category?: string;
    search?: string;
    sortBy?: "newest" | "price-low" | "price-high" | "rating" | "popular";
    priceMin?: number;
    priceMax?: number;
    inStockOnly?: boolean;
    featured?: boolean;
  } = {}
) {
  let query = `
    SELECT p.*, 
           c.name as category_name, c.slug as category_slug,
           u.name as seller_name, u.store_name,
           pi.image_url as primary_image
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN users u ON p.seller_id = u.id
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
    WHERE p.status = 'approved'
  `;

  const params: any[] = [];

  if (options.category) {
    query += " AND c.slug = ?";
    params.push(options.category);
  }

  if (options.search) {
    query += " AND (p.name LIKE ? OR p.description LIKE ?)";
    params.push(`%${options.search}%`, `%${options.search}%`);
  }

  if (options.priceMin !== undefined) {
    query += " AND p.price >= ?";
    params.push(options.priceMin);
  }

  if (options.priceMax !== undefined) {
    query += " AND p.price <= ?";
    params.push(options.priceMax);
  }

  if (options.inStockOnly) {
    query += " AND p.stock_quantity > 0";
  }

  if (options.featured) {
    query += " AND p.is_featured = true";
  }

  // Add sorting
  switch (options.sortBy) {
    case "newest":
      query += " ORDER BY p.created_at DESC";
      break;
    case "price-low":
      query += " ORDER BY p.price ASC";
      break;
    case "price-high":
      query += " ORDER BY p.price DESC";
      break;
    case "rating":
      query += " ORDER BY p.rating_average DESC";
      break;
    case "popular":
      query += " ORDER BY p.sales_count DESC";
      break;
    default:
      query += " ORDER BY p.is_featured DESC, p.created_at DESC";
  }

  if (options.limit) {
    query += " LIMIT ?";
    params.push(options.limit);

    if (options.offset) {
      query += " OFFSET ?";
      params.push(options.offset);
    }
  }

  const [rows] = await pool.execute(query, params);
  return rows;
}

export async function getProductBySlug(slug: string) {
  const [rows] = await pool.execute(
    `
    SELECT p.*, 
           c.name as category_name, c.slug as category_slug,
           u.name as seller_name, u.store_name, u.id as seller_id
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN users u ON p.seller_id = u.id
    WHERE p.slug = ? AND p.status = 'approved'
  `,
    [slug]
  );

  if (!Array.isArray(rows) || rows.length === 0) return null;

  const product = rows[0] as any;

  // Get product images
  const [images] = await pool.execute(
    `
    SELECT image_url, alt_text, is_primary 
    FROM product_images 
    WHERE product_id = ? 
    ORDER BY is_primary DESC, sort_order
  `,
    [product.id]
  );

  // Get product attributes
  const [attributes] = await pool.execute(
    `
    SELECT attribute_name, attribute_value
    FROM product_attributes 
    WHERE product_id = ? 
    ORDER BY sort_order
  `,
    [product.id]
  );

  // Get product reviews
  const [reviews] = await pool.execute(
    `
    SELECT pr.*, u.name as user_name
    FROM product_reviews pr
    JOIN users u ON pr.user_id = u.id
    WHERE pr.product_id = ? AND pr.is_approved = true
    ORDER BY pr.created_at DESC
    LIMIT 10
  `,
    [product.id]
  );

  return {
    ...product,
    images,
    attributes,
    reviews,
  };
}

export async function getProductById(id: string) {
  const [rows] = await pool.execute(
    `
    SELECT p.*, 
           c.name as category_name, c.slug as category_slug,
           u.name as seller_name, u.store_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN users u ON p.seller_id = u.id
    WHERE p.id = ?
  `,
    [id]
  );

  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export async function getProductsByCategory(
  categorySlug: string,
  options: {
    limit?: number;
    offset?: number;
    search?: string;
    sortBy?: string;
    priceMin?: number;
    priceMax?: number;
    brands?: string[];
    inStockOnly?: boolean;
  } = {}
) {
  let query = `
    SELECT p.*, 
           c.name as category_name, c.slug as category_slug,
           u.name as seller_name, u.store_name,
           pi.image_url as primary_image
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN users u ON p.seller_id = u.id
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
    WHERE p.status = 'approved' 
    AND (c.slug = ? OR c.parent_id = (SELECT id FROM categories WHERE slug = ? LIMIT 1))
  `;

  const params: any[] = [categorySlug, categorySlug];

  if (options.search) {
    query += " AND (p.name LIKE ? OR p.description LIKE ?)";
    params.push(`%${options.search}%`, `%${options.search}%`);
  }

  if (options.priceMin !== undefined) {
    query += " AND p.price >= ?";
    params.push(options.priceMin);
  }

  if (options.priceMax !== undefined) {
    query += " AND p.price <= ?";
    params.push(options.priceMax);
  }

  if (options.brands && options.brands.length > 0) {
    query += ` AND p.brand IN (${options.brands.map(() => "?").join(",")})`;
    params.push(...options.brands);
  }

  if (options.inStockOnly) {
    query += " AND p.stock_quantity > 0";
  }

  // Add sorting
  switch (options.sortBy) {
    case "newest":
      query += " ORDER BY p.created_at DESC";
      break;
    case "price-low":
      query += " ORDER BY p.price ASC";
      break;
    case "price-high":
      query += " ORDER BY p.price DESC";
      break;
    case "rating":
      query += " ORDER BY p.rating_average DESC";
      break;
    case "popular":
      query += " ORDER BY p.sales_count DESC";
      break;
    default:
      query += " ORDER BY p.is_featured DESC, p.sales_count DESC";
  }

  if (options.limit) {
    query += " LIMIT ?";
    params.push(options.limit);

    if (options.offset) {
      query += " OFFSET ?";
      params.push(options.offset);
    }
  }

  const [rows] = await pool.execute(query, params);
  return rows;
}

export async function getSellerProducts(
  sellerId: string,
  options: {
    limit?: number;
    offset?: number;
    status?: string;
  } = {}
) {
  let query = `
    SELECT p.*, 
           c.name as category_name, c.slug as category_slug,
           pi.image_url as primary_image
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
    WHERE p.seller_id = ?
  `;

  const params: any[] = [sellerId];

  if (options.status) {
    query += " AND p.status = ?";
    params.push(options.status);
  }

  query += " ORDER BY p.created_at DESC";

  if (options.limit) {
    query += " LIMIT ?";
    params.push(options.limit);

    if (options.offset) {
      query += " OFFSET ?";
      params.push(options.offset);
    }
  }

  const [rows] = await pool.execute(query, params);
  return rows;
}

export async function getFeaturedProducts(limit: number = 8) {
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 8;

  const query = `
    SELECT p.*, 
           c.name as category_name, c.slug as category_slug,
           u.name as seller_name, u.store_name,
           pi.image_url as primary_image
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN users u ON p.seller_id = u.id
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
    WHERE p.status = 'approved' AND p.is_featured = true
    ORDER BY p.sales_count DESC, p.rating_average DESC
    LIMIT ${safeLimit} -- ép trực tiếp vào query
  `;

  const [rows] = await pool.query(query); // dùng query thay vì execute

  return rows;
}

export async function searchProducts(
  searchTerm: string,
  options: {
    limit?: number;
    offset?: number;
    category?: string;
    sortBy?: string;
    priceMin?: number;
    priceMax?: number;
  } = {}
) {
  let query = `
    SELECT p.*, 
           c.name as category_name, c.slug as category_slug,
           u.name as seller_name, u.store_name,
           pi.image_url as primary_image,
           MATCH(p.name, p.description) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN users u ON p.seller_id = u.id
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
    WHERE p.status = 'approved' 
    AND (MATCH(p.name, p.description) AGAINST(? IN NATURAL LANGUAGE MODE) > 0 
         OR p.name LIKE ? OR p.description LIKE ?)
  `;

  const params: any[] = [
    searchTerm,
    searchTerm,
    `%${searchTerm}%`,
    `%${searchTerm}%`,
  ];

  if (options.category) {
    query += " AND c.slug = ?";
    params.push(options.category);
  }

  if (options.priceMin !== undefined) {
    query += " AND p.price >= ?";
    params.push(options.priceMin);
  }

  if (options.priceMax !== undefined) {
    query += " AND p.price <= ?";
    params.push(options.priceMax);
  }

  query += " ORDER BY relevance DESC, p.sales_count DESC";

  if (options.limit) {
    query += " LIMIT ?";
    params.push(options.limit);

    if (options.offset) {
      query += " OFFSET ?";
      params.push(options.offset);
    }
  }

  const [rows] = await pool.execute(query, params);
  return rows;
}

export async function getAllUsers(
  options: {
    limit?: number;
    offset?: number;
    // Bỏ role vì không có bảng roles
    search?: string;
    sortBy?: "newest" | "name-asc" | "name-desc" | "active" | "inactive";
    status?: "active" | "inactive";
  } = {}
) {
  let query = `
    SELECT *
    FROM users u
    WHERE 1 = 1
  `;

  const params: any[] = [];

  if (options.status) {
    query += " AND u.status = ?";
    params.push(options.status);
  }

  if (options.search) {
    query += " AND (u.name LIKE ? OR u.email LIKE ?)";
    params.push(`%${options.search}%`, `%${options.search}%`);
  }

  // Add sorting
  switch (options.sortBy) {
    case "newest":
      query += " ORDER BY u.created_at DESC";
      break;
    case "name-asc":
      query += " ORDER BY u.name ASC";
      break;
    case "name-desc":
      query += " ORDER BY u.name DESC";
      break;
    case "active":
      query += " ORDER BY u.status = 'active' DESC, u.created_at DESC";
      break;
    case "inactive":
      query += " ORDER BY u.status = 'inactive' DESC, u.created_at DESC";
      break;
    default:
      query += " ORDER BY u.created_at DESC";
  }

  if (options.limit) {
    query += " LIMIT ?";
    params.push(options.limit);

    if (options.offset) {
      query += " OFFSET ?";
      params.push(options.offset);
    }
  }

  const [rows] = await pool.execute(query, params);
  return rows;
}

// Helper functions for orders
export async function getSellerOrders(
  sellerId: string, 
  options: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  let query = `
    SELECT 
      o.*,
      sa.full_name as shipping_full_name,
      sa.phone as shipping_phone,
      sa.email as shipping_email,
      sa.address as shipping_address,
      sa.ward as shipping_ward,
      sa.district as shipping_district,
      sa.city as shipping_city,
      sa.zip_code as shipping_zip_code
    FROM orders o
    LEFT JOIN shipping_addresses sa ON o.id = sa.order_id
    WHERE o.seller_id = ?
  `;

  const params: any[] = [sellerId];

  if (options.status) {
    query += " AND o.status = ?";
    params.push(options.status);
  }

  query += " ORDER BY o.created_at DESC";

  if (options.limit) {
    query += " LIMIT ?";
    params.push(options.limit);

    if (options.offset) {
      query += " OFFSET ?";
      params.push(options.offset);
    }
  }

  const [orders] = await pool.execute(query, params);
  return orders;
}

export async function getOrderItems(orderId: string) {
  const [items] = await pool.execute(`
    SELECT oi.*, p.slug as product_slug
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `, [orderId]);
  
  return items;
}

export async function updateOrderStatus(
  orderId: string, 
  status: string, 
  sellerId?: string,
  notes?: string
) {
  // Verify seller owns this order if sellerId provided
  if (sellerId) {
    const [orderCheck] = await pool.execute(
      'SELECT seller_id FROM orders WHERE id = ?',
      [orderId]
    );

    if (!Array.isArray(orderCheck) || orderCheck.length === 0) {
      throw new Error("Order not found");
    }

    if ((orderCheck[0] as any).seller_id !== sellerId) {
      throw new Error("Unauthorized");
    }
  }

  // Prepare update fields based on status
  let updateFields = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
  let updateValues = [status];

  switch (status) {
    case 'confirmed':
      updateFields.push('confirmed_at = CURRENT_TIMESTAMP');
      break;
    case 'shipped':
      updateFields.push('shipped_at = CURRENT_TIMESTAMP');
      // Generate tracking number if not exists
      const trackingNumber = `VN${Date.now()}`;
      updateFields.push('tracking_number = ?');
      updateValues.push(trackingNumber);
      break;
    case 'delivered':
      updateFields.push('delivered_at = CURRENT_TIMESTAMP');
      break;
    case 'cancelled':
      updateFields.push('cancelled_at = CURRENT_TIMESTAMP');
      if (notes) {
        updateFields.push('cancel_reason = ?');
        updateValues.push(notes);
      }
      break;
  }

  updateValues.push(orderId);

  // Update order status
  const [result] = await pool.execute(
    `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
    updateValues
  );

  return result;
}

export async function createSampleOrders() {
  console.log("🔄 Tạo sample orders...");
  
  // Get seller and buyer IDs
  const [sellersResult] = await pool.execute(
    'SELECT id, email FROM users WHERE role = "seller" LIMIT 1'
  );
  const [buyersResult] = await pool.execute(
    'SELECT id, email FROM users WHERE role = "buyer" LIMIT 1'
  );
  const [productsResult] = await pool.execute(
    'SELECT id, name, price FROM products WHERE status = "approved" LIMIT 3'
  );

  const sellers = sellersResult as any[];
  const buyers = buyersResult as any[];
  const products = productsResult as any[];

  if (sellers.length === 0 || buyers.length === 0 || products.length === 0) {
    console.log("⚠️ Không đủ dữ liệu để tạo sample orders");
    return;
  }

  const seller = sellers[0];
  const buyer = buyers[0];

  // Create sample orders
  const sampleOrders = [
    {
      id: "ORD-1730123456789-abc123def",
      buyer_id: buyer.id,
      seller_id: seller.id,
      buyer_name: "John Buyer",
      buyer_email: buyer.email,
      seller_name: "Tech Store VN",
      subtotal: 10000000,
      shipping_fee: 30000,
      tax: 0,
      total: 10030000,
      status: "pending",
      payment_method: "cod",
      payment_status: "pending",
      shipping_method: "standard",
      order_notes: "",
    },
    {
      id: "ORD-1730123456790-def456ghi",
      buyer_id: buyer.id,
      seller_id: seller.id,
      buyer_name: "John Buyer",
      buyer_email: buyer.email,
      seller_name: "Tech Store VN",
      subtotal: 15000000,
      shipping_fee: 50000,
      tax: 0,
      total: 15050000,
      status: "confirmed",
      payment_method: "credit_card",
      payment_status: "paid",
      shipping_method: "express",
      order_notes: "",
    },
    {
      id: "ORD-1730123456791-ghi789jkl",
      buyer_id: buyer.id,
      seller_id: seller.id,
      buyer_name: "John Buyer",
      buyer_email: buyer.email,
      seller_name: "Tech Store VN",
      subtotal: 25000000,
      shipping_fee: 0,
      tax: 0,
      total: 25000000,
      status: "shipped",
      payment_method: "bank_transfer",
      payment_status: "paid",
      shipping_method: "express",
      order_notes: "Giao hàng ngoài giờ hành chính",
    }
  ];

  for (const order of sampleOrders) {
    // Insert order
    await pool.execute(`
      INSERT INTO orders (
        id, buyer_id, seller_id, buyer_name, buyer_email, seller_name,
        subtotal, shipping_fee, tax, total, status, payment_method, 
        payment_status, shipping_method, order_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      order.id, order.buyer_id, order.seller_id, order.buyer_name,
      order.buyer_email, order.seller_name, order.subtotal, order.shipping_fee,
      order.tax, order.total, order.status, order.payment_method,
      order.payment_status, order.shipping_method, order.order_notes
    ]);

    // Insert shipping address
    await pool.execute(`
      INSERT INTO shipping_addresses (
        order_id, full_name, phone, email, address, ward, district, city, zip_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      order.id, order.buyer_name, "0123456789", order.buyer_email,
      "123 Nguyễn Văn Cừ", "Phường 4", "Quận 5", "TP.HCM", "70000"
    ]);

    // Insert order items
    for (let i = 0; i < Math.min(2, products.length); i++) {
      const product = products[i];
      const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 items
      
      await pool.execute(`
        INSERT INTO order_items (
          order_id, product_id, product_name, product_image,
          quantity, unit_price, total_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        order.id, product.id, product.name, "/placeholder.svg",
        quantity, product.price, product.price * quantity
      ]);
    }

    console.log(`✅ Đã tạo sample order: ${order.id}`);
  }
}

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connection test successful!");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection test failed:", error);
    return false;
  }
}
