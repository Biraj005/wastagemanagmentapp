import axios from 'axios';
import { useEffect, useState } from 'react';
import { IComplaint } from '../types/Complaint';
import { ApiResponse } from '../types/Response';
import { BACKEND_URL } from '../utils/Constant';

function getComplaints() {
    
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState<IComplaint[]>([]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data }: { data: ApiResponse<IComplaint[]> } = await axios.post(
        `${BACKEND_URL}/complaint`,
      );
      setComplaints(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComplaints();
  }, []);

  return { loading, complaints };
}

export default getComplaints;
