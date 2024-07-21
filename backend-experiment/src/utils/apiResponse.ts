export const successResponse = (data?: any, message?: string) => {
  return {
    success: true,
    ...data,
    message,
  };
};

export class ErrorResponse extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
  }
}
