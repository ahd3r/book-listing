class Book{
    constructor(title, author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    static addBookToList(book){
        const bookList = document.querySelector('#book-list');
        const createRow=document.createElement('tr');
        createRow.appendChild(document.createElement('td')).textContent=book.title;
        createRow.appendChild(document.createElement('td')).textContent=book.author;
        createRow.appendChild(document.createElement('td')).textContent=book.isbn;
        createRow.appendChild(document.createElement('td')).appendChild(document.createElement('a'));
        createRow.querySelector('a').textContent='X';
        createRow.querySelector('a').className='delete';
        bookList.appendChild(createRow);
    }

    static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#ISBN').value='';
    }

    static showMessage(classMsg,textIn){
        const msg=document.createElement('p');
        const beforeAll=document.querySelector('h1');
        msg.className=classMsg;
        msg.textContent=textIn;
        document.querySelector('.container').insertBefore(msg,beforeAll);
        setTimeout(function(){
            document.querySelector('p').remove();
        },1500);
    }

    static clearBookList(){
        while(document.querySelector('#book-list').firstChild){
            document.querySelector('#book-list').firstChild.remove();
        }
    }
}

class Store{
    static getBooksFromStorage(){
        let booksFromStorage=localStorage.getItem('books');
        if(booksFromStorage===null || booksFromStorage==='[]'){
            localStorage.setItem('books', '[]');
            booksFromStorage=localStorage.getItem('books');
            booksFromStorage=JSON.parse(booksFromStorage);
        } else {
            booksFromStorage=JSON.parse(booksFromStorage);
        }
        return booksFromStorage;
    }

    static addBookToStorage(book){
        const bookArr=Store.getBooksFromStorage();
        bookArr.push(book);
        localStorage.setItem('books', JSON.stringify(bookArr));
    }

    static renderBookListFormStorage(){
        const bookArr=Store.getBooksFromStorage();
        if (bookArr.length===0){
            UI.clearFields();
            UI.clearBookList();
            document.querySelector('.container').appendChild(document.createElement('h5')).textContent='No Book';
        } else {
            if(document.querySelector('.container>h5')){
                document.querySelector('.container>h5').remove();
                UI.clearFields();
                UI.clearBookList();
                bookArr.forEach(function(book){
                    UI.addBookToList(book);
                });
            } else {
                UI.clearFields();
                UI.clearBookList();
                bookArr.forEach(function(book){
                    UI.addBookToList(book);
                });
            }
        }
    }

    static removeBookFromStorage(placeInList){
        if(placeInList.className==='delete'){
            const bookArr=Store.getBooksFromStorage();
            const bookListInPage=document.querySelectorAll('#book-list>tr');
            bookListInPage.forEach((book, index)=>{
                if(placeInList.parentElement.parentElement===book){
                    bookArr.splice(index,1);
                }
            });
            localStorage.setItem('books', JSON.stringify(bookArr));
            UI.showMessage('right', 'Removed successfully');
        }
    }
}

Store.renderBookListFormStorage();

document.querySelector('#addbook-form').addEventListener('submit', function (e){
    const title=document.querySelector('#title').value,
          author=document.querySelector('#author').value,
          isbn=document.querySelector('#ISBN').value;

    if(title==='' || author==='' || isbn===''){
        UI.showMessage('wrong', 'Fill all line...');
    } else {
        const book = new Book(title,author,isbn);
        Store.addBookToStorage(book);
        Store.renderBookListFormStorage();
        UI.showMessage('right', 'Book added!');
    }

    e.preventDefault();
});

document.querySelector('#book-list').addEventListener('click', function(e){
    Store.removeBookFromStorage(e.target);
    Store.renderBookListFormStorage();
});
