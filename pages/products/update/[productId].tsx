/* eslint-disable @next/next/no-img-element */
import styled from "styled-components";
import { GetServerSideProps } from "next";

import { doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "firebase.config";
import { useState } from "react";
import { toast } from "react-toastify";
import Router, { useRouter } from "next/router";
import ProductUpdateForm from "components/UpdateForm";

interface Props {
  product: DocumentData;
}

const Product: React.FC<Props> = ({ product }) => {
  return (
    <Wrapper>
      <ProductUpdateForm product={product} />
    </Wrapper>
  );
};

const Wrapper = styled.section``;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { productId } = context.query;

  const productRef = doc(db, "products", productId as string);
  const docSnap = await getDoc(productRef); //all products

  return {
    props: {
      product: { ...docSnap.data(), id: docSnap.id },
    },
  };
};

export default Product;
