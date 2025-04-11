import React, { useState, useEffect } from 'react';

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    // Add other user fields as necessary
  });

  useEffect(() => {
    // Fetch user information from API
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user information:', (error as Error).message);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={userInfo.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={userInfo.email} onChange={handleChange} />
        </div>
        {/* Add other fields as necessary */}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;