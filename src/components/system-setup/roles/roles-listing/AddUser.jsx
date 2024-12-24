"use client";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
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
import { useRouter } from "next/navigation";
import { GoLinkExternal } from "react-icons/go";
import AddRoleModal from "../role-permission/add-role-modal/AddRoleModal";

const AddUser = () => {
  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [roles, setroles] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    permissions: ["Dashboard"],
    confirmPassword: "",
    role: "",
    isActive: true,
  });
  const toast = useToast();
  const router = useRouter();
  const { token } = useSelector((state) => state?.authReducer);

  const handleRefreshFlag = (value) => {
    setRefreshFlag(value);
  };
  const handleClick = () => setShow(!show);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  console.log(formData);
  const handlePermissionChange = (permission, isChecked, children = []) => {
    setFormData((prev) => {
      let updatedPermissions;

      if (isChecked) {
        // Add parent and all children to permissions
        updatedPermissions = [
          ...new Set([...prev.permissions, permission, ...children]),
        ];
      } else {
        // Remove parent and all its children from permissions
        updatedPermissions = prev.permissions.filter(
          (perm) => perm !== permission && !children.includes(perm),
        );
      }

      return { ...prev, permissions: updatedPermissions };
    });
  };

  useEffect(() => {
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
    fetchRoles();
  }, [refreshFlag]);

  const handleSubmit = async () => {
    setloading(true);
    try {
      const response = await axios.post(
        `${BaseURL}/sub-vendor/create-sub-user`,
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      setloading(false);
      router.push("/system-setup/roles");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        permissions: [],
        isActive: true,
      });
      toast({
        title: response.data?.message,
        status: "success",
        position: " top-right",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setloading(false);
      toast({
        title: error.response.data.message,
        status: "error",
        position: " top-right",
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
        "Account",
        "Create Customer",
        "Edit Customer",
        "Delete Customer",
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
  return (
    <div>
      <div className="w-full rounded-lg bg-white p-5 md:w-[50%]">
        <div className="my-4">
          <GoPrevious title={"/system-setup/roles"} />
        </div>
        <div className="">
          <Text className="text-[20px] font-semibold">Add User Account</Text>
          <hr className="mb-8 mt-3" />
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Text>Name</Text>
                <Input
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Text>Email</Text>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Text>Password</Text>
                <InputGroup size="md">
                  <Input
                    name="password"
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <InputRightElement width="4.5rem">
                    {show ? (
                      <FaRegEye onClick={handleClick} />
                    ) : (
                      <FaEyeSlash onClick={handleClick} />
                    )}
                  </InputRightElement>
                </InputGroup>
              </div>
              <div className="flex flex-col gap-1">
                <Text>Confirm Password</Text>
                <InputGroup size="md">
                  <Input
                    name="confirmPassword"
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <InputRightElement width="4.5rem">
                    {show ? (
                      <FaRegEye onClick={handleClick} />
                    ) : (
                      <FaEyeSlash onClick={handleClick} />
                    )}
                  </InputRightElement>
                </InputGroup>
                {formData.confirmPassword.length > 0 && (
                  <Text
                    className={`font-semibold ${
                      formData.password === formData.confirmPassword
                        ? "text-green-600"
                        : "text-red"
                    }`}
                  >
                    {formData.password === formData.confirmPassword
                      ? "Password Match!"
                      : "Password does not match!"}
                  </Text>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <Text>Role</Text>{" "}
                  <AddRoleModal refreshFlag={handleRefreshFlag} user={true} />
                </div>
                <Select
                  name="role"
                  placeholder="Select Role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  {roles?.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <Text>Active</Text>
                <Switch
                  colorScheme="green"
                  size="lg"
                  name="isActive"
                  isChecked={formData.isActive}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Text className="mt-4 text-[18px] font-semibold">
                Allow Permission
              </Text>

              {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-3 gap-x-20">
                {[
                  "Add Product",
                  "Edit Product",
                  "Delete Product",
                  "All Product",
                  "Orders",
                  "Invoicing",
                  "Customer",
                  "Edit Customer",
                  "Delete Customer",
                  "System Setup",
                ]
                  .filter((permission) => {
                    // Show "Edit Product" and "Delete Product" only if "Add Product" is checked
                    if (
                      (permission === "Edit Product" ||
                        permission === "Delete Product") &&
                      !formData.permissions.includes("Add Product")
                    ) {
                      return false;
                    }

                    // Show "Edit Customer" and "Delete Customer" only if "Customer" is checked
                    if (
                      (permission === "Edit Customer" ||
                        permission === "Delete Customer") &&
                      !formData.permissions.includes("Customer")
                    ) {
                      return false;
                    }

                    return true;
                  })
                  .map((permission) => (
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-2">
                {permissionsData.map(({ parent, children }) => (
                  <div key={parent} className="rounded-lg border p-4 shadow">
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
                            children,
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
                                <span className="ml-3 text-[14px]">
                                  {child}
                                </span>
                              </Text>
                              <Switch
                                size="md"
                                colorScheme="green"
                                isChecked={formData.permissions.includes(child)}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    child,
                                    e.target.checked,
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
            <div className="mt-4 flex justify-end">
              <div className="flex gap-3 ">
                <GoBackButton title={"Cancel"} />
                <div className="">
                  <Button
                    isLoading={loading}
                    spinnerPlacement="start"
                    loadingText="Submitting..."
                    isDisabled={
                      formData.name === "" ||
                      formData.email === "" ||
                      formData.password === "" ||
                      formData.confirmPassword === "" ||
                      formData.role === "" ||
                      formData.isActive === "" ||
                      formData.password != formData.confirmPassword
                    }
                    colorScheme={"orange"}
                    onClick={handleSubmit}
                  >
                    Add Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
