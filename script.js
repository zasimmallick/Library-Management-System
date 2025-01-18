// DOM Elements
const addBookButton = document.getElementById("addBookButton");
const booksContainer = document.getElementById("booksContainer");
const bookModal = document.getElementById("bookModal");
const modalTitle = document.getElementById("modalTitle");
const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookGenre = document.getElementById("bookGenre");
const bookAvailable = document.getElementById("bookAvailable");
const saveBookButton = document.getElementById("saveBookButton");
const closeModalButton = document.getElementById("closeModalButton");
const searchInput = document.getElementById("searchInput");

// State
let books = JSON.parse(localStorage.getItem("books")) || [];
let editBookId = null;

// Functions
function renderBooks() {
  booksContainer.innerHTML = "";
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    book.author.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  filteredBooks.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("card", "bg-white", "shadow-lg", "p-4", "rounded-lg");
    bookCard.innerHTML = `
      <h3 class="text-xl font-bold">${book.title}</h3>
      <p class="text-gray-700">Author: ${book.author}</p>
      <p class="text-gray-700">Genre: ${book.genre}</p>
      <p class="text-${book.available ? 'green' : 'red'}-500">
        ${book.available ? "Available" : "Not Available"}
      </p>
      <div class="mt-4 flex justify-between">
        <button class="btn btn-sm btn-warning edit-book" data-id="${book.id}">Edit</button>
        <button class="btn btn-sm btn-error delete-book" data-id="${book.id}">Delete</button>
      </div>
    `;
    booksContainer.appendChild(bookCard);
  });
}

function openModal(edit = false, bookId = null) {
  bookModal.classList.remove("hidden");
  if (edit) {
    modalTitle.textContent = "Edit Book";
    const bookToEdit = books.find(book => book.id === bookId);
    bookTitle.value = bookToEdit.title;
    bookAuthor.value = bookToEdit.author;
    bookGenre.value = bookToEdit.genre;
    bookAvailable.checked = bookToEdit.available;
    editBookId = bookId;
  } else {
    modalTitle.textContent = "Add Book";
    bookTitle.value = "";
    bookAuthor.value = "";
    bookGenre.value = "";
    bookAvailable.checked = false;
    editBookId = null;
  }
}

function closeModal() {
  bookModal.classList.add("hidden");
}

function saveBook() {
  const title = bookTitle.value.trim();
  const author = bookAuthor.value.trim();
  const genre = bookGenre.value.trim();
  const available = bookAvailable.checked;

  if (!title || !author || !genre) {
    alert("All fields are required!");
    return;
  }

  if (editBookId) {
    books = books.map(book =>
      book.id === editBookId ? { ...book, title, author, genre, available } : book
    );
  } else {
    const newBook = { id: Date.now(), title, author, genre, available };
    books.push(newBook);
  }

  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
  closeModal();
}

function deleteBook(bookId) {
  books = books.filter(book => book.id !== bookId);
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
}

// Event Listeners
addBookButton.addEventListener("click", () => openModal());
closeModalButton.addEventListener("click", closeModal);
saveBookButton.addEventListener("click", saveBook);
searchInput.addEventListener("input", renderBooks);

booksContainer.addEventListener("click", e => {
  if (e.target.classList.contains("edit-book")) {
    const bookId = parseInt(e.target.dataset.id, 10);
    openModal(true, bookId);
  }
  if (e.target.classList.contains("delete-book")) {
    const bookId = parseInt(e.target.dataset.id, 10);
    deleteBook(bookId);
  }
});

// Initial Render
renderBooks();
