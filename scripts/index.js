window.addEventListener("load", () => {
  init();
});

let imageURI = "";
let resultCount = 0;
let resultTotal = 0;
let totalPages = 0;
let pageNum = 1;

const showMore = document.querySelector(".showMore");
const showMoreInfo = document.querySelector(".showMoreInfo");

function init() {
  let collectionBtn = document.querySelector(".collectionBtn");
  collectionBtn.addEventListener("click", () => query());

  let showcaseClose = document.querySelector(".closeShowcase");
  showcaseClose.addEventListener("click", closeShowcase);

  let searchInput = document.querySelector(".collection");
  searchInput.addEventListener("keyup", (e) => {
    if (e.keyCode == 13) {
      query();
    }
  });

  let form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  const pageNext = document.querySelector(".showMoreControl.next");
  pageNext.addEventListener("click", () => {
    pageQuery("next");
  });
  const pagePrev = document.querySelector(".showMoreControl.prev");
  pagePrev.addEventListener("click", () => {
    pageQuery("prev");
  });
}

function repeatClose() {
  let showcaseClose = document.querySelector(".closeShowcase");
  showcaseClose.addEventListener("click", closeShowcase);
}

function query(pageNumber = 1) {
  console.log("Page Number", pageNumber);

  if (pageNumber === 1) {
    pageNum = 1;
  }

  const collectionInput = document.querySelector(".collection");
  const collectionResult = document.querySelector(".collectionResult > h2");
  const collectionTitle = document.querySelector(".contentTitle");
  const gallery = document.querySelector(".gallery");

  let footer = document.querySelector("footer");
  footer.style.display = "none";
  footer.style.bottom = "unset";

  let collectionValue = collectionInput.value;
  let template = ``;

  /*
    Here I am validating the collectionValue to make sure that somthing has been entered to be searched. If it is equal to nothing then
    the collectionResult div will be set to a message in which the end user will see. This is done via textContent which is the correct way
    of setting the content as it is simply a string which the textContent node accepts.
    */
  if (collectionValue === "") {
    collectionResult.textContent = "Please enter a search term.";
  } else {
    /*
        If there is data within the collectionValue variable then we can continue on with the query.
        To query the V & A API I'm using the Fetch API which is a newer alternative than previous XMLHttpRequest(XHR)/AJAX methods.
        The fetch API is async by nature. It uses promises which makes it easier to handle and avoids using callbacks which can get 
        fairly complex depending on complexity of the API/Data request.

        I have also chained the promises which has enabled me to access data across the requests. The first thing to do when using the fetch
        API was to specify the URL/URI in my case I used ES6 Template Strings (Template Litreal) which uses backticks (``) and allows inline templating funcitonality
        within the string this is great as it means I don't have to concatinate the URL string and vairbles together which can get fairly complex
        when there is alot of URL parameters.

        In the V&A API the main parameter is the search query for this I am simply passing in the collectionValue via the use of the
        template strings. The next paramter is the offset this is used to get the rest of the results from the query as the V & A has a deafult limit
        of 15 records per request this can be changed by using the limit paramter but I have decided to keep it at the deafult.
        */
    fetch(
      `https://api.vam.ac.uk/v2/objects/search?q=${collectionValue}&page=${pageNumber}&page_size=15`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (apiData) {
        resultTotal = apiData.info.record_count;
        totalPages = apiData.info.pages || 1;
        apiData.records.forEach((item) => {
          let title = item._primaryTitle || "";
          let place = item._primaryPlace || "";
          let imageID = item._primaryImageId || null;
          let artist = item._primaryMaker ? item._primaryMaker.name : "";

          let titleFull = title;

          resultCount = apiData.records.length;

          if (title.length > 37) {
            title = title.substring(37, length) + "....";
          } else if (title.length == 0) {
            title = "Title unavailable";
            titleFull = "Title unavailable";
          }

          if (place.length == 0) {
            place = "Unavaliable";
          }

          /* v2 API provides image URLs directly in the _images object
                       We'll use the _iiif_image_base_url to construct a medium-sized image
                    */

          if (item._images && item._images._iiif_image_base_url) {
            imageURI =
              item._images._iiif_image_base_url + "full/768,/0/default.jpg";
          } else {
            imageURI =
              "https://archiveshub.jisc.ac.uk/images/contrlogos/valogo.jpg";
          }

          /*
                        This is the template for the data to be placed in. I am using template strings to format the markup and then pass
                        in the related variables. This is a much cleaner way than dynamicly creating each element and then appending in the
                        same nested order. Also notice I have used the + and = opperator to ensure that the previous template is added on
                        in the next itteration of the loop, otherwise it would be overwritten each time and there would only be one item on
                        the page the last in the JSON array.
                    */

          template += `
                    <div class="item-wrapper">
                    <div class="item">
                    <img class="vaImage" src="${imageURI}" onerror="replaceImage(this)">
                    <div class="item__overlay">
                        <h2 class="itemTitle">${title}</h2>
                        <h2 class="itemTitleFull">${titleFull}</h2>
                        <div class="divider-load"></div>
                        <div class="divider"></div>
                        <h3 class="itemTitle titleSmall">${artist}</h3>
                        <div class="locationArea">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${place}</span>
                        </div>
                    </div>
                    </div>
                    </div>
                `;
          gallery.innerHTML = template;

          collectionResult.textContent = "";

          addEvents();
        });

        if (apiData.records.length == 0) {
          gallery.innerHTML = "";
          console.log("No results");
          collectionResult.textContent =
            "No results found for: " + collectionValue;
        } else {
          console.log(apiData.records);

          collectionResult.textContent = `Showing (${resultTotal}) results for: ${collectionValue}`;
        }

        if (totalPages > 1) {
          showMore.classList.add("show");

          showMoreInfo.innerHTML = pagination();

          window.scroll({
            top: 0,
            left: 0,
            behavior: "instant",
          });
        } else {
          showMore.classList.remove("show");
        }
      });
  }

  setTimeout(() => {
    footer.style.display = "block";
  }, 1000);
}

