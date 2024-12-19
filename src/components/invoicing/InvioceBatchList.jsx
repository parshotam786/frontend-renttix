"use client";
import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { invoiceService } from "./service/invoiceService";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
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
import CanceButton from "../Buttons/CanceButton";
import { ProgressSpinner } from "primereact/progressspinner";
import Loader from "../common/Loader";

export default function InvioceBatchList() {
  let emptyinvoice = {
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

  const [invoices, setinvoices] = useState([]);
  const [invoiceDialog, setinvoiceDialog] = useState(false);
  const [deleteinvoiceDialog, setDeleteinvoiceDialog] = useState(false);
  const [deleteOrdersDialog, setDeleteOrdersDialog] = useState(false);
  const [invoice, setinvoice] = useState(emptyinvoice);
  const [selectedinvoices, setSelectedinvoices] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const [loading, setloading] = useState(false);
  const dt = useRef(null);
  const router = useRouter();

  //   useEffect(() => {
  //     invoiceService.getinvoices().then((data) => setinvoices(data));
  //   }, []);

  const { token, user } = useSelector((state) => state?.authReducer);

  const id = ["Admin", "Seller"].includes(user?.role)
    ? user?._id
    : user?.vendor;

  useEffect(() => {
    setloading(true);
    axios
      .get(`${BaseURL}/invoice/invoice-batches?search=&&page=1&&limit=10`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setinvoices(response.data.data);
        setloading(false);
      })
      .catch((error) => {
        // setError(error);
        setloading(false);
      });
  }, [token]);

  const formatCurrency = (value) => {
    return value?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
  const priceBodyTemplate = (rowData) => {
    return formatCurrency(Number(rowData.totalPrice));
  };
  const openNew = () => {
    router.push("/invoice/add-invoice");
  };

  const hideDialog = () => {
    setSubmitted(false);
    setinvoiceDialog(false);
  };

  const hideDeleteinvoiceDialog = () => {
    setDeleteinvoiceDialog(false);
  };

  const hideDeleteOrdersDialog = () => {
    setDeleteOrdersDialog(false);
  };

  const saveinvoice = () => {
    setSubmitted(true);

    if (invoice.name.trim()) {
      let _invoices = [...invoices];
      let _invoice = { ...invoice };

      if (invoice.id) {
        const index = findIndexById(invoice.id);

        _invoices[index] = _invoice;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "invoice Updated",
          life: 3000,
        });
      } else {
        _invoice.id = createId();
        _invoice.image = "invoice-placeholder.svg";
        _invoices.push(_invoice);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "invoice Created",
          life: 3000,
        });
      }

      setinvoices(_invoices);
      setinvoiceDialog(false);
      setinvoice(emptyinvoice);
    }
  };

  const editinvoice = (invoice) => {
    setinvoice({ ...invoice });
    setinvoiceDialog(true);
  };

  const confirmDeleteinvoice = (invoice) => {
    setinvoice(invoice);
    setDeleteinvoiceDialog(true);
  };

  const deleteinvoice = async () => {
    setloading(true);
    try {
      let res = await axios.delete(`${BaseURL}/invoice/${invoice._id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      let _invoices = invoices.filter((val) => val._id !== invoice._id);

      setinvoices(_invoices);
      setDeleteinvoiceDialog(false);
      setinvoice(emptyinvoice);
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

    for (let i = 0; i < invoices.length; i++) {
      if (invoices[i].id === id) {
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

  const deleteSelectedinvoices = () => {
    let _invoices = invoices.filter((val) => !selectedinvoices.includes(val));

    setinvoices(_invoices);
    setDeleteOrdersDialog(false);
    setSelectedinvoices(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "invoices Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _invoice = { ...invoice };

    _invoice["category"] = e.value;
    setinvoice(_invoice);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {/* <Button
          label="New invoice"
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
          disabled={!selectedinvoices || !selectedinvoices.length}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <i className="pi pi-pen-to-square mr-2" /> */}
        <i
          className="pi pi-trash ml-2 text-red"
          onClick={() => confirmDeleteinvoice(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="align-items-center justify-content-between flex flex-wrap gap-2">
      {/* <h4 className="m-0">Manage invoices</h4> */}
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

  const deleteinvoiceDialogFooter = (
    <React.Fragment>
      <div className="flex justify-end gap-2">
        <CanceButton onClick={hideDeleteinvoiceDialog} />
        <Button
          label="Yes"
          icon={"pi pi-check"}
          loading={loading}
          severity="danger"
          onClick={deleteinvoice}
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
          onClick={deleteSelectedinvoices}
        />
      </div>
    </React.Fragment>
  );

  return (
    <div>
      <Breadcrumb pageName="Invoice Batch" />
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
            value={invoices}
            selection={selectedinvoices}
            onSelectionChange={(e) => setSelectedinvoices(e.value)}
            dataKey="_id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} invoices"
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
              field="account"
              header="Name"
              body={(info) => {
                return (
                  <span>
                    <Link
                      style={{ color: "#337ab7" }}
                      href={`/invoice/invoice-batches/${info?._id}`}
                    >
                      <div className="flex items-center justify-start gap-3">
                        <i className="pi pi-box text-[20px] text-[#555]" />
                        <label className=" capitalize">
                          {info.name} <span>({info.batchNumber})</span>
                        </label>
                      </div>
                    </Link>
                  </span>
                );
              }}
            ></Column>

            <Column
              field={"description"}
              header="Description"
              body={(item) => {
                return (
                  <>
                    <span>{item.description}</span>
                  </>
                );
              }}
              sortable
              style={{ minWidth: "8rem" }}
            ></Column>
            <Column
              field="batchDate"
              header="Batch Date"
              sortable
              body={(item) => {
                return (
                  <>
                    <span>{moment(item.batchDate).format("LLLL")}</span>
                  </>
                );
              }}
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="totalInvoice"
              header="Total Invoices	"
              sortable
              body={(item) => {
                return (
                  <>
                    <span>{item.totalInvoice}</span>
                  </>
                );
              }}
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="totalPrice"
              header="Total (Inc. TAX)	"
              body={priceBodyTemplate}
              sortable
              style={{ minWidth: "12rem" }}
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
        visible={deleteinvoiceDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteinvoiceDialogFooter}
        onHide={hideDeleteinvoiceDialog}
      >
        <div className="confirmation-content flex items-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {invoice && (
            <span>
              Are you sure you want to delete <b>{invoice.name}</b>?
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
          {invoice && (
            <span>Are you sure you want to delete the selected Orders?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
