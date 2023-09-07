import React, { useState } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations'; // Import your SAVE_BOOK mutation
import { SEARCH_BOOKS } from '../utils/queries'; // Import your SEARCH_BOOKS query
import Auth from '../utils/auth';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  // Initialize the saveBook mutation hook
  const [saveBook] = useMutation(SAVE_BOOK);

  const { loading, error, data } = useQuery(SEARCH_BOOKS, {
    variables: { searchTerm: searchInput },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      // Handle loading and error states
      if (loading) {
        return <div>Loading...</div>;
      }
      if (error) {
        console.error(error);
        return <div>Error loading data</div>;
      }

      // Get book data from the query response
      const bookData = data.searchBooks.map((book) => ({
        bookId: book.bookId,
        authors: book.authors || ['No author to display'],
        title: book.title,
        description: book.description,
        image: book.image || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Find the book to save in searchedBooks
      const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

      // Execute the saveBook mutation with Apollo Client
      const { data } = await saveBook({
        variables: { input: bookToSave }, // Pass book data as input
      });

      if (!data) {
        throw new Error('Something went wrong!');
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={false}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {false
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;