"use client";
import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { orderService } from "./service/orderService";
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
import { ProgressSpinner } from "primereact/progressspinner";

export default function OrderList() {
  let emptyorder = {
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

  const [orders, setorders] = useState([]);
  const [orderDialog, setorderDialog] = useState(false);
  const [deleteorderDialog, setDeleteorderDialog] = useState(false);
  const [deleteOrdersDialog, setDeleteOrdersDialog] = useState(false);
  const [order, setorder] = useState(emptyorder);
  const [selectedorders, setSelectedorders] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setloading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const router = useRouter();

  //   useEffect(() => {
  //     orderService.getorders().then((data) => setorders(data));
  //   }, []);

  const { token, user } = useSelector((state) => state?.authReducer);

  const id = ["Admin", "Seller"].includes(user?.role)
    ? user?._id
    : user?.vendor;

  useEffect(() => {
    setloading(true);
    axios
      .get(`${BaseURL}/order/get-all-orders`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setorders(response.data.data);
        setloading(false);
      })
      .catch((error) => {
        // setError(error);
        setloading(false);
      });
  }, [token]);

  const hideDialog = () => {
    setSubmitted(false);
    setorderDialog(false);
  };

  const hideDeleteorderDialog = () => {
    setDeleteorderDialog(false);
  };

  const hideDeleteOrdersDialog = () => {
    setDeleteOrdersDialog(false);
  };

  const saveorder = () => {
    setSubmitted(true);

    if (order.name.trim()) {
      let _orders = [...orders];
      let _order = { ...order };

      if (order.id) {
        const index = findIndexById(order.id);

        _orders[index] = _order;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "order Updated",
          life: 3000,
        });
      } else {
        _order.id = createId();
        _order.image = "order-placeholder.svg";
        _orders.push(_order);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "order Created",
          life: 3000,
        });
      }

      setorders(_orders);
      setorderDialog(false);
      setorder(emptyorder);
    }
  };

  const editorder = (order) => {
    setorder({ ...order });
    setorderDialog(true);
  };

  const confirmDeleteorder = (order) => {
    setorder(order);
    setDeleteorderDialog(true);
  };

  const deleteorder = () => {
    let _orders = orders.filter((val) => val._id !== order._id);

    setorders(_orders);
    setDeleteorderDialog(false);
    setorder(emptyorder);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Order Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < orders.length; i++) {
      if (orders[i].id === id) {
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

  const deleteSelectedorders = () => {
    let _orders = orders.filter((val) => !selectedorders.includes(val));

    setorders(_orders);
    setDeleteOrdersDialog(false);
    setSelectedorders(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "orders Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _order = { ...order };

    _order["category"] = e.value;
    setorder(_order);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _order = { ...order };

    _order[`${name}`] = val;

    setorder(_order);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _order = { ...order };

    _order[`${name}`] = val;

    setorder(_order);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {/* <Button
          label="New order"
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
          disabled={!selectedorders || !selectedorders.length}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <i className="pi pi-pen-to-square mr-2 text-primary" />
        <i
          className="pi pi-trash text-red"
          onClick={() => confirmDeleteorder(rowData)}
        />
      </React.Fragment>
    );
  };

  const getSeverity = (order) => {
    switch (order.stockStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const header = (
    <div className="align-items-center justify-content-between flex flex-wrap gap-2">
      {/* <h4 className="m-0">Manage orders</h4> */}
      <IconField iconPosition="right">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </IconField>
    </div>
  );
  const orderDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveorder} />
    </React.Fragment>
  );
  const deleteorderDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteorderDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteorder}
      />
    </React.Fragment>
  );
  const deleteOrdersDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteOrdersDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedorders}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Breadcrumb pageName="Orders" />
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
            <ProgressSpinner
              style={{
                width: "50px",
                height: "50px",
              }}
              strokeWidth="3"
              aria-label="Loading"
            />
          </div>
        ) : (
          <DataTable
            ref={dt}
            value={orders}
            selection={selectedorders}
            onSelectionChange={(e) => setSelectedorders(e.value)}
            dataKey="_id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
            globalFilter={globalFilter}
          >
            <Column selectionMode="multiple" exportable={false}></Column>
            <Column
              field="orderId"
              header="Order No"
              sortable
              body={(item) => {
                return <Tag severity={"success"} value={item.orderId}></Tag>;
              }}
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="account"
              header="Name"
              sortable
              // body={imageBodyTemplate}
            ></Column>

            <Column
              field={"order"}
              header="Type"
              body={(item) => {
                return (
                  <>
                    <Tag severity={"info"} value={"Order"}></Tag>
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
                    <Tag severity={"warning"} value={"Open"}></Tag>
                  </>
                );
              }}
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="deliveryDate"
              header="Delivery Date"
              sortable
              body={(item) => {
                return (
                  <>
                    <span>{moment(item.deliveryDate).format("LLLL")}</span>
                  </>
                );
              }}
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="deliveryAddress1"
              header="Delivery Address"
              // body={(item) => {
              //   return (
              //     <>
              //       <span>
              //         {item.minimumRentalPeriod}
              //         {item.minimumRentalPeriod >= 1 ? "Days" : "-"}
              //       </span>
              //     </>
              //   );
              // }}
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="city"
              header="Depot"
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
        visible={orderDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="order Details"
        modal
        className="p-fluid"
        footer={orderDialogFooter}
        onHide={hideDialog}
      >
        {/* {order.image && (
          <img
            src={`https://primefaces.org/cdn/primereact/images/order/${order.image}`}
            alt={order.image}
            className="order-image m-auto block pb-3"
          />
        )} */}
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Name
          </label>
          <InputText
            id="name"
            value={order.name}
            onChange={(e) => onInputChange(e, "name")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !order.name })}
          />
          {submitted && !order.name && (
            <small className="p-error">Name is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="description" className="font-bold">
            Description
          </label>
          <InputTextarea
            id="description"
            value={order.description}
            onChange={(e) => onInputChange(e, "description")}
            required
            rows={3}
            cols={20}
          />
        </div>

        <div className="field">
          <label className="mb-3 font-bold">Category</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category1"
                name="category"
                value="Accessories"
                onChange={onCategoryChange}
                checked={order.category === "Accessories"}
              />
              <label htmlFor="category1">Accessories</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category2"
                name="category"
                value="Clothing"
                onChange={onCategoryChange}
                checked={order.category === "Clothing"}
              />
              <label htmlFor="category2">Clothing</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category3"
                name="category"
                value="Electronics"
                onChange={onCategoryChange}
                checked={order.category === "Electronics"}
              />
              <label htmlFor="category3">Electronics</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category4"
                name="category"
                value="Fitness"
                onChange={onCategoryChange}
                checked={order.category === "Fitness"}
              />
              <label htmlFor="category4">Fitness</label>
            </div>
          </div>
        </div>

        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="price" className="font-bold">
              Price
            </label>
            <InputNumber
              id="price"
              value={order.price}
              onValueChange={(e) => onInputNumberChange(e, "price")}
              mode="currency"
              currency="USD"
              locale="en-US"
            />
          </div>
          <div className="field col">
            <label htmlFor="quantity" className="font-bold">
              Quantity
            </label>
            <InputNumber
              id="quantity"
              value={order.quantity}
              onValueChange={(e) => onInputNumberChange(e, "quantity")}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={deleteorderDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteorderDialogFooter}
        onHide={hideDeleteorderDialog}
      >
        <div className="confirmation-content flex items-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {order && (
            <span>
              Are you sure you want to delete <b>{order.name}</b>?
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
          {order && (
            <span>Are you sure you want to delete the selected Orders?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
