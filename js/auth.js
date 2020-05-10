//auth
//listen for auth status changes
auth.onAuthStateChanged((user) => {
  if (user) {
    setupUI(user);
  } else setupUI();
  // fetchMobilePhones([]);
  // fetchAccessories([]);
});

// get current user id
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User logged in already or has just logged in.
    // console.log(user.uid);

    //get user cart details
    db.doc(`users/${user.uid}`)
      .collection("usercart")
      .onSnapshot((snapshot) => {
        // console.log(snapshot.docs);
        fetchCart(snapshot.docs);
        // data called on index.js
      });
  } else {
    // User not logged in or has just logged out.
  }
});

//remove items from cart
function removeItem(name, useruid, price) {
  var user = firebase.auth().currentUser;
  totalPriceAfterRemoveITem = 0;
  if (user) {
    // User is signed in.
    console.log(useruid);
  } else {
    // No user is signed in.
  }

  // db.doc(`users/${user.uid}`).collection('usercart').doc(`${name}`).delete()
  db.doc(`users/${user.uid}`).collection("usercart").doc(name).delete();
  M.toast({ html: "Item removed" });

  var del = document.querySelector(".remove-from-cart");
  var row = del.parentNode.parentNode;
  row.parentNode.removeChild(row);
  totalPriceAfterRemoveITem -= price;
  document.querySelector(".total-price-count").innerHTML = totalPriceAfterRemoveITem;
}

//change ui on auth
const accountDetails = document.querySelector(".account-details");
const loggedInLinks = document.querySelectorAll(".logged-in");
const loggedOutLinks = document.querySelectorAll(".logged-out");

const setupUI = (user) => {
  if (user) {
    //show user info in accounts section when logged in
    const html = `
    <div>You are signed as : ${user.email}</div>
        `;

    accountDetails.innerHTML = html;

    //toggle UI elemnts (nav links)
    loggedInLinks.forEach((item) => (item.style.display = "block"));
    loggedOutLinks.forEach((item) => (item.style.display = "none"));
  } else {
    //hide user info in accounts section when logged in
    accountDetails.innerHTML = "";

    loggedInLinks.forEach((item) => (item.style.display = "none"));
    loggedOutLinks.forEach((item) => (item.style.display = "block"));
  }
};

//fetch user cart in modal
// fetch  cart  from database

const cartContainer = document.querySelector(".cartWrapper");
const fetchCart = (data) => {
  var user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
  }

  // console.log(user);

  let html = "";
  let totalPrice = Number(0);
  if (data.length === 0) {
    console.log("no cart");
    document.querySelector(".hide-cart").style.display = "block";
    document.querySelector(".show-cart").style.display = "none";
  } else {
    document.querySelector(".show-cart").style.display = "block";
    document.querySelector(".hide-cart").style.display = "none";
    console.log("cart");
    data.forEach((doc) => {
      const cart = doc.data();

      const li = `
      <tr class="cart-row">
      <td><img src="${cart.image}" width="50px" ></td>
      <td>${cart.name}</td>
      <td><i class="material-icons remove-from-cart" onclick="removeItem('${cart.name}', '${cart.price}')">remove_circle_outline</i></td>
      <td class="product-prices">${cart.price}</td>
        </tr>
    `;

      html += li;
      totalPrice += cart.price;
    });

    document.querySelector(".total-price-count").innerHTML = totalPrice;
    cartContainer.innerHTML = html;
  }
};

//signup form
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  const password2 = signupForm["signup-password-repeat"].value;
  const phone = signupForm["signup-phone"].value;
  if (password != password2) {
    signupForm.querySelector(".signup-error").innerHTML =
      "Password dosen't match";
  } else {
    // signup the user and add firestore data
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        // console.log('dtd', data)
        return data.user.uid;
      })
      .then((uid) => {
        console.log(uid);

        const credentials = {
          email,
          uid,
          phone,
        };

        db.doc(`users/${uid}`).set(credentials);
      })
      .then((c) => {
        const modal = document.querySelector("#modal-signup");
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector(".signup-error").innerHTML = "";
      })
      .catch((err) => {
        signupForm.querySelector(".signup-error").innerHTML = err.message;
      });
  }
});

//logout user
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    M.toast({ html: "User signed out" });
    window.location = "index.html";
  });
});

//login user
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get user info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((c) => {
      //close the login modal and reset the form

      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      loginForm.querySelector(".signin-error").innerHTML = "";
      location.reload();
    })
    .catch((err) => {
      loginForm.querySelector(".signin-error").innerHTML = err.message;
    });
});

// --------------------setup materialize component for modals--------------------
document.addEventListener("DOMContentLoaded", function () {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});