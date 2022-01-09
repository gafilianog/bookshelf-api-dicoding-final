const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;

    if (!name) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        res.code(400);
        return res;
    }

    if (readPage > pageCount) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        res.code(400);
        return res;
    }

    const id = nanoid(16);
    const finished = (pageCount === readPage);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        id,
        finished,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const res = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        res.code(201);
        return res;
    }

    const res = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    res.code(500);
    return res;
};

const getAllBooksHandler = (req, h) => {
    const {name, reading, finished} = req.query;
    let filteredBooks = books;

    if (name) {
        filteredBooks = filteredBooks.filter(
            (book) => book.name.toLowerCase().includes(name.toLowerCase()),
        );
    }

    if (reading) {
        filteredBooks = filteredBooks.filter(
            (book) => Number(reading) === Number(book.reading),
        );
    }

    if (finished) {
        filteredBooks = filteredBooks.filter(
            (book) => Number(finished) === Number(book.finished),
        );
    }

    const res = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    res.code(200);
    return res;
};

const getBookByIdHandler = (req, h) => {
    const {bookId} = req.params;
    const book = books.filter((b) => b.id === bookId)[0];

    if (book) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const res = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    res.code(404);
    return res;
};

const editBookByIdHandler = (req, h) => {
    const {bookId} = req.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        if (!name) {
            const res = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            res.code(400);
            return res;
        }

        if (readPage > pageCount) {
            const res = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            res.code(400);
            return res;
        }

        const finished = (pageCount === readPage);

        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
            finished,
        };

        const res = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        res.code(200);
        return res;
    }

    const res = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    res.code(404);
    return res;
};

const deleteBookByIdHandler = (req, h) => {
    const {bookId} = req.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const res = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        res.code(200);
        return res;
    }

    const res = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    res.code(404);
    return res;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
