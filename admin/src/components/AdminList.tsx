import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ApiDispatch, RootState } from "@/store/store";
import { deleteAdmins, getAdmins } from "@/store/slices/admin";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const PAGE_SIZE = 5;

const TableSkeleton = () => (
  
  <TableBody>
    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: 5 }).map((_, j) => (
          <TableCell key={j} className="py-4 pl-4">
            <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

function AdminList() {
  const dispatch = useDispatch<ApiDispatch>();
 

  const {
    admins, loading, deleteLoading,
    currentPage, totalPages, totalElements,
  } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(getAdmins({ pagenumber: 0, counts: PAGE_SIZE }));
  }, []);

  const loadPage = (page: number) => {
    dispatch(getAdmins({ pagenumber: page, counts: PAGE_SIZE }));
  };
  const handleDelete = async (id: number) => {
    try {

     dispatch(deleteAdmins({id:id}))
       

    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="mt-4 border border-gray-200 shadow-md rounded-2xl overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>

            <TableHead className="hidden sm:table-cell py-4 pl-4">
              ID
            </TableHead>

            <TableHead className="py-4">Name</TableHead>
            <TableHead className="py-4">Email</TableHead>

            <TableHead className="hidden md:table-cell py-4">
              District
            </TableHead>

            <TableHead className="py-4">Actions</TableHead>
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableSkeleton />
        ) : (
          <TableBody>
            {admins?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-10">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">

                  <TableCell className="hidden sm:table-cell py-4 pl-4 text-sm text-gray-400">
                    #{user.id}
                  </TableCell>

                  <TableCell className="py-4 text-sm font-medium text-gray-800">
                    {user.username}
                  </TableCell>

                  <TableCell className="py-4 text-sm text-gray-600">
                    {user.email}
                  </TableCell>

                  <TableCell className="hidden md:table-cell py-4 text-sm text-gray-600 capitalize">
                    {user.district}
                  </TableCell>

                  <TableCell className="py-4">
                    <Button
                      className="bg-red-600 hover:bg-red-700 rounded-2xl text-xs h-8 gap-1"
                      disabled={deleteLoading === user.id}
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash size={13} />
                      {deleteLoading === user.id ? "Deleting..." : "Delete"}
                    </Button>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        )}
      </Table>
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
        <span className="text-xs text-gray-400">
          {totalElements} users · Page {currentPage + 1} of {totalPages}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-xs h-8 rounded-xl"
            disabled={currentPage === 0 || loading}
            onClick={() => loadPage(currentPage - 1)}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            className="text-xs h-8 rounded-xl"
            disabled={admins.length<PAGE_SIZE || loading}
            onClick={() => loadPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminList;