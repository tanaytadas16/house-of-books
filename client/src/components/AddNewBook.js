import React, { useState, useContext } from 'react';
import axios from 'axios';
import FormInput from './FormInput';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import '../styles/Signup.scss';
import { UserContext } from '../contexts/userContext';

const defaultFormFields = {
    ISBN: '',
    title: '',
    url: '',
    description: '',
    author: '',
    averageRating: '',
    binding: '',
    genre: '',
    numberofPages: '',
    originalPublicationYear: '',
    price: '',
    publisher: '',
    yearPublished: '',
    reviews: [],
    count: '',
};

export default function AddNewBook() {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {
        ISBN,
        title,
        url,
        description,
        author,
        // averageRating,
        binding,
        genre,
        numberofPages,
        originalPublicationYear,
        price,
        publisher,
        yearPublished,
        // reviews,
        // count,
    } = formFields;
    const { setCurrentUser } = useContext(UserContext);
    const navigate = useNavigate();

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };
    const handleOnSubmit = async (event) => {
        event.preventDefault();

        let dataBody = {
            ISBN: ISBN,
            title: title,
            url: url,
            description: description,
            author: author,
            // averageRating: 0,
            binding: binding,
            genre: genre,
            numberofPages: numberofPages,
            originalPublicationYear: originalPublicationYear,
            price: price,
            publisher: publisher,
            yearPublished: yearPublished,
            // reviews: [],
            // count: 0,
        };
        axios
            .post('http://localhost:4000/books/addnewbook', {
                data: dataBody,
            })
            .then(function (response) {
                console.log(response.data);
                navigate('/books', { replace: true });
            });
    };

    return (
        <div className="addnewbook-container">
            AddNewBook
            <form onSubmit={handleOnSubmit}>
                <FormInput
                    label="Title"
                    type="text"
                    required
                    onChange={handleChange}
                    value={title}
                    name="title"
                />
                <FormInput
                    label="ISBN"
                    type="text"
                    onChange={handleChange}
                    value={ISBN}
                    name="ISBN"
                />
                <FormInput
                    label="Image URL"
                    type="text"
                    required
                    onChange={handleChange}
                    value={url}
                    name="url"
                />
                <FormInput
                    label="Author"
                    type="text"
                    required
                    onChange={handleChange}
                    value={author}
                    name="author"
                />
                <FormInput
                    label="Description"
                    type="text"
                    required
                    onChange={handleChange}
                    value={description}
                    name="description"
                />

                <FormInput
                    label="Genre"
                    type="text"
                    required
                    onChange={handleChange}
                    value={genre}
                    name="genre"
                />
                <FormInput
                    label="Paperback/HardCover"
                    type="text"
                    required
                    onChange={handleChange}
                    value={binding}
                    name="binding"
                />

                <FormInput
                    label="Pages"
                    type="number"
                    required
                    onChange={handleChange}
                    value={numberofPages}
                    name="numberofPages"
                />
                <FormInput
                    label="Price"
                    type="number"
                    required
                    onChange={handleChange}
                    value={price}
                    name="price"
                />
                <FormInput
                    label="Publisher"
                    type="text"
                    required
                    onChange={handleChange}
                    value={publisher}
                    name="publisher"
                />
                <FormInput
                    label="Original Publication Year"
                    type="number"
                    required
                    onChange={handleChange}
                    value={originalPublicationYear}
                    name="originalPublicationYear"
                />

                <FormInput
                    label="Year Published"
                    type="number"
                    required
                    onChange={handleChange}
                    value={yearPublished}
                    name="yearPublished"
                />
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}
