import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

describe('<Blog />', () => {
    
    let component

    beforeEach(() => {
        const blog = {
            title:'testing is not that hard!',
            author:'Me',
            url:'somewhere on the internet'
        }

        component = render(
            <Blog blog={blog}/>
        )
    })

    test("renders content", () => {

        const element = component.getByText("testing is not that hard! Me")
        expect(element).toBeDefined()
    
    })
    
    test('at start only title and author are displayed', () => {
        
        const div = component.container.querySelector('.testDiv')
        expect(div).toHaveStyle('display: none')
    })

    test('after clicking the button, rest of the deatils are displayed', () => {
        const button = component.getByText('show')
        fireEvent.click(button)

        const div = component.container.querySelector('.testDiv')
        expect(div).not.toHaveStyle('display: none')
    })

})

test('clicking like button twice calls like function two times', () => {
    
    const like = jest.fn()
    const blog = {
        title: "let's try to test this",
        author: "Me",
        url: "this computer"
    }

    const component= render(
        <Blog blog={blog} like={like}/>
    )

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(like.mock.calls).toHaveLength(2)
})