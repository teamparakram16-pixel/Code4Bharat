// // Note to Vijeth :
// Post Url is http://localhost:3000/api/users/bookmarks/:postId
// Delete Url is http://localhost:3000/api/users/bookmarks/:postId
// Get Url is http://localhost:3000/api/users/bookmarks


import { useEffect, useState } from "react";
import axios from "axios";

export const useBookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [isAdding, setIsAdding] = useState(false);
    const [addError, setAddError] = useState(null);

    const fetchBookmarks = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/bookmarks`, {
                withCredentials: true,
            });
            setBookmarks(res.data.bookmarks ?? []);
        } catch (err) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const addBookmark = async (postId: string) => {
        setIsAdding(true);
        setAddError(null);
        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/users/bookmarks/${postId}`,
                {},
                { withCredentials: true }
            );
            await fetchBookmarks();
        } catch (err: any) {
            setAddError(err);
        } finally {
            setIsAdding(false);
        }
    };

    const removeBookmark = async (postId: string) => {
        setIsAdding(true);
        setAddError(null);
        try {
            await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/api/users/bookmarks/${postId}`,
                { withCredentials: true }
            );
            await fetchBookmarks();
        } catch (err: any) {
            setAddError(err);
        } finally {
            setIsAdding(false);
        }
    };

    const isBookmarked = (postId: string) => {
        return bookmarks.some((b: any) => b._id === postId);
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    return {
        bookmarks,
        isLoading,
        isError,
        refetch: fetchBookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        isAdding,
        addError,
    };
};
