import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { type ApiDispatch, type RootState } from "@/store/store";

import ComplaintList from "./ComplaintList";
import { setStatus, type Status } from "@/store/slices/complatint";

const itemClass = "cursor-pointer focus:bg-green-50 focus:text-green-700";

function Complaint() {
  const dispatch = useDispatch<ApiDispatch>();
  const {
    query: { status },
  } = useSelector((state: RootState) => state.complaint);

  return (
    <div className="mt-4 ml-4">
      <div className="mt-2 flex flex-col">
        <h1 className="font-bold text-3xl">Complaints</h1>
        <span className="text-gray-500">
          Manage and track waste collection issues.
        </span>
      </div>

      <div className="border border-gray-200 shadow bg-white p-5 mt-5 rounded-2xl ">
        <div className="flex flex-wrap gap-4 items-center flex-row">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-gray-500 font-medium text-sm">Filters:</span>
          </div>

          <Select
            value={status || "All"}
            onValueChange={(e: Status) => dispatch(setStatus(e))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all" className={itemClass}>
                  All Status
                </SelectItem>
                <SelectItem value="PENDING" className={itemClass}>
                  Pending
                </SelectItem>
                <SelectItem value="WORKING" className={itemClass}>
                  Working
                </SelectItem>
                <SelectItem value="RESOLVED" className={itemClass}>
                  Resolved
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ComplaintList status={status || "All"} />
    </div>
  );
}

export default Complaint;
