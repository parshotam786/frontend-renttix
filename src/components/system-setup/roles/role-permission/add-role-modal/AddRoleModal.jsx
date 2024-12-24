"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  useToast,
  Text,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import axios from "axios";
import { BaseURL } from "../../../../../utils/BaseUrl";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
const AddRoleModal = ({ user, refreshFlag }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setloading] = useState(false);
  const [name, setname] = useState("");
  const [error, seterror] = useState("");
  const [roles, setroles] = useState([]);
  const { token } = useSelector((state) => state?.authReducer);
  const toast = useToast();

  const addRole = async () => {
    setloading(true);
    try {
      const response = await axios.post(
        `${BaseURL}/roles/role`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        setloading(false);
        // refreshFlag(true);
        if (user) {
          refreshFlag((prevFlag) => !prevFlag);
        }

        setname("");
        setTimeout(() => {
          onClose();
        }, 2000);

        toast({
          title: `${response.data.message}`,
          status: "success",
          position: " top-right",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error?.response?.data, "show");
      setloading(false);
      toast({
        title: error?.response?.data?.message,
        status: "error",
        position: " top-right",
        duration: 2000,
        isClosable: true,
      });
    }
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
  }, [loading]);

  console.log(roles);
  return (
    <>
      {user ? (
        <FiExternalLink
          className="text-blue-500 cursor-pointer font-semibold"
          onClick={onOpen}
        />
      ) : (
        <Button colorScheme={"orange"} onClick={onOpen}>
          Add Role
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              name="name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              placeholder="Add new role"
            />
          </ModalBody>
          {roles.length > 0 && (
            <div className="max-h-[300px]  overflow-auto mt-4">
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      {/* <Th>No</Th> */}
                      <Th>Exsiting Role List</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {roles?.map((item, index) => (
                      <Tr>
                        {/* <Td>{index + 1}</Td> */}
                        <Td>
                          <div className="flex items-center gap-5 capitalize">
                            {" "}
                            <FaUser className="text-[20px] text-[#555555]" />
                            <Text className="font-semibold text-[14px]">
                              {item.name}
                            </Text>
                          </div>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          )}
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={loading}
              loadingText="Adding role..."
              spinnerPlacement="start"
              colorScheme={"orange"}
              onClick={addRole}
            >
              Add Role
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddRoleModal;
