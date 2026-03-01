const API = "http://localhost:5000";

// ================= REGISTER =================
function register() {
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    role: document.getElementById("role").value
  };
// api
  fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(d => {
    alert(d.message);
  })
  .catch(err => console.log(err));
}

// ================= LOGIN =================
function login() {
  const data = {
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value
  };

  fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(d => {
    if (d.user) {
      localStorage.setItem("user", JSON.stringify(d.user));

      if (d.user.role === "Restaurant") {
        window.location = "restaurant.html";
      } else {
        window.location = "index.html";
      }
    } else {
      alert(d.message);
    }
  })
  .catch(err => console.log(err));
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("user");
  window.location = "index.html";
}

// ================= LOAD PUBLIC RESTAURANTS =================
function loadRestaurants() {
  fetch(API + "/restaurants")
  .then(res => res.json())
  .then(data => {
    const div = document.getElementById("restaurants");
    if (!div) return;

    div.innerHTML = "";

    data.forEach(r => {
      div.innerHTML += `
        <div class="restaurant-card">
          <h3>${r.name}</h3>
          <div id="meals-${r._id}"></div>
          <button class="btn primary" onclick="loadMeals('${r._id}')">
            View Meals
          </button>
        </div>
      `;
    });
  });
}

// ================= LOAD MEALS =================
function loadMeals(id) {
  fetch(API + "/meals/" + id)
  .then(res => res.json())
  .then(data => {
    const div = document.getElementById("meals-" + id);
    div.innerHTML = "";

    data.forEach(m => {
      div.innerHTML += `
        <div class="meal-item">
          <span>${m.name}</span>
          <span>${m.price}৳</span>
        </div>
      `;
    });
  });
}

// ================= LOAD MY RESTAURANTS =================
function loadMyRestaurants() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  fetch(API + "/restaurants")
  .then(res => res.json())
  .then(data => {

    const my = data.filter(r => r.ownerId === user._id);

    const select = document.getElementById("restaurantSelect");
    const container = document.getElementById("myRestaurants");

    if (!select || !container) return;

    select.innerHTML = "";
    container.innerHTML = "";

    my.forEach(r => {

      select.innerHTML += `<option value="${r._id}">${r.name}</option>`;

      container.innerHTML += `
        <div class="restaurant-card">
          <h3>${r.name}</h3>
          <div id="meals-${r._id}"></div>
          <button class="btn primary" onclick="loadMeals('${r._id}')">
            View Meals
          </button>
        </div>
      `;
    });
  });
}

// ================= ADD RESTAURANT =================
function addRestaurant() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  fetch(API + "/restaurants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("rName").value,
      ownerId: user._id
    })
  })
  .then(res => res.json())
  .then(d => {
    alert(d.message);
    loadMyRestaurants();
  });
}

// ================= ADD MEAL =================
function addMeal() {
  const id = document.getElementById("restaurantSelect").value;

  fetch(API + "/meals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurantId: id,
      name: document.getElementById("mealName").value,
      price: document.getElementById("mealPrice").value
    })
  })
  .then(res => res.json())
  .then(d => {
    alert(d.message);
    loadMeals(id);
  });
}
