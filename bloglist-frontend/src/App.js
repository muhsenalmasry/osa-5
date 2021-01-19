import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import FailNotification from './components/failNotification'
import Togglable from './components/togglable'
import LoginForm from './components/loginform'
import BlogForm from './components/blogform'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [succMessage, setSuccMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const blogFormRef = useRef()


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(response => {
        setBlogs(response.filter(b=>b.user===user.id))
        
      })
    }
  }, [])

  blogs.sort((a, b)=> a.likes - b.likes)
  
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 8000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
    setErrorMessage('loggedOut')
    setTimeout(() => {
      setErrorMessage(null)
    }, 8000)
  }

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin} />
    </Togglable>
  )

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
      setSuccMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
        setTimeout(() => {
          setSuccMessage(null)
        }, 8000)
  }

  const likeBlog = (updatedBlog) => {
    blogService.update(updatedBlog.id, updatedBlog)
    .then(returnedBlog => {
      setBlogs(blogs.map(b=> b.id!==updatedBlog.id ? b : returnedBlog))
    })
  }

  const removeBlog = (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
    blogService.remove(blog.id)
    .then(response => {
      setBlogs(blogs.filter(b=> b.id !== blog.id))
    })
  }
  const blogForm = () => (
    <Togglable buttonLabel="create new" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )


  if (user === null) {
    return (
      <div>
        <h2>Blog app</h2>
        <Notification message={succMessage} />
        <FailNotification message={errorMessage} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={succMessage} />
      <FailNotification message={errorMessage} />


      <div>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        <h2>Create new</h2>
        {blogForm()}
      </div>
      {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} like={likeBlog} remove={()=>removeBlog(blog)}/>
      )}
    </div>
  )
}

export default App