import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/api';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ name: '', email: '' });
    interface User {
        id: number;
        name: string;
        email: string;
    }

    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
    };

    const handleCreateUser = async () => {
        await createUser(newUser);
        setNewUser({ name: '', email: '' });
        fetchUsers();
    };

    const handleUpdateUser = async () => {
        if (editingUser) {
            await updateUser(editingUser.id, editingUser);
            setEditingUser(null);
            fetchUsers();
        }
    };

    const handleDeleteUser = async (id: number) => {
        await deleteUser(id);
        fetchUsers();
    };

    return (
        <div>
            <h1>用户管理</h1>
            <div>
                <h2>创建用户</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <button onClick={handleCreateUser}>Add User</button>
            </div>
            <div>
                <h2>Existing Users</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            {user.name} - {user.email}
                            <button onClick={() => setEditingUser(user)}>Edit</button>
                            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            {editingUser && (
                <div>
                    <h2>编辑用户</h2>
                    <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    />
                    <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    />
                    <button onClick={handleUpdateUser}>Update User</button>
                </div>
            )}
        </div>
    );
};

export default UserManagement;