var place = document.getElementById("books-place");
var borrowed = document.getElementById("myDropdown");
var paging = document.getElementById("pagination");
var books = fetch("./books.json")
    .then(x => x.json())
    .then(x => {
        console.log(x);
        return x;
    });
var modal_content = document.getElementById("modal-content");
var currentPage = 1;

function createPaging(amount) {
    place.innerHTML = place.innerHTML +
        `<div class="pagination" id="pagination">
            <a href="#"onclick="decrement()">&laquo;</a>
            <a class ="active"href="#">${currentPage}</a>
            <a href="#" onclick="increment(${amount})">&raquo;</a>
        </div>
    `;
}
function createSearchPaging(amount) {
    place.innerHTML = place.innerHTML +
        `<div class="pagination" id="pagination">
        <a href="#"onclick="decrementSearch()">&laquo;</a>
        <a class ="active"href="#">${currentPage}</a>
        <a href="#" onclick="incrementSearch(${amount})">&raquo;</a>
    </div>
`;
}
function decrement() {

    if (currentPage > 1) {
        currentPage = currentPage - 1;
    }
    clean();

}
function increment(amount) {
    if (amount != undefined && currentPage * 6 < amount) {
        currentPage = currentPage + 1;
    }
    clean();
}

function decrementSearch() {

    if (currentPage > 1) {
        currentPage = currentPage - 1;
    }

    search();

}

