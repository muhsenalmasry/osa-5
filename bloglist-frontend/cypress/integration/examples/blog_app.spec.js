describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: "Muhsen Almasry",
            username: "m7sn",
            password: "Passw0rd"
        }
        cy.request('POST', 'http://localhost:3001/api/users', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        cy.contains('Blog app')
        cy.contains('login').click()
        cy.get('#username')
        cy.get('#password')
        cy.get('#login-button')
        cy.get('#cancel-button')
    })


    describe('Login', function () {
        it('succeeds with correct credentials', function () {
            cy.contains('login').click()
            cy.get('#username').type('m7sn')
            cy.get('#password').type('Passw0rd')
            cy.get('#login-button').click()
            cy.contains('Muhsen Almasry logged in')
        })

        it('fails with wrong credentials', function () {
            cy.contains('login').click()
            cy.get('#username').type('m7sn')
            cy.get('#password').type('password')
            cy.get('#login-button').click()
            cy.get('.error')
                .should('contain', 'wrong username or password')
                .and('have.css', 'border-style', 'solid')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', function () {
        beforeEach(function () {
            cy.login({ username: "m7sn", password: "Passw0rd" })
        })

        it('A blog can be created', function () {

            cy.contains('create new').click()
            cy.get('#title').type('A new blog')
            cy.get('#author').type('Cypress')
            cy.get('#url').type('https://somewhereonInternet')
            cy.contains('save').click()

            cy.get('.success')
                .should('contain', 'a new blog A new blog by Cypress added')
            cy.contains('A new blog Cypress')
                .contains('show')
        })

        describe('A blog exisits', function () {
            beforeEach(function () {
                cy.createBlog({ author: "Cypress", title: "another blog", url: "https://wordpress.co/cypress/blogs" })
            })

            it('it can be liked', function () {
                cy.contains('another blog Cypress')
                .contains('show').click()
                
                cy.get('.testDiv')
                .should('contain', 'Likes 0')

                cy.get('#like').click()

                cy.get('.testDiv')
                .should('contain', 'Likes 1')
            })

            it('it can be removed', function() {
                cy.contains('another blog Cypress')
                .contains('show').click()

                cy.get('.testDiv')
                .contains('remove').click()

                cy.get('html').should('not.contain', 'another blog Cypress')
            })
        })

        describe('when many blogs exist', function() {
            beforeEach(function() {
                cy.createBlog({author: "Johnny John", title:"Blog 1", url:"url1", likes:"5"})
                cy.createBlog({author: "Johnny John", title:"Blog 2", url :"url2", likes:"3"})
            })

            it.only('blog list can be sorted', function() {
                cy.get('.Blog').then(blogs => {
                    cy.wrap(blogs[0]).parent().should('contain', 'Likes 3')
                    .and('contain', 'Blog 2')
                    cy.wrap(blogs[1]).parent().should('contain', 'Likes 5')
                    .and('contain', 'Blog 1')
                })
            })
        })
    })
})