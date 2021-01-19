import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './blogform'

test('<BlogForm />', () => {
    
    const createBlog = jest.fn()

    const component= render(
        <BlogForm createBlog={createBlog}/>
    )

    const titleInput= component.container.querySelector('#title')
    const authorInput= component.container.querySelector('#author')
    const urlInput= component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(titleInput, {
        target: {value: 'BlogForm testing'}
    })
    fireEvent.change(authorInput, {
        target: {value: 'Muhsen'}
    })
    fireEvent.change(urlInput, {
        target: {value: 'C:\\Users\muhsen\bloglist-forntend'}
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].author).toBe('Muhsen')
})