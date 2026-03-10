export interface Post {
    id: number;
    username: string;
    title: string;
    content: string;
    created_datetime: string;
}

export interface Comment {
    id: number;
    username: string;
    content: string;
}

export interface ApiResponse<T> {
    data: {
        results: T[];
        count: number;
    };
}

export type Theme = 'light' | 'dark';

export type ToastType = 'success' | 'error' | 'info';
