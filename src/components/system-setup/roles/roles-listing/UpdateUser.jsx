"use client";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import GoBackButton from "../../../Button/GoBackButton";
import GoPrevious from "../../../Button/GoPrevious";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import axios from "axios";
import { BaseURL } from "../../../../utils/BaseUrl";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";

const UpdateUser = () => {
  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [roles, setroles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    permissions: [],
    role: "",
    isActive: true,
  });

  const params = useParams();
  const toast = useToast();
  const router = useRouter();
  const { token } = useSelector((state) => state?.authReducer);

  const handleClick = () => setShow(!show);
  console.log(formData.permissions);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePermissionChange = (permissionName, isChecked) => {
    setFormData((prev) => {
      const updatedPermissions = isChecked
        ? [...prev.permissions, permissionName]
        : prev.permissions.filter((perm) => perm !== permissionName);
      return {
        ...prev,
        permissions: updatedPermissions,
      };
    });
  };

  useEffect(() => {
    // Fetch roles
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${BaseURL}/roles/role`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setroles(response.data.data);
      } catch (err) {
        seterror(err.message);
      } finally {
        setloading(false);
      }
    };

    // Fetch user details
    const fetchUserDetails = async () => {
      setloading(true);
      try {
        const response = await axios.get(
          `${BaseURL}/sub-vendor/sub-user-profile/${params.id}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData({
          name: response.data?.data?.legalName || "",
          email: response.data?.data?.email || "",
          role: response.data?.data?.role || "",
          permissions: response.data?.data?.permissions || [],
          isActive: response.data?.data?.accountStatus ?? true,
        });
        setloading(false);
      } catch (err) {
        setloading(false);
        toast({
          title: "Failed to fetch user details.",
          status: "error",
          position: "top-right",
          duration: 2000,
          isClosable: true,
        });
      }
    };

    fetchRoles();
    fetchUserDetails();
  }, [params.id]);

  const handleSubmit = async () => {
    setloading(true);
    try {
      const response = await axios.put(
        `${BaseURL}/sub-vendor/sub-user-role-permissions/${params.id}`,
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setloading(false);
      router.push("/system-setup/roles");
      toast({
        title: response.data?.message,
        status: "success",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setloading(false);
      toast({
        title: error.response?.data?.message || "Failed to update user.",
        status: "error",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const permissionsData = [
    {
      parent: "Add Product",
      children: ["Edit Product", "Delete Product", "All Product"],
    },
    {
      parent: "Customer",
      children: [
        "Create Customer",
        "Edit Customer",
        "Delete Customer",
        "Account",
      ],
    },

    {
      parent: "Orders",
      children: [
        "Create Order",
        "Edit Order",
        "Book In Order",
        "Book out Order",
      ],
    },
    {
      parent: "Invoicing",
      children: [
        "Invoice Run",
        "Invoice Batches",
        "Delete Batch",
        "Confirm Batch",
        "Posted Batch",
        "Confirm Single Invoice",
        "Posted Single Invoice",
        "Delete Single Invoice",
      ],
    },
    {
      parent: "System Setup",
      children: [],
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen p-5 bg-white rounded-lg w-full md:w-[50%]">
        <Spinner size={"xl"} />
      </div>
    );
  }

  return (
    <div>
      <div className="p-5 bg-white rounded-lg w-full md:w-[50%]">
        <div className="my-4">
          <GoPrevious title={"/system-setup/roles"} />
        </div>
        <div className="">
          <Text className="font-semibold text-[20px]">
            Update user role and permission
          </Text>
          <hr className="mt-3 mb-8" />
          <div className="flex flex-col gap-3">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-1">
                <Text>Name</Text>
                <Input
                  name="name"
                  isDisabled
                  isReadOnly
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Text>Email</Text>
                <Input
                  name="email"
                  isReadOnly
                  isDisabled
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-1">
                <Text>Role</Text>
                <Select
                  name="role"
                  placeholder="Select Role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  {roles?.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Text>Active</Text>
                <div className="">
                  <Switch
                    colorScheme="green"
                    size="lg"
                    name="isActive"
                    isChecked={formData.isActive}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <hr className="my-5" />
            {/* Permissions */}
            <div className="flex flex-col gap-4">
              <Text className="font-semibold text-[18px] mt-4">
                Allow Permission
              </Text>
              {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-3 gap-x-20">
                {[
                  "Dashboard",
                  "Add Product",
                  "All Product",
                  "Orders",
                  "Invoicing",
                  "Customer",
                  "System Setup",
                ].map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center justify-between gap-1"
                  >
                    <Text className="font-semibold">{permission}</Text>
                    <Switch
                      size="lg"
                      colorScheme="green"
                      isChecked={formData.permissions.includes(permission)}
                      onChange={(e) =>
                        handlePermissionChange(permission, e.target.checked)
                      }
                    />
                  </div>
                ))}
              </div> */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-6">
                {permissionsData.map(({ parent, children }) => (
                  <div key={parent} className="border p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between gap-1">
                      <Text className="font-semibold">{parent}</Text>
                      <Switch
                        size="lg"
                        colorScheme="green"
                        isChecked={formData.permissions.includes(parent)}
                        onChange={(e) =>
                          handlePermissionChange(
                            parent,
                            e.target.checked,
                            children
                          )
                        }
                      />
                    </div>

                    {formData.permissions.includes(parent) &&
                      children.length > 0 && (
                        <div className="mt-4 pl-6">
                          {children.map((child, index) => (
                            <div
                              key={child}
                              className="flex items-center justify-between gap-1"
                            >
                              <Text className="font-medium">
                                <span>{index + 1}.</span>
                                <span className="ml-3">{child}</span>
                              </Text>
                              <Switch
                                size="md"
                                colorScheme="green"
                                isChecked={formData.permissions.includes(child)}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    child,
                                    e.target.checked
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <div className="flex gap-3 ">
                <GoBackButton title={"Cancel"} />
                <div className="">
                  <Button
                    isLoading={loading}
                    loadingText="Updating..."
                    colorScheme="green"
                    variant="solid"
                    onClick={handleSubmit}
                  >
                    Update User
                  </Button>
                </div>
              </div>
            </div>
            {error && <Text className="text-red-500">{error}</Text>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
