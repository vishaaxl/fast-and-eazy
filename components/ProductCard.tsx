/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";

import { DocumentData } from "firebase/firestore";
import styled from "styled-components";

interface Props {
  data: DocumentData;
}

const ProductCard: React.FC<Props> = ({ data }) => {
  const router = useRouter();

  return (
    <Card onClick={() => router.push(`/products/${data.id}`)}>
      <figure className="snip1418">
        <div className="img-container">
          <img src={data.productImage} alt="" />
        </div>

        <figcaption>
          <h3>{data.productName}</h3>
          <p>
            {data.description.length > 100
              ? `${data.description.substr(0, 100)}...`
              : data.description}
          </p>
          <div className="price">
            <s>Rs.{data.productPrice}</s>Rs.
            {data.productPrice - (data.productPrice / 100) * 10}
          </div>
        </figcaption>
      </figure>
    </Card>
  );
};

const Card = styled.div`
  cursor: pointer;

  .snip1418 {
    position: relative;
    overflow: hidden;
    height: 100%;
    min-width: 100%;

    background: #fff;
    text-align: left;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);

    .img-container {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        max-width: 100%;
        height: 200px;
        max-height: 60%;

        vertical-align: top;
        position: relative;
        object-fit: contain;
      }
    }

    figcaption {
      padding: 20px;
      text-transform: capitalize;

      h3 {
        font-size: 1.225rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
      }

      p {
        display: none;

        @media (min-width: 425px) {
          display: block;
        }

        margin-bottom: 0.75rem;
        font-size: 0.9rem;
        opacity: 0.8;
        line-height: 1.4;
      }

      .price {
        s {
          margin-right: 0.35rem;
          opacity: 0.5;
        }
      }
    }
  }
`;

export default ProductCard;
