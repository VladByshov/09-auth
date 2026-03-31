import type { Note, NoteTag } from "@/types/note";

import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

export const api = axios.create({
    baseURL,
    withCredentials: true,
})
