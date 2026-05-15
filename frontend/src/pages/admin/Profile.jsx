
import { useEffect, useState } from 'react'

function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth', {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to load authenticated user')
        }

        const data = await response.json()
        setUser(data.user ?? data)
      } catch (err) {
        setError(err.message || 'Unable to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, fontFamily: 'Arial, sans-serif' }}>
        <h1>User Profile</h1>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, fontFamily: 'Arial, sans-serif' }}>
        <h1>User Profile</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>User Profile</h1>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 20, background: '#fafafa' }}>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Status:</strong> {user.status}</p>
        <p><strong>Created Date:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</p>
      </div>
    </div>
  )
}

export default Profile