import Head from "next/head";

import OrdersTable from "components/OrdersTable";

export default function Orders() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* recent orders */}
      <OrdersTable />
    </>
  );
}
