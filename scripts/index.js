// Add an event listener to the window to make sure the DOM has been fully loaded and ready for Manipulation
// Use of ES6 Arrow Function
window.addEventListener('load', () => {
    init();
});

// Globaly scoped variables for full acess within any function
let imageURI = ''; // Image URI variable declaration
let resultCount = 0; // Result count variable to hold the records length 
let resultTotal = 0; // Result total based on the meta object within the API contains the total amount of the records found via querying the API
let pagOffset = 0; // Page offset variable is used to hold the offset count for Pagination
let pageNum = 1; // Page number variable used to store the current page number based on the pagination function call

const showMore = document.querySelector('.showMore'); // Constant for storing the showMore element for Pagination
const showMoreInfo = document.querySelector('.showMoreInfo'); // Constant for storing the showMoreInfo value


// The Initialize function, mostly contains event listeners awaiting a particular event to occur to run further functions
function init() {

    // The search button event listener. Once clicked it will run the query function to query the API.
    let collectionBtn = document.querySelector('.collectionBtn');
    collectionBtn.addEventListener('click', query);

    // The showcase close button event listener. Once clicked this will run the showcaseClose function which closes the showcase area.
    let showcaseClose = document.querySelector('.closeShowcase');
    showcaseClose.addEventListener('click', closeShowcase);


    // The search input event listener is to handle the enter key press when searching in the search input. 
    // On any keyup event within the search input the checkKey function will run which checks to see if the key pressed is the enter key
    // If it is equal to 13 then the query function is run.
    let searchInput = document.querySelector('.collection');
    searchInput.addEventListener('keyup', e => { // Anonymous arrow function passing the event (e)
        console.log('Test')
        if (e.keyCode == 13) {
            query();
        }
    });

    // The form event listener this will stop the deafult form action of refeshing the page / running the form action. 
    // This is all done with a simple anonymous arrow function using event preventDeafult.
    let form = document.querySelector('form');
    form.addEventListener('submit', e => {
        e.preventDefault();
    });

    // Here I am handling the page next and previous event in which once the next / prev button is clicked on the page controls it will fire the pageQuery function.
    // Which the value of 'next'/'prev' is passed in via the functions parameter so it knows which control has been clicked.
    const pageNext = document.querySelector('.showMoreControl.next');
    pageNext.addEventListener('click', () => {
        pageQuery('next');
    });
    const pagePrev = document.querySelector('.showMoreControl.prev');
    pagePrev.addEventListener('click', () => {
        pageQuery('prev');
    });
}

function repeatClose() {
    let showcaseClose = document.querySelector('.closeShowcase');
    showcaseClose.addEventListener('click', closeShowcase);
}



