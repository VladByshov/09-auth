import { type User } from "@/types/user";
import {CreateNote, Note} from "../../types/note";
import {api} from "@/lib/api/api";
import {AxiosError} from "axios";

export interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

type CheckSessionRequest = {
    success: boolean;
};

export type UpdateName = {
    email: string;
    username: string;
};

const noteOptions = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
};

export async function fetchNotes(
    search?: string,
    page?: number,
    tag?: string,
): Promise<FetchNotesResponse> {
    const response = await api.get<FetchNotesResponse>("/notes", {
        params: { search, page, tag, perPage: 12 },
        ...noteOptions,
    });
    return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`, {
        ...noteOptions,
    });
    return response.data;
}

export async function createNote(note: CreateNote): Promise<Note> {
    const response = await api.post<Note>("/notes", note, noteOptions);
    return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
    const response = await api.delete<Note>(
        `/notes/${noteId}`,
        noteOptions,
    );
    return response.data;
}

export async function register(credentials: AuthCredentials){
    const { data } = await api.post<User>("/auth/register", credentials);
    return data;
}
export async function login(data: LoginRequest) {
    const res = await api.post<User>("/auth/login", data);
    return res.data;
}

export async function logout() {
    await api.post("/auth/logout");
}

export async function checkSession() {
    const res = await api.get<CheckSessionRequest>("/auth/session");
    return res.data.success;
}

export async function getMe() {
    const res = await api.get<User>("/users/me");
    return res.data;
}

export async function updateMe(data: UpdateName) {
    const res = await api.patch<User>("/users/me", data);
    return res.data;
}

export const getErrorMessage = (error: unknown):string => {
        const axiosError = error as AxiosError<{
            message?: string
            error?: string
            response?: { message?: string }
        }>

        return (
            axiosError.response?.data?.response?.message ??
            axiosError.response?.data?.message ??
            axiosError.response?.data?.error ??
            axiosError.message ??
            'Something went wrong.'
        )
}