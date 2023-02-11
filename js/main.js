// global variables
let siteName = document.querySelector("#exampleFormControlInput1");
let siteURL = document.querySelector("#exampleFormControlInput2");
let siteCategory = document.querySelector("#exampleFormControlInput3");
let Search1 = document.querySelector("#exampleFormControlInput4");
let Search2 = document.querySelector("#exampleFormControlInput5");
let errorMsg = document.querySelectorAll(".errorMsg");
let inputEmpty = document.querySelectorAll(".inputEmpty");
let tbody = document.querySelector("#tbody");
let Add = document.querySelector("#Add");
let Save = document.querySelector("#Save");

// check if localStorage not empty
if (localStorage.getItem("Sites")) {
  mainArray = JSON.parse(localStorage.getItem("Sites"));
} else {
  mainArray = [];
}

// disabled add button until validation
inputEmpty.forEach((item) => {
  item.oninput = function () {
    if (displayError()) {
      Add.classList.remove("disabled");
    } else {
      Add.classList.add("disabled");
    }
  };
});
Add.classList.add("disabled");

// main function
Add.addEventListener("click", function () {
  if (displayError()) {
    let mainObject = {
      siteNameObj: siteName.value,
      siteURLObj: siteURL.value,
      siteCategoryObj: siteCategory.value,
    };
    mainArray.push(mainObject);
    localStorageFunction();
    displayData();
    clearData();
    Search1.value = "";
    Search2.value = "";
  }
});

// Regular Expression function
function RegExInput(regex, ele) {
  if (regex.test(ele)) {
    return true;
  } else {
    return false;
  }
}

// function show error
function displayError() {
  for (let i = 0; i < inputEmpty.length; i++) {
    if (
      inputEmpty[0].value == "" ||
      inputEmpty[1].value == "" ||
      inputEmpty[2].value == ""
    ) {
      if (inputEmpty[i].value == "") {
        errorMsg[i].style.display = "block";
        errorMsg[i].innerHTML = "this field is required";
      } else {
        errorMsg[i].style.display = "none";
      }
    } else {
      x(
        RegExInput(/^[A-Z][\w]{1,14}$/, siteName.value),
        "must be start with Capital letter and have from 2 to 15 letter",
        0
      );
      x(
        RegExInput(
          /^http(s)?:\/\/(www\.)?.+\.com(\/)((\?).*)?$/,
          siteURL.value
        ),
        "enter valid link such as www.google.com",
        1
      );
      x(
        RegExInput(/^[A-Z].{1,14}$/, siteCategory.value),
        "must be start with Capital letter and have from 2 to 15 letter",
        2
      );
      if (
        RegExInput(/^[A-Z][\w]{1,14}$/, siteName.value) &&
        RegExInput(
          /^http(s)?:\/\/(www\.)?.+\.com(\/)((\?).*)?$/,
          siteURL.value
        ) &&
        RegExInput(/^[A-Z].{1,14}$/, siteCategory.value)
      ) {
        return true;
      }
    }
  }
}
function x(reg, errTxt, i) {
  if (reg) {
    errorMsg[i].style.display = "none";
  } else {
    errorMsg[i].style.display = "block";
    errorMsg[i].innerHTML = errTxt;
  }
}

// function to display data
function displayData() {
  let temp = "";
  for (let i = 0; i < mainArray.length; i++) {
    temp += `
    <tr>
      <td>${i + 1}</td>
      <td>${mainArray[i].siteNameObj}</td>
      <td>${mainArray[i].siteCategoryObj}</td>
      <td><a target="_blank" class="btn" href="${
        mainArray[i].siteURLObj
      }"  data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Tooltip on bottom" title="${
      mainArray[i].siteURLObj
    }">Visit Site</a></td>
      <td onclick=UpdateX(${i})><button class="btn Update">Update</button></td>
      <td onclick="DeleteX(${i})"><button class="btn Delete">Delete</button></td>
    </tr>
    `;
  }
  tbody.innerHTML = temp;
}

// no data available
function noData() {
  tbody.innerHTML = `
      <tr>
        <td class="noData" colspan="6">No Data To Show</td>
      </tr>
    `;
}

// invoke displayData , noData
displayData();
if (mainArray.length < 1) {
  noData();
}

// function to update data in local storage
function localStorageFunction() {
  return localStorage.setItem("Sites", JSON.stringify(mainArray));
}

// Delete function
function DeleteX(i) {
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
        mainArray.splice(i, 1);
        displayData();
        localStorageFunction();
        clearData();
        if (mainArray.length < 1) {
          noData();
        }
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

// clear function
function clearData() {
  siteName.value = "";
  siteURL.value = "";
  siteCategory.value = "";
  for (let i = 0; i < errorMsg.length; i++) {
    errorMsg[i].style.display = "none";
  }
}

// function update
function UpdateX(i) {
  // to disabled button save if any input empty
  clearData();
  inputEmpty.forEach((item) => {
    item.oninput = function () {
      if (
        siteName.value.trim() == "" ||
        siteCategory.value.trim() == "" ||
        siteURL.value.trim() == "" ||
        !displayError()
      ) {
        Save.classList.add("disabled");
      } else {
        Save.classList.remove("disabled");
      }
    };
  });
  // switch display of buttons
  hideButtons(Add, Save);
  siteName.value = mainArray[i].siteNameObj;
  siteCategory.value = mainArray[i].siteCategoryObj;
  siteURL.value = mainArray[i].siteURLObj;
  Save.onclick = function () {
    if (
      siteName.value.trim() != "" &&
      siteCategory.value.trim() != "" &&
      siteURL.value.trim() != ""
    ) {
      mainArray[i].siteNameObj = siteName.value;
      mainArray[i].siteCategoryObj = siteCategory.value;
      mainArray[i].siteURLObj = siteURL.value;
      hideButtons(Save, Add);
      localStorageFunction();
      displayData();
      clearData();
    }
  };
}

//hide buttons
function hideButtons(b1, b2) {
  b1.style.display = "none";
  b2.style.display = "block";
}

// search function
function Search(SearchX, X) {
  clearData();
  hideButtons(Save, Add);
  let temp = "";
  // this function flag to check if search results < 1 ? invoke noData function
  let count = 0;

  // this flag to tracking which search input run now
  let thisInputSearch = X.target.dataset.flag;
  let thisFlagSearch;

  for (let i = 0; i < mainArray.length; i++) {
    if (thisInputSearch == "Search1") {
      thisFlagSearch = mainArray[i].siteNameObj;
    } else if (thisInputSearch == "Search2") {
      thisFlagSearch = mainArray[i].siteCategoryObj;
    }
    if (thisFlagSearch.toLowerCase().includes(SearchX.toLowerCase())) {
      count++;
      temp += `
      <tr>
        <td>${i + 1}</td>
        <td>${mainArray[i].siteNameObj}</td>
        <td>${mainArray[i].siteCategoryObj}</td>
        <td><a target="_blank" class="btn" href="${
          mainArray[i].siteURLObj
        }"  data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Tooltip on bottom" title="sd">Visit Site</a></td>
        <td onclick=UpdateX(${i})><button class="btn Update">Update</button></td>
        <td onclick="DeleteX(${i})"><button class="btn Delete">Delete</button></td>
      </tr>
        `;
      tbody.innerHTML = temp;
    }
    if (count < 1) {
      noData();
    }
  }
}
Search1.addEventListener("input", (e) => {
  Search2.value = "";
  Search(Search1.value, e);
  console.log();
});
Search2.addEventListener("input", (e) => {
  Search1.value = "";
  Search(Search2.value, e);
});
