import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const SessionContext = createContext()

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  // Function to fetch user session
  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:3008', { withCredentials: true })
      if (res.data.valid) {
        setUser(res.data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error("Error fetching user:", err)
    }
  }

  useEffect(() => {
    fetchUser()  // Fetch session on page load
  }, [])

  return (
    <SessionContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
