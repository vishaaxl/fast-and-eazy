import ProductForm from "components/ProductForm";
import SalesCard from "components/SalesCard";
import { db } from "firebase.config";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { AiOutlineBarChart } from "react-icons/ai";
import styled from "styled-components";

interface Props {
  products: DocumentData;
}

const AddProduct: React.FC<Props> = ({ products }) => {
  const cardsData = [
    {
      id: 1,
      title: "Total Products",
      figure: `${products.length} units`,
      increase: products.length,
      background: "#4B49AC",
      icon: <AiOutlineBarChart style={{ fontSize: "2.5rem" }} />,
    },
  ];

  return (
    <>
      <CardsWrapper>
        {cardsData.map((card) => (
          <SalesCard
            key={card.id}
            title={card.title}
            icon={card.icon}
            background={card.background}
            figure={card.figure}
            increase={card.increase}
          />
        ))}
      </CardsWrapper>
      <ProductForm />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const productsRef = collection(db, "products");
  const docsSnap = await getDocs(productsRef); //all products

  let products: DocumentData[] = [];
  docsSnap.forEach((doc) => {
    products.push(doc.data());
  });

  return {
    props: {
      products,
    },
  };
};

const CardsWrapper = styled.div`
  display: grid;
  gap: 1rem;

  @media (min-width: 425px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 767px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export default AddProduct;
