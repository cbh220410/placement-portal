// src/pages/Admin/ManageUsersPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { deleteUserById, fetchUsers, isBackendUnavailable } from '../../services/portalApi';
import styles from './ManageUsersPage.module.css';

const seedDefaultUsers = () => {
  // Initial default users (same emails as your login’s HARDCODED_USERS + some samples)
  return [
    { id: 1, name: 'Jane Doe',      email: 'student@example.com',   role: 'student' },
    { id: 2, name: 'Acme Corp',     email: 'employer@example.com',  role: 'employer' },
    { id: 3, name: 'System Admin',  email: 'admin@example.com',     role: 'admin' },
    { id: 4, name: 'Placement Officer', email: 'officer@example.com', role: 'officer' },
    { id: 5, name: 'Emily White',   email: 'emily@example.com',     role: 'student' },
  ];
};

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const backendUsers = await fetchUsers();
        setUsers(backendUsers);
        setUsingFallback(false);
        return;
      } catch (error) {
        if (!isBackendUnavailable(error)) {
          console.error('Error loading users from backend:', error);
        }
      }

      setUsingFallback(true);
      try {
        const stored = localStorage.getItem('users');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUsers(parsed);
        } else {
          const defaults = seedDefaultUsers();
          setUsers(defaults);
          localStorage.setItem('users', JSON.stringify(defaults));
        }
      } catch (err) {
        console.error('Error reading users from storage. Resetting...', err);
        const defaults = seedDefaultUsers();
        setUsers(defaults);
        localStorage.setItem('users', JSON.stringify(defaults));
      }
    };

    loadUsers();
  }, []);

  const updateStorage = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      if (!usingFallback) {
        await deleteUserById(id);
      }
      const updated = users.filter((u) => u.id !== id);
      if (usingFallback) {
        updateStorage(updated);
      } else {
        setUsers(updated);
      }
    } catch (error) {
      alert(error.message || 'Failed to delete user');
    }
  };

  const formatRole = (role) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className={styles.pageContainer}>
      <AdminNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Manage Users</h1>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Name</th>
              <th className={styles.tableHeader}>Email</th>
              <th className={styles.tableHeader}>Role</th>
              <th className={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className={styles.tableCell}>
                  No users found.
                </td>
              </tr>
            )}

            {users.map((user) => (
              <tr key={user.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  {/* keep your timeline link intact */}
                  <Link
                    to={`/admin/user-timeline/${user.id}`}
                    className={styles.nameLink}
                  >
                    {user.name}
                  </Link>
                </td>
                <td className={styles.tableCell}>{user.email}</td>
                <td className={styles.tableCell}>{formatRole(user.role)}</td>
                <td className={styles.tableCell}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsersPage;
