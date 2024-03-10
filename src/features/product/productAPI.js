export function fetchProductById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/products/" + id);

      if (response.status === 401) {
        const userConfirmed = window.confirm(
          "Your session have been expired please Login again."
        );
        if (userConfirmed) {
          window.location.reload();
        }
      }

      const data = await response.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

export function createProduct(product) {
  return new Promise(async (resolve) => {
    const response = await fetch("/products/", {
      method: "POST",
      body: JSON.stringify(product),
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function updateProduct(update) {
  return new Promise(async (resolve) => {
    const response = await fetch("/products/" + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

export function createCategory(category) {
  return new Promise(async (resolve) => {
    const response = await fetch("/categories", {
      method: "POST",
      body: JSON.stringify(category),
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function createSubCategory(category) {
  return new Promise(async (resolve) => {
    const response = await fetch("/categories/sub", {
      method: "POST",
      body: JSON.stringify(category),
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function createBrand(brand) {
  return new Promise(async (resolve) => {
    const response = await fetch("/brands", {
      method: "POST",
      body: JSON.stringify(brand),
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}
export function createRating(rating) {
  return new Promise(async (resolve) => {
    const response = await fetch("/rating", {
      method: "POST",
      body: JSON.stringify(rating),
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function updateRating(update) {
  return new Promise(async (resolve) => {
    const response = await fetch("/rating/" + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function deleteRating(ratingId) {
  return new Promise(async (resolve) => {
    const response = await fetch("/rating/" + ratingId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data: { id: ratingId } });
  });
}

export function fetchProductsByFilters(
  filter,
  sort,
  pagination,
  admin,
  min,
  max,
  rating
) {
  let queryString = "";
  const filterKeys = Object.keys(filter);

  filterKeys.forEach((key) => {
    const categoryValues = filter[key];
    if (categoryValues.length) {
      queryString += categoryValues.map((value) => `${key}=${value}`).join("&");
      queryString += "&";
    }
  });

  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }

  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  if (admin) {
    queryString += `admin=true&`;
  }

  if (min) {
    queryString += `minPrice=${min}&`;
  }

  if (max) {
    queryString += `maxPrice=${max}&`;
  }
  if (rating) {
    queryString += `rating=${rating}&`;
  }

  return new Promise(async (resolve) => {
    const response = await fetch("/products?" + queryString);
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    const totalItems = await response.headers.get("X-Total-Count");
    resolve({ data: { products: data, totalItems: +totalItems } });
  });
}

export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch("/categories");
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}
export function fetchSubCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch("/categories/sub");
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch("/brands");
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchRating() {
  return new Promise(async (resolve) => {
    const response = await fetch("/rating");
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}
export function fetchRatingById(id) {
  return new Promise(async (resolve) => {
    const response = await fetch("/rating/" + id);
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchDeletedProducts() {
  return new Promise(async (resolve) => {
    const response = await fetch("/deleted-products");
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function restoreDeletedProduct(id) {
  return new Promise(async (resolve) => {
    const response = await fetch(`/deleted-products/${id}/restore`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function updateCategory(update) {
  return new Promise(async (resolve) => {
    const response = await fetch("/categories/" + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    // // console.log(data.codeName);
    resolve({ data });
  });
}

export function updateSubCategory(update) {
  return new Promise(async (resolve) => {
    const response = await fetch("/categories/sub/" + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    // // console.log(data.codeName);
    resolve({ data });
  });
}

export function deleteCategory(categoryId) {
  return new Promise(async (resolve) => {
    const response = await fetch("/categories/" + categoryId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data: { id: categoryId } });
  });
}
export function deleteSubCategory(categoryId) {
  return new Promise(async (resolve) => {
    const response = await fetch("/categories/sub/" + categoryId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data: { id: categoryId } });
  });
}

export function updateBrand(update) {
  return new Promise(async (resolve) => {
    const response = await fetch("/brands/" + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    // // console.log(data.codeName);
    resolve({ data });
  });
}

export function deleteBrand(brandId) {
  return new Promise(async (resolve) => {
    const response = await fetch("/brands/" + brandId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();

    resolve({ data: { id: brandId } });
  });
}

export function searchProduct(search) {
  return new Promise(async (resolve) => {
    const response = await fetch("/products?search=" + search);
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function searchSuggestion(search) {
  return new Promise(async (resolve) => {
    const response = await fetch("/products/search?search=" + search);
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

// Slides

export function fetchSlides() {
  return new Promise(async (resolve) => {
    const response = await fetch("/slides");
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function createSlide(slide) {
  return new Promise(async (resolve) => {
    const response = await fetch("/slides", {
      method: "POST",
      body: JSON.stringify(slide),
      headers: { "content-type": "application/json" },
    });

    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();
    resolve({ data });
  });
}

export function deleteSlide(slide) {
  return new Promise(async (resolve) => {
    const response = await fetch("/slides/" + slide, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    if (response.status === 401) {
      const userConfirmed = window.confirm(
        "Your session have been expired please Login again."
      );
      if (userConfirmed) {
        window.location.reload();
      }
    }
    const data = await response.json();

    resolve({ data: { id: slide } });
  });
}
