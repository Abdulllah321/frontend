export function fetchLoggedInUserOrders() {
  return new Promise(async (resolve) => {
    const response = await fetch("/orders/own/");
    const data = await response.json();
    resolve({ data });
  });
}

export function fetchLoggedInUser() {
  return new Promise(async (resolve) => {
    const response = await fetch("/users/own");
    const data = await response.json();
    resolve({ data });
  });
}

export function updateUser(update) {
  return new Promise(async (resolve) => {
    const response = await fetch("/users/" + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}

export function fetchAllUser() {
  return new Promise(async (resolve) => {
    const response = await fetch("/users/all");
    const data = await response.json();
    resolve({ data });
  });
}

export function deleteUser(userId) {
  return new Promise(async (resolve) => {
    const response = await fetch("/users/all/" + userId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data: { id: userId } });
  });
}

export function updateAllUser(update) {
  return new Promise(async (resolve) => {
    const response = await fetch("/users/all/" + update.id, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data });
  });
}
