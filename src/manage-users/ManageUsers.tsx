import React, { useState } from "react";
import "./ManageUsers.css";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  userType: string;
  createdAt: string;
  status: "Active" | "Suspended";
}

const ManageUsers: React.FC = () => {
  // Dummy data for users
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john.doe@example.com",
      userType: "User",
      createdAt: "2023-10-01T12:00:00Z",
      status: "Active",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      username: "janesmith",
      email: "jane.smith@example.com",
      userType: "Shelter",
      createdAt: "2023-10-02T12:00:00Z",
      status: "Active",
    },
    {
      id: "3",
      firstName: "wick",
      lastName: "User",
      username: "wick",
      email: "wick@example.com",
      userType: "User",
      createdAt: "2023-10-03T12:00:00Z",
      status: "Active",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle deleting a user
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Handle suspending/activating a user
  const handleSuspendUser = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Suspended" : "Active",
            }
          : user
      )
    );
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <input
        type="text"
        placeholder="Search by username or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Registration Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>{user.status}</td>
              <td>
                <button 
                  className="user-status-toggle-button" 
                  onClick={() => handleSuspendUser(user.id)}
                >
                  {user.status === "Active" ? "Suspend" : "Activate"}
                </button>
                <button 
                  className="user-delete-button" 
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;