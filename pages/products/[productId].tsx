/* eslint-disable @next/next/no-img-element */
import styled from "styled-components";
import { GetServerSideProps } from "next";

import { deleteDoc, doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "firebase.config";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useState } from "react";
import { toast } from "react-toastify";
import Router, { useRouter } from "next/router";

interface Props {
  product: DocumentData;
}

const Product: React.FC<Props> = ({ product }) => {
  const [deleteState, setDeleteState] = useState(false);
  const router = useRouter();

  const deleteProduct = (id: string) => {
    const docRef = doc(db, "products", id);
    deleteDoc(docRef)
      .then(() => {
        toast("Prouct Deleted", { type: "success" });
        router.push("/products");
      })
      .catch(() => {
        toast("Something went wrong, Try again later", { type: "error" });
      });
  };
  return (
    <>
      <Wrapper>
        <div className="main-image-wrapper">
          <img
            src={product.productImage[0] || product.productImage}
            alt=""
            className="main-image"
          />
        </div>

        <ImageGallery>
          {product.listingImages.map((image: string, index: number) => (
            <img src={image} key={index} alt="" className="listing-image" />
          ))}
        </ImageGallery>
      </Wrapper>

      <Content>
        <h1>{product.productName}</h1>
        <span>{product.description}</span>
        <h2 style={{ marginTop: 0, opacity: 0.9 }}>
          Rs. {product.productPrice}
        </h2>

        {product.variations && (
          <div className="tags-container">
            {product.variations.map((variation: string) => (
              <div className="tag" key={variation}>
                {variation}
              </div>
            ))}
          </div>
        )}

        <h2>Product Details</h2>
        <ul>
          <li>
            <span>Category</span> {product.category}
          </li>
          <li>
            <span>Off Percentage</span> {product.offPercentage}%
          </li>
          <li>
            <span>Quanity Left</span> {product.productQuantiy} units
          </li>
        </ul>
      </Content>
      <ButtonWrapper>
        {deleteState ? (
          <button onClick={() => deleteProduct(product.id)}>
            <AiFillDelete />
            Confirm Delete
          </button>
        ) : (
          <button onClick={() => setDeleteState(true)}>
            <AiFillDelete />
            Delete Product
          </button>
        )}
        <button onClick={() => router.push(`/products/update/${product.id}`)}>
          <AiFillEdit />
          Edit Product
        </button>
      </ButtonWrapper>
    </>
  );
};

const ButtonWrapper = styled.div`
  width: 100%;
  @media (min-width: 767px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    font-size: 1rem;
    cursor: pointer;
    width: 100%;
    border-radius: 5px;
    border: none;
    background-color: ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.primary};
    padding: 1rem 0;
    margin-bottom: 1rem;

    &:last-child {
      background-color: ${({ theme }) => theme.primaryAccent};
    }
  }
`;

const Wrapper = styled.section`
  .main-image-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;

    background: #fff;
    box-shadow: ${({ theme }) => theme.shadowPrimary};
  }

  img {
    max-width: 100%;

    @media (min-width: 767px) {
      max-width: 50%;
    }

    padding: 2rem;
    margin-bottom: 2rem;
  }

  .listing-image {
    background: #fff;
    box-shadow: ${({ theme }) => theme.shadowPrimary};
  }
`;

const ImageGallery = styled.div`
  display: flex;
  overflow: scroll;

  img {
    max-width: 150px;
    max-height: 150px;

    margin-left: 2rem;
    padding: 2rem;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const Content = styled.div`
  & > * {
    display: block;

    margin-bottom: 1rem;
  }

  h1 {
    font-weight: 600;
    font-size: 2rem;
  }

  h2 {
    margin-top: 2rem;
    font-weight: 600;
    font-size: 1.5rem;
  }

  span {
    line-height: 1.4;
    opacity: 0.8;
  }

  .tags-container {
    display: flex;
    & > * {
      border: 2px solid rgba(0, 0, 0, 0.3);
      padding: 0.75rem 1rem;
      margin-right: 1rem;
      border-radius: 2px;
    }
  }

  ul {
    li {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 0.75rem 0;

      border-radius: 2px;
      span {
        font-weight: 500;
      }
    }
  }
`;

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
