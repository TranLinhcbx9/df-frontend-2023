const url = new URL('https://627b42e4b54fe6ee0084dfed.mockapi.io/Book');
const addModal = document.querySelector("#modal");
// const addBookButton = document.querySelector("#add-button");
// const addItemForm = document.getElementById("addItemForm");
function start(){
    getBooks(renderBooks);
    openAddBookModal();
    hideAddBookModal();
}
start()

function getBooks(callback){
    fetch(url, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    }).then(res => {
        if (res.ok) {
            console.log(res.body);
            return res.json();
        }
        // handle error
    }).then(callback)
    .catch(error => {
        // handle error
    })
}
function renderBooks(books){
    var listBooksBlock = document.getElementById('book-datas');
    var htmls = books.map(function (book) {
        return `
        <tr class="book-item-${book.id}">
        <td class="book-name-${book.id}">${book.name}</td>
        <td class="book-author-${book.id}">${book.author}</td>
        <td class="book-topic-${book.id}">${book.topic}</td>
        <td class='book-actions'>
        <button id='edit-button' onclick="handleEditBook(${book.id})">Edit</button>
        <button id='delete-button' onclick="handleDeleteBook(${book.id})">Delete</button>
        </td>
        </tr>
        `;
    })
    listBooksBlock.innerHTML = htmls.join('')
}

function handleAddBook(){
    document.querySelector("#modal .add-title").textContent = "Add Book";
    document.querySelector("#save-button").style.display = "none";
    const createButton = document.querySelector("#create-button");
    createButton.style.display = "inline-block"
    createButton.onclick = function(){
        var bookName = document.querySelector("input[name='book-name']").value;
        var bookAuthor = document.querySelector("input[name='book-author']").value;
        var bookTopic = document.querySelector("input[name='book-topic']").value;
        var newBook = {
            name:bookName,
            author:bookAuthor,
            topic:bookTopic
        };
        createBook(newBook, function(){
            getBooks(renderBooks);
            hideModal();
        });
    }
}
function createBook(data, callback){
    fetch(url, {
        method: 'POST',
        headers: {'content-type':'application/json'},
        // Send your data in the request body as JSON
        body: JSON.stringify(data)
        }).then(res => {
        if (res.ok) {
            return res.json();
        }
        })
        .then(callback)
        .catch(error => {
        // handle error
        })
}
function handleDeleteBook(id){
    fetch(url + '/' + id, {
    method: 'DELETE',
    }).then(res => {
    if (res.ok) {
        return res.json();
    }
    // handle error
    }).then(function(){
        var bookItem = document.querySelector('.book-item-' + id)
        console.log("🚀 ~ file: script.js:94 ~ handleDeleteBook ~ bookItem:", bookItem)
        if(bookItem){
            bookItem.remove();
            alert(`Xoá thành công`);
        }
    }
    ).catch(error => {
    // handle error
    })
}
function updateBook(id, data, callback){
    fetch(url + '/' + id, {
        method: 'PUT', // or PATCH
        headers: {'content-type':'application/json'},
        body: JSON.stringify(data)
        }).then(res => {
        if (res.ok) {
            return res.json();
        }
        }).then(callback)
        .catch(error => {
        // handle error
    })
}
function handleEditBook(id){
    document.querySelector("#modal .add-title").textContent = "Edit Book";
    document.querySelector("#create-button").style.display = "none";
    const saveButton = document.querySelector("#save-button");
    saveButton.style.display = "inline-block";
    openModal();
    var currentName = document.querySelector('.book-name-' + id).textContent;
    var currentAuthor = document.querySelector('.book-author-' + id).textContent;
    var currentTopic = document.querySelector('.book-topic-' + id).textContent;
    var inputName = document.querySelector("input[name='book-name']");
    var inputAuthor = document.querySelector("input[name='book-author']");
    var inputTopic = document.querySelector("input[name='book-topic']");
    //fill data edit form
    inputName.value = currentName;
    inputAuthor.value = currentAuthor;
    inputTopic.value = currentTopic;
    saveButton.onclick = function(){
        currentName = inputName.value;
        currentAuthor = inputAuthor.value;
        currentTopic = inputTopic.value;
        var data = {
            name:currentName,
            author:currentAuthor,
            topic:currentTopic
        } 
        updateBook(id, data, function(){
            getBooks(renderBooks);
            hideModal();
            clearDataModal();
        })
        console.log("🚀 ~ file: script.js:143 ~ handleEditBook ~ inputName:", inputName)
        // alert("a");
    };
    // alert("ư")
}
function searchByTitle(){
    var searchValue = document.querySelector("input[name='search-text']").value;
    var cleanSearchValue = searchValue.trim().replace(/\s+/g, ' ').toLowerCase();
    console.log("🚀 ~ file: script.js:150 ~ searchByTitle ~ searchValue:", cleanSearchValue)
    getBooks(function(books){
        console.log("🚀 ~ file: script.js:151 ~ getBooks ~ books:", books)
        var filteredBooks = books.filter(book => book.name.toLowerCase().includes(cleanSearchValue.toLowerCase()));
        console.log("🚀 ~ file: script.js:153 ~ getBooks ~ filteredBooks:", filteredBooks)
        renderBooks(filteredBooks);
    })
}
function openAddBookModal(){
    const addBookButton = document.querySelector("#add-button");
    addBookButton.addEventListener("click", function(){
        openModal();
    });
}
function openModal(){
    addModal.classList.add("open-add-model");
}
function hideAddBookModal(){
    const cancelBookButton = document.querySelector("#cancel-button");
    cancelBookButton.addEventListener("click", function(){
        hideModal();
        clearDataModal();
    })
}
function hideModal(){
    addModal.classList.remove("open-add-model");
}

function clearDataModal(){
    document.querySelector("input[name='book-name']").value = "";
    document.querySelector("input[name='book-author']").value = "";
    document.querySelector("input[name='book-topic']").value = "";
}


