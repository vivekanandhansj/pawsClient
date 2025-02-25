import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import $ from "jquery";
import "bootstrap-daterangepicker";
import moment from "moment";
window.moment = moment;
import "./DateRangePickerComponent.css";
import { useDispatch } from "react-redux";
import { dashboardWeekReport } from "../../redux/dashboardSlice";
const DateRangePickerComponent = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const toDate = moment().format("YYYY-MM-DD");
    const fromDate = moment().subtract(6, "days").format("YYYY-MM-DD");
    try {
      dispatch(dashboardWeekReport({ fromDate, toDate }));
    } catch (error) {
      console.log(error);
    }
    if (inputRef.current) {
      console.log("true");
      $(inputRef.current).daterangepicker({
        opens: "top",
        locale: {
          format: "DD/MM/YYYY",
        },
        maxSpan: { days: 6 },
        startDate: moment().subtract(6, "days").format("DD/MM/YYYY"),
        endDate: moment().format("DD/MM/YYYY"),
      });

      $(inputRef.current).on("apply.daterangepicker", function (ev, picker) {
        const fromDate = picker.startDate.format("YYYY-MM-DD");
        const toDate = picker.endDate.format("YYYY-MM-DD");

        inputRef.current.value =
          picker.startDate.format("DD/MM/YYYY") +
          " - " +
          picker.endDate.format("DD/MM/YYYY");

        dispatch(dashboardWeekReport({ fromDate, toDate }));
      });
    }
    return () => {
      if (inputRef.current) {
        $(inputRef.current).daterangepicker("destroy");
      }
    };
  }, [dispatch]);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        className="form-control dashDateRangePickerInput"
        placeholder="Select Date"
      />
    </div>
  );
};

export default DateRangePickerComponent;
