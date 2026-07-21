import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import SharedHeader from "../components/SharedHeader";
import Footer1 from "../components/Footer1";
import styles from "./TermsPage.module.css";

const TermsPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("part1");

  // Create refs for smooth scrolling to sections
  const sectionRefs = {
    part1: useRef(null),
    part2: useRef(null),
    part3: useRef(null),
    part4: useRef(null),
    part5: useRef(null),
    part6: useRef(null),
    part7: useRef(null),
  };

  // Scroll to tab if specified in route path or state
  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.pathname === "/privacy") {
      setActiveTab("part2");
      setTimeout(() => {
        sectionRefs.part2.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else if (location.pathname === "/terms") {
      setActiveTab("part1");
      setTimeout(() => {
        sectionRefs.part1.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location.pathname]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery(""); // Clear search when switching tabs manually
    sectionRefs[tabId].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePrint = () => {
    window.print();
  };

  // Content Data
  const sectionsData = [
    {
      id: "part1",
      title: "Phần I: Điều khoản sử dụng",
      icon: "📜",
      ref: sectionRefs.part1,
      articles: [
        {
          num: "1",
          title: "Chấp nhận điều khoản",
          text: "Khi tạo tài khoản, truy cập hoặc sử dụng An Wedding, Người dùng xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi Điều khoản sử dụng, Chính sách quyền riêng tư, Chính sách tài khoản, chính sách giao dịch và các quy định được hiển thị tại từng tính năng. Nếu Người dùng không đồng ý, Người dùng không nên tạo tài khoản hoặc tiếp tục sử dụng các tính năng yêu cầu chấp thuận."
        },
        {
          num: "2",
          title: "Giải thích thuật ngữ",
          text: "Dưới đây là một số định nghĩa và thuật ngữ cốt lõi được sử dụng xuyên suốt Nền tảng AN Wedding:",
          table: {
            headers: ["Thuật ngữ", "Nội dung"],
            rows: [
              ["An Wedding/Nền tảng", "Website, ứng dụng và hệ thống số kết nối cặp đôi với các nhà cung cấp dịch vụ cưới hỏi."],
              ["Người dùng", "Cá nhân truy cập, tạo tài khoản hoặc sử dụng chức năng của Nền tảng."],
              ["Khách hàng", "Người dùng gửi yêu cầu báo giá, đặt dịch vụ, thanh toán hoặc quản lý kế hoạch cưới trên Nền tảng."],
              ["Vendor", "Nhà hàng, studio, chuyên gia trang điểm, đơn vị trang trí, xe cưới, wedding planner hoặc nhà cung cấp liên quan."],
              ["Booking", "Yêu cầu đặt dịch vụ đã có nội dung, giá, lịch, điều kiện và trạng thái xác nhận trên hệ thống."],
              ["Nội dung người dùng", "Ảnh, video, bình luận, đánh giá, tin nhắn, yêu cầu báo giá và tài liệu do Người dùng cung cấp."]
            ]
          }
        },
        {
          num: "3",
          title: "Vai trò của An Wedding",
          bullets: [
            "Nền tảng trung gian: An Wedding hỗ trợ tìm kiếm, so sánh, liên hệ, quản lý Booking, thanh toán qua đối tác và giải quyết khiếu nại.",
            "Vendor trực tiếp cung cấp dịch vụ: Chất lượng chuyên môn, nhân sự, vật tư và việc thực hiện dịch vụ thuộc trách nhiệm của Vendor, trừ trường hợp An Wedding trực tiếp đứng tên cung cấp một dịch vụ cụ thể.",
            "Không bảo đảm tuyệt đối: Việc xác minh hồ sơ, đánh giá hoặc gắn nhãn uy tín không đồng nghĩa với bảo lãnh tuyệt đối cho mọi hành vi hay kết quả dịch vụ của Vendor.",
            "Bảo vệ giao dịch: An Wedding có thể áp dụng cơ chế giữ tiền theo mốc, xác minh, kiểm soát đánh giá và hỗ trợ tranh chấp thông qua đơn vị thanh toán phù hợp."
          ]
        },
        {
          num: "4",
          title: "Điều kiện sử dụng",
          bullets: [
            "Người tạo tài khoản giao dịch phải từ đủ 18 tuổi và có đầy đủ năng lực hành vi dân sự.",
            "Người dùng phải cung cấp thông tin chính xác, cập nhật và có quyền sử dụng số điện thoại, email, hình ảnh hoặc tài liệu đã cung cấp.",
            "Một cá nhân không được tạo hàng loạt tài khoản để nhận khuyến mại, thao túng đánh giá hoặc né tránh hạn chế.",
            "Người dùng chịu trách nhiệm đối với hành động thực hiện từ tài khoản của mình, trừ khi đã báo ngay cho An Wedding về việc bị chiếm đoạt."
          ]
        },
        {
          num: "5",
          title: "Quyền của Người dùng",
          bullets: [
            "Tìm kiếm, lọc, so sánh hồ sơ, gói dịch vụ, mức giá và đánh giá của Vendor.",
            "Yêu cầu báo giá, trao đổi, đặt lịch và nhận xác nhận giao dịch.",
            "Được cung cấp thông tin rõ ràng về giá, phí, điều kiện, chính sách hủy và phạm vi dịch vụ trước khi thanh toán.",
            "Yêu cầu truy cập, chỉnh sửa hoặc thực hiện quyền đối với dữ liệu cá nhân theo Chính sách quyền riêng tư.",
            "Gửi đánh giá trung thực, khiếu nại, yêu cầu hỗ trợ và cung cấp bằng chứng.",
            "Đóng tài khoản khi đã hoàn thành nghĩa vụ giao dịch, thanh toán và tranh chấp còn tồn tại."
          ]
        },
        {
          num: "6",
          title: "Nghĩa vụ của Khách hàng",
          bullets: [
            "Cung cấp đúng nhu cầu: Thông báo chính xác ngày cưới, địa điểm, số lượng khách, ngân sách, yêu cầu kỹ thuật, thời gian và các điều kiện đặc biệt.",
            "Kiểm tra trước khi xác nhận: Đọc đầy đủ mô tả gói, hạng mục bao gồm/không bao gồm, phụ phí, lịch thanh toán, chính sách hủy và thông tin Vendor.",
            "Thanh toán đúng hạn: Thực hiện đặt cọc hoặc thanh toán theo Booking và chỉ sử dụng kênh thanh toán được Nền tảng hỗ trợ khi muốn được bảo vệ giao dịch.",
            "Phối hợp thực hiện: Có mặt đúng lịch, cung cấp đầu mối liên hệ, phê duyệt thay đổi kịp thời và không cản trở hợp lý quá trình cung cấp dịch vụ.",
            "Bảo mật tài khoản: Không chia sẻ mật khẩu, OTP, mã khôi phục; thông báo ngay khi nghi ngờ truy cập trái phép.",
            "Tôn trọng và hợp pháp: Không quấy rối, xúc phạm, đe dọa, lừa đảo, xâm phạm quyền riêng tư hoặc quyền sở hữu trí tuệ của người khác.",
            "Bằng chứng trung thực: Không sửa chữa, cắt ghép hoặc tạo bằng chứng giả trong khiếu nại, hoàn tiền hoặc đánh giá."
          ]
        },
        {
          num: "7",
          title: "Hành vi bị cấm",
          bullets: [
            "Mạo danh cá nhân, tổ chức hoặc sử dụng thông tin nhận dạng không có quyền.",
            "Tạo Booking giả, thao túng khuyến mại, đánh giá, lượt xem, xếp hạng hoặc kết quả tìm kiếm.",
            "Đưa mã độc, bot, công cụ quét dữ liệu, khai thác lỗ hổng hoặc can thiệp hoạt động hệ thống.",
            "Đăng nội dung vi phạm pháp luật, thuần phong mỹ tục, quyền riêng tư, bí mật đời tư hoặc quyền sở hữu trí tuệ.",
            "Dùng dữ liệu Vendor hoặc Người dùng để gửi thư rác, quảng cáo trái phép, bán lại dữ liệu hoặc cạnh tranh không lành mạnh.",
            "Lợi dụng chính sách hoàn tiền, khiếu nại hoặc chargeback để chiếm đoạt tiền/dịch vụ.",
            "Cố ý giao dịch ngoài Nền tảng sau khi được kết nối nhằm né phí hoặc né cơ chế bảo vệ, nếu Booking/chương trình yêu cầu giao dịch trên hệ thống."
          ]
        },
        {
          num: "8",
          title: "Booking và giao dịch",
          text: "Yêu cầu báo giá chưa tạo thành Booking. Booking chỉ được hình thành khi các thông tin cốt lõi gồm Vendor, phạm vi dịch vụ, lịch, địa điểm, giá, khoản đặt cọc, chính sách hủy và trạng thái xác nhận được ghi nhận trên Nền tảng. Khách hàng phải kiểm tra lại Booking trước khi xác nhận. Mọi thay đổi quan trọng sau xác nhận cần được các bên chấp thuận bằng tin nhắn, phụ lục điện tử hoặc phương thức có thể kiểm chứng."
        },
        {
          num: "9",
          title: "Nội dung, hình ảnh và quyền sở hữu trí tuệ",
          text: "Người dùng giữ quyền đối với Nội dung người dùng nhưng cấp cho An Wedding quyền không độc quyền, miễn phí và trong phạm vi cần thiết để lưu trữ, hiển thị, định dạng, kiểm duyệt, sao lưu và vận hành tính năng. Việc dùng ảnh cưới cho quảng cáo công khai phải dựa trên phạm vi đồng ý riêng hoặc thỏa thuận cụ thể. Người dùng cam kết có quyền đăng nội dung và chịu trách nhiệm khi nội dung chứa hình ảnh của người khác, thông tin trẻ em, âm nhạc, nhãn hiệu hoặc tài sản trí tuệ của bên thứ ba."
        },
        {
          num: "10",
          title: "Đánh giá và xếp hạng",
          text: "Đánh giá phải dựa trên trải nghiệm thực tế, nêu sự kiện có thể kiểm chứng và không chứa thông tin riêng tư không cần thiết. An Wedding có thể gắn nhãn “đã đặt dịch vụ”, ẩn, giới hạn hiển thị hoặc gỡ đánh giá vi phạm; việc điều chỉnh không nhằm che giấu ý kiến tiêu cực hợp lệ."
        },
        {
          num: "11",
          title: "Tạm khóa và chấm dứt tài khoản",
          bullets: [
            "An Wedding có thể yêu cầu xác minh bổ sung, giới hạn tính năng hoặc tạm khóa khi phát hiện rủi ro gian lận, an ninh, vi phạm chính sách hoặc yêu cầu của cơ quan có thẩm quyền.",
            "Đối với vi phạm có thể khắc phục, Người dùng được thông báo lý do và cơ hội giải trình trong phạm vi phù hợp.",
            "Việc đóng tài khoản không xóa nghĩa vụ thanh toán, hoàn tiền, chứng cứ, tranh chấp hoặc dữ liệu cần lưu theo pháp luật.",
            "Người dùng có thể yêu cầu xem xét lại quyết định thông qua kênh hỗ trợ."
          ]
        },
        {
          num: "12",
          title: "Giới hạn hợp lý và tính sẵn sàng",
          text: "An Wedding nỗ lực duy trì hệ thống ổn định nhưng không cam kết dịch vụ luôn không gián đoạn. Bảo trì, lỗi nhà cung cấp hạ tầng, sự cố mạng, bất khả kháng hoặc yêu cầu bảo mật có thể làm gián đoạn tạm thời. An Wedding không loại trừ trách nhiệm trong trường hợp pháp luật không cho phép loại trừ."
        },
        {
          num: "13",
          title: "Thông báo và cập nhật",
          text: "Thông báo có thể được gửi qua ứng dụng, email, SMS hoặc số điện thoại đã đăng ký. Với thay đổi quan trọng làm giảm đáng kể quyền của Người dùng, An Wedding sẽ thông báo trước theo thời gian hợp lý và xin lại sự đồng ý nếu pháp luật hoặc bản chất xử lý yêu cầu."
        }
      ]
    },
    {
      id: "part2",
      title: "Phần II: Chính sách quyền riêng tư",
      icon: "🛡️",
      ref: sectionRefs.part2,
      articles: [
        {
          num: "1",
          title: "Nguyên tắc xử lý dữ liệu",
          bullets: [
            "Minh bạch về loại dữ liệu, mục đích, chủ thể nhận dữ liệu và thời gian lưu giữ.",
            "Chỉ thu thập dữ liệu cần thiết, phù hợp với chức năng Người dùng lựa chọn.",
            "Tách biệt sự đồng ý bắt buộc để cung cấp dịch vụ với sự đồng ý tùy chọn cho tiếp thị hoặc cá nhân hóa nâng cao.",
            "Cho phép Người dùng thực hiện quyền truy cập, chỉnh sửa, rút lại sự đồng ý, phản đối hoặc yêu cầu xóa theo điều kiện áp dụng.",
            "Áp dụng biện pháp kỹ thuật và tổ chức hợp lý; không tuyên bố hệ thống có thể loại bỏ hoàn toàn mọi rủi ro."
          ]
        },
        {
          num: "2",
          title: "Dữ liệu An Wedding có thể thu thập",
          table: {
            headers: ["Nhóm dữ liệu", "Ví dụ", "Mục đích chính", "Tính chất"],
            rows: [
              ["Tài khoản và liên hệ", "Họ tên, số điện thoại, email, ngày sinh, mật khẩu băm", "Tạo tài khoản, xác thực, liên hệ, khôi phục, chống gian lận", "Bắt buộc một phần"],
              ["Hồ sơ kế hoạch cưới", "Ngày dự kiến, khu vực, phong cách, ngân sách, số khách", "Gợi ý Vendor, lập checklist, quản lý ngân sách, báo giá", "Tùy theo tính năng"],
              ["Booking và thanh toán", "Gói dịch vụ, giá, đặt cọc, lịch sử giao dịch, hóa đơn", "Thực hiện giao dịch, đối soát, hỗ trợ, phòng chống lạm dụng", "Cần cho giao dịch"],
              ["Trao đổi và hỗ trợ", "Tin nhắn, nội dung khiếu nại, tệp đính kèm", "Kết nối, giải quyết yêu cầu, kiểm soát chất lượng", "Cần theo tình huống"],
              ["Thiết bị và nhật ký", "IP, loại thiết bị, hệ điều hành, trình duyệt, lỗi", "Bảo mật, vận hành, phân tích lỗi, chống lạm dụng", "Tự động"],
              ["Vị trí", "Tỉnh/thành, khu vực tìm kiếm; vị trí chính xác", "Hiển thị Vendor gần, tính phí di chuyển, gợi ý", "Tùy chọn"],
              ["Đăng nhập xã hội", "Tên, email, ảnh đại diện từ Google/Facebook", "Đăng ký/đăng nhập nhanh và liên kết tài khoản", "Tùy chọn"],
              ["Dữ liệu xác minh", "CCCD hoặc tài liệu tương đương khi có rủi ro", "Xác minh danh tính, xử lý tranh chấp, yêu cầu pháp lý", "Giới hạn & có thông báo"]
            ]
          }
        },
        {
          num: "3",
          title: "Mục đích sử dụng thông tin cá nhân",
          bullets: [
            "Cung cấp dịch vụ cốt lõi: Tạo và quản lý tài khoản, gợi ý dịch vụ, gửi yêu cầu báo giá, xác nhận Booking.",
            "Thực hiện giao dịch: Xử lý thanh toán qua đối tác, đối soát, hoàn tiền và hỗ trợ hóa đơn.",
            "Kết nối với Vendor: Chia sẻ thông tin liên hệ và yêu cầu dịch vụ khi Khách hàng chủ động gửi.",
            "Bảo mật và phòng chống gian lận: Phát hiện truy cập bất thường, tài khoản/Booking giả, lạm dụng chính sách.",
            "Cải thiện sản phẩm: Phân tích hiệu năng hệ thống, sửa lỗi, nghiên cứu trải nghiệm.",
            "Cá nhân hóa và Tiếp thị: Gợi ý gói cưới phù hợp và gửi ưu đãi khi có sự đồng ý."
          ]
        },
        {
          num: "4",
          title: "Dữ liệu chia sẻ với ai",
          table: {
            headers: ["Bên nhận", "Phạm vi chia sẻ", "Cam kết / Điều kiện"],
            rows: [
              ["Vendor Người dùng lựa chọn", "Thông tin liên hệ, ngày cưới, địa điểm, nhu cầu Booking", "Chỉ dùng để tư vấn và thực hiện dịch vụ hoặc xử lý tranh chấp"],
              ["Đối tác thanh toán", "Mã giao dịch, số tiền, thông tin định danh tối thiểu", "Tuân thủ tiêu chuẩn an toàn của đơn vị trung gian được cấp phép"],
              ["Nhà cung cấp hạ tầng", "Lưu trữ đám mây, gửi OTP/email, phân tích lỗi", "Hợp đồng bảo mật nghiêm ngặt, chỉ xử lý theo chỉ dẫn kỹ thuật"],
              ["Cơ quan nhà nước", "Theo yêu cầu hợp pháp của cơ quan có thẩm quyền", "Đánh giá đúng thẩm quyền, ghi nhận hồ sơ cung cấp theo luật"]
            ]
          }
        },
        {
          num: "5",
          title: "Cam kết bảo mật của An Wedding",
          bullets: [
            "Không bán dữ liệu cá nhân của Người dùng như một sản phẩm dữ liệu độc lập.",
            "Không dùng ảnh cưới, video riêng tư cho mục đích quảng cáo công khai khi chưa có sự đồng ý rõ ràng.",
            "Không yêu cầu cung cấp mật khẩu hoặc OTP qua các cuộc gọi hỗ trợ bên ngoài ứng dụng.",
            "Mã hóa đường truyền dữ liệu (SSL/TLS), bảo vệ mật khẩu bằng thuật toán băm (bcrypt) và sao lưu định kỳ."
          ]
        }
      ]
    },
    {
      id: "part3",
      title: "Phần III: Chính sách tài khoản & bảo mật",
      icon: "🔑",
      ref: sectionRefs.part3,
      articles: [
        {
          num: "1",
          title: "Điều kiện đăng ký",
          bullets: [
            "Người đăng ký tài khoản giao dịch phải từ đủ 18 tuổi.",
            "Sử dụng tên và thông tin liên hệ mà Người dùng thực tế có quyền kiểm soát.",
            "Không đăng ký thay cho người khác nếu chưa được ủy quyền hợp pháp.",
            "Không tạo tài khoản mới nếu trước đó đã bị khóa vĩnh viễn vì vi phạm nghiêm trọng."
          ]
        },
        {
          num: "2",
          title: "Thông tin bắt buộc và tùy chọn",
          table: {
            headers: ["Loại", "Thông tin", "Ghi chú"],
            rows: [
              ["Bắt buộc", "Họ tên, số điện thoại hoặc email, mật khẩu, xác nhận độ tuổi", "Dùng để tạo và bảo vệ tài khoản chống xâm nhập trái phép"],
              ["Bổ sung khi giao dịch", "Địa chỉ, thông tin liên hệ nhận dịch vụ, dữ liệu Booking, thông tin hóa đơn", "Chỉ yêu cầu khi các chức năng đặt chỗ cần xử lý thực tế"],
              ["Tùy chọn", "Ảnh đại diện, phong cách cưới, ngân sách dự kiến, ngày cưới dự kiến", "Giúp cá nhân hóa gợi ý, người dùng có thể cập nhật hoặc bỏ qua"],
              ["Xác minh tăng cường", "Giấy tờ nhận dạng (CCCD/Hộ chiếu) trong tình huống rủi ro", "Chỉ yêu cầu khi phát hiện giao dịch bất thường hoặc tranh chấp lớn"]
            ]
          }
        },
        {
          num: "3",
          title: "Bảo mật tài khoản, mật khẩu và OTP",
          bullets: [
            "Người dùng phải sử dụng mật khẩu mạnh, không chia sẻ mật khẩu, OTP hoặc mã khôi phục cho bất kỳ ai.",
            "Chỉ nhập thông tin đăng nhập trên tên miền chính thức www.anwedding.com hoặc ứng dụng chính thức.",
            "Thông báo ngay lập tức cho An Wedding khi nghi ngờ tài khoản bị hack, mất số điện thoại đăng ký hoặc có giao dịch lạ."
          ]
        }
      ]
    },
    {
      id: "part4",
      title: "Phần IV: Đặt dịch vụ, thanh toán & hủy hoàn tiền",
      icon: "💳",
      ref: sectionRefs.part4,
      articles: [
        {
          num: "1",
          title: "Quy trình đặt dịch vụ cưới",
          text: "Quy trình bao gồm 7 bước rõ ràng: 1. Tìm kiếm -> 2. Gửi yêu cầu báo giá -> 3. So sánh trao đổi trên chat -> 4. Xác nhận Booking và lịch -> 5. Thanh toán đặt cọc -> 6. Nghiệm thu từng mốc dịch vụ -> 7. Hoàn tất & gửi đánh giá."
        },
        {
          num: "2",
          title: "Thanh toán và cơ chế giữ tiền an toàn",
          text: "Để bảo vệ quyền lợi của Khách hàng, An Wedding áp dụng cơ chế thanh toán giữ tiền theo các mốc thực hiện dịch vụ:",
          bullets: [
            "Đặt cọc (20%–50%): Thanh toán ngay khi xác nhận Booking để Vendor khóa lịch và chuẩn bị nguyên vật liệu.",
            "Thanh toán theo tiến độ: Theo các mốc nghiệm thu thỏa thuận trước trong Booking.",
            "Hoàn tất dịch vụ: Số dư còn lại được giải ngân cho Vendor sau khi Khách hàng xác nhận hài lòng hoặc hết thời hạn phản hồi tự động.",
            "Tạm giữ khi có khiếu nại: Số tiền tranh chấp sẽ được hệ thống tạm khóa cho đến khi các bên hòa giải xong."
          ]
        },
        {
          num: "3",
          title: "Chính sách hủy dịch vụ mặc định",
          text: "Nếu trong Booking không có thỏa thuận hủy riêng, khung hoàn tiền mặc định sau sẽ được áp dụng cho các khoản tiền chưa thực hiện:",
          table: {
            headers: ["Thời điểm Khách hàng hủy trước ngày dịch vụ", "Mức hoàn tham khảo", "Ghi chú"],
            rows: [
              ["Từ 30 ngày trở lên", "Hoàn 90%", "Khấu trừ phí cổng thanh toán và chi phí thực tế không thể thu hồi"],
              ["Từ 15 đến 29 ngày", "Hoàn 70%", "Khấu trừ chi phí chuẩn bị mặt bằng/nhân sự hợp lý"],
              ["Từ 07 đến 14 ngày", "Hoàn 50%", "Áp dụng khi Vendor đã giữ lịch cứng và từ chối khách hàng khác"],
              ["Dưới 07 ngày", "Hoàn 20%", "Đền bù thiệt hại giữ lịch của Vendor"],
              ["Không đến / Không phối hợp", "Không hoàn tiền", "Vendor chứng minh đã chuẩn bị đầy đủ tại địa điểm hẹn"]
            ]
          }
        }
      ]
    },
    {
      id: "part5",
      title: "Phần V: Quy tắc cộng đồng & đánh giá",
      icon: "💬",
      ref: sectionRefs.part5,
      articles: [
        {
          num: "1",
          title: "Nguyên tắc cộng đồng",
          bullets: [
            "Trung thực: Không đăng đánh giá giả, không mạo danh trải nghiệm chưa có thực.",
            "Tôn trọng: Không dùng từ ngữ lăng mạ, quấy rối, thù ghét hoặc bôi nhọ danh dự của người khác.",
            "Bảo mật riêng tư: Không công khai thông tin cá nhân của Vendor (SĐT riêng, CCCD, địa chỉ nhà) trên phần đánh giá công cộng.",
            "Bản quyền hình ảnh: Chỉ tải lên hình ảnh, video mà bạn sở hữu quyền sử dụng hợp pháp."
          ]
        },
        {
          num: "2",
          title: "Kiểm duyệt nội dung",
          text: "An Wedding bảo lưu quyền ẩn hoặc xóa các nội dung, hình ảnh hoặc đánh giá vi phạm Quy tắc cộng đồng. Đối với tài khoản cố ý thao túng đánh giá hoặc spam quảng cáo, hệ thống có thể tạm khóa hoặc chấm dứt quyền sử dụng dịch vụ mà không cần báo trước."
        }
      ]
    },
    {
      id: "part6",
      title: "Phần VI: Khiếu nại & giải quyết tranh chấp",
      icon: "⚖️",
      ref: sectionRefs.part6,
      articles: [
        {
          num: "1",
          title: "Kênh tiếp nhận khiếu nại chính thức",
          bullets: [
            "Trung tâm trợ giúp trực tiếp trong tài khoản Khách hàng.",
            "Email tiếp nhận hồ sơ: support@anwedding.com (dành cho tranh chấp cần đính kèm hợp đồng, ảnh chụp đối chứng).",
            "Đầu mối bảo vệ dữ liệu cá nhân: privacy@anwedding.com."
          ]
        },
        {
          num: "2",
          title: "Quy trình xử lý tranh chấp 6 bước",
          bullets: [
            "Bước 1: Tiếp nhận khiếu nại và tạo mã vụ việc trong vòng 24 giờ.",
            "Bước 2: Phân loại mức độ vi phạm và kiểm tra thông tin hợp đồng Booking.",
            "Bước 3: Áp dụng biện pháp tạm thời (Tạm giữ tiền thanh toán, khóa tài khoản nếu có dấu hiệu lừa đảo).",
            "Bước 4: Yêu cầu Vendor và Khách hàng cung cấp tài liệu, hình ảnh, tin nhắn đối chứng trong vòng 3-5 ngày làm việc.",
            "Bước 5: Tiến hành hòa giải điện tử để hai bên thống nhất phương án đổi lịch hoặc bồi thường.",
            "Bước 6: Ra quyết định xử lý cuối cùng dựa trên các bằng chứng thu thập được nếu hai bên không tự thỏa thuận được."
          ]
        }
      ]
    },
    {
      id: "part7",
      title: "Phần VII: Bản đồng ý khi đăng ký tài khoản",
      icon: "✍️",
      ref: sectionRefs.part7,
      articles: [
        {
          num: "1",
          title: "Cam kết khi tạo tài khoản An Wedding",
          text: "Bằng việc bấm nút 'Đăng ký' hoặc 'Đăng nhập', Người dùng chính thức đồng ý:",
          bullets: [
            "Đã đọc kỹ, hiểu rõ và đồng ý bị ràng buộc bởi Điều khoản sử dụng và tất cả các chính sách đi kèm của AN Wedding.",
            "Cam kết cung cấp thông tin liên hệ chính xác, chính chủ và chịu trách nhiệm trước pháp luật về tính chân thực của thông tin đó.",
            "Chấp thuận nhận các thông báo điện tử cần thiết phục vụ vận hành, giao dịch và cập nhật an ninh bảo mật từ hệ thống."
          ]
        }
      ]
    }
  ];

  // Filter content based on search query
  const getFilteredContent = () => {
    if (!searchQuery.trim()) return sectionsData;

    const query = searchQuery.toLowerCase();
    return sectionsData.map(section => {
      const matchingArticles = section.articles.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.text?.toLowerCase().includes(query) || 
        article.bullets?.some(b => b.toLowerCase().includes(query))
      );
      
      return {
        ...section,
        articles: matchingArticles
      };
    }).filter(section => section.articles.length > 0);
  };

  const filteredSections = getFilteredContent();

  return (
    <div className={styles.pageContainer}>
      <SharedHeader theme="light" />

      {/* Hero Header with Luxury Styling */}
      <section className={styles.heroSection}>
        <div className={styles.heroBgOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.badgeRow}>
            <span className={styles.versionBadge}>PHIÊN BẢN 1.0</span>
            <span className={styles.metaBadge}>📅 Cập nhật: 13/07/2026</span>
            <span className={styles.metaBadge}>⚡ Hiệu lực: 01/08/2026</span>
          </div>
          <h1 className={styles.title}>Điều Khoản & Chính Sách</h1>
          <p className={styles.subtitle}>
            Chào mừng bạn đến với AN Wedding. Vui lòng đọc kỹ các điều khoản và chính sách dưới đây để hiểu rõ quyền lợi và trách nhiệm của bạn khi sử dụng nền tảng của chúng tôi.
          </p>

          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm điều khoản (ví dụ: hoàn tiền, hủy lịch, đặt cọc...)"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className={styles.mainLayout}>
        {/* Left Interactive Sidebar */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>
            <span>📋</span> Mục lục chính sách
          </h2>
          <ul className={styles.navList}>
            {sectionsData.map((sec) => (
              <li
                key={sec.id}
                className={`${styles.navItem} ${activeTab === sec.id && !searchQuery ? styles.activeNavItem : ""}`}
                onClick={() => handleTabClick(sec.id)}
              >
                <span className={styles.navIcon}>{sec.icon}</span>
                <span>{sec.title}</span>
              </li>
            ))}
          </ul>

          <div className={styles.sidebarCard}>
            <h3 className={styles.cardTitle}>Tải bản đầy đủ</h3>
            <p className={styles.cardDesc}>Bạn muốn lưu trữ hoặc in bản điều khoản đầy đủ của AN Wedding?</p>
            <button className={styles.printBtn} onClick={handlePrint}>
              🖨️ In / Tải PDF điều khoản
            </button>
          </div>

          <div className={styles.sidebarCard}>
            <h3 className={styles.cardTitle}>Cần hỗ trợ pháp lý?</h3>
            <p className={styles.cardDesc}>Gửi thư trực tiếp tới bộ phận pháp lý của chúng tôi tại Việt Nam.</p>
            <a href="mailto:privacy@anwedding.com" className={styles.cardLink}>
              ✉️ privacy@anwedding.com →
            </a>
          </div>
        </aside>

        {/* Right Content Area */}
        <article className={styles.contentArea}>
          {filteredSections.length === 0 ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3>Không tìm thấy kết quả nào phù hợp</h3>
              <p>Vui lòng thử lại với từ khóa khác hoặc duyệt danh mục bên trái.</p>
            </div>
          ) : (
            filteredSections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                ref={section.ref}
                className={styles.sectionBlock}
              >
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIconBadge}>{section.icon}</div>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                </div>

                {section.articles.map((art, idx) => (
                  <div key={idx} className={styles.subArticle}>
                    <h3 className={styles.articleTitle}>
                      {art.num}. {art.title}
                    </h3>
                    
                    {art.text && <p className={styles.articleText}>{art.text}</p>}

                    {art.bullets && (
                      <ul className={styles.customList}>
                        {art.bullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    )}

                    {art.table && (
                      <div style={{ overflowX: "auto" }}>
                        <table className={styles.styledTable}>
                          <thead>
                            <tr>
                              {art.table.headers.map((h, hIdx) => (
                                <th key={hIdx}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {art.table.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}

          {/* Legal references footnote */}
          <div className={styles.calloutBox}>
            <div className={styles.calloutTitle}>
              ⚖️ Cơ sở tham chiếu pháp lý
            </div>
            <p className={styles.calloutText}>
              Bộ điều khoản được xây dựng tham chiếu các quy định pháp luật Việt Nam hiện hành: Luật Thương mại điện tử số 122/2025/QH15, Nghị định số 248/2026/NĐ-CP, Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15, Nghị định số 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, Luật Giao dịch điện tử số 20/2023/QH15, và Luật An ninh mạng số 24/2018/QH14.
            </p>
          </div>
        </article>
      </main>

      <Footer1 />
    </div>
  );
};

export default TermsPage;
