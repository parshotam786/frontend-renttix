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
import { useSelector } from "react-redux";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";
import { BaseURL } from "../../../utils/baseUrl";
import { ProgressSpinner } from "primereact/progressspinner";
import CanceButton from "../Buttons/CanceButton";
import Loader from "../common/Loader";

export default function ProductList() {
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
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [loading, setloading] = useState(false);
  const toast = useRef(null);
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
    setloading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/product/product-lists`,
        { vendorId: id },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        setProducts(response.data.data);
        setloading(false);
      })
      .catch((error) => {
        // setError(error);
        setloading(false);
      });
  }, []);

  const formatCurrency = (value) => {
    return value?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
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

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`${BaseURL}/product/delete-product/${product.id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      let _products = products.filter((val) => val.id !== product.id);
      console.log(product.id);

      setProducts(_products);
      setDeleteProductDialog(false);
      setProduct(emptyProduct);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Product Deleted",
        life: 3000,
      });
    } catch (error) {
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
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));

    setProducts(_products);
    setDeleteProductsDialog(false);
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
      rowData.rentPrice ? rowData.rentPrice : Number(rowData.salePrice),
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
        <i
          onClick={() => router.push(`/product/${rowData.id}`)}
          className="pi pi-pen-to-square mr-2 text-primary"
        />
        <i
          className="pi pi-trash ml-2 text-red"
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
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <div className="flex justify-end gap-2">
        <CanceButton onClick={hideDeleteProductDialog} />

        <Button
          label="Yes"
          icon="pi pi-check"
          severity="danger"
          onClick={deleteProduct}
        />
      </div>
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <div className="flex justify-end gap-2">
        <CanceButton onClick={hideDeleteProductsDialog} />

        <Button
          label="Yes"
          icon="pi pi-check"
          severity="danger"
          onClick={deleteSelectedProducts}
        />
      </div>
    </React.Fragment>
  );

  return (
    <div>
      <Breadcrumb pageName="Products" />
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4 dark:bg-black"
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
            value={products}
            selection={selectedProducts}
            onSelectionChange={(e) => setSelectedProducts(e.value)}
            dataKey="id"
            paginator
            rows={10}
            className="dark:bg-black"
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
              field="thumbnail"
              header="Product"
              body={imageBodyTemplate}
            ></Column>
            <Column
              field="productName"
              header="Product Name"
              sortable
              style={{ minWidth: "16rem" }}
            ></Column>

            <Column
              field={"rentPrice" ? "rentPrice" : "salePrice"}
              header="Price"
              body={priceBodyTemplate}
              sortable
              style={{ minWidth: "8rem" }}
            ></Column>
            <Column
              field="status"
              header="Category"
              sortable
              body={(item) => {
                return (
                  <>
                    <Tag
                      severity={item.status === "Rental" ? "warning" : "info"}
                      value={item.status}
                    ></Tag>
                  </>
                );
              }}
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="quantity"
              header="Quantity"
              sortable
              style={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="minimumRentalPeriod"
              header="Min Rental Period"
              body={(item) => {
                return (
                  <>
                    <span>
                      {item.minimumRentalPeriod}
                      {item.minimumRentalPeriod >= 1 ? "days" : "-"}
                    </span>
                  </>
                );
              }}
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="stockStatus"
              header="Status"
              body={statusBodyTemplate}
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
        visible={productDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Product Details"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        {/* {product.image && (
          <img
            src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
            alt={product.image}
            className="product-image m-auto block pb-3"
          />
        )} */}
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Name
          </label>
          <InputText
            id="name"
            value={product.name}
            onChange={(e) => onInputChange(e, "name")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !product.name })}
          />
          {submitted && !product.name && (
            <small className="p-error">Name is required.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="description" className="font-bold">
            Description
          </label>
          <InputTextarea
            id="description"
            value={product.description}
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
                checked={product.category === "Accessories"}
              />
              <label htmlFor="category1">Accessories</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category2"
                name="category"
                value="Clothing"
                onChange={onCategoryChange}
                checked={product.category === "Clothing"}
              />
              <label htmlFor="category2">Clothing</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category3"
                name="category"
                value="Electronics"
                onChange={onCategoryChange}
                checked={product.category === "Electronics"}
              />
              <label htmlFor="category3">Electronics</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="category4"
                name="category"
                value="Fitness"
                onChange={onCategoryChange}
                checked={product.category === "Fitness"}
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
              value={product.price}
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
              value={product.quantity}
              onValueChange={(e) => onInputNumberChange(e, "quantity")}
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="confirmation-content flex items-center">
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
        visible={deleteProductsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
      >
        <div className="confirmation-content flex items-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>Are you sure you want to delete the selected products?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
