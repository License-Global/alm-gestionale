import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useArchivedOrders } from "../../../hooks/useArchivedOrder";

const AndamentoCommesse = ({ orders = [] }) => {
  const { orders: archivedOrders = [], loading } = useArchivedOrders();

  const chartData = useMemo(() => {
    // Array dei mesi in italiano
    const months = [
      "Gen",
      "Feb",
      "Mar",
      "Apr",
      "Mag",
      "Giu",
      "Lug",
      "Ago",
      "Set",
      "Ott",
      "Nov",
      "Dic",
    ];

    // Inizializza contatori per tutti i mesi
    const monthlyCount = months.map((month, index) => ({
      month,
      count: 0,
      archived: 0,
      monthIndex: index,
    }));

    // Conta le commesse inserite per mese
    orders.forEach((order) => {
      if (order.created_at) {
        const date = new Date(order.created_at);
        const monthIndex = date.getMonth();
        monthlyCount[monthIndex].count++;
      }
    });

    // Conta le commesse archiviate per mese (usando created_at della tabella archived)
    archivedOrders.forEach((order) => {
      if (order.created_at) {
        const date = new Date(order.created_at);
        const monthIndex = date.getMonth();
        monthlyCount[monthIndex].archived++;
      }
    });

    return monthlyCount;
  }, [orders, archivedOrders]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "12px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p style={{ fontWeight: "500", color: "#374151" }}>{`${label}`}</p>
          <p style={{ color: "#87ceeb" }}>{`Commesse inserite: ${payload[0]?.value || 0}`}</p>
          <p style={{ color: "#22c55e" }}>{`Commesse archiviate: ${payload[1]?.value || 0}`}</p>
        </div>
      );
    }
    return null;
  };

  // Debug log
  // console.log("Orders data:", orders.length);
  // console.log("Archived data:", archivedOrders.length);
  // console.log("Chart data:", chartData);

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        padding: "24px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Andamento Commesse
        </h3>
        <p
          style={{
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Numero di commesse aggiunte e archiviate per mese
        </p>
      </div>

      <div style={{ width: "100%", height: "320px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={12}
              fontWeight={500}
            />
            <YAxis stroke="#6b7280" fontSize={12} fontWeight={500} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#87ceeb" // aggiunte blu chiaro
              strokeWidth={3}
              dot={{ fill: "#87ceeb", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: "#87ceeb" }}
              name="Commesse inserite"
            />
            <Line
              type="monotone"
              dataKey="archived"
              stroke="#22c55e" // archiviate verde
              strokeWidth={3}
              dot={{ fill: "#22c55e", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: "#22c55e" }}
              name="Commesse archiviate"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          marginTop: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        <span>Totale commesse inserite: {orders.length}</span>
        <span>Totale commesse archiviate: {archivedOrders.length}</span>
        <span>Anno corrente</span>
      </div>
    </div>
  );
};

export default AndamentoCommesse;
