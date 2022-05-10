import React, { useEffect, useState } from "react";
import { utils } from "near-api-js";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import { getAccountId } from "../../util/near";
const Product = ({
  product,
  buy,
  id,
}: {
  product: {
    name: string;
    image: string;
    price: string;
    quantity: string;
    vendor: string;
    buyer_list: Array<string | null>;
  };
  buy: (id: number, price: number) => Promise<void>;
  id: number;
}) => {
  const { name, image, price, quantity, vendor, buyer_list } = product;
  const [account, setAccountId] = useState<string>("");
  const triggerBuy = () => {
    buy(id, Number(price));
  };
  useEffect(() => {
    getAccountId().then((e) => {
      setAccountId(e);
    });
  }, []);
  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-secondary">{vendor}</span>
            <Badge bg="secondary" className="ms-auto">
              {buyer_list.length} sold
            </Badge>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={image} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Text className="text-secondary">
            <span>
              {buyer_list.length
                ? Number(quantity) - Number(buyer_list.length)
                : quantity}{" "}
              Left
            </span>
          </Card.Text>
          <>
            {buyer_list.length == Number(quantity) ? (
              <Button variant="dark" className="w-100 py-3" disabled>
                Stock is cleared Now!!
              </Button>
            ) : buyer_list.length ? (
              buyer_list.filter((accoun) => accoun == account).length ? (
                <Button variant="dark" className="w-100 py-3" disabled>
                  You have Purchased this item
                </Button>
              ) : (
                <Button
                  variant="outline-dark"
                  onClick={triggerBuy}
                  className="w-100 py-3"
                >
                  Buy for {price} NEAR
                </Button>
              )
            ) : (
              <Button
                variant="outline-dark"
                onClick={triggerBuy}
                className="w-100 py-3"
              >
                Buy for {price} NEAR
              </Button>
            )}
          </>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Product;
