const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Restaurant = require("./models/Restaurant");
const Review = require("./models/Review");
const Service = require("./models/Service");
const bcrypt = require("bcryptjs");

dotenv.config();

const restaurants = [
  { name: "Trung tâm Tiệc cưới & Hội nghị Mipec Palace", address: "229 Tây Sơn, Đống Đa, Hà Nội", rating: 5, price: "400.000đ/khách", image: "/Restaurant-Details@2x.png" },
  { name: "Forevermark Tây Hồ", address: "614 Lạc Long Quân, Tây Hồ, Hà Nội", rating: 5, price: "3,8 triệu/bàn/10 người", image: "/Frame-251@2x.png" },
  { name: "Nhà Hàng Tiệc Cưới Sân Golf Sông Bé", address: "Thành Phố Thuận An - Bình Dương", rating: 5, price: "NHẬN BÁO GIÁ", image: "/Frame-251@2x.png" },
  { name: "Trung tâm tiệc cưới Melia Hanoi Hotel", address: "Lý Thường Kiệt, Quận Hoàn Kiếm", rating: 5, price: "NHẬN BÁO GIÁ", image: "/Frame-251@2x.png" },
  { name: "Nhà Hàng Sheraton Hanoi Hotel", address: "Nghi Tàm, Số 11 Xuân Diệu, Tây Hồ", rating: 5, price: "NHẬN BÁO GIÁ", image: "/Frame-251@2x.png" },
  { name: "Khách sạn Hanoi Daewoo Hotel", address: "Số 360, Kim Mã, Quận Ba Đình", rating: 5, price: "NHẬN BÁO GIÁ", image: "/Frame-251@2x.png" },
  { name: "Lotte Hotel Hanoi", address: "54 Liễu Giai, quận Ba Đình", rating: 5, price: "NHẬN BÁO GIÁ", image: "/Frame-251@2x.png" },
  { name: "Nguyên Đình Long Biên", address: "Tầng 3 TTTM Savico Megamall", rating: 5, price: "2.290.000đ/mâm", image: "/Frame-251@2x.png" },
  { name: "Trống Đồng Palace Quán Sứ", address: "Trần Hưng Đạo, quận Hoàn Kiếm", rating: 5, price: "245.000đ/khách", image: "/Frame-251@2x.png" },
  { name: "Tràng An Palace Nguyễn Khang", address: "461 Nguyễn Khang, Cầu Giấy,Hà Nội", rating: 5, price: "450.000đ/khách", image: "/Frame-251@2x.png" }
];

const reviews = [
  { content: "\"Quá tuyệt vời! Thực sự rất ưng ý luôn!\"", author: "Khánh Linh", rating: 5 },
  { content: "\"Nhiều ưu đãi tốt, book nhà hàng nhanh gọn lẹ.\"", author: "Khánh Linh", rating: 5 },
  { content: "\"Đội ngũ tư vấn siêu nhiệt tình và tận tâm.\"", author: "Khánh Linh", rating: 5 }
];

