

export interface ApiResponse<T> {
  status: number;      
  timestamp: string;    
  success: boolean;
  message: string;
  data: T;
}