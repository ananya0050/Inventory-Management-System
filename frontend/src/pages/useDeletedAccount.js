/**
 * useDeletedAccount
 * -----------------
 * Call this hook once in a top-level component (e.g. App or a layout wrapper).
 * It listens on the user-specific Socket.IO channel and immediately redirects
 * the user to /login with a deletion message if the admin deletes their account.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

export default function useDeletedAccount() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) return;

    const event = `user:deleted:${user.id}`;

    const handleDeleted = () => {
      localStorage.clear();
      // Carry the deletion message so Login.jsx can display it
      sessionStorage.setItem('deletedByAdmin', '1');
      navigate('/login', { replace: true });
    };

    socket.on(event, handleDeleted);
    return () => socket.off(event, handleDeleted);
  }, [navigate]);
}