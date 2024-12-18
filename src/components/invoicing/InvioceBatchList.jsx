"use client";
import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { ProductService } from "./service/ProductService";
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

export default function InvioceBatchList() {
  let emptyProduct = {
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

  const [products, setProducts] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteOrdersDialog, setDeleteOrdersDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const [loading, setloading] = useState(false);
  const dt = useRef(null);
  const router = useRouter();

  //   useEffect(() => {
  //     ProductService.getProducts().then((data) => setProducts(data));
  //   }, []);

  const { token, user } = useSelector((state) => state?.authReducer);

  const id = ["Admin", "Seller"].includes(user?.role)
    ? user?._id
    : user?.vendor;

  useEffect(() => {
    axios
      .get(`${BaseURL}/invoice/invoice-batches?search=&&page=1&&limit=10`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        // setError(error);
        // setLoading(false);
      });
  }, [token]);

  const formatCurrency = (value) => {
    return value?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const openNew = () => {
    router.push("/product/add-product");
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteOrdersDialog = () => {
    setDeleteOrdersDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };

      if (product.id) {
        const index = findIndexById(product.id);

        _products[index] = _product;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        _product.id = createId();
        _product.image = "product-placeholder.svg";
        _products.push(_product);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = async () => {
    setloading(true);
    try {
      let res = await axios.delete(`${BaseURL}/invoice/${product._id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      let _products = products.filter((val) => val._id !== product._id);

      setProducts(_products);
      setDeleteProductDialog(false);
      setProduct(emptyProduct);
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

    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
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

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));

    setProducts(_products);
    setDeleteOrdersDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _product = { ...product };

    _product["category"] = e.value;
    setProduct(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {/* <Button
          label="New Product"
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
          disabled={!selectedProducts || !selectedProducts.length}
        />
      </div>
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        className="border-round h-[50px] w-[50px] rounded-lg shadow-2"
        src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${rowData.thumbnail}`}
        alt={rowData.thumbnail}
        // className="border-round shadow-2"
        style={{ width: "64px" }}
      />
    );
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(
      rowData.rentPrice ? rowData.rentPrice : rowData.salePrice,
    );
  };

  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag value={rowData.stockStatus} severity={getSeverity(rowData)}></Tag>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <i className="pi pi-pen-to-square mr-2" /> */}
        <i
          className="pi pi-trash ml-2"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const getSeverity = (product) => {
    switch (product.stockStatus) {
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
      {/* <h4 className="m-0">Manage Products</h4> */}
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
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon={"pi pi-check"}
        loading={loading}
        severity="danger"
        onClick={deleteProduct}
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
        onClick={deleteSelectedProducts}
      />
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

        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="_id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
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
            body={(item) => {
              return (
                <>
                  <span>{Number(item.totalPrice).toFixed(2)}</span>
                </>
              );
            }}
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
      </div>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.name}</b>?
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
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>Are you sure you want to delete the selected Orders?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
