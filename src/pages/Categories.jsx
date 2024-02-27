import React, { useState } from "react";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/common/Footer";
import { useSelector } from "react-redux";
import { selectCategories } from "../features/product/productSlice";
import { mainCategory } from "../features/common/MainCategories";

export default function Categories() {
  const categories = useSelector(selectCategories);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  const mainCategoriesWithCategories = mainCategory.filter((main) =>
    categories.some((cat) => cat.mainCategory?.[0]?.title === main.title)
  );

  const categoriesByMain = categories.reduce((acc, cat) => {
    if (cat.mainCategory && cat.mainCategory.length > 0) {
      const mainTitle = cat.mainCategory[0].title;
      if (!acc[mainTitle]) {
        acc[mainTitle] = [];
      }
      acc[mainTitle].push(cat);
    }
    return acc;
  }, {});

  return (
    <>
      <NavBar>
        <div className="flex bg-blue-50 shadow-xl p-4">
          <div className="mr-6">
            {mainCategoriesWithCategories.map((parentCategory) => (
              <div
                key={parentCategory.title}
                className={`w-24 relative cursor-pointer my-2 bg-white flex flex-col items-center justify-center rounded-md ${
                  selectedMainCategory === parentCategory.title
                    ? "border border-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedMainCategory(parentCategory.title)}
              >
                <img
                  src={parentCategory.image}
                  alt={parentCategory.title}
                  className="w-20 h-20 rounded-md"
                />
                <div className="text-center font-bold w-20 capitalize">
                  {parentCategory.title}
                </div>
              </div>
            ))}
          </div>
          <div className="h-max w-full">
            {Object.entries(categoriesByMain).map(([mainTitle, cats]) => (
              <div key={mainTitle} className="mb-4 w-full">
                <div className="font-bold mb-2 capitalize bg-custom-gradient text-white px-2 w-full flex items-center justify-between gap-4 rounded-md  ">
                  <div className="flex flex-shrink-0">
                  {mainTitle}
                  </div>
                  <span className="w-full h-[2px] bg-white"/>
                </div>
                <div className="flex gap-2">
                  {cats.map((cat) => (
                    <div
                      key={cat.label}
                      className="flex flex-col items-center bg-white rounded-md p-2 w-28"
                    >
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-24 h-24 object-cover"
                      />
                      <div>{cat?.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </NavBar>
      <Footer />
    </>
  );
}
