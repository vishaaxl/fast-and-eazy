import { Formik, Form, FieldArray, Field } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import styled from "styled-components";

import Input, { InputBlock } from "./Input";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "firebase.config";
import { doc, DocumentData, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface Props {
  product: DocumentData;
}

interface ProductProps {
  productName: string;
  productPrice: string;
  category: string;
  productImage: any;
  listingImages: any[];
  productQuantity: string;
  description: string;
  variations: string[];
  offPercentage: string;
}

const ProductUpdateForm: React.FC<Props> = ({ product }) => {
  const [productImage, setProductImage] = useState("");
  const [listingImages, setListingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prepared, setPrepared] = useState(false);

  const router = useRouter();

  const initialValues: ProductProps = {
    productName: product.productName,
    productPrice: product.productPrice,
    category: product.category,
    productImage: "",
    listingImages: [""],
    productQuantity: product.productQuantity,
    description: product.description,
    offPercentage: product.offPercentage,
    variations: product.variations,
  };

  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Required"),
    productPrice: Yup.string().required("Required"),
    category: Yup.string().required("Required"),
    productImage: Yup.string().required("Required"),
    listingImages: Yup.array().of(Yup.string().required("Required")),
    productQuantity: Yup.number()
      .typeError("Must be a number")
      .required("Required"),
    description: Yup.string().required("Required"),
    offPercentage: Yup.number()
      .typeError("Must be a number")
      .required("Required"),
  });

  const uploadFile = (file: any, setData: any) => {
    if (!file) return;

    setLoading(true);
    const storageRef = ref(storage, `/products/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setPrepared(false);
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(progress);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setData((prev: any) => [...prev, url]);
          setPrepared(true);
          setLoading(false);
        });
      }
    );
  };

  const uploadProduct = (data: any, resetForm: () => void) => {
    setLoading(true);

    const docRef = doc(db, "products", product.id);
    updateDoc(docRef, data)
      .then(() => {
        setLoading(false);
        toast("Product Updated");
        resetForm();
        router.push("/products");
        setPrepared(false);
      })
      .catch((error) => {
        setLoading(false);
        toast("Something went wrong, Please try again later");
      });
  };

  return (
    <FormWrapper>
      <SectionHeading>Update Product</SectionHeading>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          // upload images to firebase
          if (!prepared) {
            uploadFile(values.productImage, setProductImage);

            values.listingImages.map((image) => {
              uploadFile(image, setListingImages);
            });

            return;
          }

          // save to database
          uploadProduct(
            {
              ...values,
              productImage: productImage,
              listingImages: [...product.listingImages, ...listingImages],
            },
            resetForm
          );
        }}
      >
        {({ setFieldValue }) => (
          <Form>
            <Input name="productName" placeholder="Product Name" />
            <Input
              name="productPrice"
              placeholder="Product Price  ( Rs.)"
              type="number"
            />
            <Input name="category" placeholder="Category" component="select">
              <option value="Electronics accessories">
                Electronics accessories
              </option>
              <option value="fashion">fashion</option>
              <option value="beauty">beauty</option>
              <option value="kichen and home decoration accessories">
                kichen and home decoration accessories
              </option>
              <option value="tv & fridge">tv & fridge</option>
              <option value="toy accessories">toy accessories</option>
            </Input>

            {/* product image */}
            <InputBlock>
              <label>Poduct Image</label>
              <Field
                name="productImage"
                type="file"
                value={undefined}
                onChange={(event: any) => {
                  setFieldValue("productImage", event.currentTarget.files[0]);
                }}
              />
            </InputBlock>

            {/* multiple images  */}
            <div>
              <label style={{ opacity: 0.8 }}>Listing Images</label>
              <FieldArray name="listingImages">
                {(fieldArrayProps) => {
                  const { push, remove, form } = fieldArrayProps;
                  const { values } = form;
                  const { listingImages } = values;

                  return (
                    <>
                      <button
                        style={{ fontSize: "1rem", margin: "1rem 0 0 .5rem" }}
                        type="button"
                        onClick={() => push("")}
                      >
                        Add More Images
                      </button>
                      <span
                        style={{
                          opacity: 0.8,
                          display: "block",
                          fontSize: ".95rem",
                          margin: "1rem 0",
                        }}
                      >
                        **Add atleast one listing image for product preview
                      </span>

                      {listingImages.map((image: string, index: number) => (
                        <InputBlock
                          key={index}
                          style={{
                            display: "grid",
                            gridTemplateColumns: index != 0 ? "8fr 1fr" : "1fr",
                          }}
                        >
                          <Field
                            name={`listingImages[${index}]`}
                            style={{ width: "100%" }}
                            type="file"
                            value={undefined}
                            onChange={(event: any) => {
                              setFieldValue(
                                `listingImages[${index}]`,
                                event.currentTarget.files[0]
                              );
                            }}
                          />
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {index != 0 && (
                              <button
                                style={{ fontSize: "1rem" }}
                                type="button"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </InputBlock>
                      ))}
                    </>
                  );
                }}
              </FieldArray>
            </div>
            <Input
              name="productQuantity"
              placeholder="Product Quantity"
              type="number"
            />
            <Input
              name="description"
              placeholder="Product Description"
              rows="6"
              type={"textarea"}
              component="textarea"
            />
            <Input
              name="offPercentage"
              placeholder="Off Percentage"
              type="number"
            />
            {/* variations */}
            <div>
              <label
                style={{
                  opacity: 0.8,
                  marginBottom: "1rem",
                  display: "inline-block",
                }}
              >
                Product Variations
              </label>
              <FieldArray name="variations">
                {(fieldArrayProps) => {
                  const { push, remove, form } = fieldArrayProps;
                  const { values } = form;
                  const { variations } = values;

                  return (
                    <>
                      <button
                        style={{ fontSize: "1rem", margin: "1rem 0 0 .5rem" }}
                        type="button"
                        onClick={() => push("")}
                      >
                        Add Variation
                      </button>

                      {variations.map((image: string, index: number) => (
                        <InputBlock
                          key={index}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "8fr 1fr",
                          }}
                        >
                          <Field
                            name={`variations[${index}]`}
                            style={{ width: "100%" }}
                          />
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <button
                              style={{ fontSize: "1rem" }}
                              type="button"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </InputBlock>
                      ))}
                    </>
                  );
                }}
              </FieldArray>
            </div>

            <div
              style={{
                opacity: 0.8,
                margin: "1rem 0",
              }}
            >
              **Please wait for atleast 5 seconds after add product option
              appears
            </div>
            {!prepared ? (
              <Submit
                type="submit"
                value="Prepare Product"
                disabled={loading && true}
              />
            ) : (
              <Submit
                type="submit"
                value="Add Product"
                disabled={loading && true}
              />
            )}
          </Form>
        )}
      </Formik>
    </FormWrapper>
  );
};

const SectionHeading = styled.h2`
  font-size: 2rem;
  margin: 1rem 0;
  font-weight: 600;
`;

const FormWrapper = styled.div`
  margin: 2rem 0;
  padding: 2rem 1rem;

  box-shadow: ${({ theme }) => theme.shadowPrimary};
  background-color: #fff;
  border-radius: 0.75rem;
`;

const Submit = styled.input`
  cursor: pointer;
  padding: 0.75rem 2rem;
  border-radius: 5px;
  border: none;
  font-size: 1.025rem;

  background-color: ${({ theme }) => theme.primaryAccent};
  color: ${({ theme }) => theme.primary};

  &:disabled {
    opacity: 0.5;
  }
`;

export default ProductUpdateForm;
