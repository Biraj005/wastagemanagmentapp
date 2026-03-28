import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, ApiDispatch } from "@/store/store";
import {
  getAllComplaints,
  updateComplaint,
  type Status,
} from "@/store/slices/complatint";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface Props {
  status: string;
}

const statusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded";
    case "WORKING":
      return "bg-blue-100 text-blue-700 px-2 py-1 rounded";
    case "RESOLVED":
      return "bg-green-100 text-green-700 px-2 py-1 rounded";
    default:
      return "bg-gray-100 text-gray-700 px-2 py-1 rounded";
  }
};

const PAGE_SIZE = 5;

function ComplaintList({ status }: Props) {
  const dispatch = useDispatch<ApiDispatch>();

  const { complaints, totalPages, loading } = useSelector(
    (state: RootState) => state.complaint,
  );

  const userType = useSelector((state: RootState) => state.auth.role);

  const [page, setPage] = useState(1);

  // 🔥 store selected status per complaint
  const [selectedStatus, setSelectedStatus] = useState<
    Record<number, Status>
  >({});

  useEffect(() => {
    setPage(1);
  }, [status]);

  useEffect(() => {
    dispatch(
      getAllComplaints({
        pagenumber: page - 1,
        size: PAGE_SIZE,
        status: status === "all" ? undefined : (status as Status),
      }),
    );
  }, [page, status, dispatch]);

  const handleUpdate = async (status: Status, id: number) => {
    try {
      await dispatch(updateComplaint({ id, status })).unwrap();
      dispatch(
        getAllComplaints({
          pagenumber: page - 1,
          size: PAGE_SIZE,
          status:  (status as Status),
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4 border shadow-md rounded-2xl overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Complaint</TableHead>
              <TableHead className="hidden sm:table-cell">
                Location
              </TableHead>
              {userType === "ADMIN" && (
                <TableHead className="hidden md:table-cell">
                  District
                </TableHead>
              )}
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : complaints?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No complaints found.
                </TableCell>
              </TableRow>
            ) : (
              complaints?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex gap-3">
                      <img
                        src={item.imageUrl}
                        className="w-10 h-10 rounded"
                      />
                      <div>
                        <div>{item.description}</div>
                        <div className="text-xs text-gray-400">
                          ID: {item.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden sm:table-cell">
                    {item.latitude}, {item.longitude}
                  </TableCell>

                  {userType === "ADMIN" && (
                    <TableCell>{item.districtName}</TableCell>
                  )}

                  <TableCell>
                    <span className={statusColor(item.status)}>
                      {item.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    {new Date(
                      item.complaintDate,
                    ).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View</Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                          <DialogDescription>
                            Update complaint status
                          </DialogDescription>
                        </DialogHeader>

                        <FieldGroup>
                          <Field>
                            <img src={item.imageUrl} />
                          </Field>

                          <Field>
                            <span>{item.description}</span>
                          </Field>

                          <Field>
                            <span>
                              {item.latitude}°, {item.longitude}°
                            </span>
                          </Field>

                          {/* ✅ Controlled Select */}
                          <Field>
                            <Select
                              value={
                                selectedStatus[item.id] ||
                                item.status
                              }
                              onValueChange={(val: Status) =>
                                setSelectedStatus((prev) => ({
                                  ...prev,
                                  [item.id]: val,
                                }))
                              }
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="PENDING">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="WORKING">
                                    Working
                                  </SelectItem>
                                  <SelectItem value="RESOLVED">
                                    Resolved
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </Field>
                        </FieldGroup>

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">
                              Cancel
                            </Button>
                          </DialogClose>

                          <DialogClose asChild>
                            <Button
                              type="button"
                              onClick={() => {
                                const newStatus =
                                  selectedStatus[item.id] ||
                                  item.status;

                                handleUpdate(newStatus, item.id);
                              }}
                            >
                              Save changes
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between px-4 py-3 border-t">
        <span className="text-xs text-gray-400">
          Page {page} of {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ComplaintList;