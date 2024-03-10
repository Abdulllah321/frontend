export async function addToWishlist(item) {
  const response = await fetch("/wishlist", {
    method: "POST",
    body: JSON.stringify(item),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return { data };
}

export async function fetchWishlistItemsByUserId() {
  const response = await fetch("/wishlist", {
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return { data };
}

export async function updateWishlistItem(update) {
  const response = await fetch(`/wishlist/${update.id}`, {
    method: "PATCH",
    body: JSON.stringify(update),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return { data };
}

export async function deleteItemFromWishlist(itemId) {
  const response = await fetch(`/wishlist/${itemId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  await response.json(); // Assuming the response is not used since we're resolving with a custom object
  return { data: { id: itemId } };
}

export async function resetWishlist() {
  const response = await fetchWishlistItemsByUserId();
  const items = response.data;
  for (let item of items) {
    await deleteItemFromWishlist(item.id);
  }
  return { status: "success" };
}