function incrementSearch(amount) {

    if (amount != undefined && currentPage * 6 < amount) {
        currentPage = currentPage + 1;
    }
    search();

}
function createBooks() {

    books.then(x => {
        x.books.forEach(element => {

            var obj = { translator: "", available: "", name: "" };
            contentAvailablity(obj, element);

            if (element.id > (currentPage - 1) * 6 && element.id < currentPage * 6 + 1) {
                displayBook(obj, element);
            }

            if (element.Available == false) {
                borrowedNameAvailablity(obj, element);
                displayBorrowedBook(obj, element);
            }
        });

        createPaging(x.books.length);
    });

}
function contentAvailablity(obj, element) {
    if (element.Translator == "None") {
        obj.translator = "-";
    } else {
        obj.translator = element.Translator;
    }
    if (element.Available) {
        obj.available = "Yes";
    } else {
        obj.available = "No";
    }
    if (element.Name.length > 40) {
        obj.name = ` style="font-size:14px;"`;
    } else if (element.Name.length > 30) {
        obj.name = ` style="font-size:20px;"`;
    } else if (element.Name.length > 20) {
        obj.name = ` style="font-size:26px;"`;
    } else {
        obj.name = ``;
    }
}
function displayBook(obj, element) {
    place.innerHTML = place.innerHTML +
        `<div class="block color-back">
        <div class="one-book">
            <img src="${element.Image}" alt="Image for a book" />
            <h1 class="book-name"${obj.name}>${element.Name}</h1>
            <p class="author">${element.Author}</p>
            <p style="margin-bottom: 0px">${element.Price}$</p>
            <div class="text-left">
                <table style="border-spacing: 1rem">
                    <tbody>
                        <tr>
                            <td>Type:</td>
                            <td>${element.Type}</td>
                        </tr>
                        <tr>
                            <td>Translator:</td>
                            <td>${obj.translator}</td>
                        </tr>
                        <tr>
                            <td>Released Date:</td>
                            <td>${element.Released_date}</td>
                        </tr>
                        <tr>
                            <td>Language:</td>
                            <td>${element.Language}</td>
                        </tr>
                        <tr>
                            <td>Available:</td>
                            <td>${obj.available}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button name='${element.id}'class="buttons" onclick="book_detail(name)">Details</button>
        </div >
    </div > `
}
function searchButton() {
    currentPage = 1;
    search();
}
function search() {
    let name = document.getElementById("name");
    let author = document.getElementById("author");
    let type = document.getElementById("type");
    let low_price = document.getElementById("txt_price_low");
    let high_price = document.getElementById("txt_price_max");
    let rel_year = document.getElementById("rel_year");
    let language = document.getElementById("language");
    let availablity = document.getElementById("yes").checked ? true : false;
    if (document.getElementById("yes").checked == false && document.getElementById("no").checked == false) {
        availablity = 1;

    }
    var bookAmount = 0;

    place.innerHTML = "";
    books.then(x => {
        x.books.forEach(element => {
            var obj = { translator: "", available: "", name: "" };
            contentAvailablity(obj, element);

            var searching = {
                name: name,
                author: author,
                type: type,
                low_price: low_price,
                high_price: high_price,
                rel_year: rel_year,
                language: language,
                availablity: availablity,
                suitable: true
            }
            //console.log(element)
            searchAvailability(searching, element);
            if (searching.suitable) {
                if (bookAmount < 6 * currentPage && bookAmount >= 6 * (currentPage - 1)) {

                    displayBook(obj, element);
                }
                bookAmount++;

            }

        });

        createSearchPaging(bookAmount);
    });

}
function searchAvailability(searching, element) {
    if (element.Name.includes(searching.name.value) == false) {
        searching.suitable = false
    }
    if (element.Author.includes(searching.author.value) == false) {
        searching.suitable = false
    }
    if (element.Type.includes(searching.type.value) == false && searching.type.value != "none") {
        searching.suitable = false
    }
    if ((Number(element.Price) < Number(searching.low_price.value)
        || Number(element.Price) > Number(searching.high_price.value))
        && (searching.high_price.value != 0)) {
        searching.suitable = false
    }
    if (element.Released_date.includes(searching.rel_year.value) == false) {
        searching.suitable = false
    }
    if (element.Language.includes(searching.language.value) == false && searching.language.value != "none") {
        searching.suitable = false
    }
    if (element.Available != searching.availablity && searching.availablity != 1) {
        searching.suitable = false
    }

}
function clean() {
    place.innerHTML = "";
    borrowed.innerHTML = "";
    createBooks();
}
function book_detail(id) {
    var modal = document.getElementById("Modal");
    modal.style.display = "block";
    books.then(x => {
        x.books.forEach(element => {
            if (id == element.id) {
                var obj = { translator: "", available: "", name: "" };
                contentAvailablity(obj, element);
                displayDetailedBook(obj, element);
            }
        });
    });

}
function displayDetailedBook(obj, element) {
    modal_content.innerHTML = "";
    modal_content.innerHTML = modal_content.innerHTML +
        `<div class="detail-block color-back">
                <img
                    id="detailed-image"
                    src="${element.Image}"
                    alt="Image for a book"
                    class="detailed-image"
                    
                />
            <div class="one-book detail-one-book">
                
                <h1 class="book-name" ${obj.name}>
                    ${element.Name}
                </h1>
                <p class="author">${element.Author}</p>
                <p style="margin-bottom: 0px">${element.Price}$</p>
                <div class="text-left">
                    <table style="border-spacing: 1rem">
                        <tbody>
                            <tr>
                                <td>Type:</td>
                                <td>${element.Type}</td>
                            </tr>
                            <tr>
                                <td>Publisher:</td>
                                <td>${element.Publisher}</td>
                            </tr>
                            <tr>
                                <td>Translator:</td>
                                <td>${obj.translator}</td>
                            </tr>
                            <tr>
                                <td>Released Date:</td>
                                <td>${element.Released_date}</td>
                            </tr>
                            <tr>
                                <td>Language:</td>
                                <td>${element.Language}</td>
                            </tr>
                            <tr>
                                <td>ISBN:</td>
                                <td>${element.ISBN}</td>
                            </tr>
                            <tr>
                                <td>Page Amount:</td>
                                <td>${element.Page_Amount}</td>
                            </tr>
                            <tr>
                                <td>Shape:</td>
                                <td>${element.Shape}</td>
                            </tr>
                            <tr>
                                <td>Paper Type:</td>
                                <td>${element.Paper_Type}</td>
                            </tr>
                            <tr>
                                <td>Content:</td>
                                <td>${element.Content}</td>
                            </tr>
                            <tr>
                                <td>Available:</td>
                                <td>${obj.available}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button
                    name="${element.id}"
                    class="buttons"
                    onclick="borrow(name)"
                    style = "margin:2px"
                >
                    Borrow
                </button>
                <button
                class="buttons"
                onclick="close_modal()"
                style = "margin:2px"
            >
                Close
            </button>
                <button
                    name="${element.id}"
                    class="buttons"
                    onclick="giveBack(name)"
                    style = "margin:2px"
                >
                    Return
                </button>
            </div>
        </div>`
}
function close_modal() {
    var modal = document.getElementById("Modal");
    modal.style.display = "none";
}
function borrow(id) {
    books.then(x => {
        x.books.forEach(element => {
            if (id == element.id && element.Available == true) {
                element.Available = false;
                alert(element.Name + " is borrowed!");
                restartDetailAndMain(id)
            } else if (id == element.id && element.Available == false) {
                alert("You cannot borrow the book which you do not return");
            }

        });
    });
}
function restartDetailAndMain(id) {
    book_detail(id);
    place.innerHTML = "";
    borrowed.innerHTML = "";
    createBooks();
}
function giveBack(id) {
    books.then(x => {
        x.books.forEach(element => {
            if (id == element.id && element.Available == false) {
                element.Available = true;
                alert(element.Name + " is returned!");
                restartDetailAndMain(id)
            } else if (id == element.id && element.Available == true) {
                alert("You cannot return the book which you do not borrow")
            }
        });
    });
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(registeration => {
        // console.log("sw registered");
        // console.log(registeration);
    }).catch(error => {
        // console.log("sw error");
        // console.log(error);
    });

}
function drop_down_list() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function displayBorrowedBook(obj, element) {
    borrowed.innerHTML = borrowed.innerHTML + `
    <div class="dropdown-book" onclick="book_detail(${element.id})">
        <a href="#">
            <img
                src="${element.Image}"
                alt="Image for a book"
            />
            <div class="dropdown_text">
                <p
                    ${obj.name} class="dropdown_text_title"
                >
                    ${element.Name}
                </p>
                <p style="font-size: 1.2rem">${element.Author}</p>
                <p style="font-size: 1rem">${element.Price}$</p>
            </div>
            <div></div>
        </a>
        </div>
    </div>
    `;
}
function borrowedNameAvailablity(obj, element) {
    if (element.Name.length > 40) {
        obj.name = ` style="font-size:1rem;font-weight: 600;"`;
    } else if (element.Name.length > 30) {
        obj.name = ` style="font-size:1.25rem;font-weight: 600;"`;
    } else if (element.Name.length > 20) {
        obj.name = ` style="font-size:1.5rem;font-weight: 600;"`;
    } else {
        obj.name = ``;
    }
}

async function func(u) {
    let r = await fetch(u)
    let s = await r.clone().text()
    let b = await r.json()
    console.log(b);
    // console.log(s);
    console.log(JSON.stringify(b));
}
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

func("./books.json")
createBooks();

