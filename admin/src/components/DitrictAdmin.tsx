import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Field, FieldGroup } from "@/components/ui/field";
import { Eye, Mail, Pin, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AdminList from "./AdminList";
import type React from "react";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEN_URL } from "@/utils/constants";
import { useDispatch } from "react-redux";
import type { ApiDispatch } from "@/store/store";
import { getAdmins } from "@/store/slices/admin";
import { z } from "zod";
import { districtAdminSchema } from "@/types/User";
import { toast } from "sonner";

type FormErrors = Partial<
  Record<keyof z.infer<typeof districtAdminSchema>, string>
>;

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  district: "",
};

function DistrictAdmin() {
  const dispatch = useDispatch<ApiDispatch>();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = districtAdminSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = Cookies.get("token");

      await axios.post(
        `${BACKEN_URL}/admin/add/district-admin`,
        {
          username: result.data.name,
          email: result.data.email,
          password: result.data.password,
          district: result.data.district,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Admin added successfully");

      setOpen(false);
      setForm(INITIAL_FORM);
      setErrors({});
      dispatch(getAdmins({ pagenumber: 0, counts: 5 }));
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setForm(INITIAL_FORM);
      setErrors({});
    }
  };

  return (
    <div className="mt-4 ml-4">
      <div className="mt-2 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">District Admins</h1>
          <span className="text-gray-500">
            Manage administrators assigned to specific districts.
          </span>
        </div>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-green-700 hover:bg-green-800 gap-2">
              <Plus size={16} /> Add Admin
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add District Admin</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new district admin.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <FieldGroup>
                {/* Name */}
                <Field>
                  <Label>Name</Label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={16}
                    />
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                      className="pl-10"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </Field>

                {/* Email */}
                <Field>
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={16}
                    />
                    <Input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="Enter email"
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </Field>

                {/* Password */}
                <Field>
                  <Label>Password</Label>
                  <div className="relative">
                    <Eye
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={16}
                    />
                    <Input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="Enter password"
                      className="pl-10"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </Field>

                {/* Confirm Password */}
                <Field>
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Eye
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={16}
                    />
                    <Input
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      type="password"
                      placeholder="Confirm password"
                      className="pl-10"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </Field>

                {/* District */}
                <Field>
                  <Label>District</Label>
                  <div className="relative">
                    <Pin
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={16}
                    />
                    <Input
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      type="text"
                      placeholder="District"
                      className="pl-10"
                    />
                  </div>
                  {errors.district && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.district}
                    </p>
                  )}
                </Field>
              </FieldGroup>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-700 hover:bg-green-800"
                >
                  {isSubmitting ? "Adding..." : "Add Admin"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AdminList />
    </div>
  );
}

export default DistrictAdmin;