const services = [
  // --- NHÀ HÀNG (nha_hang) ---
  { 
    name: "La Maison 1888", 
    category: "nha_hang", 
    address: "Bán đảo Sơn Trà, Sơn Trà, Đà Nẵng", 
    location: "Sơn Trà", 
    price: 2500000, 
    priceLabel: "Giá từ 2.500.000đ/bàn", 
    rating: 4.9, 
    reviewsCount: 1284, 
    capacity: 400, 
    amenities: ["Sân vườn", "View biển", "Sảnh lớn", "Tiệc ngoài trời"], 
    badge: "NỔI BẬT", 
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800",
    phone: "0236 393 8888",
    website: "https://danang.intercontinental.com/la-maison-1888",
    facebook: "https://facebook.com/LaMaison1888Danang",
    description: "Tọa lạc tại resort đẳng cấp InterContinental Danang Sun Peninsula, La Maison 1888 là nhà hàng đầu tiên tại Việt Nam kết tác cùng đầu bếp chuẩn 3 sao Michelin. Với lối kiến trúc kết hợp biệt thự Pháp cổ điển và hồn Việt, không gian tiệc cưới tại đây lãng mạn vô bờ bến với view bao trọn vịnh Sơn Trà thơ mộng.",
    includedServices: ["Thực đơn tiệc cưới chuẩn vị Âu Pháp cao cấp", "Miễn phí phòng trang điểm cô dâu tiêu chuẩn VIP", "Hệ thống âm thanh sân khấu chuyên nghiệp", "Nước giải khát chào mừng (Welcome mocktail)", "Thử món ăn thử trước tiệc cho 6 người"],
    album: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800",
      "https://images.unsplash.com/photo-1507504038482-762fe9a76383?q=80&w=800",
      "https://images.unsplash.com/photo-1519225495810-7517c300ea87?q=80&w=800"
    ],
    pricingDetails: [
      { name: "Gói Tiệc Bạc (Silver Package)", price: 2500000, desc: "Bao gồm thực đơn 6 món phong cách fusion Á-Âu, nước ngọt bia tiêu chuẩn, trang trí sảnh tiệc nhẹ nhàng với hoa tươi bản địa." },
      { name: "Gói Tiệc Vàng (Gold Package)", price: 3800000, desc: "Thực đơn 7 món cao cấp với các nguyên liệu thượng hạng, phục vụ vang Pháp suốt bữa tiệc, miễn phí MC chuyên nghiệp và tháp ly bánh kem hoành tráng." },
      { name: "Gói Hoàng Gia (Royal Michelin)", price: 5500000, desc: "Thực đơn đỉnh cao do đầu bếp 3 sao Michelin thiết kế riêng, champagne Moët & Chandon rót tràn bàn, decor toàn bộ sảnh bằng hoa tươi nhập khẩu độc quyền." }
    ]
  },
  { 
    name: "Park Hyatt Ballroom", 
    category: "nha_hang", 
    address: "Quận 1, TP. Hồ Chí Minh", 
    location: "Quận 1", 
    price: 3200000, 
    priceLabel: "Giá từ 3.200.000đ/bàn", 
    rating: 4.8, 
    reviewsCount: 962, 
    capacity: 600, 
    amenities: ["Sảnh lớn", "Bãi đỗ xe", "Phòng cô dâu", "Sang trọng"], 
    badge: "ƯU ĐÃI", 
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800",
    phone: "028 3824 1234",
    website: "https://hyatt.com/park-hyatt-saigon",
    facebook: "https://facebook.com/ParkHyattSaigonWedding",
    description: "Sảnh tiệc cưới sang trọng Park Hyatt Ballroom nằm ngay tại trung tâm TP.HCM, mang đến một định nghĩa hoàn hảo về sự tinh tế và vương giả. Sảnh không cột với trần cao được trang trí bằng chùm đèn pha lê Ý lộng lẫy sẽ biến mỗi đám cưới trở thành một dạ tiệc hoàng cung lộng lẫy nhất.",
    includedServices: ["Sảnh tiệc pha lê sang trọng không cột chắn", "Thực đơn tiệc cưới cao cấp từ bếp trưởng Park Hyatt", "Gói trang trí hoa tươi nghệ thuật tiêu chuẩn", "Phòng tân hôn VIP 1 đêm kèm bữa sáng cho cặp đôi", "Màn hình LED siêu nét trung tâm"],
    album: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800",
      "https://images.unsplash.com/photo-1520854221256-17451cc35953?q=80&w=800"
    ],
    pricingDetails: [
      { name: "Gói Classic Elegant", price: 3200000, desc: "Thực đơn 6 món tuyển chọn Á Đông, bia nước ngọt Heineken trọn gói, sảnh tiệc tiêu chuẩn với nến và hoa tươi." },
      { name: "Gói Premium Crystal", price: 4500000, desc: "Thực đơn 7 món đặc sắc Á-Âu, tháp champagne nghệ thuật, backdrop check-in hoa tươi thiết kế riêng biệt." },
      { name: "Gói Luxury Diamond", price: 6000000, desc: "Món ăn cao cấp thượng hạng (Bào ngư, Vi cá), trọn gói rượu vang cao cấp nhập khẩu, 1 đêm tại phòng Suite Hoàng Gia cho cô dâu chú rể." }
    ]
  },
  { 
    name: "Rosewood Garden", 
    category: "nha_hang", 
    address: "Tây Hồ, Hà Nội", 
    location: "Tây Hồ", 
    price: 1800000, 
    priceLabel: "Giá từ 1.800.000đ/bàn", 
    rating: 4.7, 
    reviewsCount: 548, 
    capacity: 210, 
    amenities: ["Sân vườn", "View hồ", "Tiệc ngoài trời"], 
    badge: "MỚI", 
    image: "https://images.unsplash.com/photo-1545232979-8bf34eb9757b?q=80&w=800",
    phone: "024 3719 5555",
    website: "https://rosewoodwedding.com.vn",
    facebook: "https://facebook.com/RosewoodGardenTayHo",
    description: "Rosewood Garden là tổ hợp sân vườn và sảnh tiệc nằm ven bờ hồ Tây thơ mộng, lộng gió. Nơi đây là điểm đến mơ ước của các cặp đôi trẻ yêu thích phong cách cưới tự do, gần gũi thiên nhiên mang phong cách Rustic ấm cúng hay đám cưới ngoài trời kiểu Âu sang chảnh.",
    includedServices: ["Không gian sân vườn ven hồ Tây lãng mạn", "Thực đơn tiệc tự chọn BBQ hoặc tiệc bàn truyền thống", "Cổng hoa và lối đi rải cánh hồng", "Hệ thống âm thanh Acoustic ngoài trời chuyên nghiệp", "Nước detox đón khách giải nhiệt"],
    album: [
      "https://images.unsplash.com/photo-1545232979-8bf34eb9757b?q=80&w=800",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
      "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?q=80&w=800"
    ],
    pricingDetails: [
      { name: "Gói Rustic Garden", price: 1800000, desc: "Thực đơn 6 món gia đình ấm cúng, miễn phí không gian sân cỏ ngoài trời, hoa giấy nghệ thuật trang trí." },
      { name: "Gói Bohemian Dream", price: 2600000, desc: "Tiệc Buffet hơn 35 món nướng đặc sắc ngoài trời, dàn đèn lồng cổ tích trang trí buổi tối lộng lẫy." },
      { name: "Gói Sunset Romance", price: 3800000, desc: "Gói tiệc cao cấp đón hoàng hôn Hồ Tây, bàn Gallery hoa tươi ngập tràn, miễn phí ban nhạc Acoustic chơi trực tiếp trong 2 tiếng." }
    ]
  },
  { 
    name: "The Reverie Saigon", 
    category: "nha_hang", 
    address: "Quận 1, TP. Hồ Chí Minh", 
    location: "Quận 1", 
    price: 4800000, 
    priceLabel: "Giá từ 4.800.000đ/bàn", 
    rating: 4.9, 
    reviewsCount: 1820, 
    capacity: 800, 
    amenities: ["Sảnh lớn", "Bãi đỗ xe", "Phòng cô dâu", "View sông"], 
    badge: "NỔI BẬT", 
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800",
    phone: "028 3823 6688",
    website: "https://thereveriesaigon.com/wedding",
    facebook: "https://facebook.com/TheReverieSaigonWedding",
    description: "Nổi tiếng là một trong những khách sạn xa hoa bậc nhất thế giới, The Reverie Saigon mang phong cách vương giả Ý lộng lẫy đầy kiêu hãnh. Sảnh tiệc La Scala tráng lệ với các chi tiết mạ vàng, cột cẩm thạch và các tác phẩm pha lê tinh xảo sẽ hiện thực hóa đám cưới cổ tích của giới siêu giàu.",
    includedServices: ["Sảnh tiệc La Scala tráng lệ mạ vàng 24k", "Ẩm thực thượng lưu chuẩn Michelin quốc tế", "Dịch vụ quản gia tiệc cưới riêng hỗ trợ cô dâu", "Dàn nhạc giao hưởng đón khách khai mạc tiệc", "Quà tặng sô-cô-la thủ công cao cấp cho khách"],
    album: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800",
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800",
      "https://images.unsplash.com/photo-1520854221256-17451cc35953?q=80&w=800"
    ],
    pricingDetails: [
      { name: "Gói Imperial Gold", price: 4800000, desc: "Thực đơn 7 món ẩm thực Quảng Đông thượng hạng hoặc Tây Âu quý phái, phục vụ rượu vang cao cấp suốt buổi tiệc." },
      { name: "Gói Splendor Platinum", price: 6500000, desc: "Thực đơn bào ngư vi cá đẳng cấp, thiết kế thảm hoa tươi chạy dọc lễ đường, MC đài truyền hình dẫn lễ." },
      { name: "Gói The Reverie Royal", price: 9500000, desc: "Gói yến tiệc hoàng gia xa xỉ, hoa tươi trang trí lấp đầy trần sảnh tiệc, miễn phí xe siêu sang đưa đón cô dâu chú rể." }
    ]
  },

  // --- TRANG ĐIỂM CÔ DÂU (trang_diem) ---
  { 
    name: "Tee Le Studio Makeup", 
    category: "trang_diem", 
    address: "Quận 1, TP. Hồ Chí Minh", 
    location: "Quận 1", 
    price: 3500000, 
    priceLabel: "Giá từ 3.500.000đ/layout", 
    rating: 4.9, 
    reviewsCount: 654, 
    amenities: ["Mỹ phẩm cao cấp", "Theo sát dặm phấn", "Làm tóc đi kèm"], 
    badge: "NỔI BẬT", 
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800",
    phone: "0909 333 444",
    website: "https://teelestudio.com.vn",
    facebook: "https://facebook.com/TeeLeStudioMakeup",
    description: "Được sáng lập bởi chuyên gia trang điểm danh tiếng hàng đầu Tee Le, học viện là điểm hẹn của các hoa hậu và ngôi sao hạng A trong ngày trọng đại. Nổi tiếng với layout trang điểm biến hóa xuất sắc từ vẻ trong trẻo sương mai đến kiêu kỳ, quý phái cùng việc sử dụng 100% mỹ phẩm đắt đỏ nhất thế giới.",
    includedServices: ["Tư vấn layout trang điểm phù hợp với váy cưới", "Làm tóc cô dâu nghệ thuật đi kèm", "Sử dụng mỹ phẩm hi-end (Tom Ford, Chanel, Dior)", "Hỗ trợ mặc váy cưới và chỉnh phục trang ngày cưới"],
    album: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800"
    ],
    pricingDetails: [
      { name: "Gói Makeup Tiệc Cưới (Bride Makeup)", price: 3500000, desc: "Trang điểm và làm tóc cô dâu tại Studio Tee Le bởi chuyên viên cao cấp. Miễn phí hoa tươi cài tóc." },
      { name: "Gói Makeup Home/Hotel", price: 5500000, desc: "Chuyên viên trang điểm đến tận nhà hoặc khách sạn của cô dâu trong nội thành. Bao gồm dặm phấn trước giờ đón khách." },
      { name: "Gói Master Tee Le Signature", price: 10000000, desc: "Đích thân Master Tee Le trang điểm và tạo dáng tóc cho cô dâu. Theo sát hỗ trợ dặm phấn đổi layout trong suốt tiệc cưới." }
    ]
  },
  { 
    name: "Quách Ánh Makeup Store", 
    category: "trang_diem", 
    address: "Hoàn Kiếm, Hà Nội", 
    location: "Hoàn Kiếm", 
    price: 2800000, 
    priceLabel: "Giá từ 2.800.000đ/layout", 
    rating: 4.8, 
    reviewsCount: 423, 
    amenities: ["Mỹ phẩm cao cấp", "Làm tóc đi kèm", "Thử layout trước"], 
    badge: "ƯU ĐÃI", 
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800",
    phone: "0345 888 999",
    website: "https://quachanh.makeup",
    facebook: "https://facebook.com/QuachAnhMakeupStore",
    description: "Quách Ánh - 'Phù thủy trang điểm' xứ Hà Thành là người định hình xu hướng trang điểm cưới nhẹ nhàng mà sắc sảo. Cửa hàng đem lại dịch vụ chuyên nghiệp, giúp tôn lên vẻ đẹp tự nhiên sẵn có của cô dâu một cách tự nhiên nhất.",
    includedServices: ["Trang điểm nhẹ nhàng trong veo kiểu Hàn Quốc", "Làm tóc uốn nếp bồng bềnh tự nhiên", "Mỹ phẩm dưỡng da cấp ẩm sâu trước khi trang điểm", "Thử layout trang điểm trước ngày cưới 1 tuần"],
    album: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800",
      "https://images.unsplash.com/photo-1526045478516-99145907023c?q=80&w=800"
    ],
    pricingDetails: [
      { name: "Gói Makeup Basic Rose", price: 2800000, desc: "Trang điểm và làm tóc cưới tại cửa hàng bởi chuyên viên được đào tạo trực tiếp từ Quách Ánh." },
      { name: "Gói Makeup Premium Glow", price: 4500000, desc: "Trang điểm tại tư gia hoặc khách sạn lễ ăn hỏi và tiệc cưới (2 layout làm tóc khác biệt)." },
      { name: "Gói Master Quách Ánh", price: 8500000, desc: "Do đích thân Quách Ánh thực hiện. Tone trang điểm độc quyền che mọi khuyết điểm, mang lại vẻ ngoài hoàn mỹ lộng lẫy dưới ánh đèn sân khấu." }
    ]
  },

  // --- XE HOA CƯỚI (xe_hoa) ---
  { 
    name: "Mercedes S500 Flower Edition", 
    category: "xe_hoa", 
    address: "Quận 1, TP. Hồ Chí Minh", 
    location: "Quận 1", 
    price: 3000000, 
    priceLabel: "Giá thuê từ 3.000.000đ/ngày", 
    rating: 4.8, 
    reviewsCount: 145, 
    amenities: ["Có tài xế đi kèm", "Trang trí hoa tươi", "Xe đời mới"], 
    badge: "ƯU ĐÃI", 
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800",
    phone: "0912 345 678",
    website: "https://luxurycarrent.com.vn",
    facebook: "https://facebook.com/MercedesS500XeHoa",
    description: "Mercedes S500 dòng xe sang hàng đầu luôn là lựa chọn vương giả dành cho ngày rước dâu. Xe phủ sắc trắng ngọc trai bóng bẩy, nội thất bọc da êm ái cùng hệ thống giảm xóc êm ái như bay. Ngoại thất xe được trang trí nghệ thuật bằng hoa tươi thiết kế riêng tỉ mỉ.",
    includedServices: ["Thuê xe Mercedes S500 trắng ngọc trai đời mới nhất", "Tài xế lịch sự, mặc vest sang trọng, thông thuộc đường sá", "Xăng xe và phí cầu đường nội thành trọn gói", "Thiết kế và gắn hoa cưới tươi cao cấp lên nắp capo"],
    album: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800"
    ],
    pricingDetails: [
      { name: "Gói Thuê Nửa Ngày (4 tiếng)", price: 3000000, desc: "Giới hạn 40km di chuyển nội thành, phù hợp làm lễ rước dâu gọn gàng trong buổi sáng." },
      { name: "Gói Thuê Nguyên Ngày (8 tiếng)", price: 5000000, desc: "Giới hạn 80km di chuyển, tài xế túc trực đưa đón cả lễ gia tiên và tiệc tối nhà hàng." },
      { name: "Gói Super VIP Flower", price: 7000000, desc: "Gói trọn ngày kèm thiết kế cụm hoa tươi nhập khẩu khổng lồ trị giá 3 triệu đồng, phục vụ nước yến mát lạnh trên xe." }
    ]
  },
  { 
    name: "Bentley Flying Spur White", 
    category: "xe_hoa", 
    address: "Hoàn Kiếm, Hà Nội", 
    location: "Hoàn Kiếm", 
    price: 8000000, 
    priceLabel: "Giá thuê từ 8.000.000đ/ngày", 
    rating: 4.9, 
    reviewsCount: 92, 
    amenities: ["Siêu xe sang trọng", "Có tài xế đi kèm", "Trang trí hoa tươi"], 
    badge: "NỔI BẬT", 
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800",
    phone: "0908 999 999",
    website: "https://bentleyxehoa.vn",
    facebook: "https://facebook.com/BentleyFlyingSpurXeHoa",
    description: "Để tạo nên một dấu ấn khó phai đẳng cấp thượng lưu, Bentley Flying Spur màu trắng tuyết chính là sự khẳng định hoàn hảo. Với các đường nét thủ công quý tộc Anh Quốc, đây là siêu phẩm xe cưới nổi bật nhất trên mọi cung đường rước dâu tại Thủ đô.",
    includedServices: ["Thuê siêu xe Bentley Flying Spur đẳng cấp hoàng gia Anh", "Tài xế chuyên nghiệp được đào tạo khắt khe phục vụ VIP", "Trang trí hoa tươi ngoại nhập đẳng cấp nghệ thuật", "Biển số xe tên cô dâu chú rể thiết kế riêng"],
    album: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800"
    ],
    pricingDetails: [
      { name: "Gói Quý Tộc 4 Tiếng", price: 8000000, desc: "Bao gồm tài xế, xăng xe, hoa tươi rước dâu nội thành dưới 30km di chuyển." },
      { name: "Gói Hoàng Gia 8 Tiếng", price: 13000000, desc: "Túc trực đưa đón tiệc gia tiên buổi sáng đến nhà hàng tiệc cưới buổi tối, phục vụ vang nổ trên xe." },
      { name: "Gói Diamond Bentley Custom", price: 18000000, desc: "Gói trọn gói cao cấp nhất, trang trí hoa hồng trắng Ecuador ngập tràn, miễn phí ghi hình phóng sự lúc rước dâu trên xe." }
    ]
  },

  // --- CHỤP ẢNH CƯỚI (chup_anh) ---
  { 
    name: "TuArt Wedding", 
    category: "chup_anh", 
    address: "Quận 1, TP. Hồ Chí Minh", 
    location: "Quận 1", 
    price: 12000000, 
    priceLabel: "Giá từ 12.000.000đ/album", 
    rating: 4.9, 
    reviewsCount: 2145, 
    amenities: ["Chụp ngoại cảnh", "Chụp studio", "Hỗ trợ trang phục", "Photobook cao cấp"], 
    badge: "NỔI BẬT", 
    image: "https://images.unsplash.com/photo-1537907690979-ee8e01276184?q=80&w=800",
    phone: "0888 606 888",
    website: "https://tuart.com.vn",
    facebook: "https://facebook.com/tuartwedding",
    description: "TuArt Wedding là đơn vị chụp ảnh cưới số 1 Việt Nam sở hữu hệ sinh thái cưới hỏi trọn gói lớn nhất nước. Với phong cách nhiếp ảnh bay bổng, màu sắc độc bản rực rỡ và đội ngũ nhiếp ảnh gia tận tụy, TuArt cam kết lưu giữ trọn vẹn những khoảnh khắc đắt giá nhất của tình yêu.",
    includedServices: ["Ekip chụp riêng biệt bao gồm 1 thợ chụp, 1 thợ trang điểm, 1 thợ ánh sáng", "Mượn 3 váy cưới cao cấp Bella và 2 Vest chú rể cao cấp", "Toàn bộ file ảnh gốc chất lượng cao hơn 800 tấm", "1 cuốn album Photobook khổ lớn bìa da cao cấp"],
    album: [
      "https://images.unsplash.com/photo-1537907690979-ee8e01276184?q=80&w=800",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800"
    ],
    pricingDetails: [
      { name: "Gói Chụp Studio Hàn Quốc", price: 12000000, desc: "Chụp tại phim trường/studio máy lạnh TuArt. Nhẹ nhàng, ngọt ngào, tinh tế, tiết kiệm thời gian." },
      { name: "Gói Ngoại Cảnh Sài Gòn / Đà Lạt", price: 18000000, desc: "Chụp 1 ngày tại các địa điểm ngoại cảnh lãng mạn. Bao gồm chi phí đi lại cho cả ekip." },
      { name: "Gói Trọn Gói Ngày Cưới VIP", price: 28000000, desc: "Gói siêu cấp bao gồm Album Pre-wedding ngoại cảnh + Chụp hình quay phim phóng sự cưới bằng thiết bị điện ảnh tối tân nhất." }
    ]
  },

  // --- THUÊ VÁY CƯỚI (vay_cuoi) ---
  { 
    name: "Bella Bridal Dress", 
    category: "vay_cuoi", 
    address: "Quận 1, TP. Hồ Chí Minh", 
    location: "Quận 1", 
    price: 8000000, 
    priceLabel: "Thuê từ 8.000.000đ/váy", 
    rating: 4.8, 
    reviewsCount: 340, 
    amenities: ["Váy cưới thiết kế", "Nhập khẩu cao cấp", "Hỗ trợ chỉnh sửa", "Có kèm phụ kiện"], 
    badge: "ƯU ĐÃI", 
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800",
    phone: "0902 666 888",
    website: "https://bellabridal.vn",
    facebook: "https://facebook.com/bellabridal",
    description: "Bella Bridal mang đến cho các nàng dâu những mẫu váy cưới lộng lẫy tựa nữ thần. Thiết kế của Bella luôn chú trọng phom dáng corset chuẩn mực châu Âu giúp nâng eo giấu dáng hoàn hảo, đính kết đá Swarovski lấp lánh như ngàn vì sao dưới ánh đèn lễ đường.",
    includedServices: ["Thuê váy cưới cao cấp dòng thiết kế Luxury trong 3 ngày", "Chỉnh sửa váy cưới theo số đo cơ thể cô dâu miễn phí", "Miễn phí mượn phụ kiện cao cấp: vương miện, voan dài đính đá, găng tay", "Hấp là phẳng phiu đóng hộp chuyên nghiệp khi bàn giao"],
    album: [
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800",
      "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800",
      "https://images.unsplash.com/photo-1546808220-0bc4f2d77b80?q=80&w=800"
    ],
    pricingDetails: [
      { name: "Gói Thuê Váy Luxury Line", price: 8000000, desc: "Thuê 1 váy cưới dòng Luxury thiết kế sẵn lộng lẫy, chất liệu ren Pháp mềm mại, đuôi dài lãng mạn." },
      { name: "Gói Thuê Váy Couture Line (New Arrival)", price: 15000000, desc: "Thuê 1 váy cưới dòng Limited mới ra mắt năm nay, đính đá cườm thủ công sang chảnh, thu hút mọi ánh nhìn." },
      { name: "Gói Thiết Kế Sở Hữu Riêng (Tailor Made)", price: 35000000, desc: "Thiết kế bản vẽ riêng cho nàng dâu, may đo thủ công 100% bằng vải cao cấp nhập khẩu từ Ý. Nàng dâu được sở hữu vĩnh viễn chiếc váy." }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    await User.deleteMany();
    await Restaurant.deleteMany();
    await Review.deleteMany();
    await Service.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("123456", salt);

    await User.create([
      { name: "Admin", email: "admin@anwedding.com", password: hash, role: "admin",
        phone: "0901 000 001", address: "123 Lý Tự Trọng, Quận 1, TP.HCM",
        description: "Quản trị viên nền tảng AN Wedding." },
      { name: "AN Wedding Studio", email: "vendor@anwedding.com", password: hash, role: "vendor",
        phone: "0901 234 567",
        address: "45 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
        description: "AN Wedding Studio – đơn vị cung cấp dịch vụ cưới hỏi toàn diện hàng đầu Việt Nam. Với hơn 10 năm kinh nghiệm, chúng tôi đã đồng hành cùng hàng nghìn cặp đôi trong ngày trọng đại. Đội ngũ chuyên nghiệp, tận tâm và sáng tạo luôn sẵn sàng biến giấc mơ của bạn thành hiện thực.",
        facebook: "https://facebook.com/anweddingstudio",
        instagram: "https://instagram.com/anweddingstudio",
        avatar: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=200" },
      { name: "Customer1", email: "customer@anwedding.com", password: hash, role: "customer" }
    ]);


    await Restaurant.insertMany(restaurants);
    await Review.insertMany(reviews);
    
    // We will expand other services in seed to have fallback values if not specified, 
    // to keep the code neat but rich.
    // Let's populate fallback detail fields for services that didn't have custom ones:
    const populatedServices = services.map(s => {
      if (!s.phone) s.phone = "0901 234 567";
      if (!s.website) s.website = "https://anwedding.com";
      if (!s.facebook) s.facebook = "https://facebook.com/anwedding";
      if (!s.description) {
        s.description = `Dịch vụ cưới hỏi ${s.name} chất lượng cao, mang lại trải nghiệm tuyệt vời và đáng nhớ cho ngày hạnh phúc của bạn. Chúng tôi cam kết chất lượng dịch vụ chuyên nghiệp nhất.`;
      }
      if (!s.includedServices || s.includedServices.length === 0) {
        s.includedServices = ["Dịch vụ tư vấn kế hoạch chuyên sâu", "Hỗ trợ 24/7 trực tiếp", "Hợp đồng minh bạch rõ ràng", "Ekip phục vụ chu đáo, nhiệt tình"];
      }
      if (!s.album || s.album.length === 0) {
        s.album = [s.image, "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800"];
      }
      if (!s.pricingDetails || s.pricingDetails.length === 0) {
        s.pricingDetails = [
          { name: "Gói Cơ Bản (Standard)", price: s.price, desc: "Bao gồm các dịch vụ cơ bản cần thiết nhất, tiết kiệm chi phí." },
          { name: "Gói Nâng Cấp (Gold)", price: Math.round(s.price * 1.5), desc: "Thêm nhiều tiện ích hấp dẫn, tăng cường trải nghiệm ngày vui." },
          { name: "Gói Trọn Gói VIP (Diamond)", price: Math.round(s.price * 2.2), desc: "Sử dụng những nguyên liệu, trang thiết bị cao cấp nhất, có đội ngũ giám sát đi kèm." }
        ];
      }
      return s;
    });

    // Let's add more of the seed services that were truncated or omitted so that they are all saved with full details!
    const extraServices = [
      // More restaurants
      {
        name: "Villa Sông Sài Gòn",
        category: "nha_hang",
        address: "Thảo Điền, TP. Hồ Chí Minh",
        location: "Thảo Điền",
        price: 2100000,
        priceLabel: "Giá từ 2.100.000đ/bàn",
        rating: 4.6,
        reviewsCount: 412,
        capacity: 200,
        amenities: ["View sông", "Sân vườn", "Tiệc ngoài trời"],
        badge: null,
        image: "https://images.unsplash.com/photo-1507504038482-762fe9a76383?q=80&w=800",
        phone: "028 3744 6090",
        website: "https://villasong.com",
        facebook: "https://facebook.com/villasongsaigon",
        description: "Villa Sông Sài Gòn tọa lạc tại trung tâm Thảo Điền quận 2, là một dinh thự mang đậm phong cách Pháp cổ nằm hiền hòa bên bờ sông Sài Gòn thơ mộng. Với thảm cỏ xanh mướt trải dài và hồ bơi sang trọng, đây là địa điểm tuyệt đỉnh cho lễ cưới ngoài trời kiểu sân vườn hay tiệc buffet tối lãng mạn ngắm hoàng hôn buông trên sông.",
        includedServices: ["Không gian sân vườn cỏ mặt sông tuyệt đẹp", "Thực đơn tiệc tự chọn kiểu Âu thượng hạng", "Ghế ngồi tiffany cưới ngoài trời trang trí nơ lụa", "Welcome drinks sang chảnh cho khách mời", "Âm thanh ánh sáng sân khấu mặt sông"],
        album: ["https://images.unsplash.com/photo-1507504038482-762fe9a76383?q=80&w=800", "https://images.unsplash.com/photo-1519225495810-7517c300ea87?q=80&w=800"],
        pricingDetails: [
          { name: "Gói Riverside Garden", price: 2100000, desc: "Thực đơn 6 món bàn tiệc cao cấp Á-Âu, miễn phí thuê địa điểm sân cỏ, sảnh dự phòng mát lạnh." },
          { name: "Gói Sunset Buffet Party", price: 3200000, desc: "Tiệc buffet hơn 40 món chuẩn 5 sao ngoài trời bờ sông, quầy BBQ nướng trực tiếp tại chỗ." },
          { name: "Gói Villa Royal Wedding", price: 4900000, desc: "Trọn gói tiệc tối bờ sông lung linh ánh nến, hoa hồng Đà Lạt trang trí ngập tràn, tặng 1 đêm tân hôn tại phòng Suite hướng sông." }
        ]
      },
      {
        name: "Almanity Hội An",
        category: "nha_hang",
        address: "Hội An, Quảng Nam",
        location: "Hội An",
        price: 1650000,
        priceLabel: "Giá từ 1.650.000đ/bàn",
        rating: 4.8,
        reviewsCount: 723,
        capacity: 300,
        amenities: ["Sân vườn", "Bãi đỗ xe", "Tiệc ngoài trời"],
        badge: "ƯU ĐÃI",
        image: "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?q=80&w=800",
        phone: "0235 386 6666",
        website: "https://almanityhoian.com",
        facebook: "https://facebook.com/almanityhoian",
        description: "Mang trọn cái hồn trầm mặc của phố cổ Hội An hòa quyện cùng phong cách nghỉ dưỡng spa thanh khiết, Almanity Hội An mang tới không gian tiệc cưới hồ bơi nhiệt đới bao quanh bởi rặng dừa xanh mướt. Nơi đây kiến tạo những đám cưới mang đậm bản sắc văn hóa kết hợp xu hướng đương đại độc đáo.",
        includedServices: ["Sảnh tiệc hoặc không gian hồ bơi nhiệt đới thơ mộng", "Thực đơn món ngon xứ Quảng kết hợp ẩm thực quốc tế", "Đèn lồng Hội An trang trí lung linh buổi tối", "Miễn phí dịch vụ Spa hồi phục cho cô dâu chú rể", "Khu đỗ xe riêng biệt an toàn cho khách"],
        album: ["https://images.unsplash.com/photo-1522413452208-996ff3f3e740?q=80&w=800", "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800"],
        pricingDetails: [
          { name: "Gói Phố Hoài", price: 1650000, desc: "Mâm tiệc đậm chất truyền thống Hội An, miễn phí sảnh tiệc trong nhà máy lạnh." },
          { name: "Gói Duyên Dáng Sông Hoài", price: 2500000, desc: "Bàn tiệc Âu-Việt tinh tế, tiệc hồ bơi ngoài trời lãng mạn ngập tràn hoa tươi và đèn lồng cổ kính." },
          { name: "Gói Yến Tiệc Almanity VIP", price: 3900000, desc: "Thực đơn hải sản cao cấp nhất, tháp rượu vang, MC tiệc cưới, chương trình ca múa nhạc truyền thống chào đón khách." }
        ]
      },
      // More makeups
      {
        name: "Juhee Makeup",
        category: "trang_diem",
        address: "Tây Hồ, Hà Nội",
        location: "Tây Hồ",
        price: 1500000,
        priceLabel: "Giá từ 1.500.000đ/layout",
        rating: 4.6,
        reviewsCount: 232,
        amenities: ["Làm tóc đi kèm", "Giá bình dân", "Đội ngũ chuyên nghiệp"],
        badge: "MỚI",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800",
        phone: "093 799 9789",
        website: "https://juheemakeup.com.vn",
        facebook: "https://facebook.com/juheemakeup",
        description: "Juhee Makeup là chuỗi thương hiệu trang điểm cưới chuyên nghiệp nổi bật với tiêu chí chất lượng đỉnh cao - chi phí tối ưu. Thương hiệu mang lại giải pháp hoàn hảo cho mọi cô dâu ước ao vẻ ngoài thanh lịch, tỏa sáng tự nhiên mà không tốn kém quá nhiều ngân sách.",
        includedServices: ["Trang điểm cô dâu chụp hình cưới / ăn hỏi / lễ cưới", "Kiểu tóc cô dâu trang nhã, hiện đại phù hợp với váy", "Mỹ phẩm chính hãng xuất xứ Nhật Bản, Hàn Quốc", "Tặng kèm mi giả và bông phấn trang điểm"],
        album: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800"],
        pricingDetails: [
          { name: "Gói Makeup Tiêu Chuẩn (Studio)", price: 1500000, desc: "Trang điểm và làm tóc cưới nhẹ nhàng tại salon Juhee bởi chuyên viên tay nghề cao." },
          { name: "Gói Tận Nhà Nội Thành (Home Delivery)", price: 2300000, desc: "Chuyên viên tới tận nhà/khách sạn trang điểm cho cô dâu vào sáng sớm ngày làm lễ cưới." },
          { name: "Gói Trọn Gói Cưới Hợp Đồng VIP", price: 3800000, desc: "Bao gồm trang điểm lễ ăn hỏi + lễ cưới, kèm theo trang điểm miễn phí cho mẹ cô dâu và mẹ chú rể." }
        ]
      },
      // More car rent
      {
        name: "VinFast VF9 Luxe",
        category: "xe_hoa",
        address: "Tây Hồ, Hà Nội",
        location: "Tây Hồ",
        price: 2500000,
        priceLabel: "Giá thuê từ 2.500.000đ/ngày",
        rating: 4.7,
        reviewsCount: 210,
        amenities: ["Xe điện hiện đại", "Xe đời mới", "Có tài xế đi kèm"],
        badge: "MỚI",
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800",
        phone: "0903 123 456",
        website: "https://vinfastrent.vn",
        facebook: "https://facebook.com/VinFastVF9XeHoa",
        description: "Đi đầu xu thế đám cưới xanh thân thiện môi trường, siêu SUV điện VinFast VF9 Luxe màu xanh dương hoặc trắng lịch lãm là điểm nhấn công nghệ và hiện đại bậc nhất. Khoang cabin hạng thương gia cực kỳ rộng rãi giúp cô dâu hoàn toàn thoải mái trong trang phục cưới lộng lẫy nhất.",
        includedServices: ["Thuê SUV VinFast VF9 bản 6 chỗ thương gia sang trọng", "Tài xế lịch sự, rành công nghệ, thân thiện hỗ trợ", "Trang trí cụm hoa tươi trang nhã gắn xe hoa", "Sạc nhanh điện thoại và điều hòa mát sâu trọn hành trình"],
        album: ["https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800", "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800"],
        pricingDetails: [
          { name: "Gói VF9 Eco 4 Tiếng", price: 2500000, desc: "Gói thuê rước dâu nội ô 4 tiếng, di chuyển dưới 40km, tặng kèm hoa xe cưới tiêu chuẩn." },
          { name: "Gói VF9 Luxury 8 Tiếng", price: 3800000, desc: "Thời gian 8 tiếng trọn ngày, thoải mái di chuyển ngoại thành hoặc chụp ngoại cảnh xe hoa." },
          { name: "Gói Green Wedding VIP", price: 5000000, desc: "Trang trí hoa hồng trắng tươi 100%, thiết kế độc quyền, kèm phục vụ bánh ngọt nước uống đẳng cấp trên xe." }
        ]
      },
      // More dress
      {
        name: "Chung Thanh Phong Bridal",
        category: "vay_cuoi",
        address: "Quận 1, TP. Hồ Chí Minh",
        location: "Quận 1",
        price: 25000000,
        priceLabel: "Thuê từ 25.000.000đ/váy",
        rating: 4.9,
        reviewsCount: 450,
        amenities: ["Nhà thiết kế nổi tiếng", "Váy cưới thiết kế", "May đo riêng biệt"],
        badge: "NỔI BẬT",
        image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800",
        phone: "0909 688 888",
        website: "https://chungthanhphong.com",
        facebook: "https://facebook.com/chungthanhphongbridal",
        description: "Thương hiệu váy cưới haute couture đẳng cấp hàng đầu Việt Nam của NTK Chung Thanh Phong. Từng chiếc váy cưới là một tác phẩm điêu khắc nghệ thuật tôn vinh đường cong cơ thể, áp dụng kỹ thuật dựng gọng corset siết eo trứ danh và các chi tiết đính kết thủ công lộng lẫy đến nghẹt thở.",
        includedServices: ["Thuê váy cưới Haute Couture thiết kế độc bản của NTK Chung Thanh Phong", "Đích thân NTK tư vấn phom dáng váy phù hợp nhất cho cô dâu", "Chỉnh sửa số đo váy cưới cực kỳ chuẩn xác bởi thợ may lành nghề", "Trọn bộ phụ kiện voan, găng tay, trang sức ngọc trai phối kèm độc quyền"],
        album: ["https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800", "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800", "https://images.unsplash.com/photo-1546808220-0bc4f2d77b80?q=80&w=800"],
        pricingDetails: [
          { name: "Gói Thuê Dòng Limited Dress", price: 25000000, desc: "Thuê 1 váy cưới lộng lẫy dòng Limited tại showroom, phù hợp cho lễ cưới sân khấu chính." },
          { name: "Gói Thiết Kế May Thuê (Custom Rent)", price: 50000000, desc: "NTK Chung Thanh Phong lên bản vẽ thiết kế mới và may đo theo số đo cô dâu, cô dâu được mặc đầu tiên rồi hoàn trả váy." },
          { name: "Gói Thiết Kế May Sở Hữu (Haute Couture Dream)", price: 120000000, desc: "Gói may đo thủ công cao cấp nhất, sở hữu vĩnh viễn chiếc váy cưới độc quyền duy nhất trên thế giới của NTK Chung Thanh Phong." }
        ]
      }
    ];

    // Combine
    const finalServices = [...populatedServices];
    // Add extra services if not already added by name
    extraServices.forEach(exS => {
      if (!finalServices.some(fs => fs.name === exS.name)) {
        finalServices.push(exS);
      }
    });

    // Insert services first
    const insertedServices = await Service.insertMany(finalServices);

    // Find the vendor user and assign them to all seeded services
    const vendorUser = await User.findOne({ role: "vendor" });
    if (vendorUser) {
      await Service.updateMany(
        { _id: { $in: insertedServices.map(s => s._id) } },
        { $set: { vendor: vendorUser._id } }
      );
      console.log(`Assigned vendor "${vendorUser.name}" (${vendorUser.email}) to ${insertedServices.length} services.`);
    }

    console.log("Database seeded successfully with rich, highly-detailed Services!");
    process.exit();

  } catch (error) {
    console.error("Seeding failed: ", error);
    process.exit(1);
  }
};

seedDB();
