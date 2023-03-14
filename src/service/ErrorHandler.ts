export function handleError(error: Error, message?: string, ...values: any){
    console.error('Error name:', error.name, '. Error message:', error.message);
    if (values){
        return values;
    } else {
        return Promise.reject(error);
    }
}