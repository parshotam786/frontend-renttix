"use client";
import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { useSelector } from "react-redux";
import Link from "next/link";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Badge } from "primereact/badge";
import { BaseURL } from "../../../../../utils/baseUrl";

export default function PaginatorTemplateDemo() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(5);
  const { token } = useSelector((state) => state?.authReducer);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BaseURL}/sub-vendor/all-sub-user?search=${search}&page=${page}&limit=${rows}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();
      if (result.success) {
        setCustomers(result.data);
        setTotalRecords(result.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, page, rows]);

  const onSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page when search changes
  };

  const onPageChange = (event) => {
    setPage(event.page + 1); // PrimeReact uses 0-based index for pages
    setRows(event.rows);
  };

  return (
    <div className="card">
      <div className=" mb-5 flex justify-between border-b-2 pb-4">
        <div className="flex items-center justify-start gap-2">
          <label className="text-[20px] font-semibold">Accounts</label>
          <Badge
            value={customers?.length}
            size="small"
            severity="warning"
          ></Badge>
        </div>
        <div className="flex justify-between gap-4">
          <div className="align-items-center justify-content-between flex flex-wrap gap-2">
            <IconField iconPosition="right">
              {search == null || search == "" ? (
                <InputIcon className="pi pi-search" />
              ) : (
                <></>
              )}
              <InputText
                placeholder="Search"
                value={search}
                onChange={onSearch}
              />
            </IconField>
          </div>

          <div className="">
            <Link href={"/system-setup/roles/add-role"}>
              <Button className="" colorScheme={"orange"}>
                Add Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <DataTable
        value={customers}
        paginator={false}
        // loading={loading}
        rows={rows}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          sortable
          field="legalName"
          header="Name"
          style={{ width: "25%" }}
        ></Column>
        <Column field="email" header="Email" style={{ width: "25%" }}></Column>
        <Column field="role" header="Role" style={{ width: "25%" }}></Column>
        <Column
          field="representative.name"
          header="Representative"
          style={{ width: "25%" }}
        ></Column>
      </DataTable>
      <Paginator
        first={(page - 1) * rows}
        rows={rows}
        totalRecords={totalRecords}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPageChange={onPageChange}
        template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
      />
    </div>
  );
}
