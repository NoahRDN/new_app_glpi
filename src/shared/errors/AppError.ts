export class AppError extends Error {
  userMessage: string;
  status?: number;

  constructor(params: { message: string; userMessage: string; status?: number }) {
    super(params.message);
    this.name = "AppError";
    this.userMessage = params.userMessage;
    this.status = params.status;
  }
}