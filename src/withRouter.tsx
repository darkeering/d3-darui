import React from "react";
import { useLocation, useNavigate, useParams } from "react-router";

export default function withRouter(Child: any) {
  return (props: any) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return (
      <Child
        {...props}
        location={location}
        navigate={navigate}
        params={params}
      ></Child>
    );
  };
}