function pagination() {
  console.log("Pagination", resultTotal, "Total Pages", totalPages);

  let paginationControl = ``;

  return (paginationControl = `<span>Page ${pageNum} of ${totalPages}</span>`);
}

function pageQuery(page) {
  console.log("Hit Page", page);
  if (page == "next") {
    pageNum++;
    query(pageNum);
  } else {
    if (pageNum > 1) {
      pageNum--;
      query(pageNum);
    }
  }
}

function closeShowcase() {
  console.log("Showcase Close");
  const showcaseWrapper = document.querySelector(".itemShowcaseWrapper");
  showcaseWrapper.classList.remove("showcaseShow");

  const itemExpand = document.querySelector(".expandActive");
  itemExpand.classList.remove("expandActive");

  setTimeout(() => {
    const showcaseContainer = document.querySelector(".itemShowcase");
    showcaseContainer.innerHTML = `<div class="closeShowcase">
                                            <i class="far fa-times-circle"></i>
                                        </div>`;
  }, 1000);

  setTimeout(() => {
    let itemTitleIn = document.querySelector(".itemTitleOut");
    let itemTitleSmallIn = document.querySelector(".itemTitleSmallOut");
    let vaImageIn = document.querySelector(".vaImageOut");
    let locationAreaIn = document.querySelector(".locationAreaOut");
    let dividerSelectIn = document.querySelector(".dividerOut");
    let dividerLoadIn = document.querySelector(".dividerloadOut");
    let itemIn = document.querySelector(".itemBorderOut");

    itemTitleIn.classList.remove("itemTitleOut");

    itemTitleSmallIn.classList.remove("itemTitleSmallOut");

    console.log(vaImageIn);
    vaImageIn.classList.remove("vaImageOut");

    locationAreaIn.classList.remove("locationAreaOut");

    dividerSelectIn.classList.remove("dividerOut");
    dividerLoadIn.classList.remove("dividerloadOut");
    itemIn.classList.remove("itemBorderOut");

    repeatClose();
  }, 1200);
}

function addEvents() {
  function handleClick(e) {
    const showcaseWrapper = document.querySelector(".itemShowcaseWrapper");
    const showcase = document.querySelector(".itemShowcase");
    const item = e.currentTarget;
    const itemOverlay = e.currentTarget.querySelector(".item__overlay");
    const dividerSelect = itemOverlay.querySelector(".divider");
    const dividerLoad = itemOverlay.querySelector(".divider-load");
    const itemTitle = itemOverlay.querySelector(".itemTitle");
    const itemTitleFull = itemOverlay.querySelector(".itemTitleFull");
    const itemTitleSmall = itemOverlay.querySelector(".itemTitle.titleSmall");
    const vaImage = e.currentTarget.querySelector(".vaImage");
    const locationArea = itemOverlay.querySelector(".locationArea");

    dividerLoad.classList.add("divider-load-active");

    itemTitle.classList.add("itemTitleOut");

    itemTitleSmall.classList.add("itemTitleSmallOut");

    vaImage.classList.add("vaImageOut");

    locationArea.classList.add("locationAreaOut");
    setTimeout(() => {
      dividerSelect.classList.add("dividerOut");
      dividerLoad.classList.add("dividerloadOut");
      item.classList.add("itemBorderOut");
    }, 1500);

    let itemCopy = item.cloneNode(true);
    showcase.append(itemCopy);

    setTimeout(() => {
      item.classList.add("expandActive");
    }, 2000);

    setTimeout(() => {
      let itemShowcase = showcase.querySelector(".item");
      itemShowcase.classList.add("itmShowcase");

      let itemOverlayShowcase = showcase.querySelector(".item__overlay");
      itemOverlayShowcase.classList.add("itmOverlayShowcase");

      let itemTitleShowcase = itemOverlayShowcase.querySelector(".itemTitle");
      itemTitleShowcase.classList.add("itmTitleShowcase");
      itemTitleShowcase.textContent = itemTitleFull.textContent;

      let itemTitleSmallShowcase = itemOverlayShowcase.querySelector(
        ".itemTitle.titleSmall"
      );
      itemTitleSmallShowcase.classList.add("tSmallShowcase");

      let dividerShowcase = itemOverlayShowcase.querySelector(".divider");
      dividerShowcase.classList.add("divderShowcase");

      let dividerLoadShowcase =
        itemOverlayShowcase.querySelector(".divider-load");
      dividerLoadShowcase.classList.add("divderloadShowcase");

      let vaImageShowcase = showcase.querySelector(".vaImage");
      vaImageShowcase.classList.add("vaimageShowcase");

      let locationAreaShowcase =
        itemOverlayShowcase.querySelector(".locationArea");
      locationAreaShowcase.classList.add("locareaShowcase");
    }, 3700);

    setTimeout(() => {
      showcaseWrapper.classList.add("showcaseShow");
    }, 3600);
  }

  function handleClickWrapper(e) {
    e.currentTarget.style.zIndex = "2";
  }

  const items = document.querySelectorAll(".item");
  const itemsWrapper = document.querySelectorAll(".item-wrapper");

  items.forEach((item) => item.addEventListener("click", handleClick));

  itemsWrapper.forEach((itemWrapper) =>
    itemWrapper.addEventListener("click", handleClickWrapper)
  );
}

function replaceImage(image) {
  image.onerror = "";
  image.src = "https://archiveshub.jisc.ac.uk/images/contrlogos/valogo.jpg";
  return true;
}
