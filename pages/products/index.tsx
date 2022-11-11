import ProductCard from "components/ProductCard";
import { db } from "firebase.config";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { GetServerSideProps } from "next";
import styled from "styled-components";

interface Props {
  products: DocumentData;
}

const Product: React.FC<Props> = ({ products }) => {
  return (
    <CardsWrapper>
      {products.map((product: DocumentData) => (
        <ProductCard key={product.id} data={product} />
      ))}
    </CardsWrapper>
  );
};

const CardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  @media (min-width: 767px) {
    grid-template-columns: repeat(3, 1fr);
  }

  gap: 1rem;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const productsRef = collection(db, "products");
  const docsSnap = await getDocs(productsRef); //all products

  let products: DocumentData[] = [];
  docsSnap.forEach((doc) => {
    products.push({ ...doc.data(), id: doc.id });
  });

  return {
    props: {
      products,
    },
  };
};

export default Product;
