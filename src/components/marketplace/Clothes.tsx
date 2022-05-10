import AddCloth from "./AddCloth";
import Product from "./Product";
import Loader from "../utils/Loader";
import { Col, Row } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getclothes,
  buy_clothe,
  addclothe as createProduct,
} from "../../util/marketplace";
import { toast } from "react-toastify";
const Clothes = () => {
  const [products, setProducts] = useState<
    Array<[string, string, string, string, string, Array<string | null>]>
  >([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of products
  //@ts-ignore
  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setProducts(await getclothes());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [loading, products]);

  const addProduct = async (
    name: string,
    image: string,
    price: number,
    quantity: number
  ) => {
    try {
      setLoading(true);
      createProduct({ name, image, price, quantity }).then(() => {
        getProducts();
      });
      toast(<NotificationSuccess text="Product added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a product." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to initiate transaction
  const buy = async (id: number, price: number): Promise<void> => {
    try {
      console.log(id);
      await buy_clothe({
        id,
        price,
      }).then(() => getProducts());
      toast(<NotificationSuccess text="Product bought successfully" />);
    } catch (error) {
      //@ts-ignore
      toast(<NotificationError text={error["kind"]["ExecutionError"]} />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  type props = {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: Array<null | string>;
  };
  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Cloth Market</h1>
            <AddCloth data={addProduct} />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            <>
              {products.map((e, index) => (
                <Product
                  product={{
                    name: e[0],
                    image: e[1],
                    price: e[2],
                    quantity: e[3],
                    vendor: e[4],
                    buyer_list: e[5],
                  }}
                  buy={buy}
                  key={index.toString()}
                  id={index + 1}
                />
              ))}
            </>
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Clothes;
