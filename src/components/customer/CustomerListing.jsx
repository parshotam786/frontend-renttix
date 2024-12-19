"use client";
import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { customerService } from "./service/customerService";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";
import { BaseURL } from "../../../utils/baseUrl";
import Link from "next/link";
import { MultiSelect } from "primereact/multiselect";
import { ProgressSpinner } from "primereact/progressspinner";
import Loader from "../common/Loader";
import CanceButton from "../Buttons/CanceButton";

export default function CustomerListing() {
  let emptycustomer = {
    id: null,
    name: "",
    image: null,
    description: "",
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: "INSTOCK",
  };

  const [customers, setcustomers] = useState([]);
  const [customerDialog, setcustomerDialog] = useState(false);
  const [deletecustomerDialog, setDeletecustomerDialog] = useState(false);
  const [deleteOrdersDialog, setDeleteOrdersDialog] = useState(false);
  const [customer, setcustomer] = useState(emptycustomer);
  const [selectedcustomers, setSelectedcustomers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const [loading, setloading] = useState(false);
  const dt = useRef(null);
  const router = useRouter();

  const { token, user } = useSelector((state) => state?.authReducer);

  const id = ["Admin", "Seller"].includes(user?.role)
    ? user?._id
    : user?.vendor;

  useEffect(() => {
    setloading(true);
    axios
      .get(`${BaseURL}/customer/customer`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setloading(false);
        setcustomers(response.data.customers);
      })
      .catch((error) => {
        // setError(error);
        setloading(false);
      });
  }, [token]);

  const hideDialog = () => {
    setSubmitted(false);
    setcustomerDialog(false);
  };

  const hideDeletecustomerDialog = () => {
    setDeletecustomerDialog(false);
  };

  const hideDeleteOrdersDialog = () => {
    setDeleteOrdersDialog(false);
  };

  const savecustomer = () => {
    setSubmitted(true);

    if (customer.name.trim()) {
      let _customers = [...customers];
      let _customer = { ...customer };

      if (customer.id) {
        const index = findIndexById(customer.id);

        _customers[index] = _customer;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "customer Updated",
          life: 3000,
        });
      } else {
        _customer.id = createId();
        _customer.image = "customer-placeholder.svg";
        _customers.push(_customer);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "customer Created",
          life: 3000,
        });
      }

      setcustomers(_customers);
      setcustomerDialog(false);
      setcustomer(emptycustomer);
    }
  };

  const confirmDeletecustomer = (customer) => {
    setcustomer(customer);
    setDeletecustomerDialog(true);
  };

  const deletecustomer = async () => {
    setloading(true);
    try {
      let res = await axios.delete(
        `${BaseURL}/customer/customer/${customer._id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      let _customers = customers.filter((val) => val._id !== customer._id);

      setcustomers(_customers);
      setDeletecustomerDialog(false);
      setcustomer(emptycustomer);
      setloading(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: res.data.message,
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message,
        life: 3000,
      });
      setloading(false);
      console.log(error);
    }
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < customers.length; i++) {
      if (customers[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteOrdersDialog(true);
  };

  const deleteSelectedcustomers = () => {
    let _customers = customers.filter(
      (val) => !selectedcustomers.includes(val),
    );

    setcustomers(_customers);
    setDeleteOrdersDialog(false);
    setSelectedcustomers(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "customers Deleted",
      life: 3000,
    });
  };

  const getSeverity = (item) => {
    switch (item.type) {
      case "Customer":
        return "help";

      case "Supplier":
        return "info";

      case "Reseller":
        return "Primary";
      case "Sub-Contractor":
        return "info";

      default:
        return null;
    }
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {/* <Button
          label="New customer"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        /> */}
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          style={{ background: "red" }}
          onClick={confirmDeleteSelected}
          disabled={!selectedcustomers || !selectedcustomers.length}
        />
      </div>
    );
  };

  const representativeBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2 ">
        <img
          alt={rowData?.name?.name}
          src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${rowData.thumbnail}`}
          width="40"
          height={"40"}
          className="min-h-12 min-w-12 rounded-full"
        />
        <span>{rowData.name.name}</span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <i className="pi pi-pen-to-square mr-2 text-primary" />
        <i
          className="pi pi-trash ml-2 text-red"
          onClick={() => confirmDeletecustomer(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="align-items-center justify-content-between flex flex-wrap gap-2">
      <IconField iconPosition="right">
        {globalFilter == null || globalFilter == "" ? (
          <InputIcon className="pi pi-search" />
        ) : (
          <></>
        )}
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </IconField>
    </div>
  );

  const deletecustomerDialogFooter = (
    <React.Fragment>
      <div className="flex justify-end gap-2">
        <CanceButton onClick={hideDeletecustomerDialog} />
        <Button
          label="Yes"
          icon={"pi pi-check"}
          loading={loading}
          severity="danger"
          onClick={deletecustomer}
        />
      </div>
    </React.Fragment>
  );
  const deleteOrdersDialogFooter = (
    <React.Fragment>
      <div className="flex justify-end gap-2">
        <CanceButton onClick={hideDeleteOrdersDialog} />

        <Button
          label="Yes"
          icon="pi pi-check"
          severity="danger"
          onClick={deleteSelectedcustomers}
        />
      </div>
    </React.Fragment>
  );

  return (
    <div>
      <Breadcrumb pageName="Customers" />
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          // right={rightToolbarTemplate}
          right={header}
        ></Toolbar>
        {loading ? (
          <div className="my-auto flex min-h-[50vh] items-center justify-center">
            <Loader />
          </div>
        ) : (
          <DataTable
            ref={dt}
            value={customers}
            selection={selectedcustomers}
            onSelectionChange={(e) => setSelectedcustomers(e.value)}
            dataKey="_id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            emptyMessage="No customers found."
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Customers"
            globalFilter={globalFilter}
          >
            <Column selectionMode="multiple" exportable={false}></Column>
            {/* <Column
            field="id"
            header="Code"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column> */}

            <Column
              field="name.name"
              sortable
              header="Customer"
              body={representativeBodyTemplate}
            />

            <Column
              field={"type"}
              header="Type"
              body={(item) => {
                return (
                  <>
                    <Tag severity={getSeverity(item)} value={item.type}></Tag>
                  </>
                );
              }}
              sortable
              style={{ minWidth: "8rem" }}
            ></Column>
            <Column
              field="status"
              header="Status"
              sortable
              body={(item) => {
                return (
                  <>
                    <Tag
                      severity={item.status === "Active" ? "success" : "danger"}
                      value={item.status}
                    ></Tag>
                  </>
                );
              }}
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="city"
              header="City"
              sortable
              body={(item) => {
                return (
                  <>
                    <span>{item.city}</span>
                  </>
                );
              }}
              style={{ minWidth: "10rem" }}
            ></Column>

            <Column
              body={actionBodyTemplate}
              header="Action"
              exportable={false}
              style={{ minWidth: "12rem" }}
            ></Column>
          </DataTable>
        )}
      </div>

      <Dialog
        visible={deletecustomerDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deletecustomerDialogFooter}
        onHide={hideDeletecustomerDialog}
      >
        <div className="confirmation-content flex items-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {customer && (
            <span>
              Are you sure you want to delete <b>{customer.name.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteOrdersDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteOrdersDialogFooter}
        onHide={hideDeleteOrdersDialog}
      >
        <div className="confirmation-content flex items-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {customer && (
            <span>Are you sure you want to delete the selected Orders?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