// This is the main function of the entire application. This is what handles the query for the API aswell as part of the dynamic markup creation,
// From the requested data.
function query(pagOffset) {
    // A range of querySelectors that get various elements that are used within the query function.
    // As these are declared in the query function this are localy scoped, and cannot be accessed outside.
    const collectionInput = document.querySelector('.collection');
    const collectionResult = document.querySelector('.collectionResult > h2');
    const collectionTitle = document.querySelector('.contentTitle');
    const gallery = document.querySelector('.gallery');

    // Here I am simply reseting the footer so we don't get a sudden flash/movement once the dynamic content enters in as it enters in via
    // Animated delay.
    let footer = document.querySelector('footer');
    footer.style.display = 'none';
    footer.style.bottom = 'unset';

    // This is where we get the search query from the user/input field.
    // Using .value on the collectonInput element we get the entered value and pass it into collectionValue for use later on.
    let collectionValue = collectionInput.value;
    let template = ``; // This variable will hold the markup for the content that will be dynamiclly generated later from the API data.

    /*
    Here I am validating the collectionValue to make sure that somthing has been entered to be searched. If it is equal to nothing then
    the collectionResult div will be set to a message in which the end user will see. This is done via textContent which is the correct way
    of setting the content as it is simply a string which the textContent node accepts.
    */
    if (collectionValue === '') {
        collectionResult.textContent = 'Please enter a search term.';
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
        fetch(`https://www.vam.ac.uk/api/json/museumobject/search?q=${collectionValue}&offset=${pagOffset}`)
            .then(function (response) {
                return response.json(); // Here I am returning the reponse as json 
            })
            .then(function (apiData) { // The Returned JSON response is then accessible within the next promise as I have chained them
                resultTotal = apiData.meta.result_count; // Set the resultTotal to the global variable
                apiData.records.forEach(item => { // The forEach loop allows me to loop through each record item/object within the JSON Data item can be named anything 

                    // Here I am using Object Destructuring this is assining the objects nested key data to variables without having to it line by line specifiy the path to the data each time
                    // E.g. item.fields.place and again for each specific nested key. 
                    
                    let {title, place, "primary_image_id": imageID, artist} = item.fields;

                    // Keep orginal title
                    let titleFull = title;

                    resultCount = apiData.records.length;

                    // Truncate title if too long and replace if missing
                    if (title.length > 37) {
                        title = title.substring(37, length) + '....';
                    } else if (title.length == 0) {
                        title = 'Title unavailable';
                        titleFull = 'Title unavailable';
                    }

                    // If there is no place within the place property value witin the object then set it to Unavaliable for the particular record in the itteration 
                    if (place.length == 0) {
                        place = 'Unavaliable';
                    }


                    /* Here we are checking to see if there is a primary_image_id property within the json fields object this is
                       Important as if we did not have this then the code would run below and throw and error as there would be no
                       data within the imageID variable. We can then also cater for the records that dont have images by including an else
                       statement which will just replace the imageURI variable to a placeholder image.
                    */

                    if (item.fields.hasOwnProperty('primary_image_id')) {

                        let imageIDp1 = imageID.substring(0, 6);
                        imageURI = `https://media.vam.ac.uk/media/thira/collection_images/${imageIDp1}/${imageID}.jpg`;

                    } else {
                        imageURI = 'https://archiveshub.jisc.ac.uk/images/contrlogos/valogo.jpg';
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
                    // Sanitizing data before use

                    // Resetting the users search query within the result section.
                    collectionResult.textContent = '';

                    // Calling the addEvents function
                    addEvents();
                });

                // Here I am validaiting the records length if there are none then that means the searched query did not find anything
                // If the are records then the collection result section is set with the resultTotal and collectionValue
                if (apiData.records.length == 0) {
                    gallery.innerHTML = '';
                    console.log('No results');
                    collectionResult.textContent = 'No results found for: ' + collectionValue;
                } else {
                    console.log(apiData.records);
                    // Set result term
                    collectionResult.textContent = `Showing (${resultTotal}) results for: ${collectionValue}`;
                }

                // Check to see if result is greater than offset amount if true enable pagination.

                if (apiData.records.length >= 15) {
                    showMore.classList.add('show');

                    // Call the pagination function which returns the number of pages
                    showMoreInfo.innerHTML = pagination();

                    // Everytime a new page is clicked I am setting the window to the top via the window.scroll API
                    window.scroll({
                        top: 0,
                        left: 0,
                        behavior: 'instant'
                    });
                }


            });

    }
    // Show footer once the dynamic content is loaded
    setTimeout(() => {
        footer.style.display = 'block';
    }, 1000);
}

/* 

The Pagination function works out how many pages there are based on the searched query the user
enters. This is done by getting the resultTotal from the meta object within the api. After getting the
total amount of objects it is then a case of doing some Math. I am using the Math.floor function to get a
integer back and not a decimal. Once I have the total pages I then need to add on 1 as the remainder has not yet
been counted for. As the API is offseted by 15 there are only 15 results displated on a page at a time this is what I
divide by to get the pages amount. To get the remainder e.g. I'm using the modulo arithemtic opperator which will give
me the remainer which will be the amount of items on the very last page. 

*/

function pagination() {
    console.log('Pagination', resultTotal);

    let totalPages = Math.floor(resultTotal / 15) + 1;
    let remainder = resultTotal % 15;
    let paginationControl = ``;

    console.log('Total Pages: ' + totalPages + 'Remainder: ' + remainder);

        // In the future a page range selection could be implemented by doing somthing like below

        // for (let i = 1; i <= totalPages; i++) {
        //     paginationControl = `<span>Page ${i++} of ${totalPages}</span>`;
        //     return paginationControl;
        // }

    return paginationControl = `<span>Page ${pageNum} of ${totalPages}</span>`;
}

/* 

The pageQuery function takes a page peramter which is either next or prev depending on which
button was clicked within the pagination controls. If next is clicked the pagOffset variable
is incremented to 15. Every time the user clicks on next it will increment by 15 each time
and then run the query function while passing in the pagOffset value this value is then used
within the api request URI parameter to get the next offset for the next set of results within
the original query. To go back to a previous page the above happens just in opposite (decrement)

*/

function pageQuery(page) {
    console.log('Hit Page', page);
    if (page == 'next') {
        pagOffset += 15;
        query(pagOffset);
        pageNum++;
    } else {
        pagOffset -= 15;
        query(pagOffset);
        // Decrement Page Number
        pageNum--;
    }
}

/* 

The closeShowcase function handles the closing of the showcase area. This function simply reverses the items orginal state before
it was cloned and expanded into the showcase view. 

*/

function closeShowcase() {
    console.log('Showcase Close');
    const showcaseWrapper = document.querySelector('.itemShowcaseWrapper');
    showcaseWrapper.classList.remove('showcaseShow');

    
    const itemExpand = document.querySelector('.expandActive');
    itemExpand.classList.remove('expandActive');
    
    setTimeout(() => {
        const showcaseContainer = document.querySelector('.itemShowcase');
        showcaseContainer.innerHTML = `<div class="closeShowcase">
                                            <i class="far fa-times-circle"></i>
                                        </div>`;
    }, 1000);


    setTimeout(() => {

        let itemTitleIn = document.querySelector('.itemTitleOut');
        let itemTitleSmallIn = document.querySelector('.itemTitleSmallOut');
        let vaImageIn = document.querySelector('.vaImageOut');
        let locationAreaIn = document.querySelector('.locationAreaOut');
        let dividerSelectIn = document.querySelector('.dividerOut');
        let dividerLoadIn = document.querySelector('.dividerloadOut');
        let itemIn = document.querySelector('.itemBorderOut');

    // H1 Title 
    itemTitleIn.classList.remove('itemTitleOut');
    // Small Title
    itemTitleSmallIn.classList.remove('itemTitleSmallOut');

    console.log(vaImageIn);
    vaImageIn.classList.remove('vaImageOut');
    // Location Area
    locationAreaIn.classList.remove('locationAreaOut');

    // Dividers Out
    dividerSelectIn.classList.remove('dividerOut');
    dividerLoadIn.classList.remove('dividerloadOut');
    itemIn.classList.remove('itemBorderOut');

    repeatClose();
    }, 1200);


}

/* 

The addEvents function is the main function for all of the item events that occur on the page.
This is mainly for animation purposes in which adding of classes is done in a specifc order to
transiton to the showcase area in which the item is cloned via cloneNode and then re styled to
fit within the showcase view.

*/

function addEvents() {

    function handleClick(e) {

        const showcaseWrapper = document.querySelector('.itemShowcaseWrapper');
        const showcase = document.querySelector('.itemShowcase');
        const item = e.currentTarget;
        const itemOverlay = e.currentTarget.querySelector('.item__overlay');
        const dividerSelect = itemOverlay.querySelector('.divider');
        const dividerLoad = itemOverlay.querySelector('.divider-load');
        const itemTitle = itemOverlay.querySelector('.itemTitle');
        const itemTitleFull = itemOverlay.querySelector('.itemTitleFull');
        const itemTitleSmall = itemOverlay.querySelector('.itemTitle.titleSmall');
        const vaImage = e.currentTarget.querySelector('.vaImage');
        const locationArea = itemOverlay.querySelector('.locationArea');
        // Start loading
        dividerLoad.classList.add('divider-load-active');

        // Transiton Out
            // H1 Title 
            itemTitle.classList.add('itemTitleOut');

            // Small Title
            itemTitleSmall.classList.add('itemTitleSmallOut');
            // Image
            vaImage.classList.add('vaImageOut');
            // Location Area
            locationArea.classList.add('locationAreaOut');
            setTimeout(() => {
                // Dividers Out
                dividerSelect.classList.add('dividerOut');
                dividerLoad.classList.add('dividerloadOut');
                item.classList.add('itemBorderOut');
            }, 1500);

        
        // Clone the element and append to showcase
        let itemCopy = item.cloneNode(true);
        showcase.append(itemCopy);
        
        // Add expand class after 5 seconds

        setTimeout( () => {
            item.classList.add('expandActive');
            // Divider and Divider Load
        }, 2000);

        setTimeout( () => {
            // Item
            let itemShowcase = showcase.querySelector('.item');
            itemShowcase.classList.add('itmShowcase');

            // Item Overlay
            let itemOverlayShowcase = showcase.querySelector('.item__overlay');
            itemOverlayShowcase.classList.add('itmOverlayShowcase');

            // H1 Title 
            let itemTitleShowcase = itemOverlayShowcase.querySelector('.itemTitle');
            itemTitleShowcase.classList.add('itmTitleShowcase');
            itemTitleShowcase.textContent = itemTitleFull.textContent;

            // Small Title
            let itemTitleSmallShowcase = itemOverlayShowcase.querySelector('.itemTitle.titleSmall');
            itemTitleSmallShowcase.classList.add('tSmallShowcase');

            // Divider
            let dividerShowcase = itemOverlayShowcase.querySelector('.divider');
            dividerShowcase.classList.add('divderShowcase');

            // Divider Load
            let dividerLoadShowcase = itemOverlayShowcase.querySelector('.divider-load');
            dividerLoadShowcase.classList.add('divderloadShowcase');

            // Image
            let vaImageShowcase = showcase.querySelector('.vaImage');
            vaImageShowcase.classList.add('vaimageShowcase');

            // Location Area
            let locationAreaShowcase = itemOverlayShowcase.querySelector('.locationArea');
            locationAreaShowcase.classList.add('locareaShowcase');
        }, 3700);

        setTimeout( () => {
            showcaseWrapper.classList.add('showcaseShow');
        }, 3600);

    }


    /* 

    The handleClickWrapper function does what is says and handles the wrappers z-index once clicked.
    This is for animation purposes for the item showcase transiton.  

    */

    function handleClickWrapper(e) {
        e.currentTarget.style.zIndex = '2';
    }


    const items = document.querySelectorAll('.item');
    const itemsWrapper = document.querySelectorAll('.item-wrapper');

    items.forEach(item => item.addEventListener('click', handleClick));

    // Wrapper Handle event
    itemsWrapper.forEach(itemWrapper => itemWrapper.addEventListener('click', handleClickWrapper));


}


/* 

The replaceImage function replaces images that are present within the object but are broken.
To replace the broken images the replaceImage function is called if the image src response is
a 404 error this is done via the onerror attribute and saves looping through each element to
check the response status on each URL the onerror simply calls the replaceImage function and
passes itself (this) which then resets its current src to the deafult image URL.

*/

function replaceImage(image) {
    image.onerror = "";
    image.src = 'https://archiveshub.jisc.ac.uk/images/contrlogos/valogo.jpg';
    return true;
}

