export interface ApiResponse<T> {
  status: string;        // HttpStatus → string (e.g. "OK", "BAD_REQUEST")
  timestamp: Date;     // LocalDateTime → ISO string
  success: boolean;
  message: string;
  data: T;
}