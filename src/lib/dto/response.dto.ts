export interface ResponseDTO<T> {
    code: string;
    message?: string;
    data?: T | null;
}
