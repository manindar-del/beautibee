import React from "react";

export async function getServerSideProps(context) {
  return {
    redirect: {
      permanent: true,
      destination: "/dashboard/account",
    },
  };
}

const index = () => {
  return <div>index</div>;
};

export default index;
