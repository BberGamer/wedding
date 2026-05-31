import { useState, useEffect } from "react";
import FrameComponent2 from "../components/FrameComponent2";
import HeroContent1 from "../components/HeroContent1";
import FrameComponent3 from "../components/FrameComponent3";
import Footer2 from "../components/Footer2";
import styles from "./WEDDINGPLANNER2.module.css";
import { API_URL } from "../config";

const WEDDINGPLANNER2 = () => {
  const [frameComponent3Items, setFrameComponent3Items] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/restaurants`)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((item, index) => {
          let col = "";
          let row = "";
          if (index % 3 === 1) col = "2";
          else if (index % 3 === 2) col = "3";
          
          if (index >= 0 && index < 3) row = index === 0 ? "1" : "";
          else if (index >= 3 && index < 6) row = "2";
          else if (index >= 6 && index < 9) row = "3";
          else if (index >= 9) row = "4";

          return {
            restaurantDetails: item.image || "/Frame-251@2x.png",
            nhHngTicCiSnGolfSngB: item.name,
            thnhPhThunAnBnhDng: item.address,
            starsFirst: "/Star-1.svg",
            starsSecond: "/Star-2.svg",
            starsThird: "/Star-3.svg",
            starsFourth: "/Star-4.svg",
            starsFifth: "/Star-5.svg",
            nHNBOGI: item.price || "NHẬN BÁO GIÁ",
            frameDivGridColumn: col,
            frameDivWidth: index === 0 ? "415.1px" : index === 11 ? "unset" : "",
            frameDivGridRow: row,
          };
        });
        setFrameComponent3Items(formattedData);
      })
      .catch((err) => console.error("Error fetching restaurants:", err));
  }, []);
  return (
    <div className={styles.weddingPlanner}>
      <FrameComponent2 />
      <main className={styles.heroContentParent}>
        <HeroContent1 />
        <section className={styles.listHeaderParent}>
          <div className={styles.listHeader}>
            <div className={styles.danhSchNh}>DANH SÁCH NHÀ HÀNG</div>
          </div>
          <div className={styles.filterHeaderParent}>
            <div className={styles.filterHeader}>
              <div className={styles.lcTheoWrapper}>
                <div className={styles.danhSchNh}>Lọc theo</div>
              </div>
              <div className={styles.filterOptionListParent}>
                <div className={styles.filterOptionList}>
                  <div className={styles.danhSchNh}>Giá</div>
                </div>
                <div className={styles.filterOptionList2}>
                  <div className={styles.danhSchNh}>Địa điểm</div>
                </div>
                <div className={styles.filterOptionList3}>
                  <div className={styles.danhSchNh}>Xếp hạng</div>
                </div>
                <div className={styles.filterOptionList2}>
                  <div className={styles.danhSchNh}>Phổ biển</div>
                </div>
              </div>
            </div>
            <div className={styles.instanceParent}>
              {frameComponent3Items.map((item, index) => (
                <FrameComponent3
                  key={index}
                  restaurantDetails={item.restaurantDetails}
                  nhHngTicCiSnGolfSngB={item.nhHngTicCiSnGolfSngB}
                  thnhPhThunAnBnhDng={item.thnhPhThunAnBnhDng}
                  starsFirst={item.starsFirst}
                  starsSecond={item.starsSecond}
                  starsThird={item.starsThird}
                  starsFourth={item.starsFourth}
                  starsFifth={item.starsFifth}
                  nHNBOGI={item.nHNBOGI}
                  frameDivGridColumn={item.frameDivGridColumn}
                  frameDivWidth={item.frameDivWidth}
                  frameDivGridRow={item.frameDivGridRow}
                />
              ))}
            </div>
          </div>
        </section>
        <Footer2 />
      </main>
    </div>
  );
};

export default WEDDINGPLANNER2;
