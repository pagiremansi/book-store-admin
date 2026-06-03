import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const API = "https://book-store-backend.onrender.com/api/books";

  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);

  const [book, setBook] = useState({
    bookName: "",
    author: "",
    category: "",
    price: ""
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await axios.get(API);
      setBooks(res.data);
    } catch (err) {
      console.error("Error loading books:", err);
    }
  };

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value
    });
  };

  const addBook = async (e) => {
    e.preventDefault();

    if (
      !book.bookName ||
      !book.author ||
      !book.category ||
      !book.price
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, book);
        alert("Book Updated Successfully!");
      } else {
        await axios.post(API, book);
        alert("Book Added Successfully!");
      }

      setBook({
        bookName: "",
        author: "",
        category: "",
        price: ""
      });

      setEditId(null);
      loadBooks();

    } catch (err) {
      console.error("Error:", err);
      alert("Operation Failed!");
    }
  };

  const deleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`${API}/${id}`);
        loadBooks();
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  const editBook = (bookData) => {
    setBook({
      bookName: bookData.bookName,
      author: bookData.author,
      category: bookData.category,
      price: bookData.price
    });

    setEditId(bookData.id);
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      background: "#f9fafc",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    },

    title: {
      textAlign: "center",
      color: "#1976d2",
      marginBottom: "30px"
    },

    form: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginBottom: "20px"
    },

    input: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #000"
    },

    button: {
      padding: "10px",
      background: "#1976d2",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold"
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px"
    },

    thtd: {
      border: "1px solid #000",
      padding: "10px",
      textAlign: "center"
    },

    th: {
      background: "#1976d2",
      color: "white"
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 Book Management System</h1>

      <form onSubmit={addBook} style={styles.form}>
        <input
          type="text"
          name="bookName"
          placeholder="Book Name"
          value={book.bookName}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="author"
          placeholder="Author"
          value={book.author}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={book.category}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={book.price}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          {editId ? "✏️ Update Book" : "➕ Add Book"}
        </button>
      </form>

      <h2 style={{ color: "black" }}>📖 Books List</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thtd, ...styles.th }}>Name</th>
            <th style={{ ...styles.thtd, ...styles.th }}>Author</th>
            <th style={{ ...styles.thtd, ...styles.th }}>Category</th>
            <th style={{ ...styles.thtd, ...styles.th }}>Price</th>
            <th style={{ ...styles.thtd, ...styles.th }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.length > 0 ? (
            books.map((b) => (
              <tr key={b.id}>
                <td style={styles.thtd}>{b.bookName}</td>
                <td style={styles.thtd}>{b.author}</td>
                <td style={styles.thtd}>{b.category}</td>
                <td style={styles.thtd}>{b.price}</td>

                <td style={styles.thtd}>
                  <button
                    onClick={() => editBook(b)}
                    style={{
                      marginRight: "5px",
                      padding: "5px 10px"
                    }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => deleteBook(b.id)}
                    style={{
                      padding: "5px 10px"
                    }}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={styles.thtd}>
                No Books Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;