import { createContext, useContext, useEffect, useState } from 'react';
import { ComplaintStatus, IComplaint } from '../types/Complaint';
import { ApiResponse } from '../types/Response';
import { BACKEND_URL } from '../utils/Constant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ComplaintContextType {
  complaints: IComplaint[];
  loading: boolean;
  resolvedPercentage?: number;
  refreshComplaints: () => Promise<void>;
  addComplaint: (formData: FormData) => Promise<boolean>;
  deleteComplaint:(id:number)=>Promise<boolean>
}

export const ComplaintContext = createContext<ComplaintContextType | null>(
  null,
);

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [resolvedPercentage, setResolvedPercentage] = useState<number>();
  const [complaints, setComplaints] = useState<IComplaint[]>([]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const { data }: { data: ApiResponse<IComplaint[]> } = await axios.get(
        `${BACKEND_URL}/complaint`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        setComplaints(data.data);
      }
    } catch (error) {
      console.log('Fetch Error:', error);
    } finally {
      setLoading(false); 
    }
  };

  const addComplaint = async (formData: FormData): Promise<boolean> => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      console.log("tokne",token,BACKEND_URL)

      const { data }: { data: ApiResponse<IComplaint> } = await axios.post(
        `${BACKEND_URL}/complaint`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            
          },
        },
      );

      if (data.success) {
        setComplaints(prev => [...prev, data.data]);
        return true;
      }

      return false;
    } catch (error) {
       if(axios.isAxiosError(error)){
        console.log('Add Error:', error.toJSON());
       }
      return false;
    } finally {
      setLoading(false); 
    }
  };
  const deleteComplaint = async (id:number)=>{
      try {
        const token = await AsyncStorage.getItem("token");

        const {data}:{data:ApiResponse<null>} = await axios.delete(`${BACKEND_URL}/complaint/${id}`,{
          headers:{
              Authorization: `Bearer ${token}`,
          }
        })

        if(data.success){
          setComplaints(complaints.filter(item=>item.id!==id))
          return true;
        }else{
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
  }
  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    const total = complaints.length;
    const resolved = complaints.filter(
      c => c.status === ComplaintStatus.COMPLETED,
    ).length;

    setResolvedPercentage(
      total > 0 ? (resolved / total) * 100 : undefined,
    );
  }, [complaints]);

  const value: ComplaintContextType = {
    complaints,
    loading,
    refreshComplaints: fetchComplaints,
    resolvedPercentage,
    addComplaint,
    deleteComplaint: deleteComplaint
  };

  return (
    <ComplaintContext.Provider value={value}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaintContext = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error(
      'useComplaintContext must be used within a ComplaintProvider',
    );
  }
  return context;
};