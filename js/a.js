// global variables
let productName = document.querySelector("#exampleFormControlInput1");
let productPrice = document.querySelector("#exampleFormControlInput2");
let productCategory = document.querySelector("#exampleFormControlInput3");
let Search = document.querySelector("#exampleFormControlInput4");
let productDescription = document.querySelector("#exampleFormControlTextarea1");
let tbody = document.querySelector("#tbody");
let Add = document.querySelector("#Add");
let Save = document.querySelector("#Save");
let mainArray = [];
// check if localStorage not empty
if (localStorage.getItem("Product")) {
  mainArray = JSON.parse(localStorage.getItem("Product"));
}
// main function
Add.onclick = function () {
  if (
    productName.value.trim() != "" &&
    productPrice.value.trim() != "" &&
    productCategory.value.trim() != "" &&
    productDescription.value.trim() != ""
  ) {
    let mainObject = {
      objProductName: productName.value,
      objProductPrice: productPrice.value,
      objProductCategory: productCategory.value,
      objProductDescription: productDescription.value,
    };
    mainArray.push(mainObject);
    showData();
    emptying();
    updateLocalStorage();
  }
};
// to display data
function showData() {
  let temp = "";
  for (let i = 0; i < mainArray.length; i++) {
    temp += `
      <tr>
        <td>${i + 1}</td>
        <td>${mainArray[i].objProductName}</td>
        <td>${mainArray[i].objProductPrice}</td>
        <td>${mainArray[i].objProductCategory}</td>
        <td>${mainArray[i].objProductDescription}</td>
        <td><button class="btn Update" onclick="UpdateX(${i})">Update</button></td>
        <td><button class="btn Delete" onclick="DeleteX(${i})">Delete</button></td>
      </tr>
    `;
  }
  tbody.innerHTML = temp;
}
// if array is empty show this message
function noData() {
  tbody.innerHTML = `
      <tr>
        <td class="noData" colspan="7">No Data To Show</td>
      </tr>
    `;
}
// invoke showData , noData
showData();
if (mainArray.length < 1) {
  noData();
}
// to update localStorage
function updateLocalStorage() {
  return localStorage.setItem("Product", JSON.stringify(mainArray));
}
// to empty inputs
function emptying() {
  productName.value = "";
  productPrice.value = "";
  productCategory.value = "";
  productDescription.value = "";
}
// to remove elements from main array
function DeleteX(el) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "delete this row",
      cancelButtonText: "cancel",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          "Deleted!",
          "this row has been deleted.",
          "success"
        );
        //start my code here
        mainArray.splice(el, 1);
        updateLocalStorage();
        showData();
        if (mainArray.length < 0) {
          noData();
        }
        emptying();
        //end my code here
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          "Cancelled",
          "You cancelled delete row.",
          "error"
        );
      }
    });
}
//hide buttons
function hideButtons(b1, b2) {
  b1.style.display = "none";
  b2.style.display = "block";
}
// to Update elements from main array
function UpdateX(el) {
  // to add class disabled
  let disabledButtons = document.querySelectorAll(".Update");
  disabledButtons.forEach((ele) => {
    ele.classList.remove("disabled");
    ele.addEventListener("", (e) => {
      e.target.classList.add("disabled");
    });
  });

  // without this condition if search result < 1 button update can't add class disabled
  if (disabledButtons.length > 1) {
    // disabledButtons[el].classList.add("disabled");
    console.log(disabledButtons[el]);
  } else {
    disabledButtons[0].classList.add("disabled");
  }
  // check if user remove data from input during the update ? add class disabled to Save button : remove disabled class
  let inputEmpty = document.querySelectorAll(".inputEmpty");
  inputEmpty.forEach((item) => {
    item.oninput = function () {
      if (
        productName.value.trim() == "" ||
        productPrice.value.trim() == "" ||
        productCategory.value.trim() == "" ||
        productDescription.value.trim() == ""
      ) {
        Save.classList.add("disabled");
      } else {
        Save.classList.remove("disabled");
      }
    };
  });

  hideButtons(Add, Save);
  productName.value = mainArray[el].objProductName;
  productPrice.value = mainArray[el].objProductPrice;
  productCategory.value = mainArray[el].objProductCategory;
  productDescription.value = mainArray[el].objProductDescription;
  Save.onclick = function () {
    if (
      productName.value.trim() != "" &&
      productPrice.value.trim() != "" &&
      productCategory.value.trim() != "" &&
      productDescription.value.trim() != ""
    ) {
      mainArray[el].objProductName = productName.value;
      mainArray[el].objProductPrice = productPrice.value;
      mainArray[el].objProductCategory = productCategory.value;
      mainArray[el].objProductDescription = productDescription.value;
      hideButtons(Save, Add);
      updateLocalStorage();
      showData();
      emptying();
    }
  };
}
// search function
Search.oninput = function () {
  let count = 0;
  let temp = "";
  for (let i = 0; i < mainArray.length; i++) {
    if (
      mainArray[i].objProductName
        .toLowerCase()
        .includes(Search.value.toLowerCase())
    ) {
      count++;
      temp += `
          <tr>
            <td>${i + 1}</td>
            <td>${mainArray[i].objProductName}</td>
            <td>${mainArray[i].objProductPrice}</td>
            <td>${mainArray[i].objProductCategory}</td>
            <td>${mainArray[i].objProductDescription}</td>
            <td><button class="btn Update" onclick="UpdateX(${i})">Update</button></td>
            <td><button class="btn Delete" onclick="DeleteX(${i})">Delete</button></td>
          </tr>
        `;
      tbody.innerHTML = temp;
    }
    if (count < 1) {
      noData();
    }
  }
};
