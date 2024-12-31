"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  Button,
  InputText,
  Toast,
  DataTable,
  Column,
} from "primereact";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { BaseURL } from "../../../../../../utils/baseUrl";
import CanceButton from "@/components/Buttons/CanceButton";
import { Avatar } from "primereact/avatar";
import { ScrollTop } from "primereact/scrolltop";

const AddRoleModal = ({ user, refreshFlag }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [roles, setRoles] = useState([]);
  const { token } = useSelector((state) => state?.authReducer);
  const toastRef = React.useRef(null);

  const addRole = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BaseURL}/roles/role`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setLoading(false);
        if (user) {
          refreshFlag((prevFlag) => !prevFlag);
        }

        setName("");
        toastRef.current.show({
          severity: "success",
          summary: "Success",
          detail: response.data.message,
          life: 3000,
        });
        setTimeout(() => setVisible(false), 2000);
      }
    } catch (error) {
      setLoading(false);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: error?.response?.data?.message,
        life: 3000,
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
        setRoles(response.data.data);
      } catch (err) {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: err.message,
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, [loading]);

  return (
    <>
      <Toast ref={toastRef} />

      {user ? (
        <FiExternalLink
          className="cursor-pointer font-semibold text-blue-500"
          onClick={() => setVisible(true)}
        />
      ) : (
        <Button
          label="Add Role"
          className="p-button-warning"
          onClick={() => setVisible(true)}
        />
      )}

      <Dialog
        header="Add New Role"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="field mb-5">
          <InputText
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add new role"
            className="mb-3 w-full"
          />
        </div>
        <label htmlFor="" className=" font-semibold text-dark-2">
          Existing Role List
        </label>
        <hr />
        {roles.length > 0 && (
          <div className=" max-h-[300px] overflow-auto">
            <DataTable
              value={roles}
              // header="Existing Role List"
              className="custom-datatable"
              responsiveLayout="scroll"
            >
              <Column
                body={(rowData) => (
                  <div className="flex items-center gap-5 capitalize">
                    <Avatar icon="pi pi-user" size="large" shape="circle" />

                    {/* <FaUser className="text-[20px] text-[#555555]" /> */}
                    <span className="text-[14px] font-semibold">
                      {rowData.name}
                    </span>
                  </div>
                )}
              />
            </DataTable>
            <ScrollTop
              target="parent"
              threshold={100}
              className="w-2rem h-2rem border-round bg-primary"
              icon="pi pi-arrow-up text-base"
            />
          </div>
        )}

        <div className="mt-3 flex justify-end gap-5">
          <CanceButton onClick={() => setVisible(false)} />

          <Button
            label="Add Role"
            className="p-button-warning"
            loading={loading}
            onClick={addRole}
          />
        </div>
      </Dialog>
    </>
  );
};

export default AddRoleModal;
