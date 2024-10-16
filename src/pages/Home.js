import React, { useEffect } from "react";
import MainTable from "../components/Tables/MainTable";
import useSession from "../hooks/useSession";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { session, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate("/login");
      }
    }
  }, [session, loading, navigate]);

  useEffect(() => {}, []);

  return <div>{<MainTable />}</div>;
};

export default Home;
